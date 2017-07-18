import { prepareDocument } from "./element.js";
import { animationFromDescription } from "../actions.js";
import { activate } from "../core.js";

export function typeForStyle(property) {
	return usedPropertyTypes[property];// || nonNumericType;
}

let usedPropertyTypes = {};
export function registerAnimatableStyles(dict) {
	Object.assign(usedPropertyTypes,dict);
	prepareDocument(dict,HyperStyleDeclaration);
}

// export function activateElement(element,receiver = element) {
// 	//initialize(element,receiver);
// 	if (typeof window === "undefined") return;
// 	if (!element || element.style.hyperStyleInitialized) return;
// 	HyperStyle.activate(element, receiver);
// 	element.style.hyperStyleInitialized = true; // formerly _webAnimationsStyleInitialized
// }

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}


// const HyperStyle = {};

// function initialize(target, receiver) {
// 	if (typeof window === "undefined") return;
// 	if (!target || target.style.hyperStyleInitialized) return;
// 	HyperStyle.activate(target, receiver);
// 	target.style.hyperStyleInitialized = true; // formerly _webAnimationsStyleInitialized
// }

export function activateElement(element,receiver = element) {
	if (typeof window === "undefined") return;
	if (!element || element.style.hyperStyleInitialized) return;
// HyperStyle.activate = function(element, receiver) {
	///console.log("activate element:%s; receiver:%s; layer:%s; delegate:%s;",element,receiver,layer,delegate);
	const hyperStyleDelegate = {};
	
	hyperStyleDelegate.typeOfProperty = function(property,value) {
		if (delegate && isFunction(delegate.typeOfProperty)) return delegate.typeOfProperty.call(delegate,property,value); // Not very useful.
		return typeForStyle(property);
	};
	hyperStyleDelegate.input = function(property,prettyValue) {
		//console.log("_____ hyperStyleDelegate.input:%s; type:%s; pretty:%s;",property,type,JSON.stringify(prettyValue));
		if (delegate && isFunction(delegate.input)) return delegate.input.call(delegate,property,prettyValue); // Not as useful because it includes unit suffix. Also unsure about native
		const type = typeForStyle(property);
		const uglyValue = type.input(prettyValue);
		//console.log("___ hyperStyleDelegate.input:%s; type:%s; pretty:%s; ugly:%s;",property,type.toString(),JSON.stringify(prettyValue),JSON.stringify(uglyValue));
		return uglyValue;
	};
	hyperStyleDelegate.output = function(property,uglyValue) { // value is the ugly value // BUG FIXME: sometimes a string
		//console.log("_____ hyperStyleDelegate.output:%s; type:%s; ugly:%s;",property,type,JSON.stringify(uglyValue));
		if (delegate && isFunction(delegate.output)) {
			return delegate.output.call(delegate,property,uglyValue);
		}
		const type = typeForStyle(property);
		let result;
		if (uglyValue === null || typeof uglyValue === "undefined") result = type.zero();
		else result = type.output(uglyValue);
		//console.log("___ hyperStyleDelegate.output:%s; type:%s; ugly:%s; pretty:%s;",property,type.toString(),JSON.stringify(uglyValue),JSON.stringify(result));
		return result;
	};
	hyperStyleDelegate.animationForKey = function(key,uglyValue,uglyPrevious,target) { // sometimesUglySometimesPrettyPrevious // prettyPrevious needs to be uglyPrevious. This is a Pyon problem
		const propertyType = typeForStyle(key);
		if (uglyPrevious === null || typeof uglyPrevious === "undefined") {
			uglyPrevious = uglyValue;
		}
		const prettyValue = propertyType.output(uglyValue);
		let prettyPrevious = propertyType.output(uglyPrevious);
		if (prettyPrevious === null || typeof prettyPrevious === "undefined") prettyPrevious = prettyValue;
		let description; // initially undefined
		if (delegate && isFunction(delegate.animationForKey)) description = delegate.animationForKey(key,prettyValue,prettyPrevious,element);
		//console.log("~~~~~~ HyperStyleDelegate.animationForKey:%s; uglyV:%s; uglyP:%s; prettyV:%s; prettyP:%s; result:%s;",key,JSON.stringify(uglyValue),JSON.stringify(uglyPrevious),prettyValue,prettyPrevious,JSON.stringify(description));
		const animation = animationFromDescription(description);
		if (animation && typeof animation.property === "undefined") animation.property = key;
		return animation;
	};
	hyperStyleDelegate.animationFromDescription = function(description) { // deprecate this because delegate.typeOfProperty is enough?
		const animation = animationFromDescription(description);
		if (animation.property) animation.type = typeForStyle(animation.property);
		return animation;
	};
	hyperStyleDelegate.display = function() {
		const presentation = receiver.presentation; // TODO: this should be provided
		const presentationKeys = Object.keys(presentation);
		presentationKeys.forEach( function(key) {
			const value = presentation[key];
			style[key] = value; // HyperStyleDeclaration is meant to be mutated.
		});
		
		const previousKeys = Object.keys(previousLayer);
		previousKeys.forEach( function(key) { // Must nullify properties that are no longer animated, if not on presentation.
			if (presentationKeys.indexOf(key) === -1) { // FIXME: Sort & walk keys? Not too bad if animating few properties.
				style[key] = "";
			}
		});
		//console.log("Hyperact style display presentation:%s;",JSON.stringify(presentation));
		previousLayer = presentation;
	};

	const style = element.style;
	const delegate = null;

	let layer = {};
	for (let property in usedPropertyTypes) {
		const prettyValue = element.style[property];
		const uglyValue = hyperStyleDelegate.input(property, prettyValue);
		layer[property] = uglyValue;
	}
	const hyperStyleDeclaration = new HyperStyleDeclaration(layer, receiver);
	let previousLayer = {};

	activate(receiver, hyperStyleDelegate, layer);

	try {
		Object.defineProperty(element, "style", {
			get: function() {
				return hyperStyleDeclaration;
			},
			configurable: true,
			enumerable: true
		});
	} catch (error) {
//			patchInlineStyleForAnimation(target.style);
		console.warn("not animatable by any craft known to Pyon");
	}
	element.style.hyperStyleInitialized = true; // formerly _webAnimationsStyleInitialized
}



export const HyperStyleDeclaration = function(layer, controller) {

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
