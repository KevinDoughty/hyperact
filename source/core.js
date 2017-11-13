import { HyperContext } from "./context.js";
import { HyperAnimation, HyperKeyframes, HyperGroup, HyperChain, animationFromDescription, hyperActionIsFilling } from "./actions.js";

const TRANSACTION_DURATION_ALONE_IS_ENOUGH = true; // original was false and required a default animation, but CA behavior is true
const DELEGATE_DOUBLE_WHAMMY = true; // allow delegate the ability to convert key, to mangle for makeshift key paths.
const ENSURE_ONE_MORE_TICK = true;// true is needed to display one more time after all animations have ended. // false is needed to removeAllAnimations after unmount

const delegateMethods = ["display","animationForKey","input","output"]; // animationForKey // hyperAction // reaction
const controllerMethods = ["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations", "removeAnimation"];
const controllerProperties = ["layer","presentation","model","previous","animations","animationNames","animationCount"];

const hyperContext = new HyperContext();

export const beginTransaction = hyperContext.beginTransaction.bind(hyperContext);
export const commitTransaction = hyperContext.commitTransaction.bind(hyperContext);
export const currentTransaction = hyperContext.currentTransaction.bind(hyperContext);
export const flushTransaction = hyperContext.flushTransaction.bind(hyperContext);
export const disableAnimation = hyperContext.disableAnimation.bind(hyperContext);

function isFunction(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

function prepAnimationObjectFromAddAnimation(animation, delegate) { // If this is only called from addAnimation, why is it here?
	if (animation instanceof HyperAnimation || animation instanceof HyperKeyframes) {
		if (delegate && animation.property && isFunction(delegate.typeOfProperty)) {
			const type = delegate.typeOfProperty.call(delegate, animation.property);
			if (type) animation.type = type;
		}
	} else if (animation instanceof HyperGroup) { // recursive
		animation.group.forEach( function(childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate);
		});
	} else if (animation instanceof HyperChain) { // recursive
		animation.chain.forEach( function(childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate);
		});
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

function implicitAnimation(property,prettyValue,prettyPrevious,prettyPresentation,delegate,defaultAnimation,transaction) { // TODO: Ensure modelLayer is fully populated before calls to animationForKey so you can use other props conditionally to determine animation
	let description;
	if (isFunction(delegate.animationForKey)) description = delegate.animationForKey.call(delegate,property,prettyValue,prettyPrevious,prettyPresentation); // TODO: rename action or implicit
	if (TRANSACTION_DURATION_ALONE_IS_ENOUGH && description === null) return null; // null stops, undefined continues
	let animation = animationFromDescription(description);
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

export function presentationTransform(sourceLayer,sourceAnimations,time,shouldSortAnimations) { // COMPOSITING // This function mutates, allowing manual composting given layer and animations.
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
	});
	return progressChanged;
}

export function decorate(controller, delegate, layerInstance) { // deprecated
	return activate(controller, delegate, layerInstance);
}

