const rAF = typeof window !== "undefined" && (
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame
) || function(callback) { setTimeout(callback, 0); };

// function isFunction(w) { // WET
// 	return w && {}.toString.call(w) === "[object Function]";
// }

let now = Date.getTime;
if (Date.now) now = Date.now;
if (typeof window !== "undefined" && typeof window.performance !== "undefined" && typeof window.performance.now !== "undefined") now = window.performance.now.bind(window.performance);

function HyperTransaction(settings) {
	this.time;// set in createTransaction so value is same as parent transaction and can be frozen
	this.disableAnimation = false; // value should probably be inherited from parent transaction
	this.duration;
	this.easing;
	//this.completionHandler; // would be nice
	if (settings) Object.keys(settings).forEach( function(key) {
		this[key] = settings[key];
	}.bind(this));
}

function HyperContext() {
	this.targets = [];
	this.getPresentations = [];
	this.getAnimationCounts = [];
	this.transactions = [];
	this.ticking = false;
	this.animationFrame;
	this.displayLayers = []; // renderLayer
	this.displayFunctions = []; // strange new implementation // I don"t want to expose delegate accessor on the controller, so I pass a bound function, easier to make changes to public interface.
	this.cleanupFunctions = [];
	this.invalidateFunctions = [];
	this.force = [];
	this.changers = [];
}

HyperContext.prototype = {
	createTransaction: function(settings,automaticallyCommit) { // private
		const transaction = new HyperTransaction(settings);
		const length = this.transactions.length;
		let time = now() / 1000;
		if (length) time = this.transactions[length-1].representedObject.time; // Clock stops in the outermost transaction.
		Object.defineProperty(transaction, "time", { // Manually set time of transaction here to be not configurable
			get: function() {
				return time;
			},
			enumerable: true,
			configurable: false
		});
		this.transactions.push({ representedObject:transaction, automaticallyCommit:automaticallyCommit, flushers:[] });
		if (automaticallyCommit) this.startTicking(); // Automatic transactions will otherwise not be closed if there is no animation or value set.
		return transaction;
	},
	createTransactionWrapper: function(settings,automaticallyCommit) { // private

		const targets = this.targets;
		let i = targets.length;
		while (i--) {
			this.invalidateFunctions[i]();
		}

		const transaction = new HyperTransaction(settings);
		const length = this.transactions.length;
		let time = now() / 1000;
		if (length) time = this.transactions[length-1].representedObject.time; // Clock stops in the outermost transaction.
		Object.defineProperty(transaction, "time", { // Manually set time of transaction here to be not configurable
			get: function() {
				return time;
			},
			enumerable: true,
			configurable: false
		});
		const wrapper = { representedObject:transaction, automaticallyCommit:automaticallyCommit, flushers:[] };
		this.transactions.push(wrapper);
		if (automaticallyCommit) this.startTicking(); // Automatic transactions will otherwise not be closed if there is no animation or value set.
		return wrapper;
	},

	currentTransaction: function() {
		const length = this.transactions.length;
		if (length) return this.transactions[length-1].representedObject;
		return this.createTransactionWrapper({},true).representedObject;
	},
	beginTransaction: function(settings) { // TODO: throw on unclosed (user created) transaction
		return this.createTransactionWrapper(settings,false).representedObject;
	},
	commitTransaction: function() {
		this.clearChangers();
		this.clearFlushers();
		this.transactions.pop();
	},
	clearFlushers: function() {
		const wrapper = this.currentTransactionWrapper();
		wrapper.flushers.forEach( flusher => {
			flusher();
		});
		wrapper.flushers.length = 0;

		const targets = this.targets;
		let i = targets.length;
		while (i--) {
			this.invalidateFunctions[i]();
		}
	},
	flushTransaction: function() { // TODO: prevent unterminated when called within display // TODO: better yet, completely remove
		this.clearChangers();
		this.clearFlushers();
		// this.invalidateFunctions.forEach( function(invalidate) { // this won"t work if there are no animations thus not registered
		// 	invalidate();
		// });
	},
	currentTransactionWrapper: function() { // private // for FAKE_SET_BUG_FIX and unregistered controllers.
		const length = this.transactions.length;
		if (!length) return this.createTransactionWrapper({},true);
		return this.transactions[length-1]; // Hope the transaction was created sucessfully, I guess, for now.
	},
	registerFlusher: function(flusher) { // FAKE_SET_BUG_FIX
		this.currentTransactionWrapper().flushers.push(flusher);
	},
	registerChanger: function(changer) {
		this.changers.push(changer);
		this.startTicking();
	},
	clearChangers: function() {
		const changers = this.changers;
		let j = changers.length;
		while (j--) {
			changers[j]();
		}
		changers.length = 0;
	},
	disableAnimation: function(disable) { // If this is false, it enables animation
		if (disable !== false) disable = true; // because the function name is misleading
		const transaction = this.currentTransaction();
		transaction.disableAnimation = disable;
		this.startTicking();
	},
	registerTarget: function(target,getPresentation,getAnimationCount,display,invalidate,cleanup,force,layer = null) {
		this.startTicking();
		const index = this.targets.indexOf(target); // optimize me, have controller track.
		if (index < 0) {
			this.targets.push(target);
			this.getPresentations.push(getPresentation);
			this.getAnimationCounts.push(getAnimationCount);
			this.displayLayers.push(layer);
			this.displayFunctions.push(display);
			this.cleanupFunctions.push(cleanup);
			this.invalidateFunctions.push(invalidate);
			this.force.push(force);
		} else {
			this.force[index] = force;
		}
	},

	deregisterTarget: function(target) {
		const index = this.targets.indexOf(target);
		if (index > -1) {
			this.targets.splice(index, 1);
			this.getPresentations.splice(index, 1);
			this.getAnimationCounts.splice(index, 1);
			this.displayLayers.splice(index, 1);
			this.displayFunctions.splice(index, 1);
			this.cleanupFunctions.splice(index, 1);
			this.invalidateFunctions.splice(index,1);
			this.force.splice(index,1);
		}
	},

	startTicking: function() { // TODO: consider cancelling previous animation frame.
		if (!this.animationFrame) this.animationFrame = rAF(this.ticker.bind(this));
	},
	ticker: function() { // Need to manually cancel animation frame if calling directly.
		this.clearChangers();
		this.animationFrame = undefined;
		const targets = this.targets; // traverse backwards so you can remove.
		let i = targets.length;
		while (i--) {
			const target = targets[i];
			const display = this.displayFunctions[i]; // this DOES exist
			const animationCount = this.getAnimationCounts[i](); // should exist
			const getPresentation = this.getPresentations[i]; // should exist
			if (!animationCount) { // Deregister from inside ticker is redundant (removalCallback & removeAnimationInstance), but is still needed when needsDisplay()
				this.invalidateFunctions[i]();
				//if (isFunction(display)) { // does exist
				const presentationLayer = getPresentation();
				display(presentationLayer);
				//}
				this.deregisterTarget(target); // Deregister here to ensure one more tick after last animation has been removed. Different behavior than removalCallback & removeAnimationInstance, for example needsDisplay()
			} else {
				//this.invalidateFunctions[i](); // this will rerender every time
				const presentationLayer = getPresentation();
				if (this.force[i] || this.displayLayers[i] !== presentationLayer) { // suppress unnecessary displays
					this.displayLayers[i] = presentationLayer;
					display(presentationLayer); // does exist
					//this.invalidateFunctions[i]();
				}
				this.cleanupFunctions[i](); // New style cleanup in ticker.
			}
			this.force[i] = false;
		}
		const length = this.transactions.length;
		if (length) {
			const transactionWrapper = this.transactions[length-1];
			if (transactionWrapper.automaticallyCommit) this.commitTransaction();
		}
		if (this.targets.length) this.startTicking();
	}
};

