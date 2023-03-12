import { HyperContext } from "./context.js";
import { HyperAnimation, HyperKeyframes, HyperGroup, HyperChain, animationFromDescription, hyperActionIsFilling, isDuckType } from "./actions.js";
import { HyperNumber } from "./types.js";
import { isFunction, prepAnimationObjectFromAddAnimation, convertedKey, convertedInputOfProperty, convertedOutputOfProperty, implicitAnimation } from "./utils.js";


export const DELEGATE_DOUBLE_WHAMMY = true; // allow delegate the ability to convert key, to mangle for makeshift key paths.
const ENSURE_ONE_MORE_TICK = true;// true is needed to display one more time after all animations have ended. // false is needed to removeAllAnimations after unmount

const HOW_IT_SHOULD_BE = false; // when true, hyperstyle transaction fails on holding down number key. Need a test that fails when this is true

const delegateMethods = ["display","animationForKey","input","output"]; // animationForKey // hyperAction // reaction
const controllerMethods = ["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations", "removeAnimation"];
const controllerProperties = ["layer","presentation","model","previous","animations","animationNames","animationCount"];

const hyperContext = new HyperContext();

export const beginTransaction = hyperContext.beginTransaction.bind(hyperContext);
export const commitTransaction = hyperContext.commitTransaction.bind(hyperContext);
export const currentTransaction = hyperContext.currentTransaction.bind(hyperContext);
export const flushTransaction = hyperContext.flushTransaction.bind(hyperContext);
export const disableAnimation = hyperContext.disableAnimation.bind(hyperContext);

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
		const debugProperty = animation.property;
		if (debugProperty && sourceLayer[debugProperty] && sourceLayer[debugProperty].px && sourceLayer[debugProperty].px.length && sourceLayer[debugProperty].px.substring && sourceLayer[debugProperty].px.substring(sourceLayer[debugProperty].px.length-3) === "NaN") {
			throw new Error("hyperact NaN composite sourceLayer:"+JSON.stringify(sourceLayer)+";");
		}
	});
	return progressChanged;
}

export function activate(controller, delegate, layerInstance, descriptions) { // layer, delegate, controller?
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
		const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyOutput,delegate) : prettyKey;
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
			const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyInput,delegate) : prettyKey;
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
			const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyInput,delegate) : prettyKey;
			//const prettyValue = layer[prettyKey]; // need a test that fails with this
			const prettyValue = HOW_IT_SHOULD_BE ? layer[prettyKey] : getModel()[prettyKey];
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

	function isAllowablePrettyKey(key) { // don't trigger animation on functions themselves
		return ((layerInstance !== controller || (controllerMethods.indexOf(key) < 0 && controllerProperties.indexOf(key) < 0)) && (layerInstance !== delegate || delegateMethods.indexOf(key) < 0));
	}
	function registerAnimatableProperty(prettyKey, optionalDescriptionOrType) {
		registerAnimatable(prettyKey, optionalDescriptionOrType);
	}

	function registerAnimatable(prettyKey, optionalDescriptionOrType, isType) { // Manually declare types or animation if not number // Needed to trigger implicit animation. // FIXME: defaultValue is broken. TODO: Proper default animations dictionary. // TODO: default animation should always be the value true
		const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyInput,delegate) : prettyKey;
		if (!isAllowablePrettyKey(prettyKey)) return;
		let firstTime = false;
		const registeredIndex = registeredProperties.indexOf(uglyKey);
		if (registeredIndex === -1) firstTime = true;
		const prettyValue = layerInstance[prettyKey];
		if (firstTime) registeredProperties.push(uglyKey);


		const descriptor = Object.getOwnPropertyDescriptor(layerInstance, prettyKey);
		const DEFAULT_TYPES_DO_NOT_REGISTER_AS_ANIMATIONS = true;
		if (DEFAULT_TYPES_DO_NOT_REGISTER_AS_ANIMATIONS) {
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

		} else {
			if (optionalDescriptionOrType) defaultAnimations[uglyKey] = isDuckType(optionalDescriptionOrType) ? { type: optionalDescriptionOrType } : optionalDescriptionOrType; // promotion from type to description happens in animationFromDescription, but this should help in unfinished implicitAnimation merging default animation with animationForKey, so one could use defaultAnimations to register types not animations
			else if (optionalDescriptionOrType === null) {
				delete defaultTypes[uglyKey];
				delete defaultAnimations[uglyKey];
				registeredProperties.splice(registeredIndex,1);
			}
			const defaultAnimation = defaultAnimations[uglyKey];
			if (defaultAnimation) defaultTypes[uglyKey] = defaultAnimation.type;
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
		const debugThrowing = false;

		const transactionTime = hyperContext.currentTransaction().time; // has side effects
		const nextRenderLayer = Object.assign({},uglyBacking);//Object.assign(baseLayer(), modelBacking);
		let changed = true; // true is needed to ensure last frame. But you don't want this to default to true any other time with no animations. Need some other way to detect if last frame
		const length = allAnimations.length;

		if (length) changed = presentationTransform(nextRenderLayer,allAnimations,transactionTime,shouldSortAnimations);
		shouldSortAnimations = false;
		if (changed || !cachedRenderLayer) {// || cachedRenderLayer === null) { // cachedRenderLayer is always null here
			registeredProperties.forEach( function(prettyKey) {
				const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyOutput,delegate) : prettyKey;
				const uglyValue = nextRenderLayer[prettyKey]; // ????? PRETTY OR UGLY KEY ?????
				if (uglyValue && uglyValue.length && uglyValue.substring && uglyValue.substring(uglyValue.length-3) === "NaN") {
					if (debugThrowing) throw new Error("hyperact getRender NaN ugly key:"+uglyKey+"; uglyValue:"+JSON.stringify(uglyValue)+"; uglyBacking:"+JSON.stringify(uglyBacking[uglyKey])+"; full:"+JSON.stringify(uglyBacking)+";");
				}
				nextRenderLayer[prettyKey] = convertedOutputOfProperty(uglyValue,uglyKey,delegate,defaultTypes);
				if (nextRenderLayer[prettyKey] && nextRenderLayer[prettyKey].length && nextRenderLayer[prettyKey].substring && nextRenderLayer[prettyKey].substring(nextRenderLayer[prettyKey].length-3) === "NaN") {
					if (debugThrowing) throw new Error("hyperact getRender NaN next key:"+uglyKey+"; uglyValue:"+JSON.stringify(uglyValue)+";");
				}
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
		if (!Number.isNaN(type)) {
			const value = { type: HyperNumber };
			value[prettyKey] = type;
		}
		return type && isDuckType(type) ? { type: type } : type;
	}

	Object.keys(layerInstance).filter(isAllowablePrettyKey).forEach( function(prettyKey) { // redundancy with setValuesOfLayer (and baseLayer), maybe I could call that instead with transaction disabled
		const prettyValue = layerInstance[prettyKey];
		const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyInput,delegate) : prettyKey;
		const description = defaultPropertyDescription(prettyKey) || { type: new HyperNumber() };
		registerAnimatableProperty(uglyKey, description); // automatic registration
		prettyBacking[uglyKey] = prettyValue;
	});

	if (descriptions) Object.keys(descriptions).filter(isAllowablePrettyKey).forEach( function(prettyKey) { // new fourth parameter to activate registers types
		const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyInput,delegate) : prettyKey;
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
