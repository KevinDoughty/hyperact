const rAF = typeof window !== "undefined" && (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame
	) || function(callback) { setTimeout(callback, 0); }; // node has setTimeout

function isFunction$1(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

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
	this.transactions = [];
	this.ticking = false;
	this.animationFrame;
	this.displayLayers = []; // renderLayer
	this.displayFunctions = []; // strange new implementation // I don't want to expose delegate accessor on the controller, so I pass a bound function, easier to make changes to public interface.
	this.cleanupFunctions = [];
	this.invalidateFunctions = [];
}

HyperContext.prototype = {
	createTransaction: function(settings,automaticallyCommit) {
		const transaction = new HyperTransaction(settings);
		const length = this.transactions.length;
		let time = now() / 1000;
		if (length) time = this.transactions[length-1].representedObject.time; // Clock stops in the outermost transaction.
		//console.log("]]] begin transaction");
		Object.defineProperty(transaction, "time", { // Manually set time of transaction here to be not configurable
			get: function() {
				return time;
			},
			enumerable: true,
			configurable: false
		});
		this.transactions.push({ representedObject:transaction, automaticallyCommit:automaticallyCommit });
		if (automaticallyCommit) this.startTicking(); // Automatic transactions will otherwise not be closed if there is no animation or value set.
		return transaction;
	},
	currentTransaction: function() {
		const length = this.transactions.length;
		if (length) return this.transactions[length-1].representedObject;
		return this.createTransaction({},true);
	},
	beginTransaction: function(settings) { // TODO: throw on unclosed (user created) transaction
		return this.createTransaction(settings,false);
	},
	commitTransaction: function() {
		this.transactions.pop();
		//console.log("[[[ commit transaction");
	},
	flushTransaction: function() { // TODO: prevent unterminated when called within display
		//if (this.animationFrame) cAF(this.animationFrame); // Unsure if cancelling animation frame is needed.
		//this.ticker(); // This is completely wrong, or at least is nothing like CATransaction -(void)flush;
		//this.displayLayers = this.displayLayers.map( function(item) { return null; });
		this.invalidateFunctions.forEach( function(invalidate) {
			invalidate();
		});
	},
	disableAnimation: function(disable) { // If this is false, it enables animation
		if (disable !== false) disable = true; // because the function name is misleading
		const transaction = this.currentTransaction();
		transaction.disableAnimation = disable;
		this.startTicking();
	},

	registerTarget: function(target,display,invalidate,cleanup) {
		this.startTicking();
		const index = this.targets.indexOf(target);
		if (index < 0) {
			this.targets.push(target);
			this.displayLayers.push(null); // cachedPresentationLayer
			this.displayFunctions.push(display);
			this.cleanupFunctions.push(cleanup);
			this.invalidateFunctions.push(invalidate);
		}
	},

	deregisterTarget: function(target) {
		const index = this.targets.indexOf(target);
		if (index > -1) {
			this.targets.splice(index, 1);
			this.displayLayers.splice(index, 1); // cachedPresentationLayer
			this.displayFunctions.splice(index, 1);
			this.cleanupFunctions.splice(index, 1);
			this.invalidateFunctions.splice(index,1);
		}
	},

	startTicking: function() { // TODO: consider cancelling previous animation frame.
		if (!this.animationFrame) this.animationFrame = rAF(this.ticker.bind(this));
	},
	ticker: function() { // Need to manually cancel animation frame if calling directly.
		//console.log(">>> tick");
		this.animationFrame = undefined;
		const targets = this.targets; // experimental optimization, traverse backwards so you can remove. This has caused problems for me before, but I don't think I was traversing backwards.
		let i = targets.length;
		while (i--) {
			const target = targets[i];
			const display = this.displayFunctions[i]; // strange new implementation
			if (!target.animationCount) { // Deregister from inside ticker is redundant (removalCallback & removeAnimationInstance), but is still needed when needsDisplay()
				if (isFunction$1(display)) {
					target.presentation;
					display(); // new ensure one last time
				}
				this.invalidateFunctions[i](); // even stranger implementation
				this.deregisterTarget(target); // Deregister here to ensure one more tick after last animation has been removed. Different behavior than removalCallback & removeAnimationInstance, for example needsDisplay()
			} else {
				const presentationLayer = target.presentation;
				if (this.displayLayers[i] !== presentationLayer) { // suppress unnecessary displays
					if (target.animationCount) this.displayLayers[i] = presentationLayer; // cachedPresentationLayer
					//display.call(target.delegate);
					display();
					this.invalidateFunctions[i](); // even stranger implementation
				}
				this.cleanupFunctions[i](); // New style cleanup in ticker.
			}
		}
		//console.log("<<< tick end");
		const length = this.transactions.length;
		if (length) {
			const transactionWrapper = this.transactions[length-1];
			if (transactionWrapper.automaticallyCommit) this.commitTransaction();
		}
		if (this.targets.length) this.startTicking();
	}
};

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

