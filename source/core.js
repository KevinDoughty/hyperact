import { HyperContext } from "./context.js";
import { HyperAnimation, HyperGroup, animationFromDescription } from "./actions.js";

const DELEGATE_MASSAGE_INPUT_OUTPUT = true; // allow delegate the ability to convert values to and from private internal representation ("ugly" values)
const DELEGATE_DOUBLE_WHAMMY = true; // allow delegate the ability to convert key, to mangle for makeshift key paths.
const ENSURE_ONE_MORE_TICK = true;// true is needed to display one more time after all animations have ended. // false is needed to removeAllAnimations after unmount

//const FAKE_RUN_LOOP_TRANSACTION = true;
// context caches presentation layers
// they get generated lazily
// If an object has no animations or presentationLayer, you will need to generate one.
// I need to generate one to emulate the core animation run loop transaction.
// presentationLayer will have to be generated before any change is made to registered layer properties.
// An existing presentationLayer should not be invalidated.

const delegateMethods = ["display","animationForKey","input","output"];


const hyperContext = new HyperContext();
export const beginTransaction = hyperContext.beginTransaction.bind(hyperContext);
export const commitTransaction = hyperContext.commitTransaction.bind(hyperContext);
export const flushTransaction = hyperContext.flushTransaction.bind(hyperContext);
export const disableAnimation = hyperContext.disableAnimation.bind(hyperContext);


function isFunction(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

function prepAnimationObjectFromAddAnimation(animation, delegate) {
	if (animation instanceof HyperGroup) { // recursive
		animation.group.forEach( function(childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate);
		});
	} else if (animation instanceof HyperAnimation) {
		convertPropertiesAsPropertyOfObjectWithFunction(["from","to","delta"],animation,delegate.input);
		if (delegate.typeOfProperty) {
			const type = delegate.typeOfProperty.call(delegate, animation.property, animation.to);
			if (type) animation.type = type;
		}
	} else throw new Error("not an animation");
}

function convertedKey(property,funky) { // DELEGATE_DOUBLE_WHAMMY // from addAnimation
	if (isFunction(funky)) return funky(property);
	return property;
}
function convertedValueOfPropertyWithFunction(value,property,funky) { // DELEGATE_MASSAGE_INPUT_OUTPUT // mutates // from register, modelLayer, and previousBacking
	if (isFunction(funky)) return funky(property,value);
	return value;
}
function convertPropertyOfLayerWithFunction(property,object,funky) { // DELEGATE_MASSAGE_INPUT_OUTPUT // mutates
	if (object && isFunction(funky)) {
		const value = object[property];
		if (value !== null && typeof value !== "undefined") object[property] = funky(property,value);
		if (property === null || typeof property === "undefined") throw new Error("convert property undefined");
		
	}
}
function convertPropertiesOfLayerWithFunction(properties,object,funky) { // DELEGATE_MASSAGE_INPUT_OUTPUT // mutates
	properties.forEach( function(property) {
		if (property === null || typeof property === "undefined") throw new Error("convert properties undefined");
		convertPropertyOfLayerWithFunction(property,object,funky);
	});
}
function convertPropertiesAsPropertyOfObjectWithFunction(properties,object,funky) { // DELEGATE_MASSAGE_INPUT_OUTPUT // mutates // animation from, to, and delta
	// ["from","to","delta"],animation,delegate.input
// 	if (object && object.property === "transform") console.log("convert pre:%s;",JSON.stringify(object));
// 	if (object && isFunction(funky)) {
// 		const property = object.property;
// 		properties.forEach( function(item) {
// 			const value = object[item];
// 			if (value !== null && typeof value !== "undefined") object[item] = funky(property,value);
// 		});
// 	}
// 	if (object && object.property === "transform") console.log("convert post:%s;",JSON.stringify(object));
}

