import { HyperContext } from "./context.js";
import { HyperAnimation, HyperKeyframes, HyperGroup, HyperChain, animationFromDescription, hyperActionIsFilling, isDuckType } from "./actions.js";
import { HyperNumber } from "./types.js";
import { isFunction, prepAnimationObjectFromAddAnimation, convertedKey, convertedInputOfProperty, convertedOutputOfProperty, implicitAnimation } from "./utils.js";
const verbose = false;


export const DELEGATE_DOUBLE_WHAMMY = true; // allow delegate the ability to convert key, to mangle for makeshift key paths.
const ENSURE_ONE_MORE_TICK = true;// true is needed to display one more time after all animations have ended. // false is needed to removeAllAnimations after unmount

//const UNFINISHED_PRESENTATION_GENERATION_FIX = true; // see comments in setValuesOfLayer and Hyperreact notes.txt. Two pass generation to prevent flicker, or maybe animationForKey uses previous transaction values

export const VAGUE_TYPE_SPAGHETTI_HACK = false;
//const NO_DELEGATE_INPUT_OUTPUT = false;

const FASTER_RENDER_LAYER = true; // !!! // Original false // true causes rococo to not animate first time, failure of tests "fake set animation" // Probably not faster but was suppossed to be a step towards fewer object instantiations. Now it's slower with more state. Render layer generates less than a full presentation layer. More caching, no single source of truth, invalidation problem.
//const MUTATE_RENDER_LAYER = true;
const AVOID_CREATING_PRESENTATION_LAYER = false; // Original false // in setValuesOfLayer // true causes flicker in transaction example // true causes test failure of "combination register" and if RENDER_LAYER is also true then "registered implicit presentation" fails too.
const NEWER_RENDER_CACHING = true; // original false // causes flicker in transaction example // true fixes two in "step-end easing" and one in "initial state" but fails one in "fake set animation"

//const DESPERATE_TIMES_CALL_FOR_DESPERATE_ACTION = true;

export const FAKE_SET_BUG_FIX = true;

const DOUBLE_CACHED_RENDER = false; // must be false // all animation tests time out


