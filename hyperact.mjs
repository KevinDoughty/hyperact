var rAF = typeof window !== "undefined" && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame) || function (callback) {
	setTimeout(callback, 0);
}; // node has setTimeout

function isFunction$1(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

var now = Date.getTime;
if (Date.now) now = Date.now;
if (typeof window !== "undefined" && typeof window.performance !== "undefined" && typeof window.performance.now !== "undefined") now = window.performance.now.bind(window.performance);

function HyperTransaction(settings) {
	this.time; // set in createTransaction so value is same as parent transaction and can be frozen
	this.disableAnimation = false; // value should probably be inherited from parent transaction
	this.duration;
	this.easing;
	//this.completionHandler; // would be nice
	if (settings) Object.keys(settings).forEach(function (key) {
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
	createTransaction: function createTransaction(settings, automaticallyCommit) {
		var transaction = new HyperTransaction(settings);
		var length = this.transactions.length;
		var time = now() / 1000;
		if (length) time = this.transactions[length - 1].representedObject.time; // Clock stops in the outermost transaction.
		Object.defineProperty(transaction, "time", { // Manually set time of transaction here to be not configurable
			get: function get() {
				return time;
			},
			enumerable: true,
			configurable: false
		});
		this.transactions.push({ representedObject: transaction, automaticallyCommit: automaticallyCommit });
		if (automaticallyCommit) this.startTicking(); // Automatic transactions will otherwise not be closed if there is no animation or value set.
		return transaction;
	},
	currentTransaction: function currentTransaction() {
		var length = this.transactions.length;
		if (length) return this.transactions[length - 1].representedObject;
		return this.createTransaction({}, true);
	},
	beginTransaction: function beginTransaction(settings) {
		// TODO: throw on unclosed (user created) transaction
		return this.createTransaction(settings, false);
	},
	commitTransaction: function commitTransaction() {
		this.transactions.pop();
	},
	flushTransaction: function flushTransaction() {
		// TODO: prevent unterminated when called within display
		//console.log("flush");
		//console.log("functions:%s;",this.invalidateFunctions.length);
		this.invalidateFunctions.forEach(function (invalidate) {
			// this won't work if there are no animations thus not registered
			invalidate();
		});
	},
	disableAnimation: function disableAnimation(disable) {
		// If this is false, it enables animation
		if (disable !== false) disable = true; // because the function name is misleading
		var transaction = this.currentTransaction();
		transaction.disableAnimation = disable;
		this.startTicking();
	},

	registerTarget: function registerTarget(target, display, invalidate, cleanup) {
		this.startTicking();
		var index = this.targets.indexOf(target);
		if (index < 0) {
			this.targets.push(target);
			this.displayLayers.push(null); // cachedPresentationLayer
			this.displayFunctions.push(display);
			this.cleanupFunctions.push(cleanup);
			this.invalidateFunctions.push(invalidate);
		}
	},

	deregisterTarget: function deregisterTarget(target) {
		var index = this.targets.indexOf(target);
		if (index > -1) {
			this.targets.splice(index, 1);
			this.displayLayers.splice(index, 1); // cachedPresentationLayer
			this.displayFunctions.splice(index, 1);
			this.cleanupFunctions.splice(index, 1);
			this.invalidateFunctions.splice(index, 1);
		}
	},

	startTicking: function startTicking() {
		// TODO: consider cancelling previous animation frame.
		if (!this.animationFrame) this.animationFrame = rAF(this.ticker.bind(this));
	},
	ticker: function ticker() {
		// Need to manually cancel animation frame if calling directly.
		this.animationFrame = undefined;
		var targets = this.targets; // experimental optimization, traverse backwards so you can remove. This has caused problems for me before, but I don't think I was traversing backwards.
		var i = targets.length;
		while (i--) {
			var target = targets[i];
			var display = this.displayFunctions[i]; // strange new implementation
			if (!target.animationCount) {
				// Deregister from inside ticker is redundant (removalCallback & removeAnimationInstance), but is still needed when needsDisplay()
				if (isFunction$1(display)) {
					target.presentation;
					display(); // new ensure one last time
				}
				this.invalidateFunctions[i](); // even stranger implementation
				this.deregisterTarget(target); // Deregister here to ensure one more tick after last animation has been removed. Different behavior than removalCallback & removeAnimationInstance, for example needsDisplay()
			} else {
				var presentationLayer = target.presentation;
				if (this.displayLayers[i] !== presentationLayer) {
					// suppress unnecessary displays
					if (target.animationCount) this.displayLayers[i] = presentationLayer; // cachedPresentationLayer
					//display.call(target.delegate);
					display();
					this.invalidateFunctions[i](); // even stranger implementation
				}
				this.cleanupFunctions[i](); // New style cleanup in ticker.
			}
		}
		var length = this.transactions.length;
		if (length) {
			var transactionWrapper = this.transactions[length - 1];
			if (transactionWrapper.automaticallyCommit) this.commitTransaction();
		}
		if (this.targets.length) this.startTicking();
	}
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var TRANSACTION_DURATION_ALONE_IS_ENOUGH$1 = true;

var animationNumber = 0;

var wetNumberType = { // WET
	zero: function zero() {
		return 0;
	},
	add: function add(a, b) {
		return a + b;
	},
	subtract: function subtract(a, b) {
		return a - b;
	},
	interpolate: function interpolate(a, b, progress) {
		return a + (b - a) * progress;
	}
};

function isFunction$2(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

function isNumber(w) {
	// WET
	return !isNaN(parseFloat(w)) && isFinite(w); // I want infinity for repeat count. Duration for testing additive.
}

function isObject(w) {
	return w && (typeof w === "undefined" ? "undefined" : _typeof(w)) === "object";
}

function HyperChain(childrenOrSettings) {
	var children = [];
	if (Array.isArray(childrenOrSettings)) children = childrenOrSettings;else if (childrenOrSettings && Array.isArray(childrenOrSettings.chain)) children = childrenOrSettings.chain;
	this.chain = children.map(function (animation) {
		return animationFromDescription(animation);
	});
	// 	this.sortIndex;
	// 	this.startTime;
	// 	this.onend;
	Object.defineProperty(this, "finished", {
		get: function get$$1() {
			if (!this.chain.length) return true;
			return this.chain[this.chain.length - 1].finished;
		},
		enumerable: false,
		configurable: false
	});
	if (childrenOrSettings && !Array.isArray(childrenOrSettings)) Object.keys(childrenOrSettings).forEach(function (key) {
		if (key !== "chain" && key !== "finished") this[key] = childrenOrSettings[key];
	}.bind(this));
}

HyperChain.prototype = {
	constructor: HyperChain,
	copy: function copy() {
		return new this.constructor(this);
	},
	runAnimation: function runAnimation(layer, key, transaction) {
		this.sortIndex = animationNumber++;
		if (this.startTime === null || typeof this.startTime === "undefined") this.startTime = transaction.time;
		var length = this.chain.length;
		var fakeTransaction = Object.assign({}, transaction);
		var startTime = this.startTime;
		for (var index = 0; index < length; index++) {
			var animation = this.chain[index];
			fakeTransaction.time = startTime;
			animation.runAnimation.call(animation, layer, key, fakeTransaction);
			if (startTime === Infinity || animation.iterations === Infinity) startTime = Infinity; // TODO: negative infinity?
			else startTime = startTime + animation.delay + animation.duration * animation.iterations;
		}
	},
	composite: function composite(onto, now) {
		var changed = false;
		var length = this.chain.length;
		for (var index = 0; index < length; index++) {
			var animation = this.chain[index];
			changed = animation.composite.call(animation, onto, now) || changed;
		}
		return changed;
	},
	convert: function convert(funky, self) {
		// mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
		if (isFunction$2(funky)) this.chain.forEach(function (animation) {
			animation.convert.call(animation, funky, self);
		});
	}
};
HyperChain.prototype.description = function (delegate) {
	var copy = Object.assign({}, this);
	copy.chain = this.chain.map(function (animation) {
		return animation.description(delegate);
	});
	return copy;
};

function HyperGroup(childrenOrSettings) {
	var children = [];
	if (Array.isArray(childrenOrSettings)) children = childrenOrSettings;else if (childrenOrSettings && childrenOrSettings.group) children = childrenOrSettings.group;

	this.group = children.map(function (animation) {
		return animationFromDescription(animation);
	});
	// 	this.sortIndex;
	// 	this.startTime;
	// 	this.onend;
	Object.defineProperty(this, "finished", {
		get: function get$$1() {
			var result = true;
			this.group.forEach(function (animation) {
				if (!animation.finished) result = false;
			});
			return result;
		},
		enumerable: false,
		configurable: false
	});
	if (childrenOrSettings && !Array.isArray(childrenOrSettings)) Object.keys(childrenOrSettings).forEach(function (key) {
		if (key !== "group" && key !== "finished") this[key] = childrenOrSettings[key];
	}.bind(this));
}

HyperGroup.prototype = {
	constructor: HyperGroup,
	copy: function copy() {
		return new this.constructor(this);
	},
	runAnimation: function runAnimation(layer, key, transaction) {
		this.sortIndex = animationNumber++;
		if (this.startTime === null || typeof this.startTime === "undefined") this.startTime = transaction.time;
		this.group.forEach(function (animation) {
			animation.runAnimation.call(animation, layer, key, transaction);
		});
	},
	composite: function composite(onto, now) {
		var changed = false;
		this.group.forEach(function (animation) {
			changed = animation.composite.call(animation, onto, now) || changed;
		});
		return changed;
	},
	convert: function convert(funky, self) {
		// mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
		if (isFunction$2(funky)) this.group.forEach(function (animation) {
			animation.convert.call(animation, funky, self);
		});
	}
};
HyperGroup.prototype.description = function (delegate) {
	var copy = Object.assign({}, this);
	copy.group = this.group.map(function (animation) {
		return animation.description(delegate);
	});
	return copy;
};

function hyperActionIsFilling(action) {
	// used in Core:cleanupAnimationAtIndex // does not apply to group & chain animations, or animations contained in a group or chain
	// Animations with a fill will be very inefficient, because composite will always return true for changed
	return action.finished && (action.fillMode === "forwards" || action.fillMode === "both"); // incomplete
} // TODO: Determine CA behavior with autoreverses && backwards fill

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
	copy: function copy() {
		// TODO: "Not Optimized. Reference to a variable that requires dynamic lookup" !!! // https://github.com/GoogleChrome/devtools-docs/issues/53
		return new this.constructor(this);
		// 		const copy = new this.constructor(this.settings);
		// 		const keys = Object.getOwnPropertyNames(this);
		// 		const length = keys.length;
		// 		for (let i = 0; i < length; i++) {
		// 			Object.defineProperty(copy, keys[i], Object.getOwnPropertyDescriptor(this, keys[i]));
		// 		}
		// 		return copy;
	},
	composite: function composite(onto, now) {
		if (this.startTime === null || this.startTime === undefined) throw new Error("Cannot composite an animation that has not been started."); // return this.type.zero();
		if (this.startTime > now && this.fillMode !== "backwards" && this.fillMode !== "both") return false;
		if (this.finished && this.fillMode !== "forwards" && this.fillMode !== "both") return false;
		var elapsed = Math.max(0, now - (this.startTime + this.delay));
		var speed = this.speed; // might make speed a property of layer, not animation, might not because no sublayers / layer hierarcy
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
		if (inReverse) iterationProgress = 1 - iterationProgress; // easing is also reversed
		if (isFunction$2(this.easing)) iterationProgress = this.easing(iterationProgress);else if (this.easing === "step-start") iterationProgress = Math.ceil(iterationProgress);else if (this.easing === "step-middle") iterationProgress = Math.round(iterationProgress);else if (this.easing === "step-end") iterationProgress = Math.floor(iterationProgress);else {
			// TODO: match web-animations syntax
			// TODO: refine regex, perform once in runAnimation
			// FIXME: step-end displays twice (actually thrice). Should I just display once, not at the start?
			var rounded = 0.5 - Math.cos(iterationProgress * Math.PI) / 2;
			if (this.easing) {
				var steps = /(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);
				if (steps) {
					var desc = steps[1];
					var count = steps[2];
					if (count > 0) {
						if (desc === "step-start") iterationProgress = Math.ceil(iterationProgress * count) / count;else if (desc === "step-middle") iterationProgress = Math.round(iterationProgress * count) / count;else if (desc === "step-end" || desc === "steps") iterationProgress = Math.floor(iterationProgress * count) / count;
					} else if (this.easing !== "linear") iterationProgress = rounded;
				} else if (this.easing !== "linear") iterationProgress = rounded;
			} else iterationProgress = rounded;
		}
		var value = void 0;
		if (this instanceof HyperKeyframes) {
			// TODO: This is just wrong
			var length = this.keyframes.length;
			if (!length) throw new Error("HyperAction composite need to be able to handle zero keyframes");
			if (length === 1) throw new Error("HyperAction composite need to be able to handle one keyframe");
			var i = length - 1;
			while (i--) {
				// TODO: test that this works in reverse
				if (iterationProgress >= this.offsets[i]) break;
			}
			var previous = i;
			var next = previous + 1;
			var frameSpan = this.offsets[next] - this.offsets[previous];
			if (frameSpan === 0) throw new Error("can't divide by zero. check your keyframe offsets.");
			var frameLocation = iterationProgress - this.offsets[previous];
			var frameProgress = frameLocation / frameSpan;
			if (this.blend === "absolute") value = this.type.interpolate(this.keyframes[previous], this.keyframes[next], frameProgress);else value = this.type.interpolate(this.delta[previous], this.delta[next], frameProgress); // sending argument to zero() for css transforms (or custom types)
		} else {
			// HyperAnimation
			if (this.blend === "absolute") value = this.type.interpolate(this.from, this.to, iterationProgress);else value = this.type.interpolate(this.delta, this.type.zero(this.to), iterationProgress); // sending argument to zero() for css transforms (or custom types)
		}
		var property = this.property;
		if (typeof property !== "undefined" && property !== null) {
			// allow animating without declaring property
			var result = value;
			var underlying = onto[property];
			if (typeof underlying === "undefined" || underlying === null) underlying = this.type.zero(this.to); // ORIGINAL // TODO: assess this // FIXME: transform functions? Underlying will never be undefined as it is a registered property, added to modelLayer. Unless you can animate properties that have not been registered, which is what I want
			if (this.additive) result = this.type.add(underlying, value);
			if (this.sort && Array.isArray(result)) result.sort(this.sort);
			onto[property] = result;
		}
		var changed = iterationProgress !== this.progress || this.finished; // Animations with a fill will be very inefficient.
		this.progress = iterationProgress;
		return changed;
	}
};

function HyperKeyframes(settings) {
	HyperAction.call(this);
	var children = [];
	if (settings && Array.isArray(settings.keyframes)) children = settings.keyframes;
	this.keyframes = children;
	var length = this.keyframes.length;

	if (settings) Object.keys(settings).forEach(function (key) {
		if (key !== "keyframes") this[key] = settings[key];
	}.bind(this));

	// TODO: lots of validation
	// TODO: composite assumes offsets are in order, and not equal (need to prevent dividing by zero)

	if (!Array.isArray(this.offsets) || this.offsets.length !== length) {
		// TODO: handle zero or one frames
		if (length < 2) this.offsets = [];else this.offsets = this.keyframes.map(function (item, index) {
			return index / (length - 1);
		});
	} else this.offsets.sort(function (a, b) {
		// TODO: maybe verify all offset are actually numbers, between 0 and 1
		return a - b;
	});
	this.progress = null;
}

HyperKeyframes.prototype = Object.create(HyperAction.prototype);
HyperKeyframes.prototype.constructor = HyperKeyframes;
HyperKeyframes.prototype.copy = function () {
	return new this.constructor(this);
};
HyperKeyframes.prototype.runAnimation = function (layer, key, transaction) {
	if (isFunction$2(this.type)) this.type = new this.type();
	if (this.type && isFunction$2(this.type.zero) && isFunction$2(this.type.add) && isFunction$2(this.type.subtract) && isFunction$2(this.type.interpolate)) {
		if (this.blend !== "absolute" && this.keyframes.length) {
			var last = this.keyframes.length - 1;
			var array = [];
			for (var i = 0; i < last; i++) {
				array[i] = this.type.subtract(this.keyframes[i], this.keyframes[last]);
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
HyperKeyframes.prototype.convert = function (funky, self) {
	// mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
	if (isFunction$2(funky) && this.property) {
		var properties = ["keyframes", "delta"];
		properties.forEach(function (item) {
			var _this = this;

			// HyperKeyframes
			if (this[item]) {
				var array = this[item].slice(0);
				this[item] = array.map(function (value) {
					return funky.call(self, _this.property, value); // intentionally allows animations with an undefined property
				});
			}
		}.bind(this));
	}
};
HyperKeyframes.prototype.description = function (delegate) {
	var copy = Object.assign({}, this);
	this.convert.call(copy, delegate.output, delegate);
	return copy;
};

function HyperAnimation(settings) {
	HyperAction.call(this);
	this.from; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.to; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.delta; // Should this be private?

	if (settings) Object.keys(settings).forEach(function (key) {
		this[key] = settings[key];
	}.bind(this));
	this.progress = null;
}

HyperAnimation.prototype = Object.create(HyperAction.prototype);
HyperAnimation.prototype.constructor = HyperAnimation;
HyperAnimation.prototype.runAnimation = function (layer, key, transaction) {
	if (!this.type) {
		this.type = wetNumberType; // questionable if I should do this here
	}
	if (isFunction$2(this.type)) this.type = new this.type();
	if (this.type && isFunction$2(this.type.zero) && isFunction$2(this.type.add) && isFunction$2(this.type.subtract) && isFunction$2(this.type.interpolate)) {
		if (!this.from) this.from = this.type.zero(this.to);
		if (!this.to) this.to = this.type.zero(this.from);
		if (this.blend !== "absolute") this.delta = this.type.subtract(this.from, this.to);
		if (this.duration === null || typeof this.duration === "undefined") this.duration = transaction.duration; // This is consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
		if (this.easing === null || typeof this.easing === "undefined") this.easing = transaction.easing; // This is (probably) consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
		if (this.speed === null || typeof this.speed === "undefined") this.speed = 1.0; // need better validation
		if (this.iterations === null || typeof this.iterations === "undefined") this.iterations = 1; // negative values have no effect
		//this.progress = 0.0; // keep progress null so first tick is considered a change
		if (typeof this.startTime === "undefined" || this.startTime === null) this.startTime = transaction.time;
		this.sortIndex = animationNumber++;
	} else throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");
};
HyperAnimation.prototype.convert = function (funky, self) {
	// mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
	if (isFunction$2(funky) && this.property) {
		var properties = ["from", "to", "delta"]; // addAnimation only has from and to, delta is calcuated from ugly values in runAnimation
		properties.forEach(function (item) {
			// HyperAnimation
			var value = this[item];
			if (value !== null && typeof value !== "undefined") this[item] = funky.call(self, this.property, value); // intentionally allows animations with an undefined property
		}.bind(this));
	}
};
HyperAnimation.prototype.description = function (delegate) {
	var copy = Object.assign({}, this);
	this.convert.call(copy, delegate.output, delegate);
	return copy;
};

function animationFromDescription(description) {
	var animation = void 0;
	if (!description && (TRANSACTION_DURATION_ALONE_IS_ENOUGH$1 || description !== 0)) return description; // TODO: if animationForKey returns null, stops. But defaultAnimation does not behave like CA animation dict and should
	if (description instanceof HyperAction || description instanceof HyperKeyframes || description instanceof HyperGroup || description instanceof HyperChain) {
		animation = description.copy.call(description);
	} else if (Array.isArray(description)) {
		animation = new HyperGroup(description);
	} else if (isObject(description)) {
		// TODO: if has both keyframes and from/to, descriptions could return a group of both. But why?
		if (TRANSACTION_DURATION_ALONE_IS_ENOUGH$1 && isFunction$2(description.add) && isFunction$2(description.subtract) && isFunction$2(description.zero) && isFunction$2(description.interpolate)) {
			// quack
			animation = new HyperAnimation({ type: description }); // for registerAnimatableProperty and implicit animation from transaction duration alone
		} else if (Array.isArray(description.keyframes)) animation = new HyperKeyframes(description);else if (Array.isArray(description.group)) animation = new HyperGroup(description);else if (Array.isArray(description.chain)) animation = new HyperChain(description);else animation = new HyperAnimation(description);
	} else if (isNumber(description)) animation = new HyperAnimation({ duration: description });else if (description === true) animation = new HyperAnimation({});else throw new Error("is this an animation:" + JSON.stringify(description));
	// TODO: What happened to instantiating if description is a function?
	return animation;
}

var TRANSACTION_DURATION_ALONE_IS_ENOUGH = true; // original was false and required a default animation, but CA behavior is true
var DELEGATE_DOUBLE_WHAMMY = true; // allow delegate the ability to convert key, to mangle for makeshift key paths.
var ENSURE_ONE_MORE_TICK = true; // true is needed to display one more time after all animations have ended. // false is needed to removeAllAnimations after unmount

var delegateMethods = ["display", "animationForKey", "input", "output"]; // animationForKey // hyperAction // reaction
var controllerMethods = ["addAnimation", "animationNamed", "needsDisplay", "registerAnimatableProperty", "removeAllAnimations", "removeAnimation"];
var controllerProperties = ["layer", "presentation", "model", "previous", "animations", "animationNames", "animationCount"];

var hyperContext = new HyperContext();

var beginTransaction = hyperContext.beginTransaction.bind(hyperContext);
var commitTransaction = hyperContext.commitTransaction.bind(hyperContext);
var currentTransaction = hyperContext.currentTransaction.bind(hyperContext);
var flushTransaction = hyperContext.flushTransaction.bind(hyperContext);
var disableAnimation = hyperContext.disableAnimation.bind(hyperContext);

function isFunction(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

function prepAnimationObjectFromAddAnimation(animation, delegate) {
	// If this is only called from addAnimation, why is it here?
	if (animation instanceof HyperAnimation || animation instanceof HyperKeyframes) {
		if (delegate && animation.property && isFunction(delegate.typeOfProperty)) {
			var type = delegate.typeOfProperty.call(delegate, animation.property);
			if (type) animation.type = type;
		}
	} else if (animation instanceof HyperGroup) {
		// recursive
		animation.group.forEach(function (childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate);
		});
	} else if (animation instanceof HyperChain) {
		// recursive
		animation.chain.forEach(function (childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate);
		});
	} else throw new Error("not an animation");
}

function convertedKey(property, funky, self) {
	// DELEGATE_DOUBLE_WHAMMY // from addAnimation
	if (isFunction(funky)) return funky.call(self, property);
	return property;
}
function convertedValueOfPropertyWithFunction(value, property, funky, self) {
	// mutates // from register, modelLayer, and previousBacking
	if (isFunction(funky)) return funky.call(self, property, value);
	return value;
}
function convertPropertyOfLayerWithFunction(property, object, funky, self) {
	// mutates
	if (object && isFunction(funky)) {
		if (property === null || typeof property === "undefined") throw new Error("convert property undefined");
		var value = object[property];
		if (value !== null && typeof value !== "undefined") object[property] = funky.call(self, property, value);
	}
}
function convertPropertiesOfLayerWithFunction(properties, object, funky, self) {
	// mutates
	properties.forEach(function (property) {
		if (property === null || typeof property === "undefined") throw new Error("convert properties undefined");
		convertPropertyOfLayerWithFunction(property, object, funky, self);
	});
}

function presentationTransform(presentationLayer, sourceAnimations, time, shouldSortAnimations) {
	// COMPOSITING // This function is separated out here for now defunct hyperstyle behavior allowing manual composting given layer and animations.
	if (!sourceAnimations || !sourceAnimations.length) return false;
	if (shouldSortAnimations) {
		// animation index. No connection to setType animation sorting
		sourceAnimations.sort(function (a, b) {
			var A = a.index || 0;
			var B = b.index || 0;
			var result = A - B;
			if (!result) result = a.startTime - b.startTime;
			if (!result) result = a.sortIndex - b.sortIndex; // animation number is needed because sort is not guaranteed to be stable
			return result;
		});
	}
	var progressChanged = false;
	sourceAnimations.forEach(function (animation) {
		progressChanged = animation.composite(presentationLayer, time) || progressChanged; // progressChanged is a premature optimization
	});
	return progressChanged;
}

function implicitAnimation(property, prettyValue, prettyPrevious, prettyPresentation, delegate, defaultAnimation, transaction) {
	// TODO: Ensure modelLayer is fully populated before calls to animationForKey so you can use other props conditionally to determine animation
	var description = void 0;
	if (isFunction(delegate.animationForKey)) description = delegate.animationForKey.call(delegate, property, prettyValue, prettyPrevious, prettyPresentation); // TODO: rename action or implicit
	if (TRANSACTION_DURATION_ALONE_IS_ENOUGH && description === null) return null; // null stops, undefined continues
	var animation = animationFromDescription(description);
	if (!animation) {
		animation = animationFromDescription(defaultAnimation); // default is not converted to ugly in registerAnimatableProperty
		if (animation && TRANSACTION_DURATION_ALONE_IS_ENOUGH) {
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
				if (animation.blend === "absolute") animation.from = prettyPresentation;else animation.from = prettyPrevious;
			}
			if (animation.to === null || typeof animation.to === "undefined") animation.to = prettyValue;
		}
		if (animation.easing === null || typeof animation.easing === "undefined") animation.easing = transaction.easing;
		if (animation.duration === null || typeof animation.duration === "undefined") animation.duration = transaction.duration;
		if (!animation.duration) animation.duration = 0.0;
	}
	return animation;
}

function decorate(controller, delegate, layerInstance) {
	// deprecated
	return activate(controller, delegate, layerInstance);
}

function activate(controller, delegate, layerInstance) {
	if (!controller) throw new Error("Nothing to hyperactivate.");
	if (controller.registerAnimatableProperty || controller.addAnimation) throw new Error("Already hyperactive"); // TODO: be more thorough
	if (!delegate) delegate = controller;
	if (!layerInstance) layerInstance = controller;
	var allAnimations = [];
	var allNames = [];
	var namedAnimations = {};
	var defaultAnimations = {};
	var shouldSortAnimations = false;
	var modelBacking = {};
	var previousBacking = {}; // modelBacking and previousBacking merge like react and there is no way to delete.
	var presentationBacking = null;
	var registeredProperties = [];
	var activeBacking = modelBacking;
	//let presentationTime = -1;

	function valueForKey(property) {
		// don't let this become re-entrant (do not animate delegate.output)
		if (DELEGATE_DOUBLE_WHAMMY) property = convertedKey(property, delegate.keyOutput, delegate);
		var prettyValue = convertedValueOfPropertyWithFunction(activeBacking[property], property, delegate.output, delegate);
		return prettyValue;
	}

	function setValueForKey(prettyValue, property) {
		var layer = {};
		layer[property] = prettyValue;
		setValuesOfLayer(layer);
	}
	function setValuesOfLayer(layer) {
		var transaction = hyperContext.currentTransaction();
		var presentationLayer = controller.presentation; // Generate presentation even if not accessed for implicit animation. Required for test "registered implicit presentation"
		var result = {};
		Object.keys(layer).forEach(function (prettyKey) {
			var uglyKey = prettyKey;
			var prettyValue = layer[prettyKey];
			if (DELEGATE_DOUBLE_WHAMMY) uglyKey = convertedKey(prettyKey, delegate.keyInput, delegate);
			controller.registerAnimatableProperty(uglyKey); // automatic registration
			var uglyValue = convertedValueOfPropertyWithFunction(prettyValue, prettyKey, delegate.input, delegate);
			var uglyPrevious = modelBacking[uglyKey];
			previousBacking[uglyKey] = uglyPrevious;
			modelBacking[uglyKey] = uglyValue;
			result[prettyKey] = prettyValue;
		});
		if (!transaction.disableAnimation) {
			Object.keys(result).forEach(function (prettyKey) {
				// using result not layer because key might be different
				var uglyKey = prettyKey;
				if (DELEGATE_DOUBLE_WHAMMY) uglyKey = convertedKey(prettyKey, delegate.keyInput, delegate);
				var prettyValue = result[prettyKey];
				var prettyPrevious = convertedValueOfPropertyWithFunction(previousBacking[uglyKey], prettyKey, delegate.output, delegate);
				if (prettyValue !== prettyPrevious) {
					var prettyPresentation = presentationLayer[prettyKey];
					var animation = implicitAnimation(prettyKey, prettyValue, prettyPrevious, prettyPresentation, delegate, defaultAnimations[prettyKey], transaction);
					if (animation) controller.addAnimation(animation); // There is room for optimization, reduce copying and converting between pretty and ugly
					else controller.needsDisplay();
				}
			});
		}
	}

	function invalidate() {
		// note that you cannot invalidate if there are no animations
		presentationBacking = null;
	}

	function registerWithContext() {
		var display = function display() {};
		if (isFunction(delegate.display)) display = function display() {
			activeBacking = controller.presentation;
			delegate.display.call(delegate);
			activeBacking = modelBacking;
		};
		hyperContext.registerTarget(controller, display, invalidate, animationCleanup);
	}

	function cleanupAndRemoveAnimationAtIndex(animation, index) {
		if (index > -1) {
			allAnimations.splice(index, 1);
			var name = allNames[index];
			allNames.splice(index, 1);
			delete namedAnimations[name];
		}
	}
	function cleanupAnimationAtIndex(animation, index, finishedWithCallback) {
		if (animation instanceof HyperGroup) {
			// recursive
			animation.group.forEach(function (childAnimation) {
				cleanupAnimationAtIndex(childAnimation, -1, finishedWithCallback);
			});
		} else if (animation instanceof HyperChain) {
			// recursive
			animation.chain.forEach(function (childAnimation) {
				cleanupAnimationAtIndex(childAnimation, -1, finishedWithCallback);
			});
		} else if (!(animation instanceof HyperAnimation) && !(animation instanceof HyperKeyframes)) throw new Error("not an animation");
		if (animation.finished) {
			if (!hyperActionIsFilling(animation)) cleanupAndRemoveAnimationAtIndex(animation, index);
			if (isFunction(animation.onend)) finishedWithCallback.push(animation);
		}
	}

	function animationCleanup() {
		// for the context to remove // animations contained within groups ignore remove (removedOnCompletion) but should fire onend
		var i = allAnimations.length;
		var finishedWithCallback = [];
		while (i--) {
			var animation = allAnimations[i];
			cleanupAnimationAtIndex(animation, i, finishedWithCallback);
		}
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(controller);
			}
		}
		finishedWithCallback.forEach(function (animation) {
			animation.onend.call(animation, true);
			animation.onend = null; // fill modes might otherwise cause onend to get called again. Can't freeze animation object.
		});
	}

	function removeAnimationInstance(animation) {
		// called from public removeAnimation
		var index = allAnimations.indexOf(animation);
		if (index > -1) {
			allAnimations.splice(index, 1);
			var name = allNames[index];
			allNames.splice(index, 1);
			delete namedAnimations[name];
			if (isFunction(animation.onend)) animation.onend.call(animation, false);
		}
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(controller);
			}
		}
	}

	function isAllowableProperty(key) {
		// don't trigger animation on functions themselves
		return (layerInstance !== controller || controllerMethods.indexOf(key) < 0 && controllerProperties.indexOf(key) < 0) && (layerInstance !== delegate || delegateMethods.indexOf(key) < 0);
	}

	controller.registerAnimatableProperty = function (property, defaultAnimation) {
		// Workaround for lack of Proxy // Needed to trigger implicit animation. // FIXME: defaultValue is broken. TODO: Proper default animations dictionary. // TODO: default animation should always be the value true
		if (!isAllowableProperty(property)) return;
		var firstTime = false;
		if (registeredProperties.indexOf(property) === -1) firstTime = true;
		if (firstTime) registeredProperties.push(property);
		var descriptor = Object.getOwnPropertyDescriptor(layerInstance, property);
		if (defaultAnimation) defaultAnimations[property] = defaultAnimation; // maybe set to defaultValue not defaultAnimation
		else if (defaultAnimations[property] === null) delete defaultAnimations[property]; // property is still animatable
		if (!descriptor || descriptor.configurable === true) {
			var uglyValue = convertedValueOfPropertyWithFunction(layerInstance[property], property, delegate.input, delegate);
			modelBacking[property] = uglyValue; // need to populate but can't use setValueForKey. No mount animations here, this function registers
			if (typeof uglyValue === "undefined") modelBacking[property] = null;
			if (firstTime) Object.defineProperty(layerInstance, property, { // ACCESSORS
				get: function get() {
					return valueForKey(property);
				},
				set: function set(value) {
					setValueForKey(value, property);
				},
				enumerable: true,
				configurable: true
			});
		}
	};

	Object.defineProperty(controller, "layer", { // TODO: I don't like this. Need a merge function.
		get: function get() {
			return layerInstance;
		},
		set: function set(layer) {
			if (layer) {
				setValuesOfLayer(layer);
			}
		},
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(controller, "animationCount", { // Performs better than asking for animations.length, especially with delegate.input and delegate.output
		get: function get() {
			return allAnimations.length;
		},
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(controller, "animations", { // TODO: cache this like presentationLayer
		get: function get() {
			var array = allAnimations.map(function (animation) {
				return animation.description.call(animation, delegate);
				// 				const copy = animation.copy.call(animation); // TODO: optimize me. Lots of copying. Potential optimization. Instead maybe freeze properties.
				// 				copy.convert.call(copy,delegate.output,delegate);
				// 				return copy;
			});
			return array;
		},
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(controller, "animationNames", {
		get: function get() {
			return Object.keys(namedAnimations);
		},
		enumerable: false,
		configurable: false
	});

	function baseLayer() {
		// model, presentation, and previous layers start from this
		return Object.keys(layerInstance).filter(isAllowableProperty).reduce(function (accumulator, current) {
			accumulator[current] = layerInstance[current];
			return accumulator;
		}, {});
	}

	Object.defineProperty(controller, "presentation", {
		get: function get() {
			var transactionTime = hyperContext.currentTransaction().time;
			if (presentationBacking !== null) return presentationBacking;
			var presentationLayer = Object.assign(baseLayer(), modelBacking);
			var changed = true; // true is needed to ensure last frame. But you don't want this to default to true any other time with no animations. Need some other way to detect if last frame
			var length = allAnimations.length;
			if (length) changed = presentationTransform(presentationLayer, allAnimations, transactionTime, shouldSortAnimations);
			shouldSortAnimations = false;
			if (changed || presentationBacking === null) {
				convertPropertiesOfLayerWithFunction(Object.keys(presentationLayer), presentationLayer, delegate.output, delegate);
				Object.freeze(presentationLayer);
				if (length) presentationBacking = presentationLayer;else presentationBacking = null;
				return presentationLayer;
			}
			return presentationBacking;
		},
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(controller, "model", {
		get: function get() {
			var layer = baseLayer();
			registeredProperties.forEach(function (key) {
				var value = convertedValueOfPropertyWithFunction(modelBacking[key], key, delegate.output, delegate);
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
		get: function get() {
			var layer = baseLayer(); //Object.assign({},layerInstance);
			registeredProperties.forEach(function (key) {
				var value = convertedValueOfPropertyWithFunction(previousBacking[key], key, delegate.output, delegate);
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

	controller.needsDisplay = function () {
		// This should be used instead of directly calling display
		presentationBacking = null;
		if (!allAnimations.length) registerWithContext(); // This might not be sufficient to produce a new presentationLayer
	};

	controller.addAnimation = function (description, name) {
		// does not register. // should be able to pass a description if type is registered
		if (delegate && isFunction(delegate.animationFromDescription)) description = delegate.animationFromDescription(description); // deprecate this
		var copy = animationFromDescription(description);
		if (!(copy instanceof HyperAnimation) && !(copy instanceof HyperKeyframes) && !(copy instanceof HyperGroup) && !(copy instanceof HyperChain)) throw new Error("Not a valid animation:" + JSON.stringify(copy));
		copy.convert.call(copy, delegate.input, delegate); // delta is calculated from ugly values in runAnimation
		prepAnimationObjectFromAddAnimation(copy, delegate);
		if (!allAnimations.length) registerWithContext();
		allAnimations.push(copy);
		if (name !== null && typeof name !== "undefined") {
			var previous = namedAnimations[name];
			if (previous) removeAnimationInstance(previous); // after pushing to allAnimations, so context doesn't stop ticking
			namedAnimations[name] = copy;
		}
		if (typeof name === "undefined" || name === null || name === false) allNames.push(null);else allNames.push(name);
		shouldSortAnimations = true;
		var transaction = hyperContext.currentTransaction();
		copy.runAnimation(controller, name, transaction);
	};

	controller.removeAnimation = function (name) {
		var animation = namedAnimations[name];
		if (animation) {
			removeAnimationInstance(animation);
		}
	};

	controller.removeAllAnimations = function () {
		allAnimations.length = 0;
		allNames.length = 0;
		namedAnimations = {};
		allAnimations.forEach(function (animation) {
			if (isFunction(animation.onend)) animation.onend.call(animation, false);
		});
		if (!ENSURE_ONE_MORE_TICK) {
			hyperContext.deregisterTarget(controller);
		}
	};

	controller.animationNamed = function (name) {
		var animation = namedAnimations[name];
		if (animation) {
			return animation.description.call(animation, delegate);
			// 			const copy = animation.copy.call(animation);
			// 			copy.convert.call(copy,delegate.output,delegate);
			// 			return copy;
		}
		return null;
	};

	Object.keys(layerInstance).forEach(function (key) {
		// more initialization
		if (TRANSACTION_DURATION_ALONE_IS_ENOUGH) controller.registerAnimatableProperty(key, true); // second argument true because you should animate every property if transaction has a duration. TODO: ensure this does not interfere with automatic registration when setting values
		else controller.registerAnimatableProperty(key);
	});

	return controller;
}

function isFunction$3(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

function HyperNumber() {/*#__PURE__*/}
HyperNumber.prototype = {
	constructor: HyperNumber,
	zero: function zero() {
		return 0;
	},
	add: function add(a, b) {
		return a + b;
	},
	subtract: function subtract(a, b) {
		// subtract b from a
		return a - b;
	},
	interpolate: function interpolate(a, b, progress) {
		return a + (b - a) * progress;
	},
	toString: function toString() {
		return "HyperNumber";
	},
	toJSON: function toJSON() {
		return this.toString();
	}
};

function HyperScale() {/*#__PURE__*/}
HyperScale.prototype = {
	constructor: HyperScale,
	zero: function zero() {
		return 1;
	},
	add: function add(a, b) {
		return a * b;
	},
	subtract: function subtract(a, b) {
		// subtract b from a
		if (b === 0) return 0;
		return a / b;
	},
	interpolate: function interpolate(a, b, progress) {
		return a + (b - a) * progress;
	},
	toString: function toString() {
		return "HyperScale";
	},
	toJSON: function toJSON() {
		return this.toString();
	}
};

function HyperArray(type, length, settings) {
	this.type = type;
	if (isFunction$3(type)) this.type = new type(settings);
	this.length = length;
}
HyperArray.prototype = {
	constructor: HyperArray,
	zero: function zero() {
		var array = [];
		var i = this.length;
		while (i--) {
			array.push(this.type.zero());
		}return array;
	},
	add: function add(a, b) {
		var array = [];
		for (var i = 0; i < this.length; i++) {
			array.push(this.type.add(a[i], b[i]));
		}
		return array;
	},
	subtract: function subtract(a, b) {
		// subtract b from a
		var array = [];
		for (var i = 0; i < this.length; i++) {
			array.push(this.type.subtract(a[i], b[i]));
		}
		return array;
	},
	interpolate: function interpolate(a, b, progress) {
		var array = [];
		for (var i = 0; i < this.length; i++) {
			array.push(this.type.interpolate(a[i], b[i], progress));
		}
		return array;
	},
	toString: function toString() {
		return "HyperArray";
	},
	toJSON: function toJSON() {
		return this.toString();
	}
};

function HyperSet(settings) {
	if (isFunction$3(settings)) this.sort = settings;else if (settings && isFunction$3(settings.sort)) this.sort = settings.sort;
	this.debug = "HyperSet";
}
HyperSet.prototype = {
	constructor: HyperSet,
	zero: function zero() {
		return [];
	},
	add: function add(a, b) {
		// add b to a
		if (!Array.isArray(a) && !Array.isArray(b)) return [];
		if (!Array.isArray(a)) return b;
		if (!Array.isArray(b)) return a;

		var array = [];
		var aLength = a.length;
		var bLength = b.length;
		var i = 0;
		var j = 0;
		if (isFunction$3(this.sort)) while (i < aLength || j < bLength) {
			if (i === aLength) {
				array.push(b[j]);
				j++;
			} else if (j === bLength) {
				array.push(a[i]);
				i++;
			} else {
				var A = a[i];
				var B = b[j];
				var sort = this.sort(A, B);
				if (sort === 0) {
					// sort is used to determine identity, not just equality.
					array.push(A);
					i++;
					j++;
				} else if (sort < 0) {
					array.push(A);
					i++;
				} else if (sort > 0) {
					array.push(B);
					j++;
				} else throw new Error("HyperSet invalid sort function, add a:" + A + "; b:" + B + "; result:" + sort + ";");
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
	subtract: function subtract(a, b) {
		// remove b from a
		if (!Array.isArray(a) && !Array.isArray(b)) return [];
		if (!Array.isArray(a)) return b;
		if (!Array.isArray(b)) return a;

		var array = [];
		var aLength = a.length;
		var bLength = b.length;
		var i = 0;
		var j = 0;
		if (isFunction$3(this.sort)) while (i < aLength || j < bLength) {
			if (i === aLength) {
				break;
			} else if (j === bLength) {
				array.push(a[i]);
				i++;
			} else {
				var A = a[i];
				var B = b[j];
				var sort = this.sort(A, B);
				if (sort === 0) {
					// sort is used to determine identity, not just equality.
					i++;
					j++;
				} else if (sort < 0) {
					array.push(A);
					i++;
				} else if (sort > 0) {
					j++;
				} else throw new Error("HyperSet invalid sort function, subtract a:" + A + "; b:" + B + "; result:" + sort + ";");
			}
		} else {
			array = a.slice(0);
			i = b.length;
			while (i--) {
				var loc = array.indexOf(b[i]);
				if (loc > -1) array.splice(loc, 1);
			}
		}
		return array;
	},
	interpolate: function interpolate(a, b, progress) {
		if (progress >= 1) return b;
		return a;
	},
	toString: function toString() {
		return "HyperSet";
	},
	toJSON: function toJSON() {
		return this.toString();
	}
};

/*#__PURE__*/var HyperPoint = function () {
	function HyperPoint() {
		/*#__PURE__*/

		classCallCheck(this, HyperPoint);
	}

	createClass(HyperPoint, [{
		key: "zero",
		value: function zero() {
			return hyperZeroPoint();
		}
	}, {
		key: "add",
		value: function add(a, b) {
			return hyperMakePoint(a.x + b.x, a.y + b.y);
		}
	}, {
		key: "subtract",
		value: function subtract(a, b) {
			// subtract b from a
			return hyperMakePoint(a.x - b.x, a.y - b.y);
		}
	}, {
		key: "interpolate",
		value: function interpolate(a, b, progress) {
			return hyperMakePoint(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress);
		}
	}, {
		key: "toString",
		value: function toString() {
			return "HyperPoint";
		}
	}, {
		key: "toJSON",
		value: function toJSON() {
			return this.toString();
		}
	}]);
	return HyperPoint;
}();

/*#__PURE__*/var HyperSize = function () {
	function HyperSize() {
		/*#__PURE__*/

		classCallCheck(this, HyperSize);
	}

	createClass(HyperSize, [{
		key: "zero",
		value: function zero() {
			return hyperZeroSize();
		}
	}, {
		key: "add",
		value: function add(a, b) {
			return hyperMakeSize(a.width + b.width, a.height + b.height);
		}
	}, {
		key: "subtract",
		value: function subtract(a, b) {
			// subtract b from a
			return hyperMakeSize(a.width - b.width, a.height - b.height);
		}
	}, {
		key: "interpolate",
		value: function interpolate(a, b, progress) {
			return hyperMakeSize(a.width + (b.width - a.width) * progress, a.height + (b.height - a.height) * progress);
		}
	}, {
		key: "toString",
		value: function toString() {
			return "HyperSize";
		}
	}, {
		key: "toJSON",
		value: function toJSON() {
			return this.toString();
		}
	}]);
	return HyperSize;
}();

/*#__PURE__*/var HyperRect = function () {
	function HyperRect() {
		/*#__PURE__*/

		classCallCheck(this, HyperRect);
	}

	createClass(HyperRect, [{
		key: "zero",
		value: function zero() {
			return hyperZeroRect();
		}
	}, {
		key: "add",
		value: function add(a, b) {
			return {
				origin: HyperPoint.prototype.add(a.origin, b.origin),
				size: HyperSize.prototype.add(a.size, b.size)
			};
		}
	}, {
		key: "subtract",
		value: function subtract(a, b) {
			// subtract b from a
			return {
				origin: HyperPoint.prototype.subtract(a.origin, b.origin),
				size: HyperSize.prototype.subtract(a.size, b.size)
			};
		}
	}, {
		key: "interpolate",
		value: function interpolate(a, b, progress) {
			return {
				origin: HyperPoint.prototype.interpolate(a.origin, b.origin, progress),
				size: HyperSize.prototype.interpolate(a.size, b.size, progress)
			};
		}
	}, {
		key: "toString",
		value: function toString() {
			return "HyperRect";
		}
	}, {
		key: "toJSON",
		value: function toJSON() {
			return this.toString();
		}
	}]);
	return HyperRect;
}();

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

var hyperNotFound = Number.MAX_VALUE;
// struct convenience constructors:
function hyperMakeRect(x, y, width, height) {
	return {
		origin: hyperMakePoint(x, y),
		size: hyperMakeSize(width, height)
	};
}
function hyperZeroRect() {
	return hyperMakeRect(0, 0, 0, 0);
}
function hyperEqualRects(a, b) {
	return hyperEqualPoints(a.origin, b.origin) && hyperEqualSizes(a.size, b.size);
}

function hyperMakePoint(x, y) {
	return {
		x: x,
		y: y
	};
}
function hyperZeroPoint() {
	return hyperMakePoint(0, 0);
}
function hyperEqualPoints(a, b) {
	return a.x === b.x && a.y === b.y;
}

function hyperMakeSize(width, height) {
	return {
		width: width,
		height: height
	};
}
function hyperZeroSize() {
	return hyperMakeSize(0, 0);
}
function hyperEqualSizes(a, b) {
	return a.width === b.width && a.height && b.height;
}

function hyperMakeRange(location, length) {
	return {
		location: location,
		length: length
	};
}
function hyperZeroRange() {
	return hyperMakeRange(0, 0);
}
function hyperNullRange() {
	return hyperMakeRange(hyperNotFound, 0);
}
function hyperIndexInRange(index, range) {
	return index > range.location && index < range.location + range.length;
}
function hyperEqualRanges(a, b) {
	return a.location === b.location && a.length === b.length;
}
function hyperIntersectionRange(a, b) {
	if (a.location + a.length <= b.location || b.location + b.length <= a.location) return hyperNullRange();
	var location = Math.max(a.location, b.location);
	var end = Math.min(a.location + a.length, b.location + b.length);
	return { location: location, length: end - location };
}

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var nonNumericType = {
	toString: function toString() {
		return "nonNumericType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	zero: function zero() {
		return "";
	},
	inverse: function inverse(value) {
		return value;
	},
	add: function add(base, delta) {
		return isDefined(delta) ? delta : base;
	},
	subtract: function subtract(base, delta) {
		// same as add? or return base?
		return base; // Sure why not
		//return this.add(base,this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		return f < 0.5 ? from : to;
	},
	output: function output(value) {
		return value;
	},
	input: function input(value) {
		return value;
	}
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var SVG_NS = "http://www.w3.org/2000/svg";

// Tree shaking is only possible in cases where the constructor args and shape of the object match,
// (ie no work other than assignment is done in the constructor.)
function createObject(proto, obj) {
	var newObject = Object.create(proto);
	Object.getOwnPropertyNames(obj).forEach(function (name) {
		Object.defineProperty(newObject, name, Object.getOwnPropertyDescriptor(obj, name));
	});
	return newObject;
}

function typeWithKeywords(keywords, type) {
	//console.log("HyperStyle typeWithKeywords:%s; type:%s;",keywords,type);
	var isKeyword;
	if (keywords.length === 1) {
		var keyword = keywords[0];
		isKeyword = function isKeyword(value) {
			return value === keyword;
		};
	} else {
		isKeyword = function isKeyword(value) {
			return keywords.indexOf(value) >= 0;
		};
	}
	return createObject(type, {
		add: function add(base, delta) {
			if (isKeyword(base) || isKeyword(delta)) {
				return delta;
			}
			return type.add(base, delta);
		},
		subtract: function subtract(base, delta) {
			if (isKeyword(base) || isKeyword(delta)) {
				return base;
			}
			return type.subtract(base, delta);
		},
		zero: function zero(value) {
			return ""; // should be "none" if possible
		},
		interpolate: function interpolate(from, to, f) {
			if (isKeyword(from) || isKeyword(to)) {
				return nonNumericType.interpolate(from, to, f);
			}
			return type.interpolate(from, to, f);
		},
		output: function output(value, svgMode) {
			return isKeyword(value) ? value : type.output(value, svgMode);
		},
		input: function input(value) {
			return isKeyword(value) ? value : type.input(value);
		}
	});
}

function clamp(x, min, max) {
	return Math.max(Math.min(x, max), min);
}

function interp(from, to, f, type) {
	if (Array.isArray(from) || Array.isArray(to)) {
		return interpArray(from, to, f, type);
	}
	var zero = type === "scale" ? 1.0 : 0.0;
	to = isDefinedAndNotNull(to) ? to : zero;
	from = isDefinedAndNotNull(from) ? from : zero;
	return to * f + from * (1 - f);
}

function interpArray(from, to, f, type) {
	// 	ASSERT_ENABLED && assert(Array.isArray(from) || from === null, "From is not an array or null");
	// 	ASSERT_ENABLED && assert( Array.isArray(to) || to === null, "To is not an array or null");
	// 	ASSERT_ENABLED && assert( from === null || to === null || from.length === to.length, "Arrays differ in length " + from + " : " + to);
	var length = from ? from.length : to.length;
	var result = [];
	for (var i = 0; i < length; i++) {
		result[i] = interp(from ? from[i] : null, to ? to[i] : null, f, type);
	}
	return result;
}

function isDefinedAndNotNull(val) {
	return isDefined(val) && val !== null;
}

function isDefined(val) {
	return typeof val !== "undefined";
}

function detectFeatures() {
	if (typeof document === "undefined") return {
		calcFunction: "calc",
		transformProperty: "transform"
	};
	var el = createDummyElement();
	el.style.cssText = "width: calc(0px);" + "width: -webkit-calc(0px);";
	var calcFunction = el.style.width.split("(")[0];
	var transformCandidates = ["transform", "webkitTransform", "msTransform"];
	var transformProperty = transformCandidates.filter(function (property) {
		return property in el.style;
	})[0];
	return {
		calcFunction: calcFunction,
		transformProperty: transformProperty
	};
}

function createDummyElement() {
	return document.documentElement.namespaceURI === SVG_NS ? document.createElementNS(SVG_NS, "g") : document.createElement("div");
}

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var features;

// This regular expression is intentionally permissive, so that
// platform-prefixed versions of calc will still be accepted as
// input. While we are restrictive with the transform property
// name, we need to be able to read underlying calc values from
// computedStyle so can"t easily restrict the input here.
var outerCalcRE = /^\s*(-webkit-)?calc\s*\(\s*([^)]*)\)/;
var valueRE = /^\s*(-?[0-9]+(\.[0-9])?[0-9]*)([a-zA-Z%]*)/;
var operatorRE = /^\s*([+-])/;
var autoRE = /^\s*auto/i;

var lengthType = {
	toString: function toString() {
		return "lengthType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	zero: function zero() {
		return { px: 0 };
	},
	add: function add(base, delta) {
		if (delta === null || delta === undefined) {
			delta = {}; // bug fix / hack. transformType does this too. So should the rest. If element is removed from dom, CompositedPropertyMap can"t applyAnimatedValues when additive. Lack of a transform also has this problem
		}
		if (base === null || base === undefined) {
			base = {}; // bug fix / hack. transformType does this too. So should the rest. If element is removed from dom, CompositedPropertyMap can"t applyAnimatedValues when additive. Lack of a transform also has this problem
		}
		var out = {};
		for (var value in base) {
			out[value] = base[value] + (delta[value] || 0);
		}
		for (var _value in delta) {
			if (_value in base) {
				continue;
			}
			out[_value] = delta[_value];
		}
		return out;
	},
	subtract: function subtract(base, delta) {
		var inverse = this.inverse(delta);
		var sum = this.add(base, inverse);
		return sum;
	},
	interpolate: function interpolate(from, to, f) {
		var out = {};
		for (var value in from) {
			out[value] = interp(from[value], to[value], f);
		}
		for (var _value2 in to) {
			if (_value2 in out) {
				continue;
			}
			out[_value2] = interp(0, to[_value2], f);
		}
		return out;
	},
	output: function output(value) {
		if (!features) features = detectFeatures(); // !!!
		var s = "";
		var singleValue = true;
		for (var item in value) {
			if (s === "") {
				s = value[item] + item;
			} else if (singleValue) {
				if (value[item] !== 0) {
					s = features.calcFunction + "(" + s + " + " + value[item] + item + ")";
					singleValue = false;
				}
			} else if (value[item] !== 0) {
				s = s.substring(0, s.length - 1) + " + " + value[item] + item + ")";
			}
		}
		return s;
	},
	input: function input(value) {
		var result = lengthType.consumeValueFromString(value);
		if (result) {
			return result.value;
		}
		return undefined;
	},
	consumeValueFromString: function consumeValueFromString(value) {
		if (!isDefinedAndNotNull(value)) {
			return undefined;
		}
		var autoMatch = autoRE.exec(value);
		if (autoMatch) {
			return {
				value: { auto: true },
				remaining: value.substring(autoMatch[0].length)
			};
		}
		var out = {};
		var calcMatch = outerCalcRE.exec(value);
		if (!calcMatch) {
			var singleValue = valueRE.exec(value);
			if (singleValue && singleValue.length === 4) {
				out[singleValue[3]] = Number(singleValue[1]);
				return {
					value: out,
					remaining: value.substring(singleValue[0].length)
				};
			}
			return undefined;
		}
		var remaining = value.substring(calcMatch[0].length);
		var calcInnards = calcMatch[2];
		var firstTime = true;
		while (true) {
			var reversed = false;
			if (firstTime) {
				firstTime = false;
			} else {
				var op = operatorRE.exec(calcInnards);
				if (!op) {
					return undefined;
				}
				if (op[1] === "-") {
					reversed = true;
				}
				calcInnards = calcInnards.substring(op[0].length);
			}
			value = valueRE.exec(calcInnards);
			if (!value) {
				return undefined;
			}
			var valueUnit = value[3];
			var valueNumber = Number(value[1]);
			if (!isDefinedAndNotNull(out[valueUnit])) {
				out[valueUnit] = 0;
			}
			if (reversed) {
				out[valueUnit] -= valueNumber;
			} else {
				out[valueUnit] += valueNumber;
			}
			calcInnards = calcInnards.substring(value[0].length);
			if (/\s*/.exec(calcInnards)[0].length === calcInnards.length) {
				return {
					value: out,
					remaining: remaining
				};
			}
		}
	},
	inverse: function inverse(value) {
		var out = {};
		for (var unit in value) {
			out[unit] = -value[unit];
		}
		return out;
	}
};

var lengthAutoType = typeWithKeywords(["auto"], lengthType);

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

//import { interp, createObject } from "./shared.js";
function NumberType() {} // Used privately by transformType only
NumberType.prototype = {
	//export const cssNumberType = {
	toString: function toString() {
		return "NumberType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(base) {
		if (base === "auto") {
			return nonNumericType.inverse(base);
		}
		var negative = base * -1;
		return negative;
	},
	zero: function zero() {
		return 0;
	},
	add: function add(base, delta) {
		if (Number(base) !== base && Number(delta) !== delta) return 0;else if (Number(base) !== base) base = 0;else if (Number(delta) !== delta) delta = 0;
		// If base or delta are "auto", we fall back to replacement.
		if (base === "auto" || delta === "auto") {
			return nonNumericType.add(base, delta);
		}
		var result = base + delta;
		return result;
	},
	subtract: function subtract(base, delta) {
		// KxDx
		//var inverse = this.inverse(delta);
		if (Number(base) !== base && Number(delta) !== delta) return 0;else if (Number(base) !== base) base = 0;else if (Number(delta) !== delta) delta = 0;
		return this.add(base, this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		// If from or to are "auto", we fall back to step interpolation.
		if (from === "auto" || to === "auto") {
			return nonNumericType.interpolate(from, to);
		}
		return interp(from, to, f);
	},
	//output: function(value) { return value + ""; }, // original
	output: function output(value) {
		return value;
	}, // no strings damn it. Unknown side effects. Because used by transformType ?
	input: function input(value) {
		if (value === "auto") {
			return "auto";
		}
		var result = Number(value);
		return isNaN(result) ? undefined : result;
	}
};
var numberType = new NumberType(); // Private, only used by transformType

function IntegerType() {}
IntegerType.prototype = Object.create(NumberType.prototype, {
	//export const cssIntegerType = createObject(cssNumberType, {
	toString: function toString() {
		return "IntergerType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	interpolate: function interpolate(from, to, f) {
		// If from or to are "auto", we fall back to step interpolation.
		if (from === "auto" || to === "auto") {
			return nonNumericType.interpolate(from, to);
		}
		return Math.floor(interp(from, to, f));
	}
});
var integerType = new IntegerType();

function OpacityType() {}
OpacityType.prototype = Object.create(NumberType, {
	//export const cssOpacityType = createObject(cssNumberType, {
	toString: function toString() {
		return "OpacityType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	zero: function zero() {
		return 0.0; // zero is definitely zero, I need to expose initialValue from propertyValueAliases
	},
	unspecified: function unspecified(value) {
		// This fixed fading in opacity but broke fading out, and I did not investigate further
		return 1.0;
		//return propertyValueAliases["opacity"].initial;
	}
});
var opacityType = new OpacityType();

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

// New experimental:
// import { parseNumber } from "../matrix/number-handler.js";
// import { parseAngle, parseLengthOrPercent, parseLength } from "../matrix/dimension-handler.js";


var convertToDeg = function convertToDeg(num, type) {
	switch (type) {
		case "grad":
			return num / 400 * 360;
		case "rad":
			return num / 2 / Math.PI * 360;
		case "turn":
			return num * 360;
		default:
			return num;
	}
};

var extractValue = function extractValue(values, pos, hasUnits) {
	var value = Number(values[pos]);
	if (!hasUnits) {
		return value;
	}
	var type = values[pos + 1];
	if (type === "") {
		type = "px";
	}
	var result = {};
	result[type] = value;
	return result;
};

var extractValues = function extractValues(values, numValues, hasOptionalValue, hasUnits) {
	var result = [];
	for (var i = 0; i < numValues; i++) {
		result.push(extractValue(values, 1 + 2 * i, hasUnits));
	}
	if (hasOptionalValue && values[1 + 2 * numValues]) {
		result.push(extractValue(values, 1 + 2 * numValues, hasUnits));
	}
	return result;
};

var SPACES = "\\s*";
var NUMBER = "[+-]?(?:\\d+|\\d*\\.\\d+)";
var RAW_OPEN_BRACKET = "\\(";
var RAW_CLOSE_BRACKET = "\\)";
var RAW_COMMA = ",";
var UNIT = "[a-zA-Z%]*";
var START = "^";

function capture(x) {
	return "(" + x + ")";
}
function optional(x) {
	return "(?:" + x + ")?";
}

var OPEN_BRACKET = [SPACES, RAW_OPEN_BRACKET, SPACES].join("");
var CLOSE_BRACKET = [SPACES, RAW_CLOSE_BRACKET, SPACES].join("");
var COMMA = [SPACES, RAW_COMMA, SPACES].join("");
var UNIT_NUMBER = [capture(NUMBER), capture(UNIT)].join("");

function transformRE(name, numParms, hasOptionalParm) {
	var tokenList = [START, SPACES, name, OPEN_BRACKET];
	for (var i = 0; i < numParms - 1; i++) {
		tokenList.push(UNIT_NUMBER);
		tokenList.push(COMMA);
	}
	tokenList.push(UNIT_NUMBER);
	if (hasOptionalParm) {
		tokenList.push(optional([COMMA, UNIT_NUMBER].join("")));
	}
	tokenList.push(CLOSE_BRACKET);
	return new RegExp(tokenList.join(""));
}

function buildMatcher(name, numValues, hasOptionalValue, hasUnits, baseValue) {
	var baseName = name;
	if (baseValue) {
		if (name[name.length - 1] === "X" || name[name.length - 1] === "Y") {
			baseName = name.substring(0, name.length - 1);
		} else if (name[name.length - 1] === "Z") {
			baseName = name.substring(0, name.length - 1) + "3d";
		}
	}

	var f = function f(x) {
		var r = extractValues(x, numValues, hasOptionalValue, hasUnits);
		if (baseValue !== undefined) {
			if (name[name.length - 1] === "X") {
				r.push(baseValue);
			} else if (name[name.length - 1] === "Y") {
				r = [baseValue].concat(r);
			} else if (name[name.length - 1] === "Z") {
				r = [baseValue, baseValue].concat(r);
			} else if (hasOptionalValue) {
				while (r.length < 2) {
					if (baseValue === "copy") {
						r.push(r[0]);
					} else {
						r.push(baseValue);
					}
				}
			}
		}
		return r;
	};
	return [transformRE(name, numValues, hasOptionalValue), f, baseName];
}

function buildRotationMatcher(name, numValues, hasOptionalValue, baseValue) {
	var m = buildMatcher(name, numValues, hasOptionalValue, true, baseValue);
	var f = function f(x) {
		var r = m[1](x);
		return r.map(function (v) {
			var result = 0;
			for (var type in v) {
				result += convertToDeg(v[type], type);
			}
			return result;
		});
	};
	return [m[0], f, m[2]];
}

function build3DRotationMatcher() {
	var m = buildMatcher("rotate3d", 4, false, true);
	var f = function f(x) {
		var r = m[1](x);
		var out = [];
		for (var i = 0; i < 3; i++) {
			out.push(r[i].px);
		}
		out.push(r[3]);
		return out;
	};
	return [m[0], f, m[2]];
}

var transformREs = [buildRotationMatcher("rotate", 1, false), buildRotationMatcher("rotateX", 1, false), buildRotationMatcher("rotateY", 1, false), buildRotationMatcher("rotateZ", 1, false), build3DRotationMatcher(), buildRotationMatcher("skew", 1, true, 0), buildRotationMatcher("skewX", 1, false), buildRotationMatcher("skewY", 1, false), buildMatcher("translateX", 1, false, true, { px: 0 }), buildMatcher("translateY", 1, false, true, { px: 0 }), buildMatcher("translateZ", 1, false, true, { px: 0 }), buildMatcher("translate", 1, true, true, { px: 0 }), buildMatcher("translate3d", 3, false, true), buildMatcher("scale", 1, true, false, "copy"), buildMatcher("scaleX", 1, false, false, 1), buildMatcher("scaleY", 1, false, false, 1), buildMatcher("scaleZ", 1, false, false, 1), buildMatcher("scale3d", 3, false, false), buildMatcher("perspective", 1, false, true), buildMatcher("matrix", 6, false, false)];

var decomposeMatrix = function () {
	// this is only ever used on the perspective matrix, which has 0, 0, 0, 1 as
	// last column

	function determinant(m) {
		return m[0][0] * m[1][1] * m[2][2] + m[1][0] * m[2][1] * m[0][2] + m[2][0] * m[0][1] * m[1][2] - m[0][2] * m[1][1] * m[2][0] - m[1][2] * m[2][1] * m[0][0] - m[2][2] * m[0][1] * m[1][0];
	}

	// this is only ever used on the perspective matrix, which has 0, 0, 0, 1 as
	// last column
	//
	// from Wikipedia:
	//
	// [A B]^-1 = [A^-1 + A^-1B(D - CA^-1B)^-1CA^-1		-A^-1B(D - CA^-1B)^-1]
	// [C D]			[-(D - CA^-1B)^-1CA^-1								(D - CA^-1B)^-1			]
	//
	// Therefore
	//
	// [A [0]]^-1 = [A^-1			[0]]
	// [C	1 ]			[ -CA^-1		1 ]
	function inverse(m) {
		var iDet = 1 / determinant(m);
		var a = m[0][0],
		    b = m[0][1],
		    c = m[0][2];
		var d = m[1][0],
		    e = m[1][1],
		    f = m[1][2];
		var g = m[2][0],
		    h = m[2][1],
		    k = m[2][2];
		var Ainv = [[(e * k - f * h) * iDet, (c * h - b * k) * iDet, (b * f - c * e) * iDet, 0], [(f * g - d * k) * iDet, (a * k - c * g) * iDet, (c * d - a * f) * iDet, 0], [(d * h - e * g) * iDet, (g * b - a * h) * iDet, (a * e - b * d) * iDet, 0]];
		var lastRow = [];
		for (var i = 0; i < 3; i++) {
			var val = 0;
			for (var j = 0; j < 3; j++) {
				val += m[3][j] * Ainv[j][i];
			}
			lastRow.push(val);
		}
		lastRow.push(1);
		Ainv.push(lastRow);
		return Ainv;
	}

	function transposeMatrix4(m) {
		return [[m[0][0], m[1][0], m[2][0], m[3][0]], [m[0][1], m[1][1], m[2][1], m[3][1]], [m[0][2], m[1][2], m[2][2], m[3][2]], [m[0][3], m[1][3], m[2][3], m[3][3]]];
	}

	function multVecMatrix(v, m) {
		var result = [];
		for (var i = 0; i < 4; i++) {
			var val = 0;
			for (var j = 0; j < 4; j++) {
				val += v[j] * m[j][i];
			}
			result.push(val);
		}
		return result;
	}

	function normalize(v) {
		var len = length(v);
		return [v[0] / len, v[1] / len, v[2] / len];
	}

	function length(v) {
		return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	}

	function combine(v1, v2, v1s, v2s) {
		return [v1s * v1[0] + v2s * v2[0], v1s * v1[1] + v2s * v2[1], v1s * v1[2] + v2s * v2[2]];
	}

	function cross(v1, v2) {
		return [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]];
	}

	function decomposeMatrix(matrix) {
		var m3d = [[matrix[0], matrix[1], 0, 0], [matrix[2], matrix[3], 0, 0], [0, 0, 1, 0], [matrix[4], matrix[5], 0, 1]];

		// skip normalization step as m3d[3][3] should always be 1
		if (m3d[3][3] !== 1) {
			throw "attempt to decompose non-normalized matrix";
		}

		var perspectiveMatrix = m3d.concat(); // copy m3d
		for (var i = 0; i < 3; i++) {
			perspectiveMatrix[i][3] = 0;
		}

		if (determinant(perspectiveMatrix) === 0) {
			return false;
		}

		var rhs = [];

		var perspective;
		if (m3d[0][3] !== 0 || m3d[1][3] !== 0 || m3d[2][3] !== 0) {
			rhs.push(m3d[0][3]);
			rhs.push(m3d[1][3]);
			rhs.push(m3d[2][3]);
			rhs.push(m3d[3][3]);

			var inversePerspectiveMatrix = inverse(perspectiveMatrix);
			var transposedInversePerspectiveMatrix = transposeMatrix4(inversePerspectiveMatrix);
			perspective = multVecMatrix(rhs, transposedInversePerspectiveMatrix);
		} else {
			perspective = [0, 0, 0, 1];
		}

		var translate = m3d[3].slice(0, 3);

		var row = [];
		row.push(m3d[0].slice(0, 3));
		var scale = [];
		scale.push(length(row[0]));
		row[0] = normalize(row[0]);

		var skew = [];
		row.push(m3d[1].slice(0, 3));
		skew.push(dot(row[0], row[1]));
		row[1] = combine(row[1], row[0], 1.0, -skew[0]);

		scale.push(length(row[1]));
		row[1] = normalize(row[1]);
		skew[0] /= scale[1];

		row.push(m3d[2].slice(0, 3));
		skew.push(dot(row[0], row[2]));
		row[2] = combine(row[2], row[0], 1.0, -skew[1]);
		skew.push(dot(row[1], row[2]));
		row[2] = combine(row[2], row[1], 1.0, -skew[2]);

		scale.push(length(row[2]));
		row[2] = normalize(row[2]);
		skew[1] /= scale[2];
		skew[2] /= scale[2];

		var pdum3 = cross(row[1], row[2]);
		if (dot(row[0], pdum3) < 0) {
			for (var _i = 0; _i < 3; _i++) {
				scale[_i] *= -1;
				row[_i][0] *= -1;
				row[_i][1] *= -1;
				row[_i][2] *= -1;
			}
		}

		var t = row[0][0] + row[1][1] + row[2][2] + 1;
		var s;
		var quaternion;

		if (t > 1e-4) {
			s = 0.5 / Math.sqrt(t);
			quaternion = [(row[2][1] - row[1][2]) * s, (row[0][2] - row[2][0]) * s, (row[1][0] - row[0][1]) * s, 0.25 / s];
		} else if (row[0][0] > row[1][1] && row[0][0] > row[2][2]) {
			s = Math.sqrt(1 + row[0][0] - row[1][1] - row[2][2]) * 2.0;
			quaternion = [0.25 * s, (row[0][1] + row[1][0]) / s, (row[0][2] + row[2][0]) / s, (row[2][1] - row[1][2]) / s];
		} else if (row[1][1] > row[2][2]) {
			s = Math.sqrt(1.0 + row[1][1] - row[0][0] - row[2][2]) * 2.0;
			quaternion = [(row[0][1] + row[1][0]) / s, 0.25 * s, (row[1][2] + row[2][1]) / s, (row[0][2] - row[2][0]) / s];
		} else {
			s = Math.sqrt(1.0 + row[2][2] - row[0][0] - row[1][1]) * 2.0;
			quaternion = [(row[0][2] + row[2][0]) / s, (row[1][2] + row[2][1]) / s, 0.25 * s, (row[1][0] - row[0][1]) / s];
		}

		return {
			translate: translate, scale: scale, skew: skew,
			quaternion: quaternion, perspective: perspective
		};
	}
	return decomposeMatrix;
}();

function dot(v1, v2) {
	var result = 0;
	for (var i = 0; i < v1.length; i++) {
		result += v1[i] * v2[i];
	}
	return result;
}

function multiplyMatrices(a, b) {
	return [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
}

function convertItemToMatrix(item) {
	switch (item.t) {// TODO: lots of types to implement:
		case "rotate":
			var amount = item.d * Math.PI / 180;
			return [Math.cos(amount), Math.sin(amount), -Math.sin(amount), Math.cos(amount), 0, 0];
		case "scale":
			return [item.d[0], 0, 0, item.d[1], 0, 0];
		// TODO: Work out what to do with non-px values.
		case "translate":
			return [1, 0, 0, 1, item.d[0].px, item.d[1].px];
		case "translate3d":
			return [1, 0, 0, 1, item.d[0].px, item.d[1].px]; // This needs a 3d matrix of course
		case "matrix":
			return item.d;
		default:
			throw new Error("HyperStyle convertItemToMatrix unimplemented type:%s;", item.t);
	}
}

function convertToMatrix(transformList) {
	return transformList.map(convertItemToMatrix).reduce(multiplyMatrices);
}

var composeMatrix = function () {
	function multiply(a, b) {
		var result = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				for (var k = 0; k < 4; k++) {
					result[i][j] += b[i][k] * a[k][j];
				}
			}
		}
		return result;
	}

	function composeMatrix(translate, scale, skew, quat, perspective) {
		var matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

		for (var i = 0; i < 4; i++) {
			matrix[i][3] = perspective[i];
		}

		for (var _i2 = 0; _i2 < 3; _i2++) {
			for (var j = 0; j < 3; j++) {
				matrix[3][_i2] += translate[j] * matrix[j][_i2];
			}
		}

		var x = quat[0],
		    y = quat[1],
		    z = quat[2],
		    w = quat[3];

		var rotMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

		rotMatrix[0][0] = 1 - 2 * (y * y + z * z);
		rotMatrix[0][1] = 2 * (x * y - z * w);
		rotMatrix[0][2] = 2 * (x * z + y * w);
		rotMatrix[1][0] = 2 * (x * y + z * w);
		rotMatrix[1][1] = 1 - 2 * (x * x + z * z);
		rotMatrix[1][2] = 2 * (y * z - x * w);
		rotMatrix[2][0] = 2 * (x * z - y * w);
		rotMatrix[2][1] = 2 * (y * z + x * w);
		rotMatrix[2][2] = 1 - 2 * (x * x + y * y);

		matrix = multiply(matrix, rotMatrix);

		var temp = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
		if (skew[2]) {
			temp[2][1] = skew[2];
			matrix = multiply(matrix, temp);
		}

		if (skew[1]) {
			temp[2][1] = 0;
			temp[2][0] = skew[0];
			matrix = multiply(matrix, temp);
		}

		for (var _i3 = 0; _i3 < 3; _i3++) {
			for (var _j = 0; _j < 3; _j++) {
				matrix[_i3][_j] *= scale[_i3];
			}
		}

		return { t: "matrix", d: [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[3][0], matrix[3][1]] };
	}
	return composeMatrix;
}();

function interpolateTransformsWithMatrices(from, to, f) {
	var fromM = decomposeMatrix(convertToMatrix(from));
	var toM = decomposeMatrix(convertToMatrix(to));

	var product = dot(fromM.quaternion, toM.quaternion);
	product = clamp(product, -1.0, 1.0);

	var quat = [];
	if (product === 1.0) {
		quat = fromM.quaternion;
	} else {
		var theta = Math.acos(product);
		var w = Math.sin(f * theta) * 1 / Math.sqrt(1 - product * product);
		for (var i = 0; i < 4; i++) {
			quat.push(fromM.quaternion[i] * (Math.cos(f * theta) - product * w) + toM.quaternion[i] * w);
		}
	}

	var translate = interp(fromM.translate, toM.translate, f);
	var scale = interp(fromM.scale, toM.scale, f);
	var skew = interp(fromM.skew, toM.skew, f);
	var perspective = interp(fromM.perspective, toM.perspective, f);

	return composeMatrix(translate, scale, skew, quat, perspective);
}

function interpTransformValue(from, to, f) {
	//console.log("interpTransformValue:%s; from:%s; to:%s;",f,JSON.stringify(from),JSON.stringify(to));
	var type = from.t ? from.t : to.t;
	switch (type) {
		// Transforms with unitless parameters.
		case "rotate":
		case "rotateX":
		case "rotateY":
		case "rotateZ":
		case "scale":
		case "scaleX":
		case "scaleY":
		case "scaleZ":
		case "scale3d":
		case "skew":
		case "skewX":
		case "skewY":
		case "matrix":
			return { t: type, d: interp(from.d, to.d, f, type) }; // are rotate and skew ok here? should be wrapped in an array. and rotate is not unitless...
		default:
			// Transforms with lengthType parameters.
			var result = [];
			var maxVal = 0;
			if (from.d && to.d) {
				maxVal = Math.max(from.d.length, to.d.length);
			} else if (from.d) {
				maxVal = from.d.length;
			} else if (to.d) {
				maxVal = to.d.length;
			}
			for (var j = 0; j < maxVal; j++) {
				var fromVal = from.d ? from.d[j] : {};
				var toVal = to.d ? to.d[j] : {};
				result.push(lengthType.interpolate(fromVal, toVal, f));
			}
			return { t: type, d: result };
	}
}

// The CSSWG decided to disallow scientific notation in CSS property strings
// (see http://lists.w3.org/Archives/Public/www-style/2010Feb/0050.html).
// We need this function to hakonitize all numbers before adding them to
// property strings.
// TODO: Apply this function to all property strings
function n(num) {
	return Number(num).toFixed(4);
}

var transformType = {
	toString: function toString() {
		return "transformType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(value) {
		// KxDx // TODO: SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// TODO: fix this :) matrix is way off // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		if (!value || !value.length) {
			// This happens often...
			//console.log("transformType inverse with no base!");
			value = this.zero();
		}
		var delta = this.zero(value);
		//console.log("inverse delta:%s;",JSON.stringify(delta));
		var out = [];
		for (var i = 0; i < value.length; i++) {
			switch (value[i].t) {
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					out.push({ t: value[i].t, d: [numberType.inverse(value[i].d[0])] }); // new style, have to unwrap then re-wrap
					break;
				case "skew":
					out.push({ t: value[i].t, d: [numberType.inverse(value[i].d[0]), numberType.inverse(value[i].d[1])] });
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
				case "perspective":
					out.push({ t: value[i].t, d: [numberType.inverse(value[i].d[0])] });
					break;
				case "translate":
					out.push({ t: value[i].t, d: [{ px: numberType.inverse(value[i].d[0].px) }, { px: numberType.inverse(value[i].d[1].px) }] });
					break;
				case "translate3d":
					out.push({ t: value[i].t, d: [{ px: numberType.inverse(value[i].d[0].px) }, { px: numberType.inverse(value[i].d[1].px) }, { px: numberType.inverse(value[i].d[2].px) }] });
					break;
				case "scale":
					out.push({ t: value[i].t, d: [delta[i].d[0] / value[i].d[0], delta[i].d[1] / value[i].d[1]] }); // inverse of 2 is 1/2
					break;
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					out.push({ t: value[i].t, d: [delta[i].d[0] / value[i].d[0]] }); // inverse of 2 is 1/2
					break;
				case "scale3d":
					out.push({ t: value[i].t, d: [delta[i].d[0] / value[i].d[0], delta[i].d[1] / value[i].d[1], -1 / value[i].d[2]] }); // inverse of 2 is 1/2
					break;
				case "matrix":
					out.push({ t: value[i].t, d: [numberType.inverse(value[i].d[0]), numberType.inverse(value[i].d[1]), numberType.inverse(value[i].d[2]), numberType.inverse(value[i].d[3]), numberType.inverse(value[i].d[4]), numberType.inverse(value[i].d[5])] });
					break;
			}
		}
		return out;
	},

	add: function add(base, delta) {
		//console.log("ADD base:%s;",JSON.stringify(base));
		//console.log("ADD delta:%s;",JSON.stringify(delta));
		if (!base || !base.length) return delta;
		if (!delta || !delta.length) return base;
		var baseLength = base.length;
		var deltaLength = delta.length;
		if (baseLength && deltaLength && baseLength >= deltaLength) {
			var diff = baseLength - deltaLength;
			var match = true;
			var j = 0;
			for (var i = diff; i < baseLength; i++) {
				if (base[i].t !== delta[j].t) {
					match = false;
					break;
				}
				j++;
			}
			if (match) return this.sum(base, delta);
		}
		return base.concat(delta);
	},

	sum: function sum(value, delta) {
		// add is for the full values, sum is for their components // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// TODO: fix this :) matrix is way off // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// 		console.log("SUM base:%s;",JSON.stringify(value));
		// 		console.log("SUM delta:%s;",JSON.stringify(delta));
		var out = [];
		var valueLength = value.length;
		var deltaLength = delta.length;
		var diff = valueLength - deltaLength;
		var j = 0;
		for (var i = 0; i < valueLength; i++) {
			if (i < diff) {
				out.push(value[i]);
			} else {
				switch (value[i].t) {
					// TODO: rotate3d(1, 2.0, 3.0, 10deg);
					case "rotate":
					case "rotateX":
					case "rotateY":
					case "rotateZ":
					case "skewX":
					case "skewY":
						out.push({ t: value[i].t, d: [numberType.add(value[i].d[0], delta[j].d[0])] }); // new style, have to unwrap then re-wrap
						break;
					case "skew":
						out.push({ t: value[i].t, d: [numberType.add(value[i].d[0], delta[j].d[0]), numberType.add(value[i].d[1], delta[j].d[1])] });
						break;
					case "translateX":
					case "translateY":
					case "translateZ":
					case "perspective":
						out.push({ t: value[i].t, d: [numberType.add(value[i].d[0], delta[j].d[0])] });
						break;
					case "translate":
						out.push({ t: value[i].t, d: [{ px: numberType.add(value[i].d[0].px, delta[j].d[0].px) }, { px: numberType.add(value[i].d[1].px, delta[j].d[1].px) }] });
						break;
					case "translate3d":
						out.push({ t: value[i].t, d: [{ px: numberType.add(value[i].d[0].px, delta[j].d[0].px) }, { px: numberType.add(value[i].d[1].px, delta[j].d[1].px) }, { px: numberType.add(value[i].d[2].px, delta[j].d[2].px) }] });
						break;
					case "scale":
						out.push({ t: value[i].t, d: [value[i].d[0] * delta[j].d[0], value[i].d[1] * delta[j].d[1]] });
						break;
					case "scaleX":
					case "scaleY":
					case "scaleZ":
						out.push({ t: value[i].t, d: [value[i].d[0] * delta[j].d[0]] });
						break;
					case "scale3d":
						out.push({ t: value[i].t, d: [value[i].d[0] * delta[j].d[0], value[i].d[1] * delta[j].d[1], value[i].d[2] * delta[j].d[2]] });
						break;
					case "matrix":
						out.push({ t: value[i].t, d: [numberType.add(value[i].d[0], delta[j].d[0]), numberType.add(value[i].d[1], delta[j].d[1]), numberType.add(value[i].d[2], delta[j].d[2]), numberType.add(value[i].d[3], delta[j].d[3]), numberType.add(value[i].d[4], delta[j].d[4]), numberType.add(value[i].d[5], delta[j].d[5])] });
						break;
					case "matrix3d":
						break;
					//console.warn("TransformType sum matrix3d not supported");
					default:
					//throw new Error("TransformType sum no type?"+JSON.stringify(value[i].t));
				}
				j++;
			}
		}
		return out;
	},

	zero: function zero(value) {
		// KxDx // requires an old value for type // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// TODO: fix this :) matrix is way off // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		//console.log("zero value:%s;",JSON.stringify(value));
		var identity2dMatrix = [1, 0, 0, 1, 0, 0];
		if (!value) return [{ t: "matrix", d: identity2dMatrix }];
		var out = [];
		for (var i = 0; i < value.length; i++) {
			switch (value[i].t) {
				// TODO: rotate3d(1, 2.0, 3.0, 10deg);
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					out.push({ t: value[i].t, d: [0] }); // new style
					break;
				case "skew":
					out.push({ t: value[i].t, d: [0, 0] });
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
				case "perspective":
					out.push({ t: value[i].t, d: [0] });
					break;
				case "translate":
					out.push({ t: value[i].t, d: [{ px: 0 }, { px: 0 }] });
					break;
				case "translate3d":
					out.push({ t: value[i].t, d: [{ px: 0 }, { px: 0 }, { px: 0 }] });
					break;
				case "scale":
					out.push({ t: value[i].t, d: [1, 1] });
					break;
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					out.push({ t: value[i].t, d: [1] });
					break;
				case "scale3d":
					out.push({ t: value[i].t, d: [1, 1, 1] });
					break;
				case "matrix":
					out.push({ t: value[i].t, d: identity2dMatrix });
					break;
			}
		}
		return out;
	},

	subtract: function subtract(base, delta) {
		var inverse = this.inverse(delta);
		var result = this.add(base, inverse);
		return result;
	},

	interpolate: function interpolate(from, to, f) {
		// ugly values
		// console.log("!!! transform interpolate:%s; from:%s; to:%s;",f,JSON.stringify(from),JSON.stringify(to));
		var out = [];
		var i;
		for (i = 0; i < Math.min(from.length, to.length); i++) {
			if (from[i].t !== to[i].t) {
				break;
			}
			out.push(interpTransformValue(from[i], to[i], f));
		}
		if (i < Math.min(from.length, to.length)) {
			out.push(interpolateTransformsWithMatrices(from.slice(i), to.slice(i), f));
			return out;
		}

		for (; i < from.length; i++) {
			out.push(interpTransformValue(from[i], { t: null, d: null }, f));
		}
		for (; i < to.length; i++) {
			out.push(interpTransformValue({ t: null, d: null }, to[i], f));
		}
		return out;
	},

	output: function output(value, svgMode) {
		// TODO: fix this :)

		// 		return value.map(function(args, i) {
		// 			console.log("%s args:%s;",i,JSON.stringify(args));
		// 			var stringifiedArgs = args.map(function(arg, j) {
		// 				console.log("%s arg:%s;",j,JSON.stringify(arg));
		// 				return types[i][1][j](arg);
		// 			}).join(',');
		// 			console.log("stringified:%s;",JSON.stringify(stringified));
		// 			if (types[i][0] == 'matrix' && stringifiedArgs.split(',').length == 16)
		// 				types[i][0] = 'matrix3d';
		// 			return types[i][0] + '(' + stringifiedArgs + ')';
		// 		}).join(' ');

		//if (typeof value === "string") throw new Error("this should not be a string");
		if (value === null || typeof value === "undefined") return "";
		if (typeof value === "string") return value;
		var out = "";
		var unit;
		for (var i = 0; i < value.length; i++) {
			switch (value[i].t) {
				// TODO: rotate3d(1, 2.0, 3.0, 10deg);
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					unit = svgMode ? "" : "deg";
					out += value[i].t + "(" + value[i].d[0] + unit + ") "; // modified. value[i].d is wrapped in an array, converting array to string worked previously but this is correct. If you don"t like it, fix input and change inverse, sum, and zero
					break;
				case "skew":
					unit = svgMode ? "" : "deg";
					out += value[i].t + "(" + value[i].d[0] + unit;
					if (value[i].d[1] === 0) {
						out += ") ";
					} else {
						out += ", " + value[i].d[1] + unit + ") ";
					}
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
				case "perspective":
					out += value[i].t + "(" + lengthType.output(value[i].d[0]) + ") ";
					break;
				case "translate":
					if (svgMode) {
						if (value[i].d[1] === undefined) {
							out += value[i].t + "(" + value[i].d[0].px + ") ";
						} else {
							out += value[i].t + "(" + value[i].d[0].px + ", " + value[i].d[1].px + ") ";
						}
						break;
					}
					if (value[i].d[1] === undefined) {
						out += value[i].t + "(" + lengthType.output(value[i].d[0]) + ") ";
					} else {
						out += value[i].t + "(" + lengthType.output(value[i].d[0]) + ", " + lengthType.output(value[i].d[1]) + ") ";
					}
					break;
				case "translate3d":
					var values = value[i].d.map(lengthType.output);
					out += value[i].t + "(" + values[0] + ", " + values[1] + ", " + values[2] + ") ";
					break;
				case "scale":
					if (value[i].d[0] === value[i].d[1]) {
						out += value[i].t + "(" + value[i].d[0] + ") ";
					} else {
						out += value[i].t + "(" + value[i].d[0] + ", " + value[i].d[1] + ") ";
					}
					break;
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					out += value[i].t + "(" + value[i].d[0] + ") ";
					break;
				case "scale3d":
					out += value[i].t + "(" + value[i].d[0] + ", " + value[i].d[1] + ", " + value[i].d[2] + ") ";
					break;
				case "matrix":
					out += value[i].t + "(" + n(value[i].d[0]) + ", " + n(value[i].d[1]) + ", " + n(value[i].d[2]) + ", " + n(value[i].d[3]) + ", " + n(value[i].d[4]) + ", " + n(value[i].d[5]) + ") ";
					break;
			}
		}
		var result = out.substring(0, out.length - 1);
		//console.log("tranform output result:%s;",JSON.stringify(result));
		return result;
	},

	input: function input(value) {

		// 		if (typeof value !== "string") return null;
		// 		return parseTransform(value) || [];

		var result = [];
		while (typeof value === "string" && value.length > 0) {
			var r;
			for (var i = 0; i < transformREs.length; i++) {
				var reSpec = transformREs[i];
				r = reSpec[0].exec(value);
				if (r) {
					result.push({ t: reSpec[2], d: reSpec[1](r) });
					value = value.substring(r[0].length);
					break;
				}
			}
			if (!isDefinedAndNotNull(r)) {
				return result;
			}
		}
		//console.log("input result:%s;",JSON.stringify(result));
		return result;
	}
};

// The following has been modified from original source:
// https://github.com/web-animations/web-animations-js/blob/dev/src/transform-handler.js


// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//	 You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	 See the License for the specific language governing permissions and
// limitations under the License.


// var _ = null;
// function cast(pattern) {
// 	return function(contents) {
// 		var i = 0;
// 		return pattern.map(function(x) { return x === _ ? contents[i++] : x; });
// 	};
// }

// function id(x) { return x; }

// var Opx = {px: 0};
// var Odeg = {deg: 0};

// // type: [argTypes, convertTo3D, convertTo2D]
// // In the argument types string, lowercase characters represent optional arguments
// var transformFunctions = {
// 	matrix: ["NNNNNN", [_, _, 0, 0, _, _, 0, 0, 0, 0, 1, 0, _, _, 0, 1], id],
// 	matrix3d: ["NNNNNNNNNNNNNNNN", id],
// 	rotate: ["A"],
// 	rotatex: ["A"],
// 	rotatey: ["A"],
// 	rotatez: ["A"],
// 	rotate3d: ["NNNA"],
// 	perspective: ["L"],
// 	scale: ["Nn", cast([_, _, 1]), id],
// 	scalex: ["N", cast([_, 1, 1]), cast([_, 1])],
// 	scaley: ["N", cast([1, _, 1]), cast([1, _])],
// 	scalez: ["N", cast([1, 1, _])],
// 	scale3d: ["NNN", id],
// 	skew: ["Aa", null, id],
// 	skewx: ["A", null, cast([_, Odeg])],
// 	skewy: ["A", null, cast([Odeg, _])],
// 	translate: ["Tt", cast([_, _, Opx]), id],
// 	translatex: ["T", cast([_, Opx, Opx]), cast([_, Opx])],
// 	translatey: ["T", cast([Opx, _, Opx]), cast([Opx, _])],
// 	translatez: ["L", cast([Opx, Opx, _])],
// 	translate3d: ["TTL", id]
// };

// function parseTransform(string) {
// 	string = string.toLowerCase().trim();
// 	if (string == "none")
// 		return [];
// 	// FIXME: Using a RegExp means calcs won"t work here
// 	var transformRegExp = /\s*(\w+)\(([^)]*)\)/g;
// 	var result = [];
// 	var match;
// 	var prevLastIndex = 0;
// 	while ((match = transformRegExp.exec(string))) {
// 		if (match.index != prevLastIndex)
// 			return;
// 		prevLastIndex = match.index + match[0].length;
// 		var functionName = match[1];
// 		var functionData = transformFunctions[functionName];
// 		if (!functionData)
// 			return;
// 		var args = match[2].split(",");
// 		var argTypes = functionData[0];
// 		if (argTypes.length < args.length)
// 			return;

// 		var parsedArgs = [];
// 		for (var i = 0; i < argTypes.length; i++) {
// 			var arg = args[i];
// 			var type = argTypes[i];
// 			var parsedArg;
// 			if (!arg)
// 				parsedArg = ({a: Odeg,
// 											n: parsedArgs[0],
// 											t: Opx})[type];
// 			else
// 				parsedArg = ({A: function(s) { return s.trim() == "0" ? Odeg : parseAngle(s); },
// 											N: parseNumber,
// 											T: parseLengthOrPercent,
// 											L: parseLength})[type.toUpperCase()](arg);
// 			if (parsedArg === undefined)
// 				return;
// 			parsedArgs.push(parsedArg);
// 		}
// 		result.push({t: functionName, d: parsedArgs});
// 		//if (transformRegExp.lastIndex == string.length) console.log("PARSE:%s; RESULT:%s;",string,JSON.stringify(result));
// 		if (transformRegExp.lastIndex == string.length)
// 			return result;
// 	}
// };

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var colorRE = new RegExp("(hsla?|rgba?)\\(" + "([\\-0-9]+%?),?\\s*" + "([\\-0-9]+%?),?\\s*" + "([\\-0-9]+%?)(?:,?\\s*([\\-0-9\\.]+%?))?" + "\\)");
var colorHashRE = new RegExp("#([0-9A-Fa-f][0-9A-Fa-f]?)" + "([0-9A-Fa-f][0-9A-Fa-f]?)" + "([0-9A-Fa-f][0-9A-Fa-f]?)");

function hsl2rgb(h, s, l) {
	// Cribbed from http://dev.w3.org/csswg/css-color/#hsl-color
	// Wrap to 0->360 degrees (IE -10 === 350) then normalize
	h = (h % 360 + 360) % 360 / 360;
	s = s / 100;
	l = l / 100;
	function hue2rgb(m1, m2, h) {
		if (h < 0) {
			h += 1;
		}
		if (h > 1) {
			h -= 1;
		}
		if (h * 6 < 1) {
			return m1 + (m2 - m1) * h * 6;
		}
		if (h * 2 < 1) {
			return m2;
		}
		if (h * 3 < 2) {
			return m1 + (m2 - m1) * (2 / 3 - h) * 6;
		}
		return m1;
	}
	var m2;
	if (l <= 0.5) {
		m2 = l * (s + 1);
	} else {
		m2 = l + s - l * s;
	}

	var m1 = l * 2 - m2;
	var r = Math.ceil(hue2rgb(m1, m2, h + 1 / 3) * 255);
	var g = Math.ceil(hue2rgb(m1, m2, h) * 255);
	var b = Math.ceil(hue2rgb(m1, m2, h - 1 / 3) * 255);
	return [r, g, b];
}

var namedColors = {
	aliceblue: [240, 248, 255, 1],
	antiquewhite: [250, 235, 215, 1],
	aqua: [0, 255, 255, 1],
	aquamarine: [127, 255, 212, 1],
	azure: [240, 255, 255, 1],
	beige: [245, 245, 220, 1],
	bisque: [255, 228, 196, 1],
	black: [0, 0, 0, 1],
	blanchedalmond: [255, 235, 205, 1],
	blue: [0, 0, 255, 1],
	blueviolet: [138, 43, 226, 1],
	brown: [165, 42, 42, 1],
	burlywood: [222, 184, 135, 1],
	cadetblue: [95, 158, 160, 1],
	chartreuse: [127, 255, 0, 1],
	chocolate: [210, 105, 30, 1],
	coral: [255, 127, 80, 1],
	cornflowerblue: [100, 149, 237, 1],
	cornsilk: [255, 248, 220, 1],
	crimson: [220, 20, 60, 1],
	cyan: [0, 255, 255, 1],
	darkblue: [0, 0, 139, 1],
	darkcyan: [0, 139, 139, 1],
	darkgoldenrod: [184, 134, 11, 1],
	darkgray: [169, 169, 169, 1],
	darkgreen: [0, 100, 0, 1],
	darkgrey: [169, 169, 169, 1],
	darkkhaki: [189, 183, 107, 1],
	darkmagenta: [139, 0, 139, 1],
	darkolivegreen: [85, 107, 47, 1],
	darkorange: [255, 140, 0, 1],
	darkorchid: [153, 50, 204, 1],
	darkred: [139, 0, 0, 1],
	darksalmon: [233, 150, 122, 1],
	darkseagreen: [143, 188, 143, 1],
	darkslateblue: [72, 61, 139, 1],
	darkslategray: [47, 79, 79, 1],
	darkslategrey: [47, 79, 79, 1],
	darkturquoise: [0, 206, 209, 1],
	darkviolet: [148, 0, 211, 1],
	deeppink: [255, 20, 147, 1],
	deepskyblue: [0, 191, 255, 1],
	dimgray: [105, 105, 105, 1],
	dimgrey: [105, 105, 105, 1],
	dodgerblue: [30, 144, 255, 1],
	firebrick: [178, 34, 34, 1],
	floralwhite: [255, 250, 240, 1],
	forestgreen: [34, 139, 34, 1],
	fuchsia: [255, 0, 255, 1],
	gainsboro: [220, 220, 220, 1],
	ghostwhite: [248, 248, 255, 1],
	gold: [255, 215, 0, 1],
	goldenrod: [218, 165, 32, 1],
	gray: [128, 128, 128, 1],
	green: [0, 128, 0, 1],
	greenyellow: [173, 255, 47, 1],
	grey: [128, 128, 128, 1],
	honeydew: [240, 255, 240, 1],
	hotpink: [255, 105, 180, 1],
	indianred: [205, 92, 92, 1],
	indigo: [75, 0, 130, 1],
	ivory: [255, 255, 240, 1],
	khaki: [240, 230, 140, 1],
	lavender: [230, 230, 250, 1],
	lavenderblush: [255, 240, 245, 1],
	lawngreen: [124, 252, 0, 1],
	lemonchiffon: [255, 250, 205, 1],
	lightblue: [173, 216, 230, 1],
	lightcoral: [240, 128, 128, 1],
	lightcyan: [224, 255, 255, 1],
	lightgoldenrodyellow: [250, 250, 210, 1],
	lightgray: [211, 211, 211, 1],
	lightgreen: [144, 238, 144, 1],
	lightgrey: [211, 211, 211, 1],
	lightpink: [255, 182, 193, 1],
	lightsalmon: [255, 160, 122, 1],
	lightseagreen: [32, 178, 170, 1],
	lightskyblue: [135, 206, 250, 1],
	lightslategray: [119, 136, 153, 1],
	lightslategrey: [119, 136, 153, 1],
	lightsteelblue: [176, 196, 222, 1],
	lightyellow: [255, 255, 224, 1],
	lime: [0, 255, 0, 1],
	limegreen: [50, 205, 50, 1],
	linen: [250, 240, 230, 1],
	magenta: [255, 0, 255, 1],
	maroon: [128, 0, 0, 1],
	mediumaquamarine: [102, 205, 170, 1],
	mediumblue: [0, 0, 205, 1],
	mediumorchid: [186, 85, 211, 1],
	mediumpurple: [147, 112, 219, 1],
	mediumseagreen: [60, 179, 113, 1],
	mediumslateblue: [123, 104, 238, 1],
	mediumspringgreen: [0, 250, 154, 1],
	mediumturquoise: [72, 209, 204, 1],
	mediumvioletred: [199, 21, 133, 1],
	midnightblue: [25, 25, 112, 1],
	mintcream: [245, 255, 250, 1],
	mistyrose: [255, 228, 225, 1],
	moccasin: [255, 228, 181, 1],
	navajowhite: [255, 222, 173, 1],
	navy: [0, 0, 128, 1],
	oldlace: [253, 245, 230, 1],
	olive: [128, 128, 0, 1],
	olivedrab: [107, 142, 35, 1],
	orange: [255, 165, 0, 1],
	orangered: [255, 69, 0, 1],
	orchid: [218, 112, 214, 1],
	palegoldenrod: [238, 232, 170, 1],
	palegreen: [152, 251, 152, 1],
	paleturquoise: [175, 238, 238, 1],
	palevioletred: [219, 112, 147, 1],
	papayawhip: [255, 239, 213, 1],
	peachpuff: [255, 218, 185, 1],
	peru: [205, 133, 63, 1],
	pink: [255, 192, 203, 1],
	plum: [221, 160, 221, 1],
	powderblue: [176, 224, 230, 1],
	purple: [128, 0, 128, 1],
	red: [255, 0, 0, 1],
	rosybrown: [188, 143, 143, 1],
	royalblue: [65, 105, 225, 1],
	saddlebrown: [139, 69, 19, 1],
	salmon: [250, 128, 114, 1],
	sandybrown: [244, 164, 96, 1],
	seagreen: [46, 139, 87, 1],
	seashell: [255, 245, 238, 1],
	sienna: [160, 82, 45, 1],
	silver: [192, 192, 192, 1],
	skyblue: [135, 206, 235, 1],
	slateblue: [106, 90, 205, 1],
	slategray: [112, 128, 144, 1],
	slategrey: [112, 128, 144, 1],
	snow: [255, 250, 250, 1],
	springgreen: [0, 255, 127, 1],
	steelblue: [70, 130, 180, 1],
	tan: [210, 180, 140, 1],
	teal: [0, 128, 128, 1],
	thistle: [216, 191, 216, 1],
	tomato: [255, 99, 71, 1],
	transparent: [0, 0, 0, 0],
	turquoise: [64, 224, 208, 1],
	violet: [238, 130, 238, 1],
	wheat: [245, 222, 179, 1],
	white: [255, 255, 255, 1],
	whitesmoke: [245, 245, 245, 1],
	yellow: [255, 255, 0, 1],
	yellowgreen: [154, 205, 50, 1]
};

var colorType = typeWithKeywords(["currentColor"], {
	toString: function toString() {
		return "ColorType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(value) {
		// KxDx
		return this.subtract(value, [255, 255, 255, 1]);
	},
	zero: function zero() {
		return [0, 0, 0, 0];
	},
	_premultiply: function _premultiply(value) {
		var alpha = value[3];
		return [value[0] * alpha, value[1] * alpha, value[2] * alpha];
	},
	add: function add(base, delta) {
		var alpha = Math.min(base[3] + delta[3], 1);
		if (alpha === 0) {
			return [0, 0, 0, 0];
		}
		base = this._premultiply(base);
		delta = this._premultiply(delta);
		return [(base[0] + delta[0]) / alpha, (base[1] + delta[1]) / alpha, (base[2] + delta[2]) / alpha, alpha];
	},
	subtract: function subtract(base, delta) {
		var alpha = Math.min(base[3] + delta[3], 1);
		if (alpha === 0) {
			return [0, 0, 0, 0];
		}
		base = this._premultiply(base);
		delta = this._premultiply(delta);
		return [(base[0] - delta[0]) / alpha, (base[1] - delta[1]) / alpha, (base[2] - delta[2]) / alpha, alpha];
	},
	interpolate: function interpolate(from, to, f) {
		var alpha = clamp(interp(from[3], to[3], f), 0, 1);
		if (alpha === 0) {
			return [0, 0, 0, 0];
		}
		from = this._premultiply(from);
		to = this._premultiply(to);
		return [interp(from[0], to[0], f) / alpha, interp(from[1], to[1], f) / alpha, interp(from[2], to[2], f) / alpha, alpha];
	},
	output: function output(value) {
		return "rgba(" + Math.round(value[0]) + ", " + Math.round(value[1]) + ", " + Math.round(value[2]) + ", " + value[3] + ")";
	},
	input: function input(value) {
		// http://dev.w3.org/csswg/css-color/#color
		var out = [];

		var regexHashResult = colorHashRE.exec(value);
		if (regexHashResult) {
			if (value.length !== 4 && value.length !== 7) {
				return undefined;
			}
			regexHashResult.shift();
			for (var i = 0; i < 3; i++) {
				if (regexHashResult[i].length === 1) {
					regexHashResult[i] = regexHashResult[i] + regexHashResult[i];
				}
				var v = Math.max(Math.min(parseInt(regexHashResult[i], 16), 255), 0);
				out[i] = v;
			}
			out.push(1.0);
		}

		var regexResult = colorRE.exec(value);
		if (regexResult) {
			regexResult.shift();
			var type = regexResult.shift().substr(0, 3);
			for (var _i = 0; _i < 3; _i++) {
				var m = 1;
				if (regexResult[_i][regexResult[_i].length - 1] === "%") {
					regexResult[_i] = regexResult[_i].substr(0, regexResult[_i].length - 1);
					m = 255.0 / 100.0;
				}
				if (type === "rgb") {
					out[_i] = clamp(Math.round(parseInt(regexResult[_i], 10) * m), 0, 255);
				} else {
					out[_i] = parseInt(regexResult[_i], 10);
				}
			}

			// Convert hsl values to rgb value
			if (type === "hsl") {
				out = hsl2rgb.apply(null, out);
			}

			if (typeof regexResult[3] !== "undefined") {
				out[3] = Math.max(Math.min(parseFloat(regexResult[3]), 1.0), 0.0);
			} else {
				out.push(1.0);
			}
		}

		if (out.some(isNaN)) {
			return undefined;
		}
		if (out.length > 0) {
			return out;
		}
		return namedColors[value];
	}
});

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var positionKeywordRE = /^\s*left|^\s*center|^\s*right|^\s*top|^\s*bottom/i;

var positionType = {
	toString: function toString() {
		return "positionType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(base) {
		// KxDx
		return [lengthType.inverse(base[0]), lengthType.add(base[1])];
	},
	zero: function zero() {
		return [{ px: 0 }, { px: 0 }];
	},
	add: function add(base, delta) {
		return [lengthType.add(base[0], delta[0]), lengthType.add(base[1], delta[1])];
	},
	subtract: function subtract(base, delta) {
		// KxDx
		return this.add(base, this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		return [lengthType.interpolate(from[0], to[0], f), lengthType.interpolate(from[1], to[1], f)];
	},
	output: function output(value) {
		return value.map(lengthType.output).join(" ");
	},
	input: function input(value) {
		var tokens = [];
		var remaining = value;
		while (true) {
			var result = positionType.consumeTokenFromString(remaining);
			if (!result) {
				return undefined;
			}
			tokens.push(result.value);
			remaining = result.remaining;
			if (!result.remaining.trim()) {
				break;
			}
			if (tokens.length >= 4) {
				return undefined;
			}
		}

		if (tokens.length === 1) {
			var token = tokens[0];
			return (positionType.isHorizontalToken(token) ? [token, "center"] : ["center", token]).map(positionType.resolveToken);
		}

		if (tokens.length === 2 && positionType.isHorizontalToken(tokens[0]) && positionType.isVerticalToken(tokens[1])) {
			return tokens.map(positionType.resolveToken);
		}

		if (tokens.filter(positionType.isKeyword).length !== 2) {
			return undefined;
		}

		var out = [undefined, undefined];
		var center = false;
		for (var i = 0; i < tokens.length; i++) {
			var _token = tokens[i];
			if (!positionType.isKeyword(_token)) {
				return undefined;
			}
			if (_token === "center") {
				if (center) {
					return undefined;
				}
				center = true;
				continue;
			}
			var axis = Number(positionType.isVerticalToken(_token));
			if (out[axis]) {
				return undefined;
			}
			if (i === tokens.length - 1 || positionType.isKeyword(tokens[i + 1])) {
				out[axis] = positionType.resolveToken(_token);
				continue;
			}
			var percentLength = tokens[++i];
			if (_token === "bottom" || _token === "right") {
				percentLength = lengthType.inverse(percentLength);
				percentLength["%"] = (percentLength["%"] || 0) + 100;
			}
			out[axis] = percentLength;
		}
		if (center) {
			if (!out[0]) {
				out[0] = positionType.resolveToken("center");
			} else if (!out[1]) {
				out[1] = positionType.resolveToken("center");
			} else {
				return undefined;
			}
		}
		return out.every(isDefinedAndNotNull) ? out : undefined;
	},
	consumeTokenFromString: function consumeTokenFromString(value) {
		var keywordMatch = positionKeywordRE.exec(value);
		if (keywordMatch) {
			return {
				value: keywordMatch[0].trim().toLowerCase(),
				remaining: value.substring(keywordMatch[0].length)
			};
		}
		return lengthType.consumeValueFromString(value);
	},
	resolveToken: function resolveToken(token) {
		if (typeof token === "string") {
			return lengthType.input({
				left: "0%",
				center: "50%",
				right: "100%",
				top: "0%",
				bottom: "100%"
			}[token]);
		}
		return token;
	},
	isHorizontalToken: function isHorizontalToken(token) {
		if (typeof token === "string") {
			return token in { left: true, center: true, right: true };
		}
		return true;
	},
	isVerticalToken: function isVerticalToken(token) {
		if (typeof token === "string") {
			return token in { top: true, center: true, bottom: true };
		}
		return true;
	},
	isKeyword: function isKeyword(token) {
		return typeof token === "string";
	}
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

// Spec: http://dev.w3.org/csswg/css-backgrounds/#background-position
var positionListType = {
	toString: function toString() {
		return "positionListType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(base) {
		// KxDx
		var out = [];
		var maxLength = base.length;
		for (var i = 0; i < maxLength; i++) {
			var basePosition = base[i] ? base[i] : positionType.zero();
			out.push(positionType.inverse(basePosition));
		}
		return out;
	},
	zero: function zero() {
		return [positionType.zero()];
	},
	add: function add(base, delta) {
		var out = [];
		var maxLength = Math.max(base.length, delta.length);
		for (var i = 0; i < maxLength; i++) {
			var basePosition = base[i] ? base[i] : positionType.zero();
			var deltaPosition = delta[i] ? delta[i] : positionType.zero();
			out.push(positionType.add(basePosition, deltaPosition));
		}
		return out;
	},
	subtract: function subtract(base, delta) {
		// KxDx
		return this.add(base, this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		var out = [];
		var maxLength = Math.max(from.length, to.length);
		for (var i = 0; i < maxLength; i++) {
			var fromPosition = from[i] ? from[i] : positionType.zero();
			var toPosition = to[i] ? to[i] : positionType.zero();
			out.push(positionType.interpolate(fromPosition, toPosition, f));
		}
		return out;
	},
	output: function output(value) {
		return value.map(positionType.output).join(", ");
	},
	input: function input(value) {
		if (!isDefinedAndNotNull(value)) {
			return undefined;
		}
		if (!value.trim()) {
			return [positionType.input("0% 0%")];
		}
		var positionValues = value.split(",");
		var out = positionValues.map(positionType.input);
		return out.every(isDefinedAndNotNull) ? out : undefined;
	}
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var rectangleRE = /rect\(([^,]+),([^,]+),([^,]+),([^)]+)\)/;

var rectangleType = {

	toString: function toString() {
		return "rectangleType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(value) {
		// KxDx
		return {
			top: lengthType.inverse(value.top),
			right: lengthType.inverse(value.right),
			bottom: lengthType.inverse(value.bottom),
			left: lengthType.inverse(value.left)
		};
	},
	zero: function zero() {
		return { top: 0, right: 0, bottom: 0, left: 0 };
	}, // KxDx
	add: function add(base, delta) {
		return {
			top: lengthType.add(base.top, delta.top),
			right: lengthType.add(base.right, delta.right),
			bottom: lengthType.add(base.bottom, delta.bottom),
			left: lengthType.add(base.left, delta.left)
		};
	},
	subtract: function subtract(base, delta) {
		// KxDx
		return this.add(base, this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		return {
			top: lengthType.interpolate(from.top, to.top, f),
			right: lengthType.interpolate(from.right, to.right, f),
			bottom: lengthType.interpolate(from.bottom, to.bottom, f),
			left: lengthType.interpolate(from.left, to.left, f)
		};
	},
	output: function output(value) {
		return "rect(" + lengthType.output(value.top) + "," + lengthType.output(value.right) + "," + lengthType.output(value.bottom) + "," + lengthType.output(value.left) + ")";
	},
	input: function input(value) {
		var match = rectangleRE.exec(value);
		if (!match) {
			return undefined;
		}
		var out = {
			top: lengthType.input(match[1]),
			right: lengthType.input(match[2]),
			bottom: lengthType.input(match[3]),
			left: lengthType.input(match[4])
		};
		if (out.top && out.right && out.bottom && out.left) {
			return out;
		}
		return undefined;
	}
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var shadowType = {
	toString: function toString() {
		return "shadowType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(value) {
		return nonNumericType.inverse(value);
	},
	zero: function zero() {
		return {
			hOffset: lengthType.zero(),
			vOffset: lengthType.zero()
		};
	},
	_addSingle: function _addSingle(base, delta) {
		if (base && delta && base.inset !== delta.inset) {
			return delta;
		}
		var result = {
			inset: base ? base.inset : delta.inset,
			hOffset: lengthType.add(base ? base.hOffset : lengthType.zero(), delta ? delta.hOffset : lengthType.zero()),
			vOffset: lengthType.add(base ? base.vOffset : lengthType.zero(), delta ? delta.vOffset : lengthType.zero()),
			blur: lengthType.add(base && base.blur || lengthType.zero(), delta && delta.blur || lengthType.zero())
		};
		if (base && base.spread || delta && delta.spread) {
			result.spread = lengthType.add(base && base.spread || lengthType.zero(), delta && delta.spread || lengthType.zero());
		}
		if (base && base.color || delta && delta.color) {
			result.color = colorType.add(base && base.color || colorType.zero(), delta && delta.color || colorType.zero());
		}
		return result;
	},
	add: function add(base, delta) {
		var result = [];
		for (var i = 0; i < base.length || i < delta.length; i++) {
			result.push(this._addSingle(base[i], delta[i]));
		}
		return result;
	},
	subtract: function subtract(base, delta) {
		// KxDx
		return this.add(base, this.inverse(delta));
	},
	_interpolateSingle: function _interpolateSingle(from, to, f) {
		if (from && to && from.inset !== to.inset) {
			return f < 0.5 ? from : to;
		}
		var result = {
			inset: from ? from.inset : to.inset,
			hOffset: lengthType.interpolate(from ? from.hOffset : lengthType.zero(), to ? to.hOffset : lengthType.zero(), f),
			vOffset: lengthType.interpolate(from ? from.vOffset : lengthType.zero(), to ? to.vOffset : lengthType.zero(), f),
			blur: lengthType.interpolate(from && from.blur || lengthType.zero(), to && to.blur || lengthType.zero(), f)
		};
		if (from && from.spread || to && to.spread) {
			result.spread = lengthType.interpolate(from && from.spread || lengthType.zero(), to && to.spread || lengthType.zero(), f);
		}
		if (from && from.color || to && to.color) {
			result.color = colorType.interpolate(from && from.color || colorType.zero(), to && to.color || colorType.zero(), f);
		}
		return result;
	},
	interpolate: function interpolate(from, to, f) {
		var result = [];
		for (var i = 0; i < from.length || i < to.length; i++) {
			result.push(this._interpolateSingle(from[i], to[i], f));
		}
		return result;
	},
	_outputSingle: function _outputSingle(value) {
		return (value.inset ? "inset " : "") + lengthType.output(value.hOffset) + " " + lengthType.output(value.vOffset) + " " + lengthType.output(value.blur) + (value.spread ? " " + lengthType.output(value.spread) : "") + (value.color ? " " + colorType.output(value.color) : "");
	},
	output: function output(value) {
		return value.map(this._outputSingle).join(", ");
	},
	input: function input(value) {
		var shadowRE = /(([^(,]+(\([^)]*\))?)+)/g;
		var match;
		var shadows = [];
		while ((match = shadowRE.exec(value)) !== null) {
			shadows.push(match[0]);
		}

		var result = shadows.map(function (value) {
			if (value === "none") {
				return shadowType.zero();
			}
			value = value.replace(/^\s+|\s+$/g, "");

			var partsRE = /([^ (]+(\([^)]*\))?)/g;
			var parts = [];
			while ((match = partsRE.exec(value)) !== null) {
				parts.push(match[0]);
			}

			if (parts.length < 2 || parts.length > 7) {
				return undefined;
			}
			var result = {
				inset: false
			};

			var lengths = [];
			while (parts.length) {
				var part = parts.shift();

				var length = lengthType.input(part);
				if (length) {
					lengths.push(length);
					continue;
				}

				var color = colorType.input(part);
				if (color) {
					result.color = color;
				}

				if (part === "inset") {
					result.inset = true;
				}
			}

			if (lengths.length < 2 || lengths.length > 4) {
				return undefined;
			}
			result.hOffset = lengths[0];
			result.vOffset = lengths[1];
			if (lengths.length > 2) {
				result.blur = lengths[2];
			}
			if (lengths.length > 3) {
				result.spread = lengths[3];
			}
			return result;
		});

		return result.every(isDefined) ? result : undefined;
	}
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var fontWeightType = {
	toString: function toString() {
		return "fontWeightType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(value) {
		// KxDx
		return value * -1;
	},
	add: function add(base, delta) {
		return base + delta;
	},
	subtract: function subtract(base, delta) {
		// KxDx
		return this.add(base, this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		return interp(from, to, f);
	},
	output: function output(value) {
		value = Math.round(value / 100) * 100;
		value = clamp(value, 100, 900);
		if (value === 400) {
			return "normal";
		}
		if (value === 700) {
			return "bold";
		}
		return String(value);
	},
	input: function input(value) {
		// TODO: support lighter / darker ?
		var out = Number(value);
		if (isNaN(out) || out < 100 || out > 900 || out % 100 !== 0) {
			return undefined;
		}
		return out;
	}
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var visibilityType = createObject(nonNumericType, {
	toString: function toString() {
		return "visibilityType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	zero: function zero() {
		return "hidden"; // Sure, why not.
	},
	unspecified: function unspecified() {
		return "visible";
	},
	add: function add(a, b) {
		if (a !== "visible" && b !== "visible") {
			return nonNumericType.add(a, b);
		}
		return "visible";
	},
	subtract: function subtract(a, b) {
		if (b === "visible" && a === "visible") return "hidden";
		return a;
	},
	interpolate: function interpolate(from, to, f) {
		if (from !== "visible" && to !== "visible") {
			return nonNumericType.interpolate(from, to, f);
		}
		if (f <= 0) {
			return from;
		}
		if (f >= 1) {
			return to;
		}
		return "visible";
	},
	input: function input(value) {
		if (["visible", "hidden", "collapse"].indexOf(value) !== -1) {
			return value;
		}
		return undefined;
	}
});

export { transformType, colorType, nonNumericType, integerType, opacityType, lengthType, lengthAutoType, positionType, positionListType, rectangleType, shadowType, fontWeightType, visibilityType, beginTransaction, commitTransaction, currentTransaction, flushTransaction, disableAnimation, decorate, activate, HyperNumber, HyperScale, HyperArray, HyperSet, HyperPoint, HyperSize, HyperRect, hyperNotFound, hyperMakeRect, hyperZeroRect, hyperEqualRects, hyperMakePoint, hyperZeroPoint, hyperEqualPoints, hyperMakeSize, hyperZeroSize, hyperEqualSizes, hyperMakeRange, hyperZeroRange, hyperNullRange, hyperIndexInRange, hyperEqualRanges, hyperIntersectionRange };