function isFunction$2(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

function isNumber(w) { // WET
	return !isNaN(parseFloat(w)) && isFinite(w); // I want infinity for repeat count. Duration for testing additive.
}

function isObject(w) {
	return w && typeof w === "object";
}

function animationFromDescription(description) {
	let animation;
	if (!description) return description;
	else if (description instanceof HyperGroup || description instanceof HyperAnimation) {
		animation = description.copy.call(description);
	} else if (Array.isArray(description)) {
		animation = new HyperGroup(description);
	} else if (isObject(description)) {
		animation = new HyperAnimation(description);
	} else if (isNumber(description)) animation = new HyperAnimation({duration:description});
	else if (description === true) animation = new HyperAnimation({});
	else throw new Error("is this an animation:"+JSON.stringify(description));
	return animation;
}



function HyperAction() {}

function HyperGroup(children) {
	HyperAction.call(this);
	if (!Array.isArray(children)) children = [];
	this.group = children.map( function(animation) {
		return animationFromDescription(animation);
	});
	this.sortIndex;
	this.startTime;
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
}

HyperGroup.prototype = {
	constructor: HyperGroup,
	copy: function() {
		return new this.constructor(this.group);
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
	}
};

function HyperAnimation(settings) {
	HyperAction.call(this);
	this.property; // string, property name
	this.from; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.to; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.type = wetNumberType; // Default
	this.delta; // Should this be private?

	this.duration; // float. In seconds. Need to validate/ensure >= 0. Initialized in runAnimation
	this.easing; // NOT FINISHED. currently callback function only, need cubic bezier and presets. Defaults to linear. Initialized in runAnimation
	this.speed; // NOT FINISHED. float. RECONSIDER. Pausing currently not possible like in Core Animation. Layers have speed, beginTime, timeOffset! Initialized in runAnimation
	this.iterations; // float >= 0. Initialized in runAnimation
	this.autoreverse; // boolean. When iterations > 1. Easing also reversed. Maybe should be named "autoreverses", maybe should be camelCased
	this.fillMode; // string. Defaults to "none". NOT FINISHED. "forwards" and "backwards" are "both". maybe should be named "fill". maybe should just be a boolean. // I'm unsure of the effect of combining a forward fill with additive // TODO: implement removedOnCompletion
	this.index = 0; // float. Custom compositing order.
	this.delay = 0; // float. In seconds. // TODO: easing should be taken in effect after the delay
	this.blend = "relative"; // also "absolute" or "zero" // Default should be "absolute" if explicit
	this.additive = true;
	this.sort;
	this.finished = false;
	this.startTime; // float // Should this be private?
	this.progress;//null; // 0 would mean first frame does not count as a change which I want for stepEnd but probably not anything else. Also complicating is separate cachedPresentationlayer and context displayLayers. Initialized in runAnimation
	this.onend; // NOT FINISHED. callback function, fires regardless of fillMode. Should rename. Should also implement didStart, maybe didTick, etc.
	//this.naming; // "default","exact","increment","nil" // why not a key property?
	this.remove = true;

	if (settings) Object.keys(settings).forEach( function(key) {
		this[key] = settings[key];
	}.bind(this));
}

HyperAnimation.prototype = {
	constructor: HyperAnimation,
	copy: function() { // TODO: "Not Optimized. Reference to a variable that requires dynamic lookup" !!! // https://github.com/GoogleChrome/devtools-docs/issues/53
		const copy = new this.constructor(this.settings);
		const keys = Object.getOwnPropertyNames(this);
		const length = keys.length;
		for (let i = 0; i < length; i++) {
			Object.defineProperty(copy, keys[i], Object.getOwnPropertyDescriptor(this, keys[i]));
		}
		return copy;
	},
	composite: function(onto,now) {
		if (this.startTime === null || this.startTime === undefined) throw new Error("Cannot composite an animation that has not been started."); // return this.type.zero();
		const elapsed = Math.max(0, now - (this.startTime + this.delay));
		const speed = this.speed; // might make speed a property of layer, not animation, might not because no sublayers / layer hierarcy yet. Part of GraphicsLayer.
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
		if (isFunction$2(this.easing)) iterationProgress = this.easing(iterationProgress);
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
		const value = (this.blend === "absolute") ? this.type.interpolate(this.from,this.to,iterationProgress) : this.type.interpolate(this.delta,this.type.zero(this.to),iterationProgress); // sending argument to zero() for css transforms
		const property = this.property;
		if (typeof property !== "undefined" && property !== null) { // allow animating without declaring property
			let result = value;
			let underlying = onto[property];
			if (typeof underlying === "undefined" || underlying === null) {
				underlying = this.type.zero(this.to); // ORIGINAL // TODO: assess this // FIXME: transform functions? Underlying will never be undefined as it is a registered property, added to modelLayer. Unless you can animate properties that have not been registered, which is what I want
			}
			if (this.additive) result = this.type.add(underlying,value);
			if (this.sort && Array.isArray(result)) result.sort(this.sort);
			onto[property] = result;
		}
		const changed = (iterationProgress !== this.progress);
		this.progress = iterationProgress;

		return changed;
	},
	runAnimation: function(layer,key,transaction) {
		if (isFunction$2(this.type)) this.type = new this.type();
		if (this.type && isFunction$2(this.type.zero) && isFunction$2(this.type.add) && isFunction$2(this.type.subtract) && isFunction$2(this.type.interpolate)) {
			if (!this.from) this.from = this.type.zero(this.to);
			if (!this.to) this.to = this.type.zero(this.from);
			if (this.blend !== "absolute") this.delta = this.type.subtract(this.from,this.to);
			if (this.duration === null || typeof this.duration === "undefined") this.duration = transaction.duration; // This is consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
			if (this.easing === null || typeof this.easing === "undefined") this.easing = transaction.easing; // This is (probably) consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
			if (this.speed === null || typeof this.speed === "undefined") this.speed = 1.0; // need better validation
			if (this.iterations === null || typeof this.iterations === "undefined") this.iterations = 1; // negative values have no effect
			//this.progress = 0.0; // keep progress null so first tick is considered a change
			this.startTime = transaction.time;
			this.sortIndex = animationNumber++;
		} else throw new Error("Hyper.Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");
	}
};

const DELEGATE_DOUBLE_WHAMMY = true; // allow delegate the ability to convert key, to mangle for makeshift key paths.
const ENSURE_ONE_MORE_TICK = true;// true is needed to display one more time after all animations have ended. // false is needed to removeAllAnimations after unmount

const delegateMethods = ["display","animationForKey","input","output"]; // animationForKey // hyperAction // reaction
const controllerMethods = ["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations", "removeAnimation"];
const controllerProperties = ["layer","presentation","model","previous","animations","animationNames","animationCount"];

const hyperContext = new HyperContext();

const beginTransaction = hyperContext.beginTransaction.bind(hyperContext);
const commitTransaction = hyperContext.commitTransaction.bind(hyperContext);
const currentTransaction = hyperContext.currentTransaction.bind(hyperContext);
const flushTransaction = hyperContext.flushTransaction.bind(hyperContext);
const disableAnimation = hyperContext.disableAnimation.bind(hyperContext);

function isFunction(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

function prepAnimationObjectFromAddAnimation(animation, delegate) {
	if (animation instanceof HyperGroup) { // recursive
		animation.group.forEach( function(childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate);
		});
	} else if (animation instanceof HyperAnimation) {
		if (delegate.typeForProperty && animation.property) {
			const type = delegate.typeForProperty.call(delegate, animation.property, animation.to);
			if (type) animation.type = type;
		}
	} else throw new Error("not an animation");
}

function convertedKey(property,funky,self) { // DELEGATE_DOUBLE_WHAMMY // from addAnimation
	if (isFunction(funky)) return funky.call(self,property);
	return property;
}
function convertedValueOfPropertyWithFunction(value,property,funky,self) { // mutates // from register, modelLayer, and previousBacking
	if (isFunction(funky)) return funky.call(self,property,value);
	return value;
}
function convertPropertyOfLayerWithFunction(property,object,funky,self) { // mutates
	if (object && isFunction(funky)) {
		if (property === null || typeof property === "undefined") throw new Error("convert property undefined");
		const value = object[property];
		if (value !== null && typeof value !== "undefined") object[property] = funky.call(self,property,value);
	}
}
function convertPropertiesOfLayerWithFunction(properties,object,funky,self) { // mutates
	properties.forEach( function(property) {
		if (property === null || typeof property === "undefined") throw new Error("convert properties undefined");
		convertPropertyOfLayerWithFunction(property,object,funky,self);
	});
}
function convertPropertiesOfAnimationWithFunction(properties,animation,funky,self) { // mutates // animation from, to, and delta
	// ["from","to","delta"],animation,delegate.input
	if (animation && isFunction(funky)) {
		if (animation instanceof HyperGroup) { // recursive
			animation.group.forEach( function(childAnimation) {
				convertPropertiesOfAnimationWithFunction(properties,childAnimation,funky,self);
			});
		} else properties.forEach( function(item) { // HyperAnimation
			const value = animation[item];
			if (animation.property && value !== null && typeof value !== "undefined") animation[item] = funky.call(self,animation.property, value); // intentionally allows animations with an undefined property
		});
	}
}

// function presentationTransform(sourceLayer,sourceAnimations,time,shouldSortAnimations,presentationBacking) { // COMPOSITING
// 	const presentationLayer = Object.assign({},sourceLayer); // Need to make sure display has non animated properties for example this.element
// 	if (!sourceAnimations || !sourceAnimations.length) return presentationLayer;
// 	if (shouldSortAnimations) { // animation index. No connection to setType animation sorting
// 		sourceAnimations.sort( function(a,b) {
// 			const A = a.index || 0;
// 			const B = b.index || 0;
// 			let result = A - B;
// 			if (!result) result = a.startTime - b.startTime;
// 			if (!result) result = a.sortIndex - b.sortIndex; // animation number is needed because sort is not guaranteed to be stable
// 			return result;
// 		});
// 	}
// 	let progressChanged = false;
// 	sourceAnimations.forEach( function(animation) {
// 		progressChanged = animation.composite(presentationLayer,time) || progressChanged; // progressChanged is a premature optimization
// 	});
// 	if (!progressChanged && sourceAnimations.length) {
// 		if (presentationBacking) return presentationBacking;
// 	}
// 	return presentationLayer;
// }
function presentationTransform(presentationLayer,sourceAnimations,time,shouldSortAnimations) { // COMPOSITING
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
		progressChanged = animation.composite(presentationLayer,time) || progressChanged; // progressChanged is a premature optimization
	});
	return progressChanged;
}