//const ADD_ANIMATION_AUTO_REGISTER = true; // animations with temporary properties and values, which are otherwise undefined

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
	const previousBacking = {}; // DEPRECATED modelBacking and previousBacking merge like react and there is no way to delete.
	const uglyBacking = {}; // prettyBacking is pretty, with RENDER_LAYER. Should be pretty if there are no animations.
	const prettyBacking = {};
	let cachedRenderLayer = null;
	let cachedCachedRenderLayer = null;
	let cachedPresentationLayer = null;
	let cachedModelLayer = null;
	let cachedPreviousLayer = null;
	const registeredProperties = [];
	let activeBacking = modelBacking;

	function valueForKey(prettyKey) { // don't let this become re-entrant (do not animate delegate.output)
		const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyOutput,delegate) : prettyKey;
		if (FASTER_RENDER_LAYER) {
			if (activeBacking === null) {
				// wouldn't know if model or presentation
				// prettyBacking should be derived and cached
				// uglyBacking is single source of truth
				// that means not using activeBacking... or does it?
				// not nullifying it.
				console.log("activeBacking === null doesn't happen");
				return getModel()[uglyKey];

			}
			return activeBacking[uglyKey];
		}
		const prettyValue = convertedOutputOfProperty(activeBacking[uglyKey],uglyKey,delegate, defaultTypes);
		return prettyValue;
	}

	function setValueForKey(prettyValue,prettyKey) {
		const layer = {};
		layer[prettyKey] = prettyValue;
		setValuesOfLayer(layer);
	}

	function setValuesOfLayer(layer) {
		if (FAKE_SET_BUG_FIX) hyperContext.registerFlusher(flusher); // don't need to bind
		const transaction = hyperContext.currentTransaction();
		const presentationLayer = AVOID_CREATING_PRESENTATION_LAYER ? null : getPresentation();

		const keys = Object.keys(layer);
		if (keys.length) {
			if (FASTER_RENDER_LAYER) { // setValuesOfLayer
				cachedPreviousLayer = cachedModelLayer;
				cachedModelLayer = null;
				//invalidate();
			} else {
				cachedPreviousLayer = null;
				cachedPreviousLayer = getPrevious();
				cachedModelLayer = null;
			}
		}
		//var animatable = {};
		keys.forEach( function(prettyKey) {
			const prettyValue = layer[prettyKey];
			const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyInput,delegate) : prettyKey;
			registerAnimatableProperty(uglyKey); // automatic registration
			const uglyValue = convertedInputOfProperty(prettyValue,uglyKey,delegate,defaultTypes);
			if (FASTER_RENDER_LAYER) { // setValuesOfLayer
				uglyBacking[uglyKey] = uglyValue;
				prettyBacking[uglyKey] = prettyValue;
			} else {
				const uglyPrevious = modelBacking[uglyKey];
				previousBacking[uglyKey] = uglyPrevious;
				modelBacking[uglyKey] = uglyValue;
			}
		});

		//if (!transaction.disableAnimation) { // setValuesOfLayer
		Object.keys(layer).forEach( function(prettyKey) { // using result not layer because key might be different
			const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyInput,delegate) : prettyKey;
			const prettyValue = FASTER_RENDER_LAYER ? getModel()[prettyKey] : layer[prettyKey];
			const uglyPrevious = previousBacking[uglyKey];
			const prettyPrevious = FASTER_RENDER_LAYER ? getPrevious()[prettyKey] : convertedOutputOfProperty(uglyPrevious,uglyKey, delegate, defaultTypes);

			if (prettyValue !== prettyPrevious) {
				const prettyPresentation = AVOID_CREATING_PRESENTATION_LAYER ? getPresentation()[prettyKey] : presentationLayer[prettyKey]; // pretty key.
				//const prettyPresentation = presentationLayer[prettyKey]; // pretty key.
				if (!transaction.disableAnimation) {
					const animation = implicitAnimation(prettyKey,prettyValue,prettyPrevious,prettyPresentation,delegate,defaultAnimations[uglyKey],defaultTypes[uglyKey],transaction);
					if (animation) addAnimation(animation); // There is room for optimization, reduce copying and converting between pretty and ugly
					//else needsDisplay(); // breaks transactions and unflushed and doesn't fix flicker
					else registerWithContext(); // but it might be a step-end which would not update!
				//} else needsDisplay(); // breaks transactions and unflushed and doesn't fix flicker
				} else registerWithContext(); // but it might be a step-end which would not update!
				//else if (!DESPERATE_TIMES_CALL_FOR_DESPERATE_ACTION) needsDisplay();
			}
		});
		//} //else needsDisplay();
		//needsDisplay();
		// if animation is disabled, changing a property value will not result in a call to display!

		//if (DESPERATE_TIMES_CALL_FOR_DESPERATE_ACTION) invalidate();
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
		//const prettyValue = firstTime ? layerInstance[prettyKey] : convertedOutputOfProperty(modelBacking[uglyKey], uglyKey, delegate, defaultAnimations); // The "specific bug fix" // if not first time registered (for instance if activate was called first then properties registered) you need
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
			if (FASTER_RENDER_LAYER) { // registerAnimatableProperty
				uglyBacking[uglyKey] = uglyValue;
				prettyBacking[uglyKey] = prettyValue;
			} else {
				modelBacking[uglyKey] = uglyValue; // need to populate but can't use setValueForKey. No mount animations here, this function registers
				previousBacking[uglyKey] = uglyValue; // This is new but needed, might break mount behavior if expecting null or undefined as previous value
			}
		}


		if (!descriptor || descriptor.configurable === true) {//} || !firstTime) { // !firstTime is the second part of the specific bug fix of calling activate first then registering properties.
			// it does matter,
			// the first time there is no type,
			// the second time there is a type but it doesn't make it here.
			// so modelBacking is populated with a pretty value!
			// if (typeof prettyValue !== "undefined" && prettyValue !== null) {
			// 	const uglyValue = convertedInputOfProperty(prettyValue, uglyKey, delegate,defaultAnimations); // layerInstance never uses uglyKey
			// 	modelBacking[uglyKey] = uglyValue; // need to populate but can't use setValueForKey. No mount animations here, this function registers
			// 	previousBacking[uglyKey] = uglyValue; // This is new but needed, might break mount behavior if expecting null or undefined as previous value
			// }
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

	function flusher() {
		cachedPresentationLayer = null;
		cachedRenderLayer = null;
	}
	function invalidate() {
		// Does not invalidate if there are no animations
		// Should not invalidate at every tick but does.
		// Commenting out causes unterminated.
		cachedPresentationLayer = null;
		if (!NEWER_RENDER_CACHING) cachedRenderLayer = null;
		cachedCachedRenderLayer = null;
		// cachedModelLayer = null;
		// cachedPreviousLayer = null;
	}

	// FIXME:
	// TODO: animation objects use ugly keys, animation descriptions use pretty keys


	function getRender() { // FASTER_RENDER_LAYER // pretty values // the new version causes 5 failures in "DEPRECATED input output delegate value transforms"
		const debugThrowing = false;
		if (NEWER_RENDER_CACHING) {
			if (DOUBLE_CACHED_RENDER && cachedCachedRenderLayer !== null) return cachedCachedRenderLayer;
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
			cachedCachedRenderLayer = cachedRenderLayer;
			if (FAKE_SET_BUG_FIX) cachedPresentationLayer = null;
			//cachedRenderLayer = nextRenderLayer;
			return cachedRenderLayer;
		} else { // original

			const transactionTime = hyperContext.currentTransaction().time; // has side effects

			if (cachedRenderLayer !== null) return cachedRenderLayer;

			//const nextRenderLayer = Object.assign({},modelBacking);//Object.assign(baseLayer(), modelBacking);
			const nextRenderLayer = Object.assign({},uglyBacking);//Object.assign(baseLayer(), modelBacking);
			let changed = true; // true is needed to ensure last frame. But you don't want this to default to true any other time with no animations. Need some other way to detect if last frame
			const length = allAnimations.length;
			if (length) changed = presentationTransform(nextRenderLayer,allAnimations,transactionTime,shouldSortAnimations);
			shouldSortAnimations = false;
			if (changed || cachedRenderLayer === null) { // cachedRenderLayer is always null here
				//convertPropertiesOfLayerWithFunction(Object.keys(presentationLayer),presentationLayer,delegate.output,delegate);
				//Object.keys(nextPresentationLayer).forEach( function(prettyKey) {
				registeredProperties.forEach( function(prettyKey) {
					const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyOutput,delegate) : prettyKey;
					const uglyValue = nextRenderLayer[prettyKey]; // ????? PRETTY OR UGLY KEY ?????
					nextRenderLayer[prettyKey] = convertedOutputOfProperty(uglyValue,uglyKey,delegate,defaultTypes);  // requires vague type spaghetti hack
					//convertPropertyOfLayerWithFunction(prettyKey,nextPresentationLayer,delegate.output,delegate);
					//const prettyValue = convertedOutputOfProperty(activeBacking[uglyKey],uglyKey,getOutputDelegate(uglyKey));
				});
				//Object.freeze(nextPresentationLayer);
				if (length) cachedRenderLayer = nextRenderLayer;
				else cachedRenderLayer = null;
				return nextRenderLayer;
			}
			return cachedRenderLayer;

		}
	}
	function getPresentation() { // pretty values including animations // This should be created in a very similar manner as getModel and getPrevious but is not
		if (FASTER_RENDER_LAYER) {
			//const transactionTime = hyperContext.currentTransaction().time; // has side effects
			if (cachedPresentationLayer !== null && (!FAKE_SET_BUG_FIX || cachedRenderLayer !== null)) return cachedPresentationLayer;
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

		} else {
			const transactionTime = hyperContext.currentTransaction().time; // has side effects
			if (cachedPresentationLayer !== null) return cachedPresentationLayer;
			const nextPresentationLayer = Object.assign(baseLayer(), modelBacking);
			let changed = true; // true is needed to ensure last frame. But you don't want this to default to true any other time with no animations. Need some other way to detect if last frame
			const length = allAnimations.length;
			if (length) changed = presentationTransform(nextPresentationLayer,allAnimations,transactionTime,shouldSortAnimations);
			shouldSortAnimations = false;
			if (changed || cachedPresentationLayer === null) {
				//convertPropertiesOfLayerWithFunction(Object.keys(presentationLayer),presentationLayer,delegate.output,delegate);
				Object.keys(nextPresentationLayer).forEach( function(prettyKey) {
					const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyOutput,delegate) : prettyKey;
					const uglyValue = nextPresentationLayer[prettyKey]; // ????? PRETTY OR UGLY KEY ?????
					nextPresentationLayer[prettyKey] = convertedOutputOfProperty(uglyValue,uglyKey,delegate,defaultTypes);  // requires vague type spaghetti hack
					//convertPropertyOfLayerWithFunction(prettyKey,nextPresentationLayer,delegate.output,delegate);
					//const prettyValue = convertedOutputOfProperty(activeBacking[uglyKey],uglyKey,getOutputDelegate(uglyKey));
				});
				Object.freeze(nextPresentationLayer);
				if (length) cachedPresentationLayer = nextPresentationLayer;
				else cachedPresentationLayer = null;
				return nextPresentationLayer;
			}
			return cachedPresentationLayer;
		}
	}
	function getModel() { // pretty values without animations
		if (cachedModelLayer !== null) return cachedModelLayer;
		const nextModelLayer = baseLayer();
		if (FASTER_RENDER_LAYER) registeredProperties.forEach( function(uglyKey) {
			const prettyValue = prettyBacking[uglyKey];
			const prettyKey = convertedKey(uglyKey,delegate.keyInput,delegate);
			Object.defineProperty(nextModelLayer, prettyKey, { // modelInstance has defined properties. Must redefine.
				value: prettyValue,
				enumerable: true,
				configurable: false
			});
		});
		else registeredProperties.forEach( function(uglyKey) {
			const source = modelBacking[uglyKey];
			const prettyValue = convertedOutputOfProperty(source, uglyKey, delegate, defaultTypes);
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
		// const nextPreviousLayer = baseLayer();//Object.assign({},layerInstance);
		// registeredProperties.forEach( function(uglyKey) {
		// 	const prettyValue = convertedOutputOfProperty(previousBacking[uglyKey], uglyKey, getOutputDelegate(uglyKey));
		// 	const prettyKey = convertedKey(uglyKey,delegate.keyInput,delegate);
		// 	Object.defineProperty(nextPreviousLayer, prettyKey, {
		// 		value: prettyValue,
		// 		enumerable: true,
		// 		configurable: false
		// 	});
		// 	previousBacking[uglyKey] = modelBacking[uglyKey]; // TODO: !!! move this out of here, should happen on value change. This should not have side effects. Won't have to if you return a cached layer!
		// });
		// Object.freeze(nextPreviousLayer);
		// return nextPreviousLayer;
	}
	function needsDisplay() { // This should be used instead of directly calling display
		// cachedPresentationLayer = null;
		// cachedRenderLayer = null;
		invalidate();
		//if (false) cachedModelLayer = null;
		//if (false) cachedPreviousLayer = null; // what about previous ?
		//if (!allAnimations.length)
		registerWithContext(); // This might not be sufficient to produce a new presentationLayer
	}
	function addAnimation(description,name) { // does not register. // should be able to pass a description if type is registered
		//if (delegate && isFunction(delegate.animationFromDescription)) description = delegate.animationFromDescription(description); // deprecate this

		const transaction = hyperContext.currentTransaction();
		getPresentation(); // cached layers are deleted at the beginning of a transaction, this ensures presentation is generated before animations added, else new animations contribute to presentation before flushing and you might get flicker. Must be presentationLayer, not renderLayer for some reason.


		const copy = animationFromDescription(description);
		if (!(copy instanceof HyperAnimation) && !(copy instanceof HyperKeyframes) && !(copy instanceof HyperGroup) && !(copy instanceof HyperChain)) throw new Error("Not a valid animation:"+JSON.stringify(copy));
		// if (FASTER_RENDER_LAYER || ADD_ANIMATION_AUTO_REGISTER) { // does register! // passes tests for no registered type or description
		// 	//if (description.property) registerAnimatableProperty(description.property,description.type);
		// 	if (description.property && description.type) registerAnimatable(description.property, description.type, true);
		// }
		//copy.convert.call(copy, delegate.input, delegate); // delta is calculated from ugly values in runAnimation
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
		const display = (!isFunction(delegate.display)) ? function() {} : function(presentation) { // layer returns calculated values during display
			if (FASTER_RENDER_LAYER) {
				activeBacking = getRender();
				delegate.display.call(delegate, presentation);
				//activeBacking = getModel();
				activeBacking = prettyBacking;
			} else {
				activeBacking = getPresentation();
				delegate.display.call(delegate, presentation);
				activeBacking = modelBacking;
			}
		};
		if (FASTER_RENDER_LAYER) hyperContext.registerTarget(layerInstance, getRender, getAnimationCount, display, invalidate, animationCleanup, true, uglyBacking);
		else hyperContext.registerTarget(layerInstance, getPresentation, getAnimationCount, display, invalidate, animationCleanup, true, modelBacking);

	}

	// Object.keys(layerInstance).forEach( function(key) { // more initialization
	// 	if (TRANSACTION_DURATION_ALONE_IS_ENOUGH) registerAnimatableProperty(key,true); // second argument true because you should animate every property if transaction has a duration. TODO: ensure this does not interfere with automatic registration when setting values
	// 	else registerAnimatableProperty(key);
	// });

	function defaultPropertyDescription(prettyKey) {
		//const prettyValue = layerInstance[prettyKey];
		const type = descriptions ? descriptions[prettyKey] : undefined;
		return type && isDuckType(type) ? { type: type } : type;
	}

	Object.keys(layerInstance).filter(isAllowablePrettyKey).forEach( function(prettyKey) { // redundancy with setValuesOfLayer (and baseLayer), maybe I could call that instead with transaction disabled
		const prettyValue = layerInstance[prettyKey];
		const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyInput,delegate) : prettyKey;
		//if (TRANSACTION_DURATION_ALONE_IS_ENOUGH && VAGUE_TYPE_SPAGHETTI_HACK) registerAnimatableProperty(uglyKey, new HyperNumber()); // automatic registration
		//else
		//if (TRANSACTION_DURATION_ALONE_IS_ENOUGH) registerAnimatableProperty(uglyKey,true); // automatic registration
		const description = defaultPropertyDescription(prettyKey) || { type: new HyperNumber() };
		registerAnimatableProperty(uglyKey, description); // automatic registration

		const uglyValue = convertedInputOfProperty(prettyValue,uglyKey,delegate,defaultTypes);

		if (FASTER_RENDER_LAYER) { // init
			//uglyBacking[uglyKey] = uglyValue;
			prettyBacking[uglyKey] = prettyValue;
		} else {
			previousBacking[uglyKey] = uglyValue;
			modelBacking[uglyKey] = uglyValue;
		}
	});
	if (descriptions) Object.keys(descriptions).filter(isAllowablePrettyKey).forEach( function(prettyKey) { // new fourth parameter to activate registers types
		const uglyKey = DELEGATE_DOUBLE_WHAMMY ? convertedKey(prettyKey,delegate.keyInput,delegate) : prettyKey;
		const description = defaultPropertyDescription(prettyKey);
		registerAnimatableProperty(uglyKey, description);
	});
	if (FASTER_RENDER_LAYER) { // init
		activeBacking = getModel(); // have to do both
		activeBacking = prettyBacking; // have to do both
	}

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
