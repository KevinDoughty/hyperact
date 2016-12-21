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

function prepAnimationObjectFromDescription(animation) { // animation can be a group, to allow for recursive groups
	if (animation instanceof HyperGroup) { // recursive
		var childAnimations = animation.group;
		if (childAnimations !== null && typeof childAnimations !== "undefined") {
			if (!Array.isArray(childAnimations)) throw new Error("childAnimations is not an array");
			childAnimations.forEach( function(childAnimation) {
				prepAnimationObjectFromDescription(childAnimation);
			});
		}
	} else if (animation instanceof HyperAnimation) { // prep
		if (isFunction(animation.type)) animation.type = new animation.type();
		if (!animation.duration) animation.duration = 0.0; // TODO: need better validation. Currently split across constructor, setter, and here
		if (animation.speed === null || typeof animation.speed === "undefined") animation.speed = 1; // need better validation
		if (animation.iterations === null || typeof animation.iterations === "undefined") animation.iterations = 1; // negative values have no effect
	} else throw new Error("not an animation object");
}

export function animationFromDescription(description) {
	var animation;
	if (!description) return description;
	else if (description instanceof HyperGroup || description instanceof HyperAnimation) {
		animation = description.copy.call(description);
	} else if (Array.isArray(description)) {
		animation = new HyperGroup(description);
	} else if (isObject(description)) {
		animation = new HyperAnimation(description);
	} else if (isNumber(description)) animation = new HyperAnimation({duration:description});
	else throw new Error("is this an animation:"+JSON.stringify(description));
	prepAnimationObjectFromDescription(animation);
	return animation;
}



function HyperAction() {}

export function HyperGroup(children) {
	HyperAction.call(this);
	this.finished = false;
	var groupDuration = 0;
	this.group = children.map( function(animation) {
		var copy = animationFromDescription(animation);
		var copyDuration = copy.delay + copy.duration * copy.iterations / copy.speed;
		groupDuration = Math.max(copyDuration,groupDuration);
		return copy;
	});
	Object.defineProperty(this, "finished", {
		get: function() {
			this.group.forEach( function(animation) {
				if (!animation.finished) return false;
			});
			return true;
		},
		enumerable: false,//true,
		configurable: false
	});
}

HyperGroup.prototype = {
	constructor: HyperGroup,
	copy: function() {
		var constructor = this.constructor;
		var copy = new constructor(this.group);
		return copy;
	},
	runAnimation: function(layer,key) {
		this.group.forEach( function(animation) {
			animation.runAnimation.call(animation,layer,key);
		}.bind(this));
	},
	composite: function(onto,now) {
		this.group.forEach( function(animation) {
			animation.composite.call(animation,onto,now);
		});
	}
};

export function HyperAnimation(settings) {
	HyperAction.call(this);
	this.property; // string, property name
	this.from; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.to; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.type = wetNumberType; // Default
	this.delta; // Should this be private?

	this.duration = 0.0; // float. In seconds. Need to validate/ensure >= 0.
	this.easing; // NOT FINISHED. currently callback function only, need cubic bezier and presets. Defaults to linear
	this.speed = 1.0; // NOT FINISHED. float. RECONSIDER. Pausing currently not possible like in Core Animation. Layers have speed, beginTime, timeOffset!
	this.iterations = 1; // float >= 0.
	this.autoreverse; // boolean. When iterations > 1. Easing also reversed. Maybe should be named "autoreverses", maybe should be camelCased
	this.fillMode; // string. Defaults to "none". NOT FINISHED. "forwards" and "backwards" are "both". maybe should be named "fill". maybe should just be a boolean. // I'm unsure of the effect of combining a forward fill with additive // TODO: implement removedOnCompletion
	this.index = 0; // float. Custom compositing order.
	this.delay = 0; // float. In seconds. // TODO: easing should be taken in effect after the delay
	this.blend = "relative"; // also "absolute" or "zero" // Default should be "absolute" if explicit
	this.additive = true;
	this.sort;
	this.finished = false;
	this.startTime; // float // Should this be private?
	this.progress = 0;//null; // 0 would mean first frame does not count as a change which I want for stepEnd but probably not anything else. Also complicating is separate cachedPresentationlayer and context displayLayers
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
		var constructor = this.constructor;
		var copy = new constructor(this.settings);
		var keys = Object.getOwnPropertyNames(this);
		var length = keys.length;
		for (var i = 0; i < length; i++) {
			Object.defineProperty(copy, keys[i], Object.getOwnPropertyDescriptor(this, keys[i]));
		}
		return copy;
	},
	composite: function(onto,now) {
		if (this.startTime === null || this.startTime === undefined) throw new Error("Cannot composite an animation that has not been started."); // return this.type.zero();
		var elapsed = Math.max(0, now - (this.startTime + this.delay));

		var speed = this.speed; // might make speed a property of layer, not animation, might not because no sublayers / layer hierarcy yet. Part of GraphicsLayer.
		var iterationProgress = 1;
		var combinedProgress = 1;
		var iterationDuration = this.duration;
		var combinedDuration = iterationDuration * this.iterations;
		if (combinedDuration) {
			iterationProgress = elapsed * speed / iterationDuration;
			combinedProgress = elapsed * speed / combinedDuration;
		}
		if (combinedProgress >= 1) {
			iterationProgress = 1;
			this.finished = true;
		}
		var inReverse = 0; // falsy
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
			var rounded = 0.5-(Math.cos(iterationProgress * Math.PI) / 2);
			if (this.easing) {
				var steps = /(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);
				if (steps) {
					var desc = steps[1];
					var count = steps[2];
					if (count > 0) {
						if (desc === "step-start") iterationProgress = Math.ceil(iterationProgress * count) / count;
						else if (desc === "step-middle") iterationProgress = Math.round(iterationProgress * count) / count;
						else if (desc === "step-end" || desc === "steps") iterationProgress = Math.floor(iterationProgress * count) / count;
					} else if (this.easing !== "linear") iterationProgress = rounded;
				} else if (this.easing !== "linear") iterationProgress = rounded;
			} else iterationProgress = rounded;
		}
		var value = (this.blend === "absolute") ? this.type.interpolate(this.from,this.to,iterationProgress) : this.type.interpolate(this.delta,this.type.zero(this.to),iterationProgress); // sending argument to zero() for css transforms
		var property = this.property;
		if (typeof property !== "undefined" && property !== null) { // allow animating without declaring property
			var result = value;
			var underlying = onto[property];
			if (typeof underlying === "undefined" || underlying === null) {
				underlying = this.type.zero(this.to); // ORIGINAL // TODO: assess this // FIXME: transform functions? Underlying will never be undefined as it is a registered property, added to modelLayer. Unless you can animate properties that have not been registered, which is what I want
			}
			if (this.additive) result = this.type.add(underlying,value);
			if (this.sort && Array.isArray(result)) result.sort(this.sort);
			onto[property] = result;
		}
		var changed = (iterationProgress !== this.progress);
		this.progress = iterationProgress;

		return changed;
	},
	runAnimation: function(layer,key) {
		if (this.type && isFunction(this.type.zero) && isFunction(this.type.add) && isFunction(this.type.subtract) && isFunction(this.type.interpolate)) {
			if (!this.from) this.from = this.type.zero(this.to);
			if (!this.to) this.to = this.type.zero(this.from);
			if (this.blend !== "absolute") {
				this.delta = this.type.subtract(this.from,this.to);
			}
			if (this.startTime === null || this.startTime === undefined) throw new Error("no start time");

		} else throw new Error("Hyper.Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");
	}
};