function implicitAnimation(property,prettyValue,prettyPrevious,prettyPresentation,delegate,defaultAnimation,transaction) { // TODO: Ensure modelLayer is fully populated before calls to animationForKey so you can use other props conditionally to determine animation
	let description;
	//console.log("??? core implicitAnimation:%s; value:%s; previous:%s; presentation:%s;",property,prettyValue,prettyPrevious,prettyPresentation);
	if (isFunction(delegate.animationForKey)) description = delegate.animationForKey.call(delegate,property,prettyValue,prettyPrevious,prettyPresentation); // TODO: rename action or implicit
	let animation = animationFromDescription(description);
	if (!animation) animation = animationFromDescription(defaultAnimation); // default is not converted to ugly in registerAnimatableProperty
	if (animation && animation instanceof HyperAnimation) {
		if (animation.property === null || typeof animation.property === "undefined") animation.property = property;
		if (animation.from === null || typeof animation.from === "undefined") {
			if (animation.blend === "absolute") animation.from = prettyPresentation;
			else animation.from = prettyPrevious;
		}
		if (animation.to === null || typeof animation.to === "undefined") animation.to = prettyValue;
		if (animation.easing === null || typeof animation.easing === "undefined") animation.easing = transaction.easing;
		if (animation.duration === null || typeof animation.duration === "undefined") animation.duration = transaction.duration;
		if (!animation.duration) animation.duration = 0.0;
	}
	return animation;
}







