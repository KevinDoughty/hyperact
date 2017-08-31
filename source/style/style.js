import { prepareDocument } from "./element.js";
//import { animationFromDescription } from "../actions.js";
import { activate } from "../core.js";

export function typeForStyle(property) {
	return usedPropertyTypes[property];// || nonNumericType;
}

let usedPropertyTypes = {};
export function registerAnimatableStyles(dict) {
	Object.assign(usedPropertyTypes,dict);
	prepareDocument(dict,HyperStyleDeclaration);
}

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

export function activateElement(element, controller, delegate) { // compare to activate(controller, delegate, layerInstance)
	if (typeof window === "undefined") return;
	if ((typeof delegate === "undefined" || delegate === null) && (typeof controller === "undefined" || controller === null)) controller = element;
	else if ((typeof delegate === "undefined" || delegate === null) && (typeof controller !== "undefined" && controller !== null) && controller !== element) delegate = controller;
	else if (typeof controller === "undefined" || controller === null) controller = element; // should really be the HyperStyleDeclaration, not the element itself.

	const hyperStyleDelegate = {};

	let target = null; // allows calling activateElement with undefined element to be set later
	let original = (element ? element.style : null);

	hyperStyleDelegate.typeOfProperty = function(property) {
		if (delegate && isFunction(delegate.typeOfProperty)) return delegate.typeOfProperty.call(delegate,property); // Not very useful.
		return typeForStyle(property);
	};
	hyperStyleDelegate.input = function(property,prettyValue) {
		if (delegate && isFunction(delegate.input)) return delegate.input.call(delegate,property,prettyValue); // Not as useful because it includes unit suffix. Also unsure about native
		const type = typeForStyle(property);
		const uglyValue = type ? type.input(prettyValue) : prettyValue; // allow registering properties with no declared type
		return uglyValue;
	};
	hyperStyleDelegate.output = function(property,uglyValue) { // value is the ugly value // BUG FIXME: sometimes a string
		if (delegate && isFunction(delegate.output)) return delegate.output.call(delegate,property,uglyValue);
		const type = typeForStyle(property);
		let result;
		if (uglyValue === null || typeof uglyValue === "undefined") result = type.zero();
		else result = type ? type.output(uglyValue) : uglyValue; // allow registering properties with no declared type
		return result;
	};
	hyperStyleDelegate.animationForKey = function(key,prettyValue,prettyPrevious,prettyPresentation) { // sometimesUglySometimesPrettyPrevious // prettyPrevious needs to be uglyPrevious. This is a Pyon problem
		if (prettyPrevious === null || typeof prettyPrevious === "undefined") prettyPrevious = prettyValue;
		let description; // initially undefined
		if (delegate && isFunction(delegate.animationForKey)) description = delegate.animationForKey(key,prettyValue,prettyPrevious,prettyPresentation,target);
		else if (delegate && isFunction(delegate)) description = delegate(key,prettyValue,prettyPrevious,prettyPresentation,target);
		return description;
// 		const animation = animationFromDescription(description);
// 		if (animation && typeof animation.property === "undefined") animation.property = key;
// 		return animation;
	};
// 	hyperStyleDelegate.animationFromDescription = function(description) { // deprecate this because delegate.typeOfProperty is enough?
// 		const animation = animationFromDescription(description);
// 		if (animation.property) animation.type = typeForStyle(animation.property); // TODO: or discrete type if undefined
// 		return animation;
// 	};
	hyperStyleDelegate.display = function() {
		const presentation = controller.presentation; // TODO: this should be provided
		const presentationKeys = Object.keys(presentation);
		presentationKeys.forEach( function(key) {
			const value = presentation[key];
			original[key] = value; // HyperStyleDeclaration is meant to be mutated.
		});
		const previousKeys = Object.keys(previousLayer);
		previousKeys.forEach( function(key) { // Must nullify properties that are no longer animated, if not on presentation.
			if (presentationKeys.indexOf(key) === -1) { // FIXME: Sort & walk keys? Not too bad if animating few properties.
				original[key] = "";
			}
		});
		previousLayer = presentation;
	};

	let layer = {};
	const hyperStyleDeclaration = new HyperStyleDeclaration(layer, controller);
	let previousLayer = {};
	activate(controller, hyperStyleDelegate, layer); // controller can be undefined only if element is not

	function setElement(what) {
		if (target) return; // you can only assign element once, either as argument or with this function
		target = what;
		original = target.style;
		console.log("SET ELEMENT ORIGINAL STYLE:",original);
		console.log("Layer zero:",JSON.stringify(layer));
		Object.keys(original).forEach( key => {
			if (typeof original[key] !== "undefined" && original[key] !== null && original[key].length !== 0) { // most properties on original style object should be an empty string
				layer[key] = original[key];
			}
		});
		console.log("Layer one:",JSON.stringify(layer));
		for (let property in usedPropertyTypes) {
			const prettyValue = original[property];
			const uglyValue = hyperStyleDelegate.input(property, prettyValue);
			console.log("prop:%s; pretty:%s; ugly:%s;",property,prettyValue,uglyValue);
			layer[property] = uglyValue;
			controller.registerAnimatableProperty(property,true);
		}
		console.log("Layer two:",JSON.stringify(layer));
		console.log("Layer three:",layer);
		try {
			Object.defineProperty(target, "style", {
				get: function() {
					return hyperStyleDeclaration;
				},
				configurable: true,
				enumerable: true
			});
		} catch(error) {
			//patchInlineStyleForAnimation(target.style);
			console.warn("not animatable by any craft known to Pyon");
		}
		target.style.hyperStyleInitialized = true;
	}

	if (element) setElement(element);
	return setElement;
}



export const HyperStyleDeclaration = function(layer, controller) {
	this.hyperStyleLength = 0;
	Object.defineProperty(this, "hyperStyleLayer", { // these will collide with css
		get: function() {
			return layer;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "hyperStyleController", { // these will collide with css
		get: function() {
			return controller;
		},
		enumerable: false,
		configurable: false
	});
};

HyperStyleDeclaration.prototype = {
	constructor: HyperStyleDeclaration
};
