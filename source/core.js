import { HyperContext } from "./context.js";
import { HyperAnimation, HyperGroup, HyperChain, animationFromDescription } from "./actions.js";

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

function prepAnimationObjectFromAddAnimation(animation, delegate) {
	if (animation instanceof HyperAnimation) {
		if (delegate.typeForProperty && animation.property) {
			const type = delegate.typeForProperty.call(delegate, animation.property, animation.to);
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
function convertPropertiesOfAnimationWithFunction(properties,animation,funky,self) { // mutates // animation from, to, and delta
	// ["from","to","delta"],animation,delegate.input
	if (animation && isFunction(funky)) {
		if (animation instanceof HyperAnimation) {
			properties.forEach( function(item) { // HyperAnimation
				const value = animation[item];
				if (animation.property && value !== null && typeof value !== "undefined") animation[item] = funky.call(self,animation.property, value); // intentionally allows animations with an undefined property
			});
		} else if (animation instanceof HyperGroup) { // recursive
			animation.group.forEach( function(childAnimation) {
				convertPropertiesOfAnimationWithFunction(properties,childAnimation,funky,self);
			});
		} else if (animation instanceof HyperChain) { // recursive
			animation.chain.forEach( function(childAnimation) {
				convertPropertiesOfAnimationWithFunction(properties,childAnimation,funky,self);
			});
		}
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



export function decorate(controller, delegate, layerInstance) { // deprecated
	return activate(controller, delegate, layerInstance);
}



export function activate(controller, delegate, layerInstance) {
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
				cleanupAnimationAtIndex(childAnimation, -1);
			});
		} else if (animation instanceof HyperChain) { // recursive
			animation.chain.forEach( function(childAnimation) {
				cleanupAnimationAtIndex(childAnimation, -1);
			});
		} else if (!(animation instanceof HyperAnimation)) throw new Error("not an animation");
		if (animation.finished) {
			cleanupAndRemoveAnimationAtIndex(animation,index);
			if (isFunction(animation.onend)) finishedWithCallback.push(animation);
		}
	}

	function animationCleanup() { // animations contained within groups ignore remove (removedOnCompletion) and do not fire onend
		let i = allAnimations.length;
		const finishedWithCallback = [];
		while (i--) {
			const animation = allAnimations[i];
			cleanupAnimationAtIndex(animation,i,finishedWithCallback);
		}
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(controller);
			}
		}
		finishedWithCallback.forEach( function(animation) {
			animation.onend.call(animation,true);
			animation.onend = null; // fill modes might otherwise cause onend to get called again. Can't freeze animation object.
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
		if (!(copy instanceof HyperAnimation) && !(copy instanceof HyperGroup) && !(copy instanceof HyperChain)) throw new Error("Animations must be an Animation, Group, or Chain subclass:"+JSON.stringify(copy));
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
