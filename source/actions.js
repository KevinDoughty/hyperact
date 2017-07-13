const TRANSACTION_DURATION_ALONE_IS_ENOUGH = true;

let animationNumber = 0;

const wetNumberType = { // WET
	zero: function() {
		return 0;
	},
	add: function(a, b) {
		return a + b;
	},
	subtract: function(a, b) {
		return a - b;
	},
	interpolate: function(a, b, progress) {
		return a + (b - a) * progress;
	}
};

function isFunction(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

function isNumber(w) { // WET
	return !isNaN(parseFloat(w)) && isFinite(w); // I want infinity for repeat count. Duration for testing additive.
}

function isObject(w) {
	return w && typeof w === "object";
}



export function HyperChain(childrenOrSettings) {
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
	convert: function(funky,self) { // mutates // animation from, to, and delta
		if (isFunction(funky)) this.chain.forEach( function(animation) {
			animation.convert.call(animation,funky,self);
		});
	}
};

export function HyperGroup(childrenOrSettings) {
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
	convert: function(funky,self) { // mutates // animation from, to, and delta
		if (isFunction(funky)) this.group.forEach( function(animation) {
			animation.convert.call(animation,funky,self);
		});
	}
};


export function hyperActionIsFilling(action) {
// used in Core:cleanupAnimationAtIndex // does not apply to group & chain animations, or animations contained in a group or chain
// Animations with a fill will be very inefficient, because composite will always return true for changed
	return (action.finished && (action.fillMode === "forwards" || action.fillMode === "both")); // incomplete
}// TODO: Determine CA behavior with autoreverses && backwards fill

function HyperAction() {
	this.property; // string, property name
	this.type = wetNumberType; // Default
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
// 		const copy = new this.constructor(this.settings);
// 		const keys = Object.getOwnPropertyNames(this);
// 		const length = keys.length;
// 		for (let i = 0; i < length; i++) {
// 			Object.defineProperty(copy, keys[i], Object.getOwnPropertyDescriptor(this, keys[i]));
// 		}
// 		return copy;
	},
	composite: function(onto,now) {
		if (this.startTime === null || this.startTime === undefined) throw new Error("Cannot composite an animation that has not been started."); // return this.type.zero();
		if (this.startTime > now && this.fillMode !== "backwards" && this.fillMode !== "both") return false;
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
		if (isFunction(this.easing)) iterationProgress = this.easing(iterationProgress);
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
		if (this instanceof HyperKeyframes) { // TODO: This is just wrong
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
		if (typeof property !== "undefined" && property !== null) { // allow animating without declaring property
			let result = value;
			let underlying = onto[property];
			if (typeof underlying === "undefined" || underlying === null) underlying = this.type.zero(this.to); // ORIGINAL // TODO: assess this // FIXME: transform functions? Underlying will never be undefined as it is a registered property, added to modelLayer. Unless you can animate properties that have not been registered, which is what I want
			if (this.additive) result = this.type.add(underlying,value);
			if (this.sort && Array.isArray(result)) result.sort(this.sort);
			onto[property] = result;
		}
		const changed = (iterationProgress !== this.progress || this.finished); // Animations with a fill will be very inefficient.
		this.progress = iterationProgress;
		return changed;
	}
};



export function HyperKeyframes(settings) {
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
	if (isFunction(this.type)) this.type = new this.type();
	if (this.type && isFunction(this.type.zero) && isFunction(this.type.add) && isFunction(this.type.subtract) && isFunction(this.type.interpolate)) {
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
HyperKeyframes.prototype.convert = function(funky,self) { // mutates // animation from, to, and delta
	if (isFunction(funky) && this.property) {
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


export function HyperAnimation(settings) {
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
	if (!this.type) {
		this.type = wetNumberType; // questionable if I should do this here
	}
	if (isFunction(this.type)) this.type = new this.type();
	if (this.type && isFunction(this.type.zero) && isFunction(this.type.add) && isFunction(this.type.subtract) && isFunction(this.type.interpolate)) {
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
HyperAnimation.prototype.convert = function(funky,self) { // mutates // animation from, to, and delta
	if (isFunction(funky) && this.property) {
		const properties = ["from","to","delta"]; // addAnimation only has from and to, delta is calcuated from ugly values in runAnimation
		properties.forEach( function(item) { // HyperAnimation
			const value = this[item];
			if (value !== null && typeof value !== "undefined") this[item] = funky.call(self,this.property, value); // intentionally allows animations with an undefined property
		}.bind(this));
	}
};



export function animationFromDescription(description) {
	let animation;
	if (!description && (TRANSACTION_DURATION_ALONE_IS_ENOUGH || description !== 0)) return description; // TODO: if animationForKey returns null, stops. But defaultAnimation does not behave like CA animation dict and should
	if (description instanceof HyperAction || description instanceof HyperKeyframes || description instanceof HyperGroup || description instanceof HyperChain) {
		animation = description.copy.call(description);
	} else if (Array.isArray(description)) {
		animation = new HyperGroup(description);
	} else if (isObject(description)) { // TODO: if has both keyframes and from/to, descriptions could return a group of both. But why?
		if (TRANSACTION_DURATION_ALONE_IS_ENOUGH && isFunction(description.add) && isFunction(description.subtract) && isFunction(description.zero) && isFunction(description.interpolate)) { // quack
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