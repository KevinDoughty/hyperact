(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Hyperact"] = factory();
	else
		root["Hyperact"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.disableAnimation = disableAnimation;
exports.decorate = decorate;

var _context = __webpack_require__(3);

var _context2 = _interopRequireDefault(_context);

var _actions = __webpack_require__(2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DELEGATE_MASSAGE_INPUT_OUTPUT = true; // allow delegate the ability to convert values to and from private internal representation ("ugly" values)
var DELEGATE_DOUBLE_WHAMMY = true; // allow delegate the ability to convert key, to mangle for makeshift key paths.
var ENSURE_ONE_MORE_TICK = true; // true is needed to display one more time after all animations have ended. // false is needed to removeAllAnimations after unmount

var hyperContext = new _context2.default();

function isFunction(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

function prepAnimationObjectFromAddAnimation(animation, delegate) {
	if (animation instanceof _actions.HyperGroup) {
		// recursive
		var childAnimations = animation.group;
		if (childAnimations) {
			if (!Array.isArray(childAnimations)) throw new Error("childAnimations is not an array");
			childAnimations.forEach(function (childAnimation) {
				prepAnimationObjectFromAddAnimation(childAnimation, delegate);
			});
		}
	} else if (animation instanceof _actions.HyperAnimation) {
		var type = delegate.typeOfProperty.call(delegate, animation.property, animation.to);
		if (type) animation.type = type;
	} else throw new Error("not an animation");
}

function presentationTransform(sourceLayer, sourceAnimations, time, shouldSortAnimations, presentationBacking) {
	// COMPOSITING
	var presentationLayer = Object.assign({}, sourceLayer); // Need to make sure display has non animated properties for example this.element
	if (!sourceAnimations || !sourceAnimations.length) {
		return presentationLayer;
	}
	if (shouldSortAnimations) {
		// no argument means it will sort // animation index. No connection to setType animation sorting
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
	if (!progressChanged && sourceAnimations.length) {
		if (presentationBacking) return presentationBacking; // presentationBacking is not an optimization per se. It is so step timing functions return the same object.
	}
	return presentationLayer;
}

function disableAnimation(value) {
	hyperContext.disableAnimation(value);
}

function decorate(controller, delegate, layerInstance) {
	if (!controller) throw new Error("Nothing to hyperactivate.");
	if (controller.registerAnimatableProperty || controller.addAnimation) throw new Error("Already hyperactive"); // TODO: be more thorough
	if (!delegate) delegate = controller;
	if (!layerInstance) layerInstance = delegate;
	var allAnimations = [];
	var allNames = [];
	var namedAnimations = {};
	var defaultAnimations = {};
	var shouldSortAnimations = false;
	var animationNumber = 0; // order added
	var modelBacking = {};
	var previousBacking = {}; // modelBacking and previousBacking merge like react and there is no way to delete.
	var presentationBacking = null; // This is nulled out to invalidate.
	var registeredProperties = [];
	var activeBacking = modelBacking;

	controller.registerAnimatableProperty = function (property, defaultAnimation) {
		// Workaround for lack of Proxy // Needed to trigger implicit animation. // FIXME: defaultValue is broken. TODO: Proper default animations dictionary.
		var initial = false;
		if (registeredProperties.indexOf(property) === -1) initial = true;
		if (initial) registeredProperties.push(property);
		var descriptor = Object.getOwnPropertyDescriptor(layerInstance, property);
		defaultAnimation = (0, _actions.animationFromDescription)(defaultAnimation);
		if (DELEGATE_MASSAGE_INPUT_OUTPUT) convertPropertiesAsPropertyOfObjectWithFunction(["from", "to", "delta"], defaultAnimation, delegate.input);
		if (defaultAnimation) defaultAnimations[property] = defaultAnimation; // maybe set to defaultValue not defaultAnimation
		else if (defaultAnimations[property] === null) delete defaultAnimations[property]; // property is still animatable
		if (!descriptor || descriptor.configurable === true) {
			var modelValue = layerInstance[property];
			if (DELEGATE_MASSAGE_INPUT_OUTPUT) modelValue = convertedValueOfPropertyWithFunction(modelValue, property, delegate.input);
			modelBacking[property] = modelValue; // need to populate but can't use setValueForKey. No mount animations here, this function registers
			if (initial) Object.defineProperty(layerInstance, property, { // ACCESSORS
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
		if (property === "animations") throw new Error("I don't think so");
	};

	Object.defineProperty(controller, "layer", {
		get: function get() {
			return layerInstance;
		},
		set: function set(layer) {
			if (layer) Object.keys(layer).forEach(function (key) {
				controller.registerAnimatableProperty(key);
				setValueForKey(layer[key], key);
			}); // else maybe unregister every property
		},
		enumerable: false, //true,
		configurable: false
	});

	var implicitAnimation = function implicitAnimation(property, value, previous) {
		// TODO: Ensure modelLayer is fully populated before calls to animationForKey so you can use other props conditionally to determine animation
		var description;
		if (isFunction(delegate.animationForKey)) description = delegate.animationForKey.call(delegate, property, value, previous); // TODO: rename action or implicit
		var animation = (0, _actions.animationFromDescription)(description);
		if (!animation) animation = (0, _actions.animationFromDescription)(defaultAnimations[property]);
		if (animation) {
			// TODO: These are not correct if animation is a group !!!
			// Not part of animationFromDescription because of accessing controller and modelBacking
			if (animation.property === null || typeof animation.property === "undefined") animation.property = property;
			if (animation.from === null || typeof animation.from === "undefined") {
				if (animation.blend === "absolute") animation.from = controller.presentation[property]; // use presentation layer
				else animation.from = modelBacking[property];
			}
			if (animation.to === null || typeof animation.to === "undefined") animation.to = value;
		}
		return animation;
	};

	var valueForKey = function valueForKey(property) {
		if (DELEGATE_DOUBLE_WHAMMY) property = convertedKey(property, delegate.keyOutput);
		var value = activeBacking[property];
		if (DELEGATE_MASSAGE_INPUT_OUTPUT) value = convertedValueOfPropertyWithFunction(value, property, delegate.output);
		return value;
	};

	var setValueForKey = function setValueForKey(value, property) {
		if (DELEGATE_DOUBLE_WHAMMY) property = convertedKey(property, delegate.keyInput);
		if (DELEGATE_MASSAGE_INPUT_OUTPUT) value = convertedValueOfPropertyWithFunction(value, property, delegate.input);
		if (value === modelBacking[property]) return; // New in Hyper! No animation if no change. This filters out repeat setting of unchanging model values while animating. Function props are always not equal (if you're not careful)
		//var previous = valueForKey(property);
		var previous = modelBacking[property];
		previousBacking[property] = previous;
		var animation;
		var transaction = hyperContext.currentTransaction(); // Careful! This transaction might not get closed.
		if (!transaction.disableAnimation) {
			// TODO: Does React setState batching mean disabling implicit state animation is impossible?
			animation = implicitAnimation(property, value, previous);
			if (animation) controller.addAnimation(animation); // this will copy a second time.
		}
		modelBacking[property] = value;
		presentationBacking = null;
		activeBacking = modelBacking;
		if (!animation) controller.needsDisplay();
	};

	var convertedKey = function convertedKey(property, funky) {
		// DELEGATE_DOUBLE_WHAMMY // from addAnimation
		if (isFunction(funky)) return funky(property);
		return property;
	};
	var convertedValueOfPropertyWithFunction = function convertedValueOfPropertyWithFunction(value, property, funky) {
		// DELEGATE_MASSAGE_INPUT_OUTPUT // mutates // from register, modelLayer, and previousBacking
		if (isFunction(funky)) return funky(property, value);
		return value;
	};
	var convertPropertyOfObjectWithFunction = function convertPropertyOfObjectWithFunction(property, object, funky) {
		// DELEGATE_MASSAGE_INPUT_OUTPUT // mutates
		if (object && isFunction(funky)) {
			var value = object[property];
			if (value !== null && typeof value !== "undefined") object[property] = funky(property, value);
			if (property === null || typeof property === "undefined") throw new Error("convert property undefined");
		}
	};
	var convertPropertiesOfObjectWithFunction = function convertPropertiesOfObjectWithFunction(properties, object, funky) {
		// DELEGATE_MASSAGE_INPUT_OUTPUT // mutates
		properties.forEach(function (property) {
			if (property === null || typeof property === "undefined") throw new Error("convert properties undefined");
			convertPropertyOfObjectWithFunction(property, object, funky);
		});
	};
	var convertPropertiesAsPropertyOfObjectWithFunction = function convertPropertiesAsPropertyOfObjectWithFunction(properties, object, funky) {
		// DELEGATE_MASSAGE_INPUT_OUTPUT // mutates // animation from, to, and delta
		// ["from","to","delta"],animation,delegate.input
		if (object && isFunction(funky)) {
			var property = object.property;
			properties.forEach(function (item) {
				var value = object[item];
				if (value !== null && typeof value !== "undefined") object[item] = funky(property, value);
			});
		}
	};

	Object.defineProperty(controller, "animationCount", { // Performs better than asking for animations.length, especially when ticking.
		get: function get() {
			return allAnimations.length;
		},
		enumerable: false, //true,
		configurable: false
	});

	Object.defineProperty(controller, "animations", { // TODO: cache this like presentationLayer
		get: function get() {
			var array = allAnimations.map(function (animation) {
				var copy = animation.copy.call(animation); // TODO: optimize me. Lots of copying. Potential optimization. Instead maybe freeze properties.
				if (DELEGATE_MASSAGE_INPUT_OUTPUT) convertPropertiesAsPropertyOfObjectWithFunction(["from", "to", "delta"], copy, delegate.output);
				return copy;
			});
			return array;
		},
		enumerable: false, //true,
		configurable: false
	});

	Object.defineProperty(controller, "animationNames", {
		get: function get() {
			return Object.keys(namedAnimations);
		},
		enumerable: false, //true,
		configurable: false
	});

	Object.defineProperty(controller, "model", { // TODO: setLayer or just plain layer
		get: function get() {
			var layer = {};
			registeredProperties.forEach(function (key) {
				var value = modelBacking[key];
				if (DELEGATE_MASSAGE_INPUT_OUTPUT) value = convertedValueOfPropertyWithFunction(value, key, delegate.output);
				Object.defineProperty(layer, key, { // modelInstance has defined properties. Must redefine.
					value: value,
					enumerable: true,
					configurable: false
				});
			});
			Object.freeze(layer);
			return layer;
		},
		enumerable: false, //true,
		configurable: false
	});

	Object.defineProperty(controller, "previous", {
		get: function get() {
			var layer = Object.assign({}, modelBacking);
			Object.keys(previousBacking).forEach(function (key) {
				var value = previousBacking[key];
				if (DELEGATE_MASSAGE_INPUT_OUTPUT) value = convertedValueOfPropertyWithFunction(value, key, delegate.output);
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
		enumerable: false, //true,
		configurable: false
	});

	var animationCleanup = function animationCleanup() {
		var i = allAnimations.length;
		while (i--) {
			var animation = allAnimations[i];
			if (animation.finished) {
				allAnimations.splice(i, 1);
				var name = allNames[i];
				allNames.splice(i, 1);
				delete namedAnimations[name];
				if (isFunction(animation.onend)) animation.onend.call(animation, true);
			}
		}
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(controller);
			}
		}
		if (!allAnimations.length) {
			// Ensure one last time
			presentationBacking = modelBacking;
		}
	};

	Object.defineProperty(controller, "presentation", {
		get: function get() {
			var time = 0; // Temporary workaround. Not sure if still needed. It should be safe to create transactions.
			if (allAnimations.length) {
				// Do not create a transaction if there are no animations else the transaction will not be automatically closed.
				var transaction = hyperContext.currentTransaction();
				time = transaction.time;
			}
			var baseLayer = {};
			if (controller !== layerInstance && delegate !== layerInstance) baseLayer = Object.assign({}, layerInstance);
			var sourceLayer = Object.assign(baseLayer, modelBacking);
			var presentationLayer = presentationTransform(sourceLayer, allAnimations, time, shouldSortAnimations, presentationBacking); //,finishedAnimations); // not modelBacking for first argument (need non animated properties), but it requires that properties like "presentationLayer" are not enumerable
			if (DELEGATE_MASSAGE_INPUT_OUTPUT && presentationLayer !== presentationBacking) convertPropertiesOfObjectWithFunction(Object.keys(presentationLayer), presentationLayer, delegate.output);
			presentationBacking = presentationLayer;
			activeBacking = presentationLayer;
			shouldSortAnimations = false;
			return presentationLayer;
		},
		enumerable: false, //true,
		configurable: false
	});

	controller.needsDisplay = function () {
		// This should be used instead of directly calling display
		var display = function display() {};
		if (isFunction(delegate.display)) display = delegate.display.bind(delegate);
		hyperContext.registerTarget(controller, display, animationCleanup);
	};

	controller.addAnimation = function (description, name) {
		// should be able to pass a description if type is registered
		var animation = (0, _actions.animationFromDescription)(description);
		if (!(animation instanceof _actions.HyperAnimation) && !(animation instanceof _actions.HyperGroup)) throw new Error("Animations must be a Hyper.Animation or Group subclass.", JSON.stringify(animation));
		if (DELEGATE_MASSAGE_INPUT_OUTPUT) {
			convertPropertiesAsPropertyOfObjectWithFunction(["from", "to", "delta"], animation, delegate.input);
			if (isFunction(delegate.typeOfProperty)) {
				// TODO: handle groups
				prepAnimationObjectFromAddAnimation(animation, delegate);
			}
		}
		var display = function display() {};
		if (isFunction(delegate.display)) display = delegate.display.bind(delegate);
		if (!allAnimations.length) hyperContext.registerTarget(controller, display, animationCleanup);
		var copy = animation.copy.call(animation);
		allAnimations.push(copy);
		if (name !== null && typeof name !== "undefined") {
			var previous = namedAnimations[name];
			if (previous) removeAnimationInstance(previous); // after pushing to allAnimations, so context doesn't stop ticking
			namedAnimations[name] = copy;
		}
		if (typeof name === "undefined" || name === null || name === false) allNames.push(null);else allNames.push(name);
		shouldSortAnimations = true;

		if (copy instanceof _actions.HyperGroup) {
			copy.sortIndex = animationNumber++; // Does group get sortIndex?
			copy.startTime = hyperContext.currentTransaction().time; // Does group get startTime?
			copy.group.forEach(function (item) {
				item.sortIndex = animationNumber++; // Should this be overridden like this?
				item.startTime = hyperContext.currentTransaction().time;
			});
		} else if (copy instanceof _actions.HyperAnimation) {
			copy.sortIndex = animationNumber++; // Should this be overridden like this?
			copy.startTime = hyperContext.currentTransaction().time;
		}
		copy.runAnimation(controller, name);
	};

	var removeAnimationInstance = function removeAnimationInstance(animation) {
		var index = allAnimations.indexOf(animation);
		if (index > -1) {
			allAnimations.splice(index, 1);
			var name = allNames[index];
			allNames.splice(index, 1);
			delete namedAnimations[name];
		}
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(controller);
			}
		}
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
			var copy = animation.copy.call(animation);
			if (DELEGATE_MASSAGE_INPUT_OUTPUT) convertPropertiesAsPropertyOfObjectWithFunction(["from", "to", "delta"], copy, delegate.output);
			return copy;
		}
		return null;
	};
}

/***/ },
/* 1 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.HyperNumber = HyperNumber;
exports.HyperScale = HyperScale;
exports.HyperArray = HyperArray;
exports.HyperSet = HyperSet;
exports.HyperPoint = HyperPoint;
exports.HyperSize = HyperSize;
exports.HyperRect = HyperRect;
exports.HyperRange = HyperRange;
exports.HyperMakeRect = HyperMakeRect;
exports.HyperZeroRect = HyperZeroRect;
exports.HyperEqualRects = HyperEqualRects;
exports.HyperMakePoint = HyperMakePoint;
exports.HyperZeroPoint = HyperZeroPoint;
exports.HyperEqualPoints = HyperEqualPoints;
exports.HyperMakeSize = HyperMakeSize;
exports.HyperZeroSize = HyperZeroSize;
exports.HyperEqualSizes = HyperEqualSizes;
exports.HyperMakeRange = HyperMakeRange;
exports.HyperZeroRange = HyperZeroRange;
exports.HyperNullRange = HyperNullRange;
exports.HyperIndexInRange = HyperIndexInRange;
exports.HyperEqualRanges = HyperEqualRanges;
exports.HyperIntersectionRange = HyperIntersectionRange;
// export function HyperValue(settings) { // The former base type class
// 	if (this instanceof HyperValue === false) {
// 		throw new Error("HyperValue is a constructor, not a function. Do not call it directly.");
// 	}
// 	if (this.constructor === HyperValue) {
// 		throw new Error("HyperValue is an abstract base class.");
// 	}
// }
// HyperValue.prototype = {
// 	constructor: HyperValue,
// 	zero: function() {
// 		throw new Error("HyperValue subclasses must implement function: zero()");
// 	},
// 	add: function() {
// 		throw new Error("HyperValue subclasses must implement function: add(a,b)");
// 	},
// 	subtract: function() {
// 		throw new Error("HyperValue subclasses must implement function: subtract(a,b) in the form subtract b from a");
// 	},
// 	interpolate: function(a,b,progress) { // new, meant to be overridden, otherwise you get discrete.
// 		//throw new Error("HyperValue subclasses must implement function: interpolate(a,b,progress)");
// 		if (progress >= 1) return b;
// 		return a;
// 	}
// };

function isFunction(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

function HyperNumber(settings) {}
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
	}
};

function HyperScale(settings) {}
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
	}
};

function HyperArray(type, length, settings) {
	this.type = type;
	if (isFunction(type)) this.type = new type(settings);
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
	}
};

function HyperSet(settings) {
	if (isFunction(settings)) this.sort = settings;else if (settings && isFunction(settings.sort)) this.sort = settings.sort;
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
		if (isFunction(this.sort)) while (i < aLength || j < bLength) {
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
					array.push(A);
					i++;
					j++;
				} else if (sort < 0) {
					array.push(A);
					i++;
				} else if (sort > 0) {
					array.push(B);
					j++;
				}
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
		if (isFunction(this.sort)) while (i < aLength || j < bLength) {
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
					i++;
					j++;
				} else if (sort < 0) {
					array.push(A);
					i++;
				} else if (sort > 0) {
					j++;
				}
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
	}
};

function HyperPoint(settings) {}
HyperPoint.prototype = {
	constructor: HyperPoint,
	zero: function zero() {
		return HyperZeroPoint();
	},
	add: function add(a, b) {
		return HyperMakePoint(a.x + b.x, a.y + b.y);
	},
	subtract: function subtract(a, b) {
		// subtract b from a
		return HyperMakePoint(a.x - b.x, a.y - b.y);
	},
	interpolate: function interpolate(a, b, progress) {
		return HyperMakePoint(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress);
	}
};

function HyperSize(settings) {}
HyperSize.prototype = {
	constructor: HyperSize,
	zero: function zero() {
		return HyperZeroSize();
	},
	add: function add(a, b) {
		return HyperMakeSize(a.width + b.width, a.height + b.height);
	},
	subtract: function subtract(a, b) {
		// subtract b from a
		return HyperMakeSize(a.width - b.width, a.height - b.height);
	},
	interpolate: function interpolate(a, b, progress) {
		return HyperMakeSize(a.width + (b.width - a.width) * progress, a.height + (b.height - a.height) * progress);
	}
};

function HyperRect(settings) {}
HyperRect.prototype = {
	constructor: HyperRect,
	zero: function zero() {
		return HyperZeroRect();
	},
	add: function add(a, b) {
		return {
			origin: HyperPoint.prototype.add(a.origin, b.origin),
			size: HyperSize.prototype.add(a.size, b.size)
		};
	},
	subtract: function subtract(a, b) {
		// subtract b from a
		return {
			origin: HyperPoint.prototype.subtract(a.origin, b.origin),
			size: HyperSize.prototype.subtract(a.size, b.size)
		};
	},
	interpolate: function interpolate(a, b, progress) {
		return {
			origin: HyperPoint.prototype.interpolate(a.origin, b.origin, progress),
			size: HyperSize.prototype.interpolate(a.size, b.size, progress)
		};
	}
};

function HyperRange(settings) {
	// TODO: negative values? // This should union the whole range, not add the individual values. NSUnionRange, not NSIntersectionRange, which is a range containing the indices that exist in both ranges.
	throw new Error("HyperRange not supported");
}
HyperRange.prototype = {
	constructor: HyperRange,
	zero: function zero() {
		return HyperNullRange();
	},
	add: function add(a, b) {
		// union?
		if (a.location === HyperNotFound && b.location === HyperNotFound) return HyperNullRange();
		if (a.length === 0 && b.length === 0) return HyperNullRange();
		if (a.location === HyperNotFound || a.length === 0) return b;
		if (b.location === HyperNotFound || b.length === 0) return a;
		var finalLocation = Math.min(a.location, b.location);
		var finalEnd = Math.max(a.location + a.length, b.location + b.length);
		var result = HyperMakeRange(finalLocation, finalEnd - finalLocation);
		return result;
	},
	subtract: function subtract(a, b) {
		// Subtraction is completely different.
		var result = a;
		if (a.location === HyperNotFound && b.location === HyperNotFound) result = HyperNullRange();else if (a.length === 0 && b.length === 0) result = HyperNullRange();else if (a.location === HyperNotFound || a.length === 0) result = HyperNullRange();else if (b.location === HyperNotFound || b.length === 0) result = a;else if (b.location <= a.location && b.location + b.length >= a.location + a.length) result = HyperNullRange();else if (b.location <= a.location && b.location + b.length > a.location && b.location + b.length < a.location + a.length) result = HyperMakeRange(b.location + b.length, a.location + a.length - (b.location + b.length));else if (b.location > a.location && b.location < a.location + a.length && b.location + b.length >= a.location + a.length) result = HyperMakeRange(a.location, b.location + b.length - a.location);
		return result;
	},
	interpolate: function interpolate(a, b, progress) {
		if (progress >= 1) return b;
		return a;
	},
	intersection: function intersection(a, b) {
		// 0,1 and 1,1 do not intersect
		if (a.location === HyperNotFound || b.location === HyperNotFound || a.length === 0 || b.length === 0) return HyperNullRange();
		if (a.location + a.length <= b.location || b.location + b.length <= a.location) return HyperNullRange(); // TODO: Consider location should be NSNotFound (INT_MAX) not zero.
		var finalLocation = Math.max(a.location, b.location);
		var finalEnd = Math.min(a.location + a.length, b.location + b.length);
		return HyperMakeRange(finalLocation, finalEnd - finalLocation);
	}
};

var HyperNotFound = exports.HyperNotFound = Number.MAX_VALUE;
// struct convenience constructors:
function HyperMakeRect(x, y, width, height) {
	return {
		origin: HyperMakePoint(x, y),
		size: HyperMakeSize(width, height)
	};
}
function HyperZeroRect() {
	return HyperMakeRect(0, 0, 0, 0);
}
function HyperEqualRects(a, b) {
	return HyperEqualPoints(a.origin, b.origin) && HyperEqualSizes(a.size, b.size);
}

function HyperMakePoint(x, y) {
	return {
		x: x,
		y: y
	};
}
function HyperZeroPoint() {
	return HyperMakePoint(0, 0);
}
function HyperEqualPoints(a, b) {
	return a.x === b.x && a.y === b.y;
}

function HyperMakeSize(width, height) {
	return {
		width: width,
		height: height
	};
}
function HyperZeroSize() {
	return HyperMakeSize(0, 0);
}
function HyperEqualSizes(a, b) {
	return a.width === b.width && a.height && b.height;
}

function HyperMakeRange(location, length) {
	return {
		location: location,
		length: length
	};
}
function HyperZeroRange() {
	return HyperMakeRange(0, 0);
}
function HyperNullRange() {
	return HyperMakeRange(HyperNotFound, 0);
}
function HyperIndexInRange(index, range) {
	return index > range.location && index < range.location + range.length;
}
function HyperEqualRanges(a, b) {
	return a.location === b.location && a.length === b.length;
}
function HyperIntersectionRange(a, b) {
	if (a.location + a.length <= b.location || b.location + b.length <= a.location) return HyperNullRange();
	var location = Math.max(a.location, b.location);
	var end = Math.min(a.location + a.length, b.location + b.length);
	return { location: location, length: end - location };
}

/***/ },
/* 2 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.animationFromDescription = animationFromDescription;
exports.HyperGroup = HyperGroup;
exports.HyperAnimation = HyperAnimation;
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

function isFunction(w) {
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

function prepAnimationObjectFromDescription(animation) {
	// animation can be a group, to allow for recursive groups
	if (animation instanceof HyperGroup) {
		// recursive
		var childAnimations = animation.group;
		if (childAnimations !== null && typeof childAnimations !== "undefined") {
			if (!Array.isArray(childAnimations)) throw new Error("childAnimations is not an array");
			childAnimations.forEach(function (childAnimation) {
				prepAnimationObjectFromDescription(childAnimation);
			});
		}
	} else if (animation instanceof HyperAnimation) {
		// prep
		if (isFunction(animation.type)) animation.type = new animation.type();
		if (!animation.duration) animation.duration = 0.0; // TODO: need better validation. Currently split across constructor, setter, and here
		if (animation.speed === null || typeof animation.speed === "undefined") animation.speed = 1; // need better validation
		if (animation.iterations === null || typeof animation.iterations === "undefined") animation.iterations = 1; // negative values have no effect
	} else throw new Error("not an animation object");
}

function animationFromDescription(description) {
	var animation;
	if (!description) return description;else if (description instanceof HyperGroup || description instanceof HyperAnimation) {
		animation = description.copy.call(description);
	} else if (Array.isArray(description)) {
		animation = new HyperGroup(description);
	} else if (isObject(description)) {
		animation = new HyperAnimation(description);
	} else if (isNumber(description)) animation = new HyperAnimation({ duration: description });else throw new Error("is this an animation:" + JSON.stringify(description));
	prepAnimationObjectFromDescription(animation);
	return animation;
}

function HyperAction() {}

function HyperGroup(children) {
	HyperAction.call(this);
	this.finished = 0;
	var groupDuration = 0;
	this.group = children.map(function (animation) {
		var copy = animationFromDescription(animation);
		var copyDuration = copy.delay + copy.duration * copy.iterations / copy.speed;
		groupDuration = Math.max(copyDuration, groupDuration);
		return copy;
	});
	Object.defineProperty(this, "finished", {
		get: function get() {
			this.group.forEach(function (animation) {
				if (!animation.finished) return 0;
			});
			return 1;
		},
		enumerable: false, //true,
		configurable: false
	});
}

HyperGroup.prototype = {
	constructor: HyperGroup,
	copy: function copy() {
		var constructor = this.constructor;
		var copy = new constructor(this.group);
		return copy;
	},
	runAnimation: function runAnimation(layer, key) {
		this.group.forEach(function (animation) {
			animation.runAnimation.call(animation, layer, key);
		}.bind(this));
	},
	composite: function composite(onto, now) {
		this.group.forEach(function (animation) {
			animation.composite.call(animation, onto, now);
		});
	}
};

function HyperAnimation(settings) {
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
	this.finished = 0; //false;
	this.startTime; // float // Should this be private?
	this.progress = 0; //null; // 0 would mean first frame does not count as a change which I want for stepEnd but probably not anything else. Also complicating is separate cachedPresentationlayer and context displayLayers
	this.onend; // NOT FINISHED. callback function, fires regardless of fillMode. Should rename. Should also implement didStart, maybe didTick, etc.
	//this.delegate; // Maybe I should use this instead of onend
	//this.naming; // "default","exact","increment","nil" // why not a key property?
	this.remove = true;

	if (settings) Object.keys(settings).forEach(function (key) {
		this[key] = settings[key];
	}.bind(this));
}

HyperAnimation.prototype = {
	constructor: HyperAnimation,
	copy: function copy() {
		// TODO: "Not Optimized. Reference to a variable that requires dynamic lookup" !!! // https://github.com/GoogleChrome/devtools-docs/issues/53
		var constructor = this.constructor;
		var copy = new constructor(this.settings);
		var keys = Object.getOwnPropertyNames(this);
		var length = keys.length;
		for (var i = 0; i < length; i++) {
			Object.defineProperty(copy, keys[i], Object.getOwnPropertyDescriptor(this, keys[i]));
		}
		return copy;
	},
	composite: function composite(onto, now) {
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
			if (this.finished > 1) throw new Error("animation not removed");
			this.finished++; // = true;
		}
		var inReverse = 0; // falsy
		if (!this.finished) {
			if (this.autoreverse === true) inReverse = Math.floor(iterationProgress) % 2;
			iterationProgress = iterationProgress % 1; // modulus for iterations
		}
		if (inReverse) iterationProgress = 1 - iterationProgress; // easing is also reversed
		if (isFunction(this.easing)) iterationProgress = this.easing(iterationProgress);else if (this.easing === "step-start") iterationProgress = Math.ceil(iterationProgress);else if (this.easing === "step-middle") iterationProgress = Math.round(iterationProgress);else if (this.easing === "step-end") iterationProgress = Math.floor(iterationProgress);else {
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
		var value = this.blend === "absolute" ? this.type.interpolate(this.from, this.to, iterationProgress) : this.type.interpolate(this.delta, this.type.zero(this.to), iterationProgress); // sending argument to zero() for css transforms
		var property = this.property;
		if (typeof property !== "undefined" && property !== null) {
			// allow animating without declaring property
			var result = value;
			var underlying = onto[property];
			if (typeof underlying === "undefined" || underlying === null) {
				underlying = this.type.zero(this.to); // ORIGINAL // TODO: assess this // FIXME: transform functions? Underlying will never be undefined as it is a registered property, added to modelLayer. Unless you can animate properties that have not been registered, which is what I want
			}
			if (this.additive) result = this.type.add(underlying, value);
			if (this.sort && Array.isArray(result)) result.sort(this.sort);
			onto[property] = result;
		}
		var changed = iterationProgress !== this.progress;
		this.progress = iterationProgress;

		return changed;
	},
	runAnimation: function runAnimation(layer, key) {
		if (this.type && isFunction(this.type.zero) && isFunction(this.type.add) && isFunction(this.type.subtract) && isFunction(this.type.interpolate)) {
			if (!this.from) this.from = this.type.zero(this.to);
			if (!this.to) this.to = this.type.zero(this.from);
			if (this.blend !== "absolute") {
				this.delta = this.type.subtract(this.from, this.to);
			}
			if (this.startTime === null || this.startTime === undefined) throw new Error("no start time");
		} else throw new Error("Hyper.Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");
	}
};

/***/ },
/* 3 */
/***/ function(module, exports) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = HyperContext;
var rAF = typeof window !== "undefined" && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame) || function (callback) {
	setTimeout(callback, 0);
}; // node has setTimeout

function isFunction(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

var now = Date.getTime;
if (Date.now) now = Date.now;
if (typeof window !== "undefined" && typeof window.performance !== "undefined" && typeof window.performance.now !== "undefined") now = window.performance.now.bind(window.performance);

function HyperTransaction(settings, automaticallyCommit) {
	this.time = now() / 1000; // value should probably be inherited from parent transaction
	this.disableAnimation = false; // value should probably be inherited from parent transaction
	this._automaticallyCommit = automaticallyCommit;
	this.settings = settings;
}

function HyperContext() {
	this.targets = [];
	this.transactions = [];
	this.ticking = false;
	this.animationFrame;
	this.displayLayers = []; // renderLayer
	this.displayFunctions = []; // strange new behavior // I don't want to expose delegate accessor on the controller, so I pass a bound function, easier to make changes to public interface.
	this.cleanupFunctions = [];
}

HyperContext.prototype = {
	createTransaction: function createTransaction(settings, automaticallyCommit) {
		var transaction = new HyperTransaction(settings, automaticallyCommit);
		var length = this.transactions.length;
		if (length) {
			// Time freezes in transactions. A time getter should return transaction time if within one.
			transaction.time = this.transactions[length - 1].time;
		}
		this.transactions.push(transaction);
		if (automaticallyCommit) this.startTicking(); // Automatic transactions will otherwise not be closed if there is no animation or value set.
		return transaction;
	},
	currentTransaction: function currentTransaction() {
		var length = this.transactions.length;
		if (length) return this.transactions[length - 1];
		return this.createTransaction({}, true);
	},
	beginTransaction: function beginTransaction(settings) {
		// TODO: throw on unclosed (user created) transaction
		this.createTransaction(settings, false);
	},
	commitTransaction: function commitTransaction() {
		this.transactions.pop();
	},
	flushTransaction: function flushTransaction() {
		// TODO: prevent unterminated when called within display
		//if (this.animationFrame) cAF(this.animationFrame); // Unsure if cancelling animation frame is needed.
		this.ticker(); // Probably should not commit existing transaction
	},
	disableAnimation: function disableAnimation(disable) {
		// If this is false, it enables animation
		if (disable !== false) disable = true; // because the function name is misleading
		var transaction = this.currentTransaction();
		transaction.disableAnimation = disable;
		this.startTicking();
	},

	registerTarget: function registerTarget(target, display, cleanup) {
		this.startTicking();
		var index = this.targets.indexOf(target);
		if (index < 0) {
			this.targets.push(target);
			this.displayLayers.push(null); // cachedPresentationLayer !!! carefully rendering
			this.displayFunctions.push(display);
			this.cleanupFunctions.push(cleanup);
		}
	},

	deregisterTarget: function deregisterTarget(target) {
		var index = this.targets.indexOf(target);
		if (index > -1) {
			this.targets.splice(index, 1);
			this.displayLayers.splice(index, 1); // cachedPresentationLayer
			this.displayFunctions.splice(index, 1);
			this.cleanupFunctions.splice(index, 1);
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
			var display = this.displayFunctions[i]; // strange new behavior
			if (!target.animationCount) {
				// Deregister from inside ticker is redundant (removalCallback & removeAnimationInstance), but is still needed when needsDisplay()
				if (isFunction(display)) {
					//var presentationLayer = target.presentation;
					display(); // new ensure one last time
				}
				this.deregisterTarget(target); // Deregister here to ensure one more tick after last animation has been removed. Different behavior than removalCallback & removeAnimationInstance, for example needsDisplay()
			} else {
				if (isFunction(display)) {
					var presentationLayer = target.presentation;
					if (this.displayLayers[i] !== presentationLayer) {
						// suppress unnecessary displays
						if (target.animationCount) this.displayLayers[i] = presentationLayer; // cachedPresentationLayer
						//display.call(target.delegate);
						display();
					}
				}
				this.cleanupFunctions[i](); // New style cleanup in ticker.
			}
		}

		var length = this.transactions.length;
		if (length) {
			var transaction = this.transactions[length - 1];
			if (transaction._automaticallyCommit) this.commitTransaction();
		}
		if (this.targets.length) this.startTicking();
	}
};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = __webpack_require__(0);

Object.keys(_core).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _core[key];
    }
  });
});

var _types = __webpack_require__(1);

Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _types[key];
    }
  });
});
exports.whyDoTheOtherExportsHaveGettersButThisDoesNot = whyDoTheOtherExportsHaveGettersButThisDoesNot;
function whyDoTheOtherExportsHaveGettersButThisDoesNot() {}

/***/ }
/******/ ]);
});