function isFunction$2(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

function HyperNumber() {}
HyperNumber.prototype = {
	constructor: HyperNumber,
	zero: function() {
		return 0;
	},
	add: function(a,b) {
		return a + b;
	},
	subtract: function(a,b) { // subtract b from a
		return a - b;
	},
	interpolate: function(a,b,progress) {
		return a + (b-a) * progress;
	},
	input: function(key,value) {
		return value;
	},
	output: function(key,value) {
		return value;
	},
	toString: function() {
		return "HyperNumber";
	},
	toJSON: function() {
		return this.toString();
	}
};

function HyperScale() {}
HyperScale.prototype = {
	constructor: HyperScale,
	zero: function() {
		return 1;
	},
	add: function(a,b) {
		return a * b;
	},
	subtract: function(a,b) { // subtract b from a
		if (b === 0) return 0;
		return a/b;
	},
	interpolate: function(a,b,progress) {
		return a + (b-a) * progress;
	},
	toString: function() {
		return "HyperScale";
	},
	toJSON: function() {
		return this.toString();
	}
};

function HyperArray(subtype,length,settings) {
	this.subtype = subtype;
	if (isFunction$2(subtype)) this.subtype = new subtype(settings);
	this.length = length;
}
HyperArray.prototype = {
	constructor: HyperArray,
	zero: function() {
		const array = [];
		let i = this.length;
		while (i--) array.push(this.subtype.zero());
		return array;
	},
	add: function(a,b) {
		const array = [];
		for (let i = 0; i < this.length; i++) {
			array.push(this.subtype.add(a[i],b[i]));
		}
		return array;
	},
	subtract: function(a,b) { // subtract b from a
		const array = [];
		for (let i = 0; i < this.length; i++) {
			array.push(this.subtype.subtract(a[i],b[i]));
		}
		return array;
	},
	interpolate: function(a,b,progress) {
		const array = [];
		for (let i = 0; i < this.length; i++) {
			array.push(this.subtype.interpolate(a[i],b[i],progress));
		}
		return array;
	},
	toString: function() {
		return "HyperArray";
	},
	toJSON: function() {
		return this.toString();
	}
};

function HyperSet(settings) {
	if (isFunction$2(settings)) this.sort = settings;
	else if (settings && isFunction$2(settings.sort)) this.sort = settings.sort;
	this.debug = "HyperSet";
}
HyperSet.prototype = {
	constructor: HyperSet,
	zero: function() {
		return [];
	},
	add: function(a,b) { // add b to a
		if (!Array.isArray(a) && !Array.isArray(b)) return [];
		if (!Array.isArray(a)) return b;
		if (!Array.isArray(b)) return a;

		let array = [];
		const aLength = a.length;
		const bLength = b.length;
		let i = 0;
		let j = 0;
		if (isFunction$2(this.sort)) while (i < aLength || j < bLength) {
			if (i === aLength) {
				array.push(b[j]);
				j++;
			} else if (j === bLength) {
				array.push(a[i]);
				i++;
			} else {
				const A = a[i];
				const B = b[j];
				const sort = this.sort(A,B);
				if (sort === 0) { // sort is used to determine identity, not just equality.
					array.push(A);
					i++;
					j++;
				} else if (sort < 0) {
					array.push(A);
					i++;
				} else if (sort > 0) {
					array.push(B);
					j++;
				} else throw new Error("HyperSet invalid sort function, add a:"+A+"; b:"+B+"; result:"+sort+";");
			}
		} else {
			array = a.slice(0);
			i = b.length;
			while (i--) {
				if (a.indexOf(b[i]) < 0) array.push(b[i]);
			}
		}
		return array;
	},
	subtract: function(a,b) { // remove b from a
		if (!Array.isArray(a) && !Array.isArray(b)) return [];
		if (!Array.isArray(a)) return b;
		if (!Array.isArray(b)) return a;

		let array = [];
		const aLength = a.length;
		const bLength = b.length;
		let i = 0;
		let j = 0;
		if (isFunction$2(this.sort)) while (i < aLength || j < bLength) {
			if (i === aLength) {
				break;
			} else if (j === bLength) {
				array.push(a[i]);
				i++;
			} else {
				const A = a[i];
				const B = b[j];
				const sort = this.sort(A,B);
				if (sort === 0) { // sort is used to determine identity, not just equality.
					i++;
					j++;
				} else if (sort < 0) {
					array.push(A);
					i++;
				} else if (sort > 0) {
					j++;
				} else throw new Error("HyperSet invalid sort function, subtract a:"+A+"; b:"+B+"; result:"+sort+";");
			}
		} else {
			array = a.slice(0);
			i = b.length;
			while (i--) {
				const loc = array.indexOf(b[i]);
				if (loc > -1) array.splice(loc,1);
			}
		}
		return array;
	},
	interpolate: function(a,b,progress) {
		if (progress >= 1) return b;
		return a;
	},
	toString: function() {
		return "HyperSet";
	},
	toJSON: function() {
		return this.toString();
	}
};

class HyperPoint {
	constructor() {
		
	}
	zero() {
		return hyperZeroPoint();
	}
	add(a,b) {
		return hyperMakePoint(a.x + b.x, a.y + b.y);
	}
	subtract(a,b) { // subtract b from a
		return hyperMakePoint(a.x - b.x, a.y - b.y);
	}
	interpolate(a,b,progress) {
		return hyperMakePoint(a.x + (b.x-a.x) * progress, a.y + (b.y-a.y) * progress);
	}
	toString() {
		return "HyperPoint";
	}
	toJSON() {
		return this.toString();
	}
}

class HyperSize {
	constructor() {
		
	}
	zero() {
		return hyperZeroSize();
	}
	add(a,b) {
		return hyperMakeSize(a.width + b.width, a.height + b.height);
	}
	subtract(a,b) { // subtract b from a
		return hyperMakeSize(a.width - b.width, a.height - b.height);
	}
	interpolate(a,b,progress) {
		return hyperMakeSize(a.width + (b.width-a.width) * progress, a.height + (b.height-a.height) * progress);
	}
	toString() {
		return "HyperSize";
	}
	toJSON() {
		return this.toString();
	}
}

class HyperRect {
	constructor() {
		
	}
	zero() {
		return hyperZeroRect();
	}
	add(a,b) {
		return {
			origin: HyperPoint.prototype.add(a.origin, b.origin),
			size: HyperSize.prototype.add(a.size, b.size)
		};
	}
	subtract(a,b) { // subtract b from a
		return {
			origin: HyperPoint.prototype.subtract(a.origin, b.origin),
			size: HyperSize.prototype.subtract(a.size, b.size)
		};
	}
	interpolate(a,b,progress) {
		return {
			origin: HyperPoint.prototype.interpolate(a.origin, b.origin, progress),
			size: HyperSize.prototype.interpolate(a.size, b.size, progress)
		};
	}
	toString() {
		return "HyperRect";
	}
	toJSON() {
		return this.toString();
	}
}

// export function HyperRange() { // TODO: negative values? // This should union the whole range, not add the individual values. NSUnionRange, not NSIntersectionRange, which is a range containing the indices that exist in both ranges.
// 	throw new Error("HyperRange not supported");
// }
// HyperRange.prototype = {
// 	constructor: HyperRange,
// 	zero: function() {
// 		return hyperNullRange();
// 	},
// 	add: function(a,b) { // union?
// 		if (a.location === hyperNotFound && b.location === hyperNotFound) return hyperNullRange();
// 		if (a.length === 0 && b.length === 0) return hyperNullRange();
// 		if (a.location === hyperNotFound || a.length === 0) return b;
// 		if (b.location === hyperNotFound || b.length === 0) return a;
// 		const finalLocation = Math.min( a.location, b.location );
// 		const finalEnd = Math.max( a.location + a.length, b.location + b.length );
// 		const result = hyperMakeRange(finalLocation, finalEnd - finalLocation );
// 		return result;
// 	},
// 	subtract: function(a,b) { // Subtraction is completely different.
// 		let result = a;
// 		if (a.location === hyperNotFound && b.location === hyperNotFound) result = hyperNullRange();
// 		else if (a.length === 0 && b.length === 0) result = hyperNullRange();
// 		else if (a.location === hyperNotFound || a.length === 0) result = hyperNullRange();
// 		else if (b.location === hyperNotFound || b.length === 0) result = a;
// 		else if (b.location <= a.location && b.location + b.length >= a.location + a.length) result = hyperNullRange();
// 		else if (b.location <= a.location && b.location + b.length > a.location && b.location + b.length < a.location + a.length) result = hyperMakeRange(b.location + b.length, (a.location + a.length) - (b.location + b.length));
// 		else if (b.location > a.location && b.location < a.location + a.length && b.location + b.length >= a.location + a.length) result = hyperMakeRange(a.location, (b.location + b.length) - a.location);
// 		return result;
// 	},
// 	interpolate: function(a,b,progress) {
// 		if (progress >= 1) return b;
// 		return a;
// 	},
// 	intersection: function(a,b) { // 0,1 and 1,1 do not intersect
// 		if (a.location === hyperNotFound || b.location === hyperNotFound || a.length === 0 || b.length === 0) return hyperNullRange();
// 		if (a.location + a.length <= b.location || b.location + b.length <= a.location) return hyperNullRange(); // TODO: Consider location should be NSNotFound (INT_MAX) not zero.
// 		const finalLocation = Math.max( a.location, b.location );
// 		const finalEnd = Math.min( a.location + a.length, b.location + b.length );
// 		return hyperMakeRange(finalLocation, finalEnd - finalLocation);
// 	}
// };

const hyperNotFound = Number.MAX_VALUE;
// struct convenience constructors:
function hyperMakeRect(x,y,width,height) {
	return {
		origin: hyperMakePoint(x,y),
		size: hyperMakeSize(width,height)
	};
}
function hyperZeroRect() {
	return hyperMakeRect(0,0,0,0);
}
function hyperEqualRects(a,b) {
	return (hyperEqualPoints(a.origin,b.origin) && hyperEqualSizes(a.size,b.size));
}

function hyperMakePoint(x,y) {
	return {
		x: x,
		y: y
	};
}
function hyperZeroPoint() {
	return hyperMakePoint(0,0);
}
function hyperEqualPoints(a,b) {
	return (a.x === b.x && a.y === b.y);
}

function hyperMakeSize(width, height) {
	return {
		width: width,
		height: height
	};
}
function hyperZeroSize() {
	return hyperMakeSize(0,0);
}
function hyperEqualSizes(a,b) {
	return (a.width === b.width && a.height && b.height);
}

function hyperMakeRange(location, length) {
	return {
		location: location,
		length: length
	};
}
function hyperZeroRange() {
	return hyperMakeRange(0,0);
}
function hyperNullRange() {
	return hyperMakeRange(hyperNotFound,0);
}
function hyperIndexInRange(index,range) {
	return (index > range.location && index < range.location + range.length);
}
function hyperEqualRanges(a,b) {
	return (a.location === b.location && a.length === b.length);
}
function hyperIntersectionRange(a,b) {
	if (a.location + a.length <= b.location || b.location + b.length <= a.location) return hyperNullRange();
	const location = Math.max( a.location, b.location );
	const end = Math.min( a.location + a.length, b.location + b.length );
	return { location: location, length: end - location };
}

let animationNumber = 0;

const hyperNumber = new HyperNumber();

function isFunction$1(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

function isNumber(w) { // WET
	return !isNaN(parseFloat(w)) && isFinite(w); // I want infinity for repeat count. Duration for testing additive.
}

function isObject(w) {
	return w && typeof w === "object";
}



function HyperChain(childrenOrSettings) {
	let children = [];
	if (Array.isArray(childrenOrSettings)) children = childrenOrSettings;
	else if (childrenOrSettings && Array.isArray(childrenOrSettings.chain)) children = childrenOrSettings.chain;
	this.chain = children.map( function(animation) {
		return animationFromDescription(animation);
	});
	// 	this.sortIndex;
	// 	this.startTime;
	// 	this.onend;
	Object.defineProperty(this, "finished", {
		get: function() {
			if (!this.chain.length) return true;
			return this.chain[this.chain.length-1].finished;
		},
		enumerable: false,
		configurable: false
	});
	if (childrenOrSettings && !Array.isArray(childrenOrSettings)) Object.keys(childrenOrSettings).forEach( function(key) {
		if (key !== "chain" && key !== "finished") this[key] = childrenOrSettings[key];
	}.bind(this));
}

HyperChain.prototype = {
	constructor: HyperChain,
	copy: function() {
		return new this.constructor(this);
	},
	runAnimation: function(layer,key,transaction) {
		this.sortIndex = animationNumber++;
		if (this.startTime === null || typeof this.startTime === "undefined") this.startTime = transaction.time;
		let length = this.chain.length;
		const fakeTransaction = Object.assign({},transaction);
		let startTime = this.startTime;
		for (let index = 0; index < length; index++) {
			const animation = this.chain[index];
			fakeTransaction.time = startTime;
			animation.runAnimation.call(animation,layer,key,fakeTransaction);
			if (startTime === Infinity || animation.iterations === Infinity) startTime = Infinity; // TODO: negative infinity?
			else startTime = startTime + animation.delay + animation.duration * animation.iterations;
		}
	},
	composite: function(onto,now) {
		let changed = false;
		let length = this.chain.length;
		for (let index = 0; index < length; index++) {
			const animation = this.chain[index];
			changed = animation.composite.call(animation,onto,now) || changed;
		}
		return changed;
	},
	convert: function(funky,self) { // mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
		if (isFunction$1(funky)) this.chain.forEach( function(animation) {
			animation.convert.call(animation,funky,self);
		});
	}
};
HyperChain.prototype.description = function(delegate) {
	const copy = Object.assign({},this);
	copy.chain = this.chain.map( animation => animation.description(delegate) );
	return copy;
};

function HyperGroup(childrenOrSettings) {
	let children = [];
	if (Array.isArray(childrenOrSettings)) children = childrenOrSettings;
	else if (childrenOrSettings && childrenOrSettings.group) children = childrenOrSettings.group;

	this.group = children.map( function(animation) {
		return animationFromDescription(animation);
	});
	// 	this.sortIndex;
	// 	this.startTime;
	// 	this.onend;
	Object.defineProperty(this, "finished", {
		get: function() {
			let result = true;
			this.group.forEach( function(animation) {
				if (!animation.finished) result = false;
			});
			return result;
		},
		enumerable: false,
		configurable: false
	});
	if (childrenOrSettings && !Array.isArray(childrenOrSettings)) Object.keys(childrenOrSettings).forEach( function(key) {
		if (key !== "group" && key !== "finished") this[key] = childrenOrSettings[key];
	}.bind(this));
}

HyperGroup.prototype = {
	constructor: HyperGroup,
	copy: function() {
		return new this.constructor(this);
	},
	runAnimation: function(layer,key,transaction) {
		this.sortIndex = animationNumber++;
		if (this.startTime === null || typeof this.startTime === "undefined") this.startTime = transaction.time;
		this.group.forEach( function(animation) {
			animation.runAnimation.call(animation,layer,key,transaction);
		});
	},
	composite: function(onto,now) {
		let changed = false;
		this.group.forEach( function(animation) {
			changed = animation.composite.call(animation,onto,now) || changed;
		});
		return changed;
	},
	convert: function(funky,self) { // mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
		if (isFunction$1(funky)) this.group.forEach( function(animation) {
			animation.convert.call(animation,funky,self);
		});
	}
};
HyperGroup.prototype.description = function(delegate) {
	const copy = Object.assign({},this);
	copy.group = this.group.map( animation => animation.description(delegate) );
	return copy;
};

function hyperActionIsFilling(action) {
// used in Core:cleanupAnimationAtIndex // does not apply to group & chain animations, or animations contained in a group or chain
// Animations with a fill will be very inefficient, because composite will always return true for changed
	return (action.finished && (action.fillMode === "forwards" || action.fillMode === "both")); // incomplete
}// TODO: Determine CA behavior with autoreverses && backwards fill

function HyperAction() {
	this.property; // string, property name
	this.type;
	this.duration; // float. In seconds. Need to validate/ensure >= 0. Initialized in runAnimation
	this.easing; // NOT FINISHED. currently callback function only, need cubic bezier and presets. Defaults to linear. Initialized in runAnimation
	this.speed; // NOT FINISHED. float. RECONSIDER. Pausing currently not possible like in Core Animation. Layers have speed, beginTime, timeOffset! Initialized in runAnimation
	this.iterations; // float >= 0. Initialized in runAnimation
	this.autoreverse; // boolean. When iterations > 1. Easing also reversed. Maybe should be named "autoreverses", maybe should be camelCased
	this.fillMode; // string. Defaults to "none". NOT FINISHED is an understatement. "forwards" and "backwards" are "both". maybe should be named "fill". maybe should just be a boolean. // I'm unsure of the effect of combining a forward fill with additive // TODO: implement removedOnCompletion
	this.index = 0; // float. Custom compositing order.
	this.delay = 0; // float. In seconds. // TODO: easing should be taken in effect after the delay
	this.blend = "relative"; // also "absolute" // Default should be "absolute" if explicit
	this.additive = true;
	this.sort;
	this.finished = false;
	this.startTime; // float // Should this be private?
	this.progress; //null; // 0 would mean first frame does not count as a change which I want for stepEnd but probably not anything else. Also complicating is separate cachedPresentationlayer and context displayLayers. No longer initialized in runAnimation
	this.onend; // NOT FINISHED. callback function, fires regardless of fillMode. Should rename. Should also implement didStart, maybe didTick, etc.
	//this.naming; // "default","exact","increment","nil" // why not a key property?
	this.remove = true;
} // Can't freeze animation objects while implementation of core cleanup sets onend function to null
HyperAction.prototype = {
	copy: function() { // TODO: "Not Optimized. Reference to a variable that requires dynamic lookup" !!! // https://github.com/GoogleChrome/devtools-docs/issues/53
		return new this.constructor(this);
	},
	composite: function(onto,now) {
		if (this.startTime === null || this.startTime === undefined) throw new Error("Cannot composite an animation that has not been started."); // return this.type.zero();
		if (this.startTime + this.delay > now && this.fillMode !== "backwards" && this.fillMode !== "both") return false;
		if (this.finished && this.fillMode !== "forwards" && this.fillMode !== "both") return false;
		const elapsed = Math.max(0, now - (this.startTime + this.delay));
		const speed = this.speed; // might make speed a property of layer, not animation, might not because no sublayers / layer hierarcy
		let iterationProgress = 1;
		let combinedProgress = 1;
		const iterationDuration = this.duration;
		const combinedDuration = iterationDuration * this.iterations;
		if (combinedDuration) {
			iterationProgress = elapsed * speed / iterationDuration;
			combinedProgress = elapsed * speed / combinedDuration;
		}
		if (combinedProgress >= 1) {
			iterationProgress = 1;
			this.finished = true;
		}
		let inReverse = 0; // falsy
		if (!this.finished) {
			if (this.autoreverse === true) inReverse = Math.floor(iterationProgress) % 2;
			iterationProgress = iterationProgress % 1; // modulus for iterations
		}
		if (inReverse) iterationProgress = 1-iterationProgress; // easing is also reversed
		if (isFunction$1(this.easing)) iterationProgress = this.easing(iterationProgress);
		else if (this.easing === "step-start") iterationProgress = Math.ceil(iterationProgress);
		else if (this.easing === "step-middle") iterationProgress = Math.round(iterationProgress);
		else if (this.easing === "step-end") iterationProgress = Math.floor(iterationProgress);
		else {
			// TODO: match web-animations syntax
			// TODO: refine regex, perform once in runAnimation
			// FIXME: step-end displays twice (actually thrice). Should I just display once, not at the start?
			const rounded = 0.5-(Math.cos(iterationProgress * Math.PI) / 2);
			if (this.easing) {
				const steps = /(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);
				if (steps) {
					const desc = steps[1];
					const count = steps[2];
					if (count > 0) {
						if (desc === "step-start") iterationProgress = Math.ceil(iterationProgress * count) / count;
						else if (desc === "step-middle") iterationProgress = Math.round(iterationProgress * count) / count;
						else if (desc === "step-end" || desc === "steps") iterationProgress = Math.floor(iterationProgress * count) / count;
					} else if (this.easing !== "linear") iterationProgress = rounded;
				} else if (this.easing !== "linear") iterationProgress = rounded;
			} else iterationProgress = rounded;
		}
		let value;
		if (this instanceof HyperKeyframes) { // TODO: This check is just wrong
			const length = this.keyframes.length;
			if (!length) throw new Error("HyperAction composite need to be able to handle zero keyframes");
			if (length === 1) throw new Error("HyperAction composite need to be able to handle one keyframe");
			let i = length-1;
			while (i--) { // TODO: test that this works in reverse
				if (iterationProgress >= this.offsets[i]) break;
			}
			const previous = i;
			let next = previous+1;
			const frameSpan = this.offsets[next]-this.offsets[previous];
			if (frameSpan === 0) throw new Error("can't divide by zero. check your keyframe offsets.");
			const frameLocation = iterationProgress-this.offsets[previous];
			const frameProgress = frameLocation/frameSpan;
			if (this.blend === "absolute") value = this.type.interpolate(this.keyframes[previous],this.keyframes[next],frameProgress);
			else value = this.type.interpolate(this.delta[previous],this.delta[next],frameProgress); // sending argument to zero() for css transforms (or custom types)
		} else { // HyperAnimation
			if (this.blend === "absolute") value = this.type.interpolate(this.from,this.to,iterationProgress);
			else value = this.type.interpolate(this.delta,this.type.zero(this.to),iterationProgress); // sending argument to zero() for css transforms (or custom types)
		}
		const property = this.property;
		if (typeof property !== "undefined" && property !== null) { // it is possible to animate without declaring property
			let result = value;
			let underlying = onto[property];
			if (typeof underlying === "undefined" || underlying === null) underlying = this.type.zero(this.to); // ORIGINAL // TODO: assess this // FIXME: transform functions? Underlying will never be undefined as it is a registered property, added to modelLayer. Unless you can animate properties that have not been registered, which is what I want
			if (this.additive) result = this.type.add(underlying,value);
			if (this.sort && Array.isArray(result)) result.sort(this.sort);
			onto[property] = result;
		}
		if (onto[property] && onto[property].px && onto[property].px.length && onto[property].px.substring && onto[property].px.substring(onto[property].px.length-3) === "NaN") {
			throw new Error("hyperact NaN composite onto:"+JSON.stringify(onto)+"; now:"+now+";");
		}
		const changed = (iterationProgress !== this.progress || this.finished); // Animations with a fill will be very inefficient.
		this.progress = iterationProgress;
		return changed;
	}
};



function HyperKeyframes(settings) {
	HyperAction.call(this);
	let children = [];
	if (settings && Array.isArray(settings.keyframes)) children = settings.keyframes;
	this.keyframes = children;
	const length = this.keyframes.length;

	if (settings) Object.keys(settings).forEach( function(key) {
		if (key !== "keyframes") this[key] = settings[key];
	}.bind(this));

	// TODO: lots of validation
	// TODO: composite assumes offsets are in order, and not equal (need to prevent dividing by zero)

	if (!Array.isArray(this.offsets) || this.offsets.length !== length) { // TODO: handle zero or one frames
		if (length < 2) this.offsets = [];
		else this.offsets = this.keyframes.map( function(item,index) {
			return index/(length-1);
		});
	} else this.offsets.sort((a,b) => { // TODO: maybe verify all offset are actually numbers, between 0 and 1
		return a-b;
	});
	this.progress = null;
}

HyperKeyframes.prototype = Object.create(HyperAction.prototype);
HyperKeyframes.prototype.constructor = HyperKeyframes;
HyperKeyframes.prototype.copy = function() {
	return new this.constructor(this);
};
HyperKeyframes.prototype.runAnimation = function(layer,key,transaction) {
	if (!this.type) this.type = hyperNumber; // questionable if I should do this here
	else if (isFunction$1(this.type)) this.type = new this.type();
	//if (!this.type) this.type = this;
	if (isFunction$1(this.type.zero) && isFunction$1(this.type.add) && isFunction$1(this.type.subtract) && isFunction$1(this.type.interpolate)) {
		if (this.blend !== "absolute" && this.keyframes.length) {
			const last = this.keyframes.length-1;
			const array = [];
			for (let i=0; i<last; i++) {
				array[i] = this.type.subtract(this.keyframes[i],this.keyframes[last]);
			}
			array[last] = this.type.zero(this.keyframes[last]);
			this.delta = array;
		}
		if (this.duration === null || typeof this.duration === "undefined") this.duration = transaction.duration; // This is consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
		if (this.easing === null || typeof this.easing === "undefined") this.easing = transaction.easing; // This is (probably) consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
		if (this.speed === null || typeof this.speed === "undefined") this.speed = 1.0; // need better validation
		if (this.iterations === null || typeof this.iterations === "undefined") this.iterations = 1; // negative values have no effect
		if (typeof this.startTime === "undefined" || this.startTime === null) this.startTime = transaction.time;
		this.sortIndex = animationNumber++;
	} else throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");
};
HyperKeyframes.prototype.convert = function(funky,self) { // mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
	if (isFunction$1(funky) && this.property) {
		const properties = ["keyframes","delta"];
		properties.forEach( function(item) { // HyperKeyframes
			if (this[item]) {
				const array = this[item].slice(0);
				this[item] = array.map( value => {
					return funky.call(self,this.property, value); // intentionally allows animations with an undefined property
				});
			}
		}.bind(this));
	}
};
HyperKeyframes.prototype.description = function(delegate) {
	const copy = Object.assign({},this);
	this.convert.call(copy, delegate.output, delegate);
	return copy;
};


function HyperAnimation(settings) {
	HyperAction.call(this);
	this.from; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.to; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.delta; // Should this be private?

	if (settings) Object.keys(settings).forEach( function(key) {
		this[key] = settings[key];
	}.bind(this));
	this.progress = null;
}

HyperAnimation.prototype = Object.create(HyperAction.prototype);
HyperAnimation.prototype.constructor = HyperAnimation;
HyperAnimation.prototype.runAnimation = function(layer,key,transaction) {
	if (!this.type) this.type = hyperNumber; // questionable if I should do this here
	else if (isFunction$1(this.type)) this.type = new this.type();
	//if (!this.type) this.type = this;
	if (isFunction$1(this.type.zero) && isFunction$1(this.type.add) && isFunction$1(this.type.subtract) && isFunction$1(this.type.interpolate)) {
		if (!this.from) this.from = this.type.zero(this.to);
		if (!this.to) this.to = this.type.zero(this.from);
		if (this.blend !== "absolute") this.delta = this.type.subtract(this.from,this.to);
		if (this.duration === null || typeof this.duration === "undefined") this.duration = transaction.duration; // This is consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
		if (this.easing === null || typeof this.easing === "undefined") this.easing = transaction.easing; // This is (probably) consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
		if (this.speed === null || typeof this.speed === "undefined") this.speed = 1.0; // need better validation
		if (this.iterations === null || typeof this.iterations === "undefined") this.iterations = 1; // negative values have no effect
		//this.progress = 0.0; // keep progress null so first tick is considered a change
		if (typeof this.startTime === "undefined" || this.startTime === null) this.startTime = transaction.time;
		this.sortIndex = animationNumber++;
	} else throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");
};
HyperAnimation.prototype.convert = function(funky,self) { // mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
	if (isFunction$1(funky) && this.property) {
		const properties = ["from","to","delta"]; // addAnimation only has from and to, delta is calcuated from ugly values in runAnimation
		properties.forEach( function(item) { // HyperAnimation
			const value = this[item];
			if (value !== null && typeof value !== "undefined") this[item] = funky.call(self,this.property, value); // intentionally allows animations with an undefined property
		}.bind(this));
	}
};
HyperAnimation.prototype.description = function(delegate) {
	const copy = Object.assign({},this);
	this.convert.call(copy, delegate.output, delegate);
	return copy;
};

function isDuckType(description) {
	return (description && isFunction$1(description.add) && isFunction$1(description.subtract) && isFunction$1(description.zero) && isFunction$1(description.interpolate));
}

function animationFromDescription(description) { // description might be a type, an animation object, an animation description, or a duration.
	// FIXME: Must convert !!!
	// TODO: Must convert. Animation objects use ugly keys, animation descriptions use pretty keys.
	// I need the delegate or type
	// I might want to remove input and output from the delegate API, and only allow input and output in the type.
	let animation;
	if (!description && description !== 0) return description; // TODO: if animationForKey returns null, stops. But defaultAnimation does not behave like CA animation dict and should
	if (description instanceof HyperAction || description instanceof HyperKeyframes || description instanceof HyperGroup || description instanceof HyperChain) {
		animation = description.copy.call(description);
	} else if (Array.isArray(description)) {
		animation = new HyperGroup(description);
	} else if (isObject(description)) { // TODO: if has both keyframes and from/to, descriptions could return a group of both. But why?
		if (isDuckType(description)) {
			animation = new HyperAnimation({ type:description });// for registerAnimatableProperty and implicit animation from transaction duration alone
		} else if (Array.isArray(description.keyframes)) animation = new HyperKeyframes(description);
		else if (Array.isArray(description.group)) animation = new HyperGroup(description);
		else if (Array.isArray(description.chain)) animation = new HyperChain(description);
		else animation = new HyperAnimation(description);
	} else if (isNumber(description)) animation = new HyperAnimation({duration:description});
	else if (description === true) animation = new HyperAnimation({});
	else throw new Error("is this an animation:"+JSON.stringify(description));
	// TODO: What happened to instantiating if description is a function?
	return animation;
}

function isFunction(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

// Called after animationFromDescription
function prepAnimationObjectFromAddAnimation(animation, delegate, defaultAnimations, defaultTypes, registerAnimatable) { // If this is only called from addAnimation, why is it here?
	if (animation instanceof HyperAnimation || animation instanceof HyperKeyframes) {
		const prettyKey = animation.property;
		if (delegate && prettyKey && isFunction(delegate.typeOfProperty)) {
			const type = delegate.typeOfProperty.call(delegate, prettyKey);
			if (type) animation.type = type;
		}
		const uglyKey = convertedKey(prettyKey,delegate.keyInput,delegate) ;
		const defaultAnim = defaultAnimations[uglyKey];
		const defaultType = defaultTypes[uglyKey] || resolveType(defaultAnim);

		if (animation.property && animation.type) registerAnimatable(animation.property, animation.type, true);

		if (animation instanceof HyperAnimation) {
			if (Array.isArray(animation.from) || Array.isArray(animation.to)) {
				if (!animation.type && isFunction(animation.sort)) animation.type = new HyperSet(animation.sort);
			}
			if (!animation.type) {
				animation.type = defaultType;
			}

			if (animation.from || animation.from === 0) animation.from = convertedInputOfProperty(animation.from,uglyKey,delegate,defaultTypes,animation.type);
			if (animation.to || animation.to === 0) animation.to = convertedInputOfProperty(animation.to,uglyKey,delegate,defaultTypes,animation.type);
			if (animation.delta || animation.delta === 0) animation.delta = convertedInputOfProperty(animation.delta,uglyKey,delegate,defaultTypes,animation.type);
		} else { // HyperKeyframes
			if (!animation.type) animation.type = defaultType;
			if (animation.keyframes) animation.keyframes = animation.keyframes.map( item => convertedInputOfProperty(item,uglyKey,delegate,defaultTypes,animation.type));
			if (animation.delta) animation.delta = animation.delta.map( item => convertedInputOfProperty(item,uglyKey,delegate,defaultTypes,animation.type));
		}
	} else if (animation instanceof HyperGroup) { // recursive
		animation.group.forEach( function(childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate, defaultAnimations, defaultTypes, registerAnimatable);
		});
	} else if (animation instanceof HyperChain) { // recursive
		animation.chain.forEach( function(childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate, defaultAnimations, defaultTypes, registerAnimatable);
		});
	} else throw new Error("not an animation");
}

function convertedKey(property,funky,self) { // DELEGATE_DOUBLE_WHAMMY
	if (isFunction(funky)) return funky.call(self,property);
	return property;
}
function convertedInputOfProperty(value,property,delegate,defaultTypes,animationType) { // mutates
	if (delegate && isFunction(delegate.input)) {
		return delegate.input.call(delegate,property,value); // completely override
	}
	let result = value;
	const defaultType = defaultTypes[property];
	if (animationType && isFunction(animationType.input)) {
		result = animationType.input.call(animationType,property,value);
	} else if (defaultType && isFunction(defaultType.input)) {
		result = defaultType.input.call(defaultType,property,value);
	}
	return result;
}
function convertedOutputOfProperty(value,property,delegate,defaultTypes,animationType) { // mutates
	if (delegate && isFunction(delegate.output)) {
		const output = delegate.output.call(delegate,property,value); // completely override
		return output;
	}
	let result = value;
	const defaultType = defaultTypes[property];
	if (animationType && isFunction(animationType.output)) {
		result = animationType.output.call(animationType,property,value);
	} else if (defaultType && isFunction(defaultType.output)) {
		result = defaultType.output.call(defaultType,property,value);
	}
	return result;
}

function resolveType(descriptionOrType) {
	if (!descriptionOrType) return null;// {};// have to return something, but really this should throw, or better yet be refactored to not happen
	if (descriptionOrType.type) {
		if (isFunction(descriptionOrType.type)) return new descriptionOrType.type();
		return descriptionOrType.type;
	} else {
		if (isFunction(descriptionOrType)) return new descriptionOrType();
		return descriptionOrType;
	}
}

function isAnimationObject(animation) {
	if (animation && (animation instanceof HyperAnimation || animation instanceof HyperKeyframes || animation instanceof HyperGroup || animation instanceof HyperChain)) return true;
}



function implicitAnimation(property,prettyValue,prettyPrevious,prettyPresentation,delegate,defaultAnimation,defaultType,transaction) { // TODO: Ensure modelLayer is fully populated before calls to animationForKey so you can use other props conditionally to determine animation
	let description, reply;
	if (isFunction(delegate.animationForKey)) reply = delegate.animationForKey.call(delegate,property,prettyValue,prettyPrevious,prettyPresentation); // TODO: rename action or implicit
	if (reply === null) return null; // null stops, undefined continues

	if (!defaultAnimation) defaultAnimation = { type:defaultType };
	if (defaultAnimation && !isAnimationObject(defaultAnimation)) description = Object.assign({},defaultAnimation); // new merging of defaultAnimation and animationForKey response
	if (description && !isAnimationObject(reply)) description = Object.assign(description, reply); // new merging of defaultAnimation and animationForKey response
	else if (reply || reply === 0) description = reply;

	let animation = animationFromDescription(reply); // pretty description !
	if (!animation) {
		animation = animationFromDescription(defaultAnimation); // default is not converted to ugly in registerAnimatableProperty
		if (animation) {
			if (!animation.duration && animation.duration !== 0) {
				if (transaction.duration) animation.duration = transaction.duration;
			} // Implement transaction tests before refactoring!
			if (!animation.duration) return null; // setting value inside zero duration transaction must not animate, but allow zero duration animations otherwise.
		}
	}
	if (animation && (animation instanceof HyperAnimation || animation instanceof HyperKeyframes)) {
		if (animation.property === null || typeof animation.property === "undefined") animation.property = property;
		if (animation instanceof HyperAnimation) {
			if (animation.from === null || typeof animation.from === "undefined") {
				if (animation.blend === "absolute") animation.from = prettyPresentation;
				else animation.from = prettyPrevious;
			}
			if (animation.to === null || typeof animation.to === "undefined") animation.to = prettyValue;
		}
		if (animation.easing === null || typeof animation.easing === "undefined") animation.easing = transaction.easing;
		if (animation.duration === null || typeof animation.duration === "undefined") animation.duration = transaction.duration;
		if (!animation.duration) animation.duration = 0.0;
	}
	return animation;
}

const delegateMethods = ["display","animationForKey","input","output"]; // animationForKey // hyperAction // reaction
const controllerMethods = ["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations", "removeAnimation"];
const controllerProperties = ["layer","presentation","model","previous","animations","animationNames","animationCount"];

const hyperContext = new HyperContext();

const beginTransaction = hyperContext.beginTransaction.bind(hyperContext);
const commitTransaction = hyperContext.commitTransaction.bind(hyperContext);
const currentTransaction = hyperContext.currentTransaction.bind(hyperContext);
const flushTransaction = hyperContext.flushTransaction.bind(hyperContext);
const disableAnimation = hyperContext.disableAnimation.bind(hyperContext);

function presentationTransform(sourceLayer,sourceAnimations,time,shouldSortAnimations) { // COMPOSITING // This function mutates, allowing manual composting given layer and animations.
	if (!sourceAnimations || !sourceAnimations.length) return false;
	if (shouldSortAnimations) { // animation index. No connection to setType animation sorting
		sourceAnimations.sort( function(a,b) {
			const A = a.index || 0;
			const B = b.index || 0;
			let result = A - B;
			if (!result) result = a.startTime - b.startTime;
			if (!result) result = a.sortIndex - b.sortIndex; // animation number is needed because sort is not guaranteed to be stable
			return result;
		});
	}
	let progressChanged = false;
	sourceAnimations.forEach( function(animation) {
		progressChanged = animation.composite(sourceLayer,time) || progressChanged; // progressChanged is a premature optimization
		const debugProperty = animation.property;
		if (debugProperty && sourceLayer[debugProperty] && sourceLayer[debugProperty].px && sourceLayer[debugProperty].px.length && sourceLayer[debugProperty].px.substring && sourceLayer[debugProperty].px.substring(sourceLayer[debugProperty].px.length-3) === "NaN") {
			throw new Error("hyperact NaN composite sourceLayer:"+JSON.stringify(sourceLayer)+";");
		}
	});
	return progressChanged;
}

function activate(controller, delegate, layerInstance, descriptions) { // layer, delegate, controller?
	if (!controller) { // "Nothing to hyperactivate." // TODO: layer, delegate, controller
		if (!delegate) delegate = {};
		else if (isFunction(delegate)) delegate = { display:delegate }; // display without this
		if (!layerInstance) layerInstance = delegate;
	} else {
		if (controller.registerAnimatableProperty || controller.addAnimation) throw new Error("Already hyperactive"); // TODO: be more thorough
		if (!delegate) delegate = controller;
		else if (isFunction(delegate)) delegate = { display:delegate }; // display without this
		if (!layerInstance) layerInstance = controller;
	}
	const allAnimations = [];
	const allNames = [];
	let namedAnimations = {};
	const defaultTypes = {};
	const defaultAnimations = {}; // Shouldn't defaultAnimations be passed as delegate.animationDict instead of being registered with registerAnimatableProperty?
	let shouldSortAnimations = false;
	const modelBacking = {}; // DEPRECATED Layer instance has accessors, not values, which are stored here. There is no public way to accesss raw ugly values.
	const uglyBacking = {}; // prettyBacking is pretty, with RENDER_LAYER. Should be pretty if there are no animations.
	const prettyBacking = {};
	let cachedRenderLayer = null;
	let cachedPresentationLayer = null;
	let cachedModelLayer = null;
	let cachedPreviousLayer = null;
	const registeredProperties = [];
	let activeBacking = modelBacking;
	let changeStorage = null;

	function valueForKey(prettyKey) {
		const uglyKey = convertedKey(prettyKey,delegate.keyOutput,delegate) ;
		if (activeBacking === null) {
			console.log("activeBacking === null doesn't happen");
			return getModel()[uglyKey];

		}
		return activeBacking[uglyKey];
	}

	function setValueForKey(prettyValue,prettyKey) {
		const layer = {};
		layer[prettyKey] = prettyValue;
		setValuesOfLayer(layer);
	}

	function setValuesOfLayer(layer) {
		hyperContext.registerFlusher(flusher); // don't need to bind // FAKE_SET_BUG_FIX
		const transaction = hyperContext.currentTransaction();
		getPresentation(); // side effects needed

		const keys = Object.keys(layer);

		if (!changeStorage) {
			registerWithContext();
			changeStorage = {};
			hyperContext.registerChanger(changer);
			cachedPreviousLayer = getModel();
		}
		if (!transaction.disableAnimation) Object.assign(changeStorage,layer);
		cachedModelLayer = null;

		keys.forEach( function(prettyKey) {
			const prettyValue = layer[prettyKey];
			const uglyKey = convertedKey(prettyKey,delegate.keyInput,delegate) ;
			//registerAnimatableProperty(uglyKey); // cannot perform automatic registration, would overwrite descriptions passed in 4th argument
			const uglyValue = convertedInputOfProperty(prettyValue,uglyKey,delegate,defaultTypes);
			uglyBacking[uglyKey] = uglyValue;
			prettyBacking[uglyKey] = prettyValue;

		});
	}

	function initiateImplicitAnimation(layer) {
		const keys = Object.keys(layer);
		const transaction = hyperContext.currentTransaction();
		const presentationLayer = getPresentation();

		keys.forEach( function(prettyKey) { // using result not layer because key might be different
			const uglyKey = convertedKey(prettyKey,delegate.keyInput,delegate) ;
			//const prettyValue = layer[prettyKey]; // need a test that fails with this
			const prettyValue = getModel()[prettyKey];
			const prettyPrevious = getPrevious()[prettyKey];
			if (prettyValue !== prettyPrevious) {
				const prettyPresentation = presentationLayer[prettyKey]; // pretty key.
				const animation = implicitAnimation(prettyKey,prettyValue,prettyPrevious,prettyPresentation,delegate,defaultAnimations[uglyKey],defaultTypes[uglyKey],transaction);
				if (animation) addAnimation(animation); // There is room for optimization, reduce copying and converting between pretty and ugly
				else registerWithContext(); // but it might be a step-end which would not update!
			}
		});
	}

	function cleanupAndRemoveAnimationAtIndex(animation, index) {
		if (index > -1) {
			allAnimations.splice(index,1);
			const name = allNames[index];
			allNames.splice(index,1);
			delete namedAnimations[name];
		}
	}

	function cleanupAnimationAtIndex(animation, index, finishedWithCallback) {
		if (animation instanceof HyperGroup) { // recursive
			animation.group.forEach( function(childAnimation) {
				cleanupAnimationAtIndex(childAnimation, -1, finishedWithCallback);
			});
		} else if (animation instanceof HyperChain) { // recursive
			animation.chain.forEach( function(childAnimation) {
				cleanupAnimationAtIndex(childAnimation, -1, finishedWithCallback);
			});
		} else if (!(animation instanceof HyperAnimation) && !(animation instanceof HyperKeyframes)) throw new Error("not an animation");
		if (animation.finished) {
			if (!hyperActionIsFilling(animation)) cleanupAndRemoveAnimationAtIndex(animation,index);
			if (isFunction(animation.onend)) finishedWithCallback.push(animation);
		}
	}

	function animationCleanup() { // for the context to remove // animations contained within groups ignore remove (removedOnCompletion) but should fire onend
		let i = allAnimations.length;
		const finishedWithCallback = [];
		while (i--) {
			const animation = allAnimations[i];
			cleanupAnimationAtIndex(animation,i,finishedWithCallback);
		}
		finishedWithCallback.forEach( function(animation) {
			animation.onend.call(animation,true);
			animation.onend = null; // fill modes might otherwise cause onend to get called again. Can't freeze animation object.
		});
	}

	function removeAnimationInstance(animation) { // called from public removeAnimation
		const index = allAnimations.indexOf(animation);
		if (index > -1) {
			allAnimations.splice(index,1);
			const name = allNames[index];
			allNames.splice(index,1);
			delete namedAnimations[name];
			if (isFunction(animation.onend)) animation.onend.call(animation,false);
		}
	}

	function isAllowablePrettyKey(key) { // don't trigger animation on functions themselves
		return ((layerInstance !== controller || (controllerMethods.indexOf(key) < 0 && controllerProperties.indexOf(key) < 0)) && (layerInstance !== delegate || delegateMethods.indexOf(key) < 0));
	}
	function registerAnimatableProperty(prettyKey, optionalDescriptionOrType) {
		registerAnimatable(prettyKey, optionalDescriptionOrType);
	}

	function registerAnimatable(prettyKey, optionalDescriptionOrType, isType) { // Manually declare types or animation if not number // Needed to trigger implicit animation. // FIXME: defaultValue is broken. TODO: Proper default animations dictionary. // TODO: default animation should always be the value true
		const uglyKey = convertedKey(prettyKey,delegate.keyInput,delegate) ;
		if (!isAllowablePrettyKey(prettyKey)) return;
		let firstTime = false;
		const registeredIndex = registeredProperties.indexOf(uglyKey);
		if (registeredIndex === -1) firstTime = true;
		const prettyValue = layerInstance[prettyKey];
		if (firstTime) registeredProperties.push(uglyKey);


		const descriptor = Object.getOwnPropertyDescriptor(layerInstance, prettyKey);
		{
			if (optionalDescriptionOrType === null) { // might also need to remove the property accessors and unconvert from ugly to pretty
				delete defaultTypes[uglyKey];
				delete defaultAnimations[uglyKey];
				registeredProperties.splice(registeredIndex,1);
			} else if (isType || isDuckType(optionalDescriptionOrType)) {
				defaultTypes[uglyKey] = optionalDescriptionOrType;
				if (firstTime) defaultAnimations[uglyKey] = { type: optionalDescriptionOrType };
			} else {
				defaultAnimations[uglyKey] = optionalDescriptionOrType;
				if (optionalDescriptionOrType) defaultTypes[uglyKey] = optionalDescriptionOrType.type;
			}

		}
		if (typeof prettyValue !== "undefined" && prettyValue !== null) {
			const uglyValue = convertedInputOfProperty(prettyValue, uglyKey, delegate, defaultTypes); // layerInstance never uses uglyKey

			uglyBacking[uglyKey] = uglyValue;
			prettyBacking[uglyKey] = prettyValue;

		}


		if (!descriptor || descriptor.configurable === true) {//} || !firstTime) { // !firstTime is the second part of the specific bug fix of calling activate first then registering properties.
			Object.defineProperty(layerInstance, prettyKey, { // ACCESSORS
				get: function() {
					return valueForKey(prettyKey);
				},
				set: function(value) {
					setValueForKey(value,prettyKey);
				},
				enumerable: true,
				configurable: true
			});
		}
	}
	function getLayer() { // layer with ugly values, without animations
		return layerInstance;
	}
	function setLayer(layer) {
		if (layer) {
			setValuesOfLayer(layer);
		}
	}
	function getAnimationCount() {
		return allAnimations.length;
	}
	function getAnimations() {
		return allAnimations.map( animation => animation.description.call(animation,delegate) );
	}
	function getAnimationNames() {
		return Object.keys(namedAnimations);
	}
	function baseLayer() { // model, presentation, and previous layers start from this
		return Object.keys(layerInstance).filter(isAllowablePrettyKey).reduce( function(accumulator, current) {
			accumulator[current] = layerInstance[current];
			return accumulator;
		}, {});
	}

	function changer() {
		initiateImplicitAnimation(changeStorage);
		changeStorage = null;
	}

	function flusher() {
		cachedPresentationLayer = null;
		cachedRenderLayer = null;
	}
	function invalidate() { // Does not invalidate if there are no animations // Should not invalidate at every tick but does.
		cachedPresentationLayer = null;
	}
	// FIXME:
	// TODO: animation objects use ugly keys, animation descriptions use pretty keys
	function getRender() { // pretty values // the new version causes 5 failures in "DEPRECATED input output delegate value transforms"

		const transactionTime = hyperContext.currentTransaction().time; // has side effects
		const nextRenderLayer = Object.assign({},uglyBacking);//Object.assign(baseLayer(), modelBacking);
		let changed = true; // true is needed to ensure last frame. But you don't want this to default to true any other time with no animations. Need some other way to detect if last frame
		const length = allAnimations.length;

		if (length) changed = presentationTransform(nextRenderLayer,allAnimations,transactionTime,shouldSortAnimations);
		shouldSortAnimations = false;
		if (changed || !cachedRenderLayer) {// || cachedRenderLayer === null) { // cachedRenderLayer is always null here
			registeredProperties.forEach( function(prettyKey) {
				const uglyKey = convertedKey(prettyKey,delegate.keyOutput,delegate) ;
				const uglyValue = nextRenderLayer[prettyKey]; // ????? PRETTY OR UGLY KEY ?????
				if (uglyValue && uglyValue.length && uglyValue.substring && uglyValue.substring(uglyValue.length-3) === "NaN") ;
				nextRenderLayer[prettyKey] = convertedOutputOfProperty(uglyValue,uglyKey,delegate,defaultTypes);
				if (nextRenderLayer[prettyKey] && nextRenderLayer[prettyKey].length && nextRenderLayer[prettyKey].substring && nextRenderLayer[prettyKey].substring(nextRenderLayer[prettyKey].length-3) === "NaN") ;
			});
			Object.freeze(nextRenderLayer);
			cachedRenderLayer = nextRenderLayer;
		}
		cachedPresentationLayer = null;
		return cachedRenderLayer;

	}
	function getPresentation() { // pretty values including animations // This should be created in a very similar manner as getModel and getPrevious but is not
		if (cachedPresentationLayer !== null && cachedRenderLayer !== null) return cachedPresentationLayer;
		const renderLayer = getRender();
		const nextPresentationLayer = baseLayer();
		registeredProperties.forEach( function(uglyKey) {
			const prettyValue = renderLayer[uglyKey]; // don't need to convert
			const prettyKey = convertedKey(uglyKey,delegate.keyInput,delegate);
			Object.defineProperty(nextPresentationLayer, prettyKey, { // modelInstance has defined properties. Must redefine.
				value: prettyValue,
				enumerable: true,
				configurable: false
			});
		});
		Object.freeze(nextPresentationLayer);
		cachedPresentationLayer = nextPresentationLayer;
		return cachedPresentationLayer;

	}
	function getModel() { // pretty values without animations
		if (cachedModelLayer !== null) return cachedModelLayer;
		const nextModelLayer = baseLayer();
		registeredProperties.forEach( function(uglyKey) {
			const prettyValue = prettyBacking[uglyKey];
			const prettyKey = convertedKey(uglyKey,delegate.keyInput,delegate);
			Object.defineProperty(nextModelLayer, prettyKey, { // modelInstance has defined properties. Must redefine.
				value: prettyValue,
				enumerable: true,
				configurable: false
			});
		});
		Object.freeze(nextModelLayer);
		cachedModelLayer = nextModelLayer;
		return cachedModelLayer;
	}
	function getPrevious() { // previous pretty values without animations
		if (cachedPreviousLayer !== null) return cachedPreviousLayer;
		return getModel();
	}
	function needsDisplay() { // This should be used instead of directly calling display
		invalidate();
		registerWithContext(); // This might not be sufficient to produce a new presentationLayer
	}
	function addAnimation(description,name) { // does not register. // should be able to pass a description if type is registered
		const transaction = hyperContext.currentTransaction();
		getPresentation(); // cached layers are deleted at the beginning of a transaction, this ensures presentation is generated before animations added, else new animations contribute to presentation before flushing and you might get flicker. Must be presentationLayer, not renderLayer for some reason.
		const copy = animationFromDescription(description);
		if (!(copy instanceof HyperAnimation) && !(copy instanceof HyperKeyframes) && !(copy instanceof HyperGroup) && !(copy instanceof HyperChain)) throw new Error("Not a valid animation:"+JSON.stringify(copy));
		prepAnimationObjectFromAddAnimation(copy, delegate, defaultAnimations, defaultTypes, registerAnimatable);
		if (!allAnimations.length) registerWithContext();
		allAnimations.push(copy);
		if (name !== null && typeof name !== "undefined") {
			const previous = namedAnimations[name];
			if (previous) removeAnimationInstance(previous); // after pushing to allAnimations, so context doesn't stop ticking
			namedAnimations[name] = copy;
		}
		if (typeof name === "undefined" || name === null || name === false) allNames.push(null);
		else allNames.push(name);
		shouldSortAnimations = true;
		copy.runAnimation(layerInstance, name, transaction);
	}
	function removeAnimation(name) {
		const animation = namedAnimations[name];
		if (animation) {
			removeAnimationInstance(animation);
		}
	}
	function removeAllAnimations() {
		allAnimations.length = 0;
		allNames.length = 0;
		namedAnimations = {};
		allAnimations.forEach( function(animation) {
			if (isFunction(animation.onend)) animation.onend.call(animation,false);
		});
	}
	function animationNamed(name) {
		const animation = namedAnimations[name];
		if (animation) {
			return animation.description.call(animation,delegate);
		}
		return null;
	}

	function registerWithContext() {
		if (changeStorage) return; // if changeStorage exists, it has already registered
		const display = (!isFunction(delegate.display)) ? function() {} : function(presentation) { // layer returns calculated values during display

			activeBacking = getRender();
			delegate.display.call(delegate, presentation);
			//activeBacking = getModel();
			activeBacking = prettyBacking;

		};
		hyperContext.registerTarget(layerInstance, getRender, getAnimationCount, display, invalidate, animationCleanup, true, uglyBacking);
	}

	function defaultPropertyDescription(prettyKey) {
		const type = descriptions ? descriptions[prettyKey] : undefined;
		return type && isDuckType(type) ? { type: type } : type;
	}

	Object.keys(layerInstance).filter(isAllowablePrettyKey).forEach( function(prettyKey) { // redundancy with setValuesOfLayer (and baseLayer), maybe I could call that instead with transaction disabled
		const prettyValue = layerInstance[prettyKey];
		const uglyKey = convertedKey(prettyKey,delegate.keyInput,delegate) ;
		const description = defaultPropertyDescription(prettyKey) || { type: new HyperNumber() };
		registerAnimatableProperty(uglyKey, description); // automatic registration
		prettyBacking[uglyKey] = prettyValue;
	});

	if (descriptions) Object.keys(descriptions).filter(isAllowablePrettyKey).forEach( function(prettyKey) { // new fourth parameter to activate registers types
		const uglyKey = convertedKey(prettyKey,delegate.keyInput,delegate) ;
		const description = defaultPropertyDescription(prettyKey);
		registerAnimatableProperty(uglyKey, description);
	});

	activeBacking = getModel(); // have to do both
	activeBacking = prettyBacking; // have to do both


	if (controller) { // If controller already has these methods, I could try to chain them... if property names didn't collide, or bring back the target parameter
		controller.registerAnimatableProperty = registerAnimatableProperty;
		controller.needsDisplay = needsDisplay;
		controller.addAnimation = addAnimation;
		controller.removeAnimation = removeAnimation;
		controller.removeAllAnimations = removeAllAnimations;
		controller.animationNamed = animationNamed;
		Object.defineProperty(controller, "layer", { // TODO: I don't like this. Need a merge function.
			get: getLayer,
			set: setLayer,
			enumerable: true,
			configurable: false
		});
		Object.defineProperty(controller, "animationCount", { // Performs better than asking for animations.length, especially with delegate.input and delegate.output
			get: getAnimationCount,
			enumerable: true,
			configurable: false
		});
		Object.defineProperty(controller, "animations", { // TODO: cache this like presentationLayer
			get: getAnimations,
			enumerable: true,
			configurable: false
		});
		Object.defineProperty(controller, "animationNames", {
			get: getAnimationNames,
			enumerable: true,
			configurable: false
		});
		Object.defineProperty(controller, "presentation", {
			get: getPresentation,
			enumerable: true,
			configurable: false
		});
		Object.defineProperty(controller, "model", {
			get:getModel,
			enumerable: true,
			configurable: false
		});
		Object.defineProperty(controller, "previous", {
			get: getPrevious,
			enumerable: true,
			configurable: false
		});
	}

	return controller; // TODO: should return the deactivate function // or maybe the layerInstance
}

export { HyperArray, HyperNumber, HyperPoint, HyperRect, HyperScale, HyperSet, HyperSize, activate, beginTransaction, commitTransaction, currentTransaction, disableAnimation, flushTransaction, hyperEqualPoints, hyperEqualRanges, hyperEqualRects, hyperEqualSizes, hyperIndexInRange, hyperIntersectionRange, hyperMakePoint, hyperMakeRange, hyperMakeRect, hyperMakeSize, hyperNotFound, hyperNullRange, hyperZeroPoint, hyperZeroRange, hyperZeroRect, hyperZeroSize, presentationTransform };