function presentationTransform(sourceLayer,sourceAnimations,time,shouldSortAnimations,presentationBacking) { // COMPOSITING
	const presentationLayer = Object.assign({},sourceLayer); // Need to make sure display has non animated properties for example this.element
	if (!sourceAnimations || !sourceAnimations.length) {
		return presentationLayer;
	}
	if (shouldSortAnimations) { // no argument means it will sort // animation index. No connection to setType animation sorting
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
	if (!progressChanged && sourceAnimations.length) {
		if (presentationBacking) return presentationBacking; // presentationBacking is not an optimization per se. It is so step timing functions return the same object.
	}
	return presentationLayer;
}

export function decorate(controller, delegate, layerInstance) {
	if (!controller) throw new Error("Nothing to hyperactivate.");
	if (controller.registerAnimatableProperty || controller.addAnimation) throw new Error("Already hyperactive"); // TODO: be more thorough
	if (!delegate) delegate = controller;
	if (!layerInstance) layerInstance = controller;
	const allAnimations = [];
	const allNames = [];
	let namedAnimations = {};
	const defaultAnimations = {};
	let shouldSortAnimations = false;
	const modelBacking = {};//Object.assign({},layerInstance);
	const previousBacking = {}; // modelBacking and previousBacking merge like react and there is no way to delete.
	let presentationBacking = null; // This is nulled out to invalidate.
	const registeredProperties = [];
	let activeBacking = modelBacking;
// 	const initialLayerOwnProperties = Object.getOwnPropertyNames(layerInstance);
	const initialLayerKeys = Object.keys(layerInstance);
// 	const initialControllerOwnProperties = Object.getOwnPropertyNames(controller);
// 	const initialControllerKeys = Object.keys(controller);

	controller.registerAnimatableProperty = function(property, defaultAnimation) { // Workaround for lack of Proxy // Needed to trigger implicit animation. // FIXME: defaultValue is broken. TODO: Proper default animations dictionary.
		if (controller === delegate && isFunction(layerInstance[property]) && delegateMethods.indexOf(property) > -1) return; // Can't animate functions that you depend on. // TODO: better rules
		let firstTime = false;
		if (registeredProperties.indexOf(property) === -1) firstTime = true;
		if (firstTime) registeredProperties.push(property);
		const descriptor = Object.getOwnPropertyDescriptor(layerInstance, property);
		defaultAnimation = animationFromDescription(defaultAnimation);
		if (DELEGATE_MASSAGE_INPUT_OUTPUT) convertPropertiesAsPropertyOfObjectWithFunction(["from","to","delta"],defaultAnimation,delegate.input);
		if (defaultAnimation) defaultAnimations[property] = defaultAnimation; // maybe set to defaultValue not defaultAnimation
		else if (defaultAnimations[property] === null) delete defaultAnimations[property]; // property is still animatable
		if (!descriptor || descriptor.configurable === true) {
			let modelValue = layerInstance[property];
			if (DELEGATE_MASSAGE_INPUT_OUTPUT) modelValue = convertedValueOfPropertyWithFunction(modelValue, property, delegate.input);
			modelBacking[property] = modelValue; // need to populate but can't use setValueForKey. No mount animations here, this function registers
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

	Object.defineProperty(controller, "layer", {
		get: function() {
			return layerInstance;
		},
		set: function(layer) {
			if (layer) Object.keys(layer).forEach( function(key) {
				controller.registerAnimatableProperty(key);
				setValueForKey(layer[key],key);
			}); // else maybe unregister every property
		},
		enumerable: false,//true,
		configurable: false
	});

	const implicitAnimation = function(property,value,previous) { // TODO: Ensure modelLayer is fully populated before calls to animationForKey so you can use other props conditionally to determine animation
		let description;
		if (isFunction(delegate.animationForKey)) description = delegate.animationForKey.call(delegate,property,value,previous); // TODO: rename action or implicit
		let animation = animationFromDescription(description);
		if (!animation) animation = animationFromDescription(defaultAnimations[property]);
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

	const valueForKey = function(property) {
		if (DELEGATE_DOUBLE_WHAMMY) property = convertedKey(property,delegate.keyOutput);
		let value = activeBacking[property];
		if (DELEGATE_MASSAGE_INPUT_OUTPUT) value = convertedValueOfPropertyWithFunction(value,property,delegate.output);
		return value;
	}; // don't let this become re-entrant

	const setValueForKey = function(value,property) {
		if (DELEGATE_DOUBLE_WHAMMY) property = convertedKey(property,delegate.keyInput);
		if (DELEGATE_MASSAGE_INPUT_OUTPUT) value = convertedValueOfPropertyWithFunction(value,property,delegate.input);
		if (value === modelBacking[property]) return; // New in Hyper! No animation if no change. This filters out repeat setting of unchanging model values while animating. Function props are always not equal (if you're not careful)
		const previous = modelBacking[property];
		previousBacking[property] = previous;
		let animation;
		const transaction = hyperContext.currentTransaction(); // Careful! This transaction might not get closed.
		if (!transaction.disableAnimation) { // TODO: Does React setState batching mean disabling implicit state animation is impossible?
			animation = implicitAnimation(property,value,previous);
			if (animation) controller.addAnimation(animation); // this will copy a second time.
		}
		modelBacking[property] = value;
		presentationBacking = null;
		activeBacking = modelBacking;
		if (!animation) controller.needsDisplay();
	};

	Object.defineProperty(controller, "animationCount", { // Performs better than asking for animations.length, especially when called from tick
		get: function() {
			return allAnimations.length;
		},
		enumerable: false,//true,
		configurable: false
	});

	Object.defineProperty(controller, "animations", { // TODO: cache this like presentationLayer
		get: function() {
			const array = allAnimations.map(function (animation) {
				const copy = animation.copy.call(animation); // TODO: optimize me. Lots of copying. Potential optimization. Instead maybe freeze properties.
				if (DELEGATE_MASSAGE_INPUT_OUTPUT) convertPropertiesAsPropertyOfObjectWithFunction(["from","to","delta"],copy,delegate.output);
				return copy;
			});
			return array;
		},
		enumerable: false,//true,
		configurable: false
	});

	Object.defineProperty(controller, "animationNames", {
		get: function() {
			return Object.keys(namedAnimations);
		},
		enumerable: false,//true,
		configurable: false
	});

	Object.defineProperty(controller, "model", { // TODO: setLayer or just plain layer
		get: function() {
			const layer = {};
			registeredProperties.forEach( function(key) {
				let value = modelBacking[key];
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
		enumerable: false,//true,
		configurable: false
	});

	Object.defineProperty(controller, "previous", {
		get: function() {
			const layer = Object.assign({},modelBacking);
			Object.keys(previousBacking).forEach( function(key) {
				let value = previousBacking[key];
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
		enumerable: false,//true,
		configurable: false
	});

	const animationCleanup = function() {
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
		if (!allAnimations.length) { // Ensure one last time
			presentationBacking = modelBacking;
		}
		finishedWithCallback.forEach( function(animation) {
			animation.onend.call(animation,true);
		});
	};

	Object.defineProperty(controller, "presentation", {
		get: function() {
			let time = 0; // Temporary workaround. Not sure if still needed. It should be safe to create transactions.
			if (allAnimations.length) time = hyperContext.currentTransaction().time;// Do not create a transaction if there are no animations else the transaction will not be automatically closed.
			let baseLayer = {};
			if (controller !== layerInstance && delegate !== layerInstance) baseLayer = Object.assign({},layerInstance);
			const sourceLayer = Object.assign(baseLayer, modelBacking);
			const presentationLayer = presentationTransform(sourceLayer,allAnimations,time,shouldSortAnimations,presentationBacking);//,finishedAnimations); // not modelBacking for first argument (need non animated properties), but it requires that properties like "presentationLayer" are not enumerable
			if (DELEGATE_MASSAGE_INPUT_OUTPUT && presentationLayer !== presentationBacking) convertPropertiesOfLayerWithFunction(Object.keys(presentationLayer),presentationLayer,delegate.output);
			presentationBacking = presentationLayer;
			shouldSortAnimations = false;
			return presentationLayer;
		},
		enumerable: false,//true,
		configurable: false
	});
	
	const registerWithContext = function() {
		let display = function() {};
		if (isFunction(delegate.display)) display = function() {
			activeBacking = controller.presentation;
			delegate.display.call(delegate);
			activeBacking = modelBacking;
		};
		hyperContext.registerTarget(controller, display, animationCleanup);
	};
	
	controller.needsDisplay = function() { // This should be used instead of directly calling display
		registerWithContext();
	};

	controller.addAnimation = function(description,name) { // should be able to pass a description if type is registered
		const animation = animationFromDescription(description);
		if (!(animation instanceof HyperAnimation) && !(animation instanceof HyperGroup)) throw new Error("Animations must be a Hyper.Animation or Group subclass.",JSON.stringify(animation));
		if (DELEGATE_MASSAGE_INPUT_OUTPUT) prepAnimationObjectFromAddAnimation(animation,delegate);
		if (!allAnimations.length) registerWithContext();
		const copy = animation.copy.call(animation);
		allAnimations.push(copy);
		if (name !== null && typeof name !== "undefined") {
			const previous = namedAnimations[name];
			if (previous) removeAnimationInstance(previous); // after pushing to allAnimations, so context doesn't stop ticking
			namedAnimations[name] = copy;
		}
		if (typeof name === "undefined" || name === null || name === false) allNames.push(null);
		else allNames.push(name);
		shouldSortAnimations = true;
		
		const time = hyperContext.currentTransaction().time;
		copy.runAnimation(controller, name, time);
	};

	const removeAnimationInstance = function(animation) {
		const index = allAnimations.indexOf(animation);
		if (index > -1) {
			allAnimations.splice(index,1);
			const name = allNames[index];
			allNames.splice(index,1);
			delete namedAnimations[name];
		}
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(controller);
			}
		}
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
			if (DELEGATE_MASSAGE_INPUT_OUTPUT) convertPropertiesAsPropertyOfObjectWithFunction(["from","to","delta"],copy,delegate.output);
			return copy;
		}
		return null;
	};

// 	const hyperOwnProperties = Object.getOwnPropertyNames(layerInstance);
// 	initialLayerOwnProperties.forEach( (key) => { // API fluctuation
// 		const index = hyperOwnProperties.indexOf(key);
// 		if (index > -1) hyperOwnProperties.splice(index,1);
// 	});
// 	const hyperKeys = Object.keys(layerInstance);
// 	initialLayerKeys.forEach( (key) => { // API fluctuation
// 		const index = hyperKeys.indexOf(key);
// 		if (index > -1) hyperKeys.splice(index,1);
// 	});

	initialLayerKeys.forEach( (key) => { // More initialization // decorate automatically registers pre-existing properties.
		modelBacking[key] = layerInstance[key];
		controller.registerAnimatableProperty(key);
	});
	return controller;
}