function activate(controller, delegate, layerInstance) {
	if (!controller) throw new Error("Nothing to hyperactivate.");
	if (controller.registerAnimatableProperty || controller.addAnimation) throw new Error("Already hyperactive"); // TODO: be more thorough
	if (!delegate) delegate = controller;
	if (!layerInstance) layerInstance = controller;
	const allAnimations = [];
	const allNames = [];
	let namedAnimations = {};
	const defaultAnimations = {};
	let shouldSortAnimations = false;
	const modelBacking = {};
	const previousBacking = {}; // modelBacking and previousBacking merge like react and there is no way to delete.
	let presentationBacking = null; // This is not nulled out anymore
	const registeredProperties = [];
	let activeBacking = modelBacking;
	let presentationTime = -1;


	function valueForKey(property) { // don't let this become re-entrant (do not animate delegate.output)
		if (DELEGATE_DOUBLE_WHAMMY) property = convertedKey(property,delegate.keyOutput,delegate);
		const prettyValue = convertedValueOfPropertyWithFunction(activeBacking[property],property,delegate.output,delegate);
		return prettyValue;
	}

// 	function setValueForKey(prettyValue,property) {
// 		if (DELEGATE_DOUBLE_WHAMMY) property = convertedKey(property,delegate.keyInput);
// 		const uglyValue = convertedValueOfPropertyWithFunction(prettyValue,property,delegate.input);
// 		if (uglyValue === modelBacking[property]) return; // No animation if no change. This filters out repeat setting of unchanging model values while animating. Function props are always not equal (if you're not careful)
// 		const uglyPrevious = modelBacking[property];
// 		const prettyPrevious = convertedValueOfPropertyWithFunction(uglyPrevious,property,delegate.output);
// 		if (prettyValue === prettyPrevious) return; // No animation if no change, better version
// 		previousBacking[property] = uglyPrevious;
// 		const transaction = hyperContext.currentTransaction(); // Careful! This transaction might not get closed.
// 		if (!transaction.disableAnimation) {
// 			const presentationLayer = controller.presentation;
// 			const prettyPresentation = presentationLayer[property];
// 			const animation = implicitAnimation(property,prettyValue,prettyPrevious,prettyPresentation,delegate,defaultAnimations[property],transaction);
// 			if (animation) controller.addAnimation(animation); // There is room for optimization, reduce copying and converting between pretty and ugly
// 			else controller.needsDisplay();
// 		}
// 		modelBacking[property] = uglyValue;
// 	}
// 	function setValuesOfLayer(layer) {
// 		Object.keys(layer).forEach( function(key) {
// 			setValueForKey(layer[key],key);
// 		});
// 	}

	function setValueForKey(prettyValue,property) {
		const layer = {};
		layer[property] = prettyValue;
		setValuesOfLayer(layer);
	}
	function setValuesOfLayer(layer) {
		
		const transaction = hyperContext.currentTransaction();
		const presentationLayer = controller.presentation;
		//console.log("setValues presentationLayer:%s;",JSON.stringify(presentationLayer));
		var result = {};
// 		var prettyKeys = Object.keys(layer);
// 		var index = prettyKeys.length;
// 		while (index--) {
// 			const prettyKey = prettyKeys[index];
		Object.keys(layer).forEach( function(prettyKey) {
			let uglyKey = prettyKey;
			const prettyValue = layer[prettyKey];
			if (DELEGATE_DOUBLE_WHAMMY) uglyKey = convertedKey(prettyKey,delegate.keyInput,delegate);
			controller.registerAnimatableProperty(uglyKey);
			const uglyValue = convertedValueOfPropertyWithFunction(prettyValue,prettyKey,delegate.input,delegate);
			const uglyPrevious = modelBacking[uglyKey];
			previousBacking[uglyKey] = uglyPrevious;
			modelBacking[uglyKey] = uglyValue;
			result[prettyKey] = prettyValue;
		});
		if (!transaction.disableAnimation) {
			Object.keys(result).forEach( function(prettyKey) { // using result not layer because key might be different
				let uglyKey = prettyKey;
				if (DELEGATE_DOUBLE_WHAMMY) uglyKey = convertedKey(prettyKey,delegate.keyInput,delegate);
				const prettyValue = result[prettyKey];
				const prettyPresentation = presentationLayer[prettyKey];
				const prettyPrevious = convertedValueOfPropertyWithFunction(previousBacking[uglyKey],prettyKey,delegate.output,delegate);
				const animation = implicitAnimation(prettyKey,prettyValue,prettyPrevious,prettyPresentation,delegate,defaultAnimations[prettyKey],transaction);
				if (animation) controller.addAnimation(animation); // There is room for optimization, reduce copying and converting between pretty and ugly
				else controller.needsDisplay();
			});
		}// else controller.needsDisplay();
	}

	function invalidate() {
		presentationTime = -1;
	}

	function registerWithContext() {
		let display = function() {};
		if (isFunction(delegate.display)) display = function() {
			activeBacking = controller.presentation;
			//console.log("..... display active:%s;",JSON.stringify(activeBacking));
			delegate.display.call(delegate);
			activeBacking = modelBacking;
		};
		hyperContext.registerTarget(controller, display, invalidate, animationCleanup);
	}

	function animationCleanup() { // animations contained within groups ignore remove (removedOnCompletion) and do not fire onend
		let i = allAnimations.length;
		const finishedWithCallback = [];
		while (i--) {
			const animation = allAnimations[i];
			if (animation.finished) {
				allAnimations.splice(i,1);
				const name = allNames[i];
				allNames.splice(i,1);
				delete namedAnimations[name];
				if (isFunction(animation.onend)) finishedWithCallback.push(animation);
			}
		}
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(controller);
			}
		}
		