export function activate(controller, delegate, layerInstance) { // layer, delegate, controller?
	if (!controller) { // "Nothing to hyperactivate." // TODO: layer, delegate, controller
		if (!delegate) delegate = {};
		if (!layerInstance) layerInstance = delegate;
	} else {
		if (controller.registerAnimatableProperty || controller.addAnimation) throw new Error("Already hyperactive"); // TODO: be more thorough
		if (!delegate) delegate = controller;
		if (!layerInstance) layerInstance = controller;
	}
	const allAnimations = [];
	const allNames = [];
	let namedAnimations = {};
	const defaultAnimations = {}; // Shouldn't defaultAnimations be passed as delegate.animationDict instead of being registered with registerAnimatableProperty?
	let shouldSortAnimations = false;
	const modelBacking = {};
	const previousBacking = {}; // modelBacking and previousBacking merge like react and there is no way to delete.
	let presentationBacking = null;
	const registeredProperties = [];
	let activeBacking = modelBacking;

	function valueForKey(property) { // don't let this become re-entrant (do not animate delegate.output)
		if (DELEGATE_DOUBLE_WHAMMY) property = convertedKey(property,delegate.keyOutput,delegate);
		const prettyValue = convertedValueOfPropertyWithFunction(activeBacking[property],property,delegate.output,delegate);
		return prettyValue;
	}

	function setValueForKey(prettyValue,property) {
		const layer = {};
		layer[property] = prettyValue;
		setValuesOfLayer(layer);
	}
	function setValuesOfLayer(layer) {
		const transaction = hyperContext.currentTransaction();
		const presentationLayer = getPresentation(); // Generate presentation even if not accessed for implicit animation. Required for test "registered implicit presentation"
		var result = {};
		Object.keys(layer).forEach( function(prettyKey) {
			let uglyKey = prettyKey;
			const prettyValue = layer[prettyKey];
			if (DELEGATE_DOUBLE_WHAMMY) uglyKey = convertedKey(prettyKey,delegate.keyInput,delegate);
			registerAnimatableProperty(uglyKey); // automatic registration
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
				const prettyPrevious = convertedValueOfPropertyWithFunction(previousBacking[uglyKey],prettyKey,delegate.output,delegate);
				if (prettyValue !== prettyPrevious) {
					const prettyPresentation = presentationLayer[prettyKey];
					const animation = implicitAnimation(prettyKey,prettyValue,prettyPrevious,prettyPresentation,delegate,defaultAnimations[prettyKey],transaction);
					if (animation) addAnimation(animation); // There is room for optimization, reduce copying and converting between pretty and ugly
					else needsDisplay();
				}
			});
		}
	}

	function invalidate() { // note that you cannot invalidate if there are no animations
		presentationBacking = null;
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
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(layerInstance);
			}
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
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(layerInstance);
			}
		}
	}

	function isAllowableProperty(key) { // don't trigger animation on functions themselves
		return ((layerInstance !== controller || (controllerMethods.indexOf(key) < 0 && controllerProperties.indexOf(key) < 0)) && (layerInstance !== delegate || delegateMethods.indexOf(key) < 0));
	}

	function registerAnimatableProperty(property, defaultAnimation) { // Workaround for lack of Proxy // Needed to trigger implicit animation. // FIXME: defaultValue is broken. TODO: Proper default animations dictionary. // TODO: default animation should always be the value true
		if (!isAllowableProperty(property)) return;
		let firstTime = false;
		if (registeredProperties.indexOf(property) === -1) firstTime = true;
		if (firstTime) registeredProperties.push(property);
		const descriptor = Object.getOwnPropertyDescriptor(layerInstance, property);
		if (defaultAnimation) defaultAnimations[property] = defaultAnimation; // maybe set to defaultValue not defaultAnimation
		else if (defaultAnimations[property] === null) delete defaultAnimations[property]; // property is still animatable
		if (!descriptor || descriptor.configurable === true) {
			const uglyValue = convertedValueOfPropertyWithFunction(layerInstance[property], property, delegate.input, delegate);
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
	}
	function getLayer() {
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
		return Object.keys(layerInstance).filter(isAllowableProperty).reduce(function(accumulator, current) {
			accumulator[current] = layerInstance[current];
			return accumulator;
		}, {});
	}
	function getPresentation() {
		const transactionTime = hyperContext.currentTransaction().time;
		if (presentationBacking !== null) return presentationBacking;
		const presentationLayer = Object.assign(baseLayer(), modelBacking);
		let changed = true; // true is needed to ensure last frame. But you don't want this to default to true any other time with no animations. Need some other way to detect if last frame
		const length = allAnimations.length;
		if (length) changed = presentationTransform(presentationLayer,allAnimations,transactionTime,shouldSortAnimations);
		shouldSortAnimations = false;
		if (changed || presentationBacking === null) {
			convertPropertiesOfLayerWithFunction(Object.keys(presentationLayer),presentationLayer,delegate.output,delegate);
			Object.freeze(presentationLayer);
			if (length) presentationBacking = presentationLayer;
			else presentationBacking = null;
			return presentationLayer;
		}
		return presentationBacking;
	}
	function getModel() {
		const layer = baseLayer();
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
	}
	function getPrevious() {
		const layer = baseLayer();//Object.assign({},layerInstance);
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
	}
	function needsDisplay() { // This should be used instead of directly calling display
		presentationBacking = null;
		if (!allAnimations.length) registerWithContext(); // This might not be sufficient to produce a new presentationLayer
	}
	function addAnimation(description,name) { // does not register. // should be able to pass a description if type is registered
		if (delegate && isFunction(delegate.animationFromDescription)) description = delegate.animationFromDescription(description); // deprecate this
		const copy = animationFromDescription(description);
		if (!(copy instanceof HyperAnimation) && !(copy instanceof HyperKeyframes) && !(copy instanceof HyperGroup) && !(copy instanceof HyperChain)) throw new Error("Not a valid animation:"+JSON.stringify(copy));
		copy.convert.call(copy, delegate.input, delegate); // delta is calculated from ugly values in runAnimation
		prepAnimationObjectFromAddAnimation(copy, delegate);
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
		if (!ENSURE_ONE_MORE_TICK) {
			hyperContext.deregisterTarget(layerInstance);
		}
	}
	function animationNamed(name) {
		const animation = namedAnimations[name];
		if (animation) {
			return animation.description.call(animation,delegate);
		}
		return null;
	}

	function registerWithContext() {
		let display = function() {};
		if (isFunction(delegate.display)) display = function(presentation) { // layer returns calculated values during display
			activeBacking = getPresentation();
			delegate.display.call(delegate, presentation);
			activeBacking = modelBacking;
		};
		hyperContext.registerTarget(layerInstance, getPresentation, getAnimationCount, display, invalidate, animationCleanup, modelBacking);
	}

	Object.keys(layerInstance).forEach( function(key) { // more initialization
		if (TRANSACTION_DURATION_ALONE_IS_ENOUGH) registerAnimatableProperty(key,true); // second argument true because you should animate every property if transaction has a duration. TODO: ensure this does not interfere with automatic registration when setting values
		else registerAnimatableProperty(key);
	});

	if (controller) {
		controller.registerAnimatableProperty = registerAnimatableProperty;
		controller.needsDisplay = needsDisplay;
		controller.addAnimation = addAnimation;
		controller.removeAnimation = removeAnimation;
		controller.removeAllAnimations = removeAllAnimations;
		controller.animationNamed = animationNamed;
		Object.defineProperty(controller, "layer", { // TODO: I don't like this. Need a merge function.
			get: getLayer,
			set: setLayer,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "animationCount", { // Performs better than asking for animations.length, especially with delegate.input and delegate.output
			get: getAnimationCount,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "animations", { // TODO: cache this like presentationLayer
			get: getAnimations,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "animationNames", {
			get: getAnimationNames,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "presentation", {
			get: getPresentation,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "model", {
			get:getModel,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "previous", {
			get: getPrevious,
			enumerable: false,
			configurable: false
		});
	}

	return controller; // TODO: should return the deactivate function // or maybe the layerInstance
}
