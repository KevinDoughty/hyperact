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
	}
};



function HyperAction() {
	this.property; // string, property name
	this.type = wetNumberType; // Default
	this.duration; // float. In seconds. Need to validate/ensure >= 0. Initialized in runAnimation
	this.easing; // NOT FINISHED. currently callback function only, need cubic bezier and presets. Defaults to linear. Initialized in runAnimation
	this.speed; // NOT FINISHED. float. RECONSIDER. Pausing currently not possible like in Core Animation. Layers have speed, beginTime, timeOffset! Initialized in runAnimation
	this.iterations; // float >= 0. Initialized in runAnimation
	this.autoreverse; // boolean. When iterations > 1. Easing also reversed. Maybe should be named "autoreverses", maybe should be camelCased
	this.fillMode; // string. Defaults to "none". NOT FINISHED. "forwards" and "backwards" are "both". maybe should be named "fill". maybe should just be a boolean. // I'm unsure of the effect of combining a forward fill with additive // TODO: implement removedOnCompletion
	this.index = 0; // float. Custom compositing order.
	this.delay = 0; // float. In seconds. // TODO: easing should be taken in effect after the delay
	this.blend = "relative"; // also "absolute" // Default should be "absolute" if explicit
	this.additive = true;
	this.sort;
	this.finished = false;
	this.startTime; // float // Should this be private?
	this.progress;//null; // 0 would mean first frame does not count as a change which I want for stepEnd but probably not anything else. Also complicating is separate cachedPresentationlayer and context displayLayers. No longer initialized in runAnimation
	this.onend; // NOT FINISHED. callback function, fires regardless of fillMode. Should rename. Should also implement didStart, maybe didTick, etc.
	//this.naming; // "default","exact","increment","nil" // why not a key property?
	this.remove = true;
} // Can't freeze animation objects while implementation of core cleanup sets onend function to null

HyperAction.prototype = {
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
		//const value = (this.blend === "absolute") ? this.type.interpolate(this.from,this.to,iterationProgress) : this.type.interpolate(this.delta,this.type.zero(this.to),iterationProgress); // sending argument to zero() for css transforms
		let value;
		if (this instanceof HyperKeyframes) { // TODO: This is just wrong
			const length = this.keyframes.length;
			if (!length) throw new Error("HyperAction composite need to be able to handle zero keyframes");
			if (length === 1) throw new Error("HyperAction composite need to be able to handle one keyframe");
			//let i = length;
			//while (i--) { // TODO: This is also just wrong
			let i;
			for (i=0; i<length-1; i++) {
				//const offset = this.offsets[i];
				//console.log("%s iterationProgress:%s; >= offset:%s;",i,iterationProgress,offset);
				if (iterationProgress >= this.offsets[i] && iterationProgress < this.offsets[i+1]) {
					break;
				}
			}
			const previous = i;
			let next = previous+1;
			if (this.blend === "absolute") value = this.type.interpolate(this.keyframes[previous],this.keyframes[next],iterationProgress-this.offsets[previous]);
			else value = this.type.interpolate(this.delta[previous],this.delta[next],iterationProgress-this.offsets[previous]); // sending argument to zero() for css transforms (or custom types)
			//console.log("%s prev:%s; next:%s; progress:%s; offset prev:%s; next:%s; keyframes prev:%s; next:%s; value:%s; offsets:%s; keyframes:%s;",this.property,previous,next,iterationProgress,this.offsets[previous],this.offsets[next],this.keyframes[previous],this.keyframes[next],value,JSON.stringify(this.offsets),JSON.stringify(this.keyframes));
		} else { // HyperAnimation
			if (this.blend === "absolute") value = this.type.interpolate(this.from,this.to,iterationProgress);
			else value = this.type.interpolate(this.delta,this.type.zero(this.to),iterationProgress); // sending argument to zero() for css transforms (or custom types)
		}
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
		const changed = (iterationProgress !== this.progress || this.finished);
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

	if (!Array.isArray(this.offsets) || this.offsets.length !== length) { // TODO: handle zero or one frames
		if (length < 2) this.offsets = [];
		else this.offsets = this.keyframes.map( function(item,index) {
			return index/(length-1);
		});
	} else this.offsets.sort((a,b) => { // TODO: maybe verify all offset are actually numbers, between 0 and 1
		return a-b;
	});
}

HyperKeyframes.prototype = Object.create(HyperAction.prototype);
HyperKeyframes.prototype.constructor = HyperKeyframes;
HyperKeyframes.prototype.runAnimation = function(layer,key,transaction) {
	if (isFunction(this.type)) this.type = new this.type();
	if (this.type && isFunction(this.type.zero) && isFunction(this.type.add) && isFunction(this.type.subtract) && isFunction(this.type.interpolate)) {
// 			if (!this.from) this.from = this.type.zero(this.to);
// 			if (!this.to) this.to = this.type.zero(this.from);
// 			if (this.blend !== "absolute") this.delta = this.type.subtract(this.from,this.to);
		if (this.blend !== "absolute" && this.keyframes.length) {
			const last = this.keyfames.length-1;
			const array = [];
			for (let i=0; i<last; i++) {
				array[i] = this.type.subtract(array[i],array[i+1]);
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



export function HyperAnimation(settings) {
	HyperAction.call(this);
	this.from; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.to; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.delta; // Should this be private?

	if (settings) Object.keys(settings).forEach( function(key) {
		this[key] = settings[key];
	}.bind(this));
}

HyperAnimation.prototype = Object.create(HyperAction.prototype);
HyperAnimation.prototype.constructor = HyperAnimation;
HyperAnimation.prototype.runAnimation = function(layer,key,transaction) {
	if (!this.type) {
		console.log("HyperAnimation runAnimation questionable type assignment");
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



export function animationFromDescription(description) {
	let animation;
	if (!description) return description;
	if (description instanceof HyperAction || description instanceof HyperGroup || description instanceof HyperChain) {
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