// 		if (!allAnimations.length) { // this is causing problems
// 			presentationBacking = modelBacking; // why would you do this?
// 		}
		finishedWithCallback.forEach( function(animation) {
			animation.onend.call(animation,true);
		});
	}

	function removeAnimationInstance(animation) {
		const index = allAnimations.indexOf(animation);
		if (index > -1) {
			allAnimations.splice(index,1);
			const name = allNames[index];
			allNames.splice(index,1);
			delete namedAnimations[name];
			if (isFunction(animation.onend)) animation.onend.call(animation,false);
		}
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(controller);
			}
		}
	}

	function allowable(key) {
		return ((layerInstance !== controller || (controllerMethods.indexOf(key) < 0 && controllerProperties.indexOf(key) < 0)) && (layerInstance !== delegate || delegateMethods.indexOf(key) < 0));
	}


	controller.registerAnimatableProperty = function(property, defaultAnimation) { // Workaround for lack of Proxy // Needed to trigger implicit animation. // FIXME: defaultValue is broken. TODO: Proper default animations dictionary.
// 		if (layerInstance === delegate && delegateMethods.indexOf(property) > -1) return; // Can't animate functions that you depend on.
// 		if (layerInstance === controller && controllerMethods.indexOf(property) > -1) return; // Can't animate functions that you depend on.
// 		if (layerInstance === controller && controllerProperties.indexOf(property) > -1) return; // Can't animate functions that you depend on.
		if (!allowable(property)) return;
		let firstTime = false;
		if (registeredProperties.indexOf(property) === -1) firstTime = true;
		if (firstTime) registeredProperties.push(property);
		const descriptor = Object.getOwnPropertyDescriptor(layerInstance, property);
		//defaultAnimation = animationFromDescription(defaultAnimation); // since I can't convert I don't need to do this either, it happens when added to the receiver
		//convertPropertiesOfAnimationWithFunction(["from","to","delta"],defaultAnimation,delegate.input); // I wish I could
		if (defaultAnimation) defaultAnimations[property] = defaultAnimation; // maybe set to defaultValue not defaultAnimation
		else if (defaultAnimations[property] === null) delete defaultAnimations[property]; // property is still animatable
		if (!descriptor || descriptor.configurable === true) {
			const uglyValue = convertedValueOfPropertyWithFunction(layerInstance[property], property, delegate.input,delegate);
			modelBacking[property] = uglyValue; // need to populate but can't use setValueForKey. No mount animations here, this function registers
			if (typeof uglyValue === "undefined") modelBacking[property] = null;
			if (firstTime) Object.defineProperty(layerInstance, property, { // ACCESSORS
				get: function() {
					return valueForKey(property);
				},
				set: function(value) {
					setValueForKey(value,property);
				},
				enumerable: true,
				configurable: true
			});
		}
		if (property === "animations") throw new Error("I don't think so");
	};

	Object.defineProperty(controller, "layer", { // TODO: I don't like this. Need a merge function.
		get: function() {
			return layerInstance;
		},
		set: function(layer) {
			if (layer) {
				setValuesOfLayer(layer);
				//flushTransaction();
			}
		},
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(controller, "animationCount", { // Performs better than asking for animations.length, especially with delegate.input and delegate.output
		get: function() {
			return allAnimations.length;
		},
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(controller, "animations", { // TODO: cache this like presentationLayer
		get: function() {
			const array = allAnimations.map(function (animation) {
				const copy = animation.copy.call(animation); // TODO: optimize me. Lots of copying. Potential optimization. Instead maybe freeze properties.
				convertPropertiesOfAnimationWithFunction(["from","to","delta"],copy,delegate.output,delegate);
				return copy;
			});
			return array;
		},
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(controller, "animationNames", {
		get: function() {
			return Object.keys(namedAnimations);
		},
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(controller, "presentation", {
		get: function() {
			//let verbose = true;
			//if (Object.keys(modelBacking).indexOf("fake") > -1) verbose = true;
			const transactionTime = hyperContext.currentTransaction().time;
			//if (verbose) console.log("presentation time:%s; transaction time:%s;",presentationTime,transactionTime);
			if (transactionTime === presentationTime && presentationBacking !== null) return presentationBacking;
//// 			let baseLayer = {};
//// 			if (controller !== layerInstance && delegate !== layerInstance) baseLayer = Object.assign({},layerInstance);

			//const presentationLayer = Object.assign({}, layerInstance, modelBacking);
			//const presentationLayer = Object.assign({}, layerInstance);
			//const presentationLayer = Object.assign({}, modelBacking);

// 			const prettyModel = Object.assign({},modelBacking);
// 			convertPropertiesOfLayerWithFunction(Object.keys(prettyModel),prettyModel,delegate.output,delegate);

			const presentationLayer = Object.assign(
				Object.keys(layerInstance).reduce( function(a, b) {
					if (allowable(b)) a[b] = layerInstance[b];
					return a;
				}, {}),
				modelBacking
			);

			//if (verbose) console.log("... presentation mid:%s;",JSON.stringify(presentationLayer));

// 			const presentationLayer = Object.assign({}, layerInstance, modelBacking);
// 			//convertPropertiesOfLayerWithFunction(Object.keys(presentationLayer),presentationLayer,delegate.output,delegate);

// 			if (!allAnimations.length) {
// 				if (verbose) console.log("... presentation result:%s;",JSON.stringify(presentationLayer));
// 				return presentationLayer;
// 			}

			let changed = true; // true is needed to ensure last frame. But you don't want this to default to true any other time with no animations. Need some other way to detect if last frame
			if (allAnimations.length) changed = presentationTransform(presentationLayer,allAnimations,transactionTime,shouldSortAnimations);
			//if (verbose) console.log("presentation changed:%s; backing:%s;",changed,presentationBacking);
			if (changed || presentationBacking === null) {
				convertPropertiesOfLayerWithFunction(Object.keys(presentationLayer),presentationLayer,delegate.output,delegate);
				presentationBacking = presentationLayer;
				Object.freeze(presentationBacking);
				//if (verbose) console.log("!!! presentation:%s; result:%s;",allAnimations.length,JSON.stringify(presentationBacking));
				//console.log("!!! presentation:%s; result:%s;",allAnimations.length,JSON.stringify(presentationBacking));
			}
			presentationTime = transactionTime;
			shouldSortAnimations = false;
			return presentationBacking;
		},
		enumerable: false,
		configurable: false
	});

// 	Object.defineProperty(controller, "model", {
// 		get: function() {
// 			const layer = {};
// 			registeredProperties.forEach( function(key) {
// 				const value = convertedValueOfPropertyWithFunction(modelBacking[key], key, delegate.output,delegate);
// 				Object.defineProperty(layer, key, { // modelInstance has defined properties. Must redefine.
// 					value: value,
// 					enumerable: true,
// 					configurable: false
// 				});
// 			});
// 			Object.freeze(layer);
// 			return layer;
// 		},
// 		enumerable: false,
// 		configurable: false
// 	});
// 	Object.defineProperty(controller, "previous", {
// 		get: function() {
// 			const layer = Object.assign({},modelBacking);
// 			Object.keys(previousBacking).forEach( function(key) {
// 				const value = convertedValueOfPropertyWithFunction(previousBacking[key], key, delegate.output,delegate);
// 				Object.defineProperty(layer, key, {
// 					value: value,
// 					enumerable: true,
// 					configurable: false
// 				});
// 				previousBacking[key] = modelBacking[key];
// 			});
// 			Object.freeze(layer);
// 			return layer;
// 		},
// 		enumerable: false,
// 		configurable: false
// 	});
	Object.defineProperty(controller, "model", {
		get: function() {
			const layer = Object.assign({},layerInstance);
			registeredProperties.forEach( function(key) {
				const value = convertedValueOfPropertyWithFunction(modelBacking[key], key, delegate.output,delegate);
				Object.defineProperty(layer, key, { // modelInstance has defined properties. Must redefine.
					value: value,
					enumerable: true,
					configurable: false
				});
			});
			Object.freeze(layer);
			return layer;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(controller, "previous", {
		get: function() {
			const layer = Object.assign({},layerInstance);
			registeredProperties.forEach( function(key) {
				const value = convertedValueOfPropertyWithFunction(previousBacking[key], key, delegate.output,delegate);
				Object.defineProperty(layer, key, {
					value: value,
					enumerable: true,
					configurable: false
				});
				previousBacking[key] = modelBacking[key];
			});
			Object.freeze(layer);
			return layer;
		},
		enumerable: false,
		configurable: false
	});

	controller.needsDisplay = function() { // This should be used instead of directly calling display
		presentationBacking = null;
		if (!allAnimations.length) registerWithContext(); // This might not be sufficient to produce a new presentationLayer
	};

	controller.addAnimation = function(description,name) { // does not register. // should be able to pass a description if type is registered
		const copy = animationFromDescription(description);
		if (!(copy instanceof HyperAnimation) && !(copy instanceof HyperGroup)) throw new Error("Animations must be a Hyper.Animation or Group subclass:"+JSON.stringify(copy));
		convertPropertiesOfAnimationWithFunction(["from","to"], copy, delegate.input,delegate); // delta is calculated from ugly values in runAnimation
		prepAnimationObjectFromAddAnimation(copy,delegate);
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
		
		const transaction = hyperContext.currentTransaction();
		copy.runAnimation(controller, name, transaction);
		
	};

	controller.removeAnimation = function(name) {
		const animation = namedAnimations[name];
		if (animation) {
			removeAnimationInstance(animation);
		}
	};

	controller.removeAllAnimations = function() {
		allAnimations.length = 0;
		allNames.length = 0;
		namedAnimations = {};
		allAnimations.forEach( function(animation) {
			if (isFunction(animation.onend)) animation.onend.call(animation,false);
		});
		if (!ENSURE_ONE_MORE_TICK) {
			hyperContext.deregisterTarget(controller);
		}
	};

	controller.animationNamed = function(name) {
		const animation = namedAnimations[name];
		if (animation) {
			const copy = animation.copy.call(animation);
			convertPropertiesOfAnimationWithFunction(["from","to","delta"],copy,delegate.output,delegate);
			return copy;
		}
		return null;
	};

	Object.keys(layerInstance).forEach( function(key) { // more initialization
		controller.registerAnimatableProperty(key);
	});

	return controller;
}

function isFunction$3(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}


function HyperScale(settings) {
}
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
	}
};








// struct convenience constructors:

function One(element) {
	activate(this);
	this.display = function() {
		document.getElementById(element).innerHTML = element +":<br>" +
			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
	};
}
One.prototype = {
	animationForKey: function(key,value,previous,presentation) {
		return 1.0;
	},
	input:function(key,value) {
		return value;
	},
	output:function(key,value) {
		return Math.round(value);
	}
};
var one = new One("one");
one.registerAnimatableProperty("x");
one.layer["a"] = 1;
one.layer["b"] = 2;
one.layer = {
	c: 3
};
var e = {
	property:"e",
	duration: 5,
	from: 5,
	to: 0,
	onend: function(finished) {
		console.log("onend:%s; two:%s;",JSON.stringify(this),JSON.stringify(two));
	}
};
one.addAnimation(e);

console.log("animations:%s;",JSON.stringify(one.animations));

function Two(element) {
	activate(this,this,{});
	this.display = function() {
		document.getElementById(element).innerHTML = element+":" + "<br>" + 
			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous) + "<br><br>";
	};
}
Two.prototype = {
	animationForKey: function(key,value,previous,presentation) {
		return 1.0;
	},
	input:function(key,value) {
		return value;
	},
	output:function(key,value) {
		if (key === "x") return Number(value).toFixed(1);
		return value;
	}
};
var two = new Two("two");
two.registerAnimatableProperty("x");
two.layer["a"] = 1;
two.layer["b"] = 2;
two.layer = {
	c: 3
};

var three = {
	animationForKey: function(key,value,previous,presentation) {
		return 1.0;
	},
	display:function() {
		document.getElementById("three").innerHTML = "three:<br>" +
			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
	},
	input:function(key,value) {
		if (key === "x" && value && value.length > 4 && value.substring(value.length-4) === " !!!") value = Number(value.substring(0, value.length-4));
		return value;
	},
	output:function(key,value) {
		if (key === "x" && value) return Math.round(value) + " !!!";
		return value;
	}
};
activate(three);
three.display();
three.registerAnimatableProperty("x");
three.layer = {
	c: 3
};

var four = {
	animationForKey: function(key,value,previous,presentation) {
		return 1.0;
	},
	display:function() {
		document.getElementById("four").innerHTML = "four:<br>" +
			"keys&nbsp;" + JSON.stringify(Object.keys(four)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
	}
};

activate(four,four,{scale:1});
four.registerAnimatableProperty("x");
four.layer = {
	c: 3
};
four.registerAnimatableProperty("scale", {
	type: new HyperScale(),
	duration: 5.0
});
four.layer.scale = 2;

document.addEventListener("mousemove",function(e) {
	one.x = e.clientX;
	two.layer.x = e.clientX;
	three.x = e.clientX;
	four.layer.x = e.clientX;
});

var c = {
	property: "c",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute",
	additive:false
};
var cc = {
	property: "c",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute"
};
var d = {
	property: "d",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute",
	additive:false
};
var dd = {
	property: "d",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute"
};
var e = {
	property: "e",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute",
	additive:false
};

document.addEventListener("mousedown",function(event) {
	one.addAnimation(c);
	two.addAnimation(cc);
	three.addAnimation(cc);
	four.addAnimation(c);

	one.addAnimation(d);
	two.addAnimation(dd);
	three.addAnimation(dd);
	four.addAnimation(d);

	one.addAnimation(e);
	two.addAnimation(e);
	three.addAnimation(e);
	four.addAnimation(e);
});
