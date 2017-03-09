//import { typeWithKeywords } from "./shared.js";

// import { transformType } from "./transform.js";
// import { colorType } from "./color.js";
import { nonNumericType } from "./nonNumeric.js";
// import { integerType, opacityType } from "./number.js";
// import { lengthType, lengthAutoType } from "./length.js";
// //import { positionType } from "./position.js";
// import { positionListType } from "./positionList.js";
// import { rectangleType } from "./rectangle.js";
// import { shadowType } from "./shadow.js";
// import { fontWeightType } from "./fontWeight.js";
// import { visibilityType } from "./visibility.js";

import { prepareDocument } from "./element.js";
import { animationFromDescription } from "../actions.js";
import { activate } from "../core.js";

export function typeForStyle(property) {
	return usedPropertyTypes[property] || nonNumericType;
}

let usedPropertyTypes = {};
export function registerAnimatableStyles(dict) {
	Object.assign(usedPropertyTypes,dict);
	prepareDocument(dict,HyperStyleDeclaration);
}
// export function registerAllStyles() {
// 	registerAnimatableStyles(propertyTypes);
// }
export function activateElement(element,receiver = element) {
	initialize(element,receiver);
}

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}
// function isNumber(w) {
// 	return !isNaN(parseFloat(w)) && isFinite(w); // I want infinity for repeat count. Probably not duration
// }
// const typeForStyle = function(property) {
// 	return propertyTypes[property] || nonNumericType;
// };


const HyperStyle = {};

// HyperStyle.addAnimation = function(element, animation, named) { // TODO: needs delegate and initialize
// 	if (typeof window === "undefined") return;
// 	if (typeof element === "undefined" || element === null) return;
// 	initialize(element);
// 	animation = animationFromDescription(animation);
// 	if (animation) {
// 		var property = animation.property;
// 		if (property) {
// 			var type = typeForStyle(property);
// 			if (isFunction(type)) type = new type();
// 			animation.type = type;
// 			if (typeof animation.from === "undefined" || animation.from === null) animation.from = type.zero();
// 			else animation.from = type.input(animation.from);
// 			if (typeof animation.to === "undefined" || animation.to === null) animation.to = type.zero();
// 			else animation.to = type.input(animation.to);
// 			//element.style._controller.registerAnimatableProperty(key);
// 			element.style.addAnimation(animation, named);
// 		}
// 	}
// };
// HyperStyle.setDelegateOfElement = function(delegate,element,oldStyle) {
// 	return HyperStyle.setDelegate(element,delegate,oldStyle);
// };
// HyperStyle.setDelegate = function(element, delegate, oldStyle) { // setDelegateOfElement
// 	if (typeof window === "undefined") return;
// 	var animatedStyle = initialize(element, delegate, oldStyle); // PyonReact
// 	if (!element) return animatedStyle; // PyonReact
// };

function initialize(target, receiver) {
	if (typeof window === "undefined") return;
	if (!target || target.style.hyperStyleInitialized) return; // PyonReact
	//HyperStyle.activate(target, delegate, null, delegate); // (element, receiver, layer, delegate)
	HyperStyle.activate(target, receiver);
	target.style.hyperStyleInitialized = true; // PyonReact // formerly _webAnimationsStyleInitialized
}


// HyperStyle.composite = function(sourceLayer, sourceAnimations, time) { // expensive access converts to and from css and internal values
// 	if (time === null || typeof time === "undefined") time = 0;
// 	var copyLayer = Object.assign({},sourceLayer);
// 	if (Array.isArray(sourceAnimations)) {
// 		var resultAnimations = [];
// 		sourceAnimations.forEach( function(description) {
// 			var animation = animationFromDescription(description);
// 			var property = animation.property;
// 			var type = typeForStyle(animation.property);
// 			animation.type = type;
// 			copyLayer[property] = type.input(sourceLayer[property]);
// 			if (animation.startTime === null || typeof animation.startTime === "undefined") animation.startTime = time;
// 			if (animation.from === null || typeof animation.from === "undefined") animation.from = animation.type.zero();
// 			else animation.from = type.input(animation.from);
// 			if (animation.to === null || typeof animation.to === "undefined") animation.to = animation.type.zero();
// 			else animation.to = animation.type.input(animation.to);
// 			if (animation.blend !== "absolute") animation.delta = animation.type.subtract(animation.from,animation.to);
// 			resultAnimations.push(animation);
// 		});
// 		var result = composite(copyLayer, resultAnimations, time);
// 		sourceAnimations.forEach( function(animation) {
// 			var property = animation.property;
// 			var type = typeForStyle(property);
// 			copyLayer[property] = type.output(result[property]);
// 		});
// 	} else if (sourceAnimations) {
// 		var resultAnimations = {};
// 		Object.keys(sourceAnimations).forEach( function(key) {
// 			var animation = animationFromDescription(sourceAnimations[key]);
// 			var property = animation.property;
// 			var type = typeForStyle(animation.property);
// 			animation.type = type;
// 			copyLayer[property] = type.input(sourceLayer[property]);
// 			if (animation.startTime === null || typeof animation.startTime === "undefined") animation.startTime = time;
// 			if (animation.from === null || typeof animation.from === "undefined") animation.from = animation.type.zero();
// 			else animation.from = animation.type.input(animation.from);
// 			if (animation.to === null || typeof animation.to === "undefined") animation.to = animation.type.zero();
// 			else animation.to = animation.type.input(animation.to);
// 			if (animation.blend !== "absolute") animation.delta = animation.type.subtract(animation.from,animation.to);
// 			resultAnimations[key] = animation;
// 		});
// 		var result = composite(copyLayer, resultAnimations, time);
// 		Object.keys(sourceAnimations).forEach( function(key) {
// 			var animation = sourceAnimations[key];
// 			var property = animation.property;
// 			var type = typeForStyle(property);
// 			copyLayer[property] = type.output(result[property]);
// 		});
// 	}
// 	return copyLayer;
// }


HyperStyle.activate = function(element, receiver) {
	///console.log("activate element:%s; receiver:%s; layer:%s; delegate:%s;",element,receiver,layer,delegate);
	
	var hyperStyleDelegate = {};
	
	hyperStyleDelegate.typeOfProperty = function(property,value) {
		if (delegate && isFunction(delegate.typeOfProperty)) return delegate.typeOfProperty.call(delegate,property,value); // Not very useful.
		return typeForStyle(property);
	};
	hyperStyleDelegate.input = function(property,prettyValue) {
		if (delegate && isFunction(delegate.input)) return delegate.input.call(delegate,property,prettyValue); // Not as useful because it includes unit suffix. Also unsure about native
		var type = typeForStyle(property);
		const uglyValue = type.input(prettyValue);
		//console.log("___ hyperStyleDelegate.input:%s; type:%s; pretty:%s; ugly:%s;",property,type.toString(),JSON.stringify(prettyValue),JSON.stringify(uglyValue));
		//throw new Error("I have no idea why this is backwards");
		return uglyValue;
	};
	hyperStyleDelegate.output = function(property,uglyValue) { // value is the ugly value // BUG FIXME: sometimes a string
		if (delegate && isFunction(delegate.output)) {
			//var result = delegate.output.call(delegate,property,uglyValue); // Not as useful because it includes unit suffix. Also unsure about native
			//console.log("_one_hyperStyleDelegate.output:%s; VALUE:%s; result:%s;",property,JSON.stringify(uglyValue),result);
			return delegate.output.call(delegate,property,uglyValue);
		}
		var type = typeForStyle(property);
		let result;
		if (uglyValue === null || typeof uglyValue === "undefined") result = type.zero();
		else result = type.output(uglyValue);
		if (typeof uglyValue === "string") {
		//if (uglyValue === null || typeof uglyValue === "undefined" || result.substring(0,4) === "calc") {
			//console.log("? STRING ? toCss result:%s; uglyValue:%s;",JSON.stringify(result),JSON.stringify(uglyValue));
		}
		//console.log("___ hyperStyleDelegate.output:%s; type:%s; ugly:%s; pretty:%s;",property,type.toString(),JSON.stringify(uglyValue),result);
		//throw new Error("I have no idea why this is backwards");
		return result;
	};
	hyperStyleDelegate.animationForKey = function(key,uglyValue,uglyPrevious,target) { // sometimesUglySometimesPrettyPrevious // prettyPrevious needs to be uglyPrevious. This is a Pyon problem
		var propertyType = typeForStyle(key);
		if (uglyValue === null || typeof uglyValue === "undefined") {
			///console.log("~~~~~~ HyperStyle hyperStyleDelegate key:%s; value:%s; prev:%s;",key,JSON.stringify(uglyValue),JSON.stringify(uglyPrevious));
			//throw new Error("~~~~~~ HyperStyle hyperStyleDelegate animationForKey uglyValue null or undefined");
		}
		if (uglyPrevious === null || typeof uglyPrevious === "undefined") {
			//console.log("####### HyperStyle hyperStyleDelegate uglyPrevious fuct");
			uglyPrevious = uglyValue;
		}
		//if (!features) features = detectFeatures(); // Duplicate
		if (typeof uglyPrevious === "string") {
			///console.log("~~~~~~ HyperStyleDelegate.animationForKey:%s; uglyV:%s; uglyP:%s;",key,JSON.stringify(uglyValue),JSON.stringify(uglyPrevious));
			//throw new Error("? ? ? ? ? ? ? ? ? string:"+JSON.stringify(uglyPrevious)+";"); // this is not an error
		}
		var prettyValue = propertyType.output(uglyValue);
		var prettyPrevious = propertyType.output(uglyPrevious);
		if (prettyPrevious === null || typeof prettyPrevious === "undefined") prettyPrevious = prettyValue;
		
		//console.log("~~~~~~ HyperStyleDelegate.animationForKey:%s; uglyV:%s; uglyP:%s; prettyV:%s; prettyP:%s; function:%s;",key,JSON.stringify(uglyValue),JSON.stringify(uglyPrevious),prettyValue,prettyPrevious,isFunction(delegate.animationForKey));
		var description; // initially undefined
		if (delegate && isFunction(delegate.animationForKey)) description = delegate.animationForKey(key,prettyValue,prettyPrevious,element);
		//console.log("~~~~~~ HyperStyleDelegate.animationForKey:%s; uglyV:%s; uglyP:%s; prettyV:%s; prettyP:%s; result:%s;",key,JSON.stringify(uglyValue),JSON.stringify(uglyPrevious),prettyValue,prettyPrevious,JSON.stringify(description));
		var animation = animationFromDescription(description);
		if (animation && typeof animation.property === "undefined") animation.property = key;
		return animation;
	};
	hyperStyleDelegate.animationFromDescription = function(description) { // deprecate this because delegate.typeOfProperty is enough?
		var animation = animationFromDescription(description);
		if (animation.property) animation.type = typeForStyle(animation.property);
		return animation;
	};
	hyperStyleDelegate.display = function() {
		//var presentation = layer;
		var presentation = receiver.presentation; // TODO: this should be provided
		var presentationKeys = Object.keys(presentation);
		presentationKeys.forEach( function(key) {
			var value = presentation[key];
			style[key] = value; // HyperStyleDeclaration is meant to be mutated.
		});
		
		var previousKeys = Object.keys(previousLayer);
		previousKeys.forEach( function(key) { // Must nullify properties that are no longer animated, if not on presentation.
			if (presentationKeys.indexOf(key) === -1) { // FIXME: Sort & walk keys? Not too bad if animating few properties.
				style[key] = "";
			}
		});
		//console.log("style.js display presentation:%s;",JSON.stringify(presentation));
		previousLayer = presentation;
	};
	
	var style = element.style;
	const delegate = null;

	
	//if (receiver === null || typeof receiver === "undefined") receiver = this;
	//if (layer === null || typeof layer === "undefined") layer = this;

	let layer = {};
	for (let property in usedPropertyTypes) {
		const prettyValue = element.style[property];
		//const uglyValue = hyperStyleDelegate.input(property, prettyValue);
		layer[property] = prettyValue;
	}
	var hyperStyleDeclaration = new HyperStyleDeclaration(layer, receiver);
	var previousLayer = {};
	///console.log("initial layer:%s;",JSON.stringify(layer));
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
		///console.warn("not animatable by any craft known to Pyon");
	}


	//hyperStyleDelegate.display();

};



//	var HyperStyleDeclaration = function(element, layer, controller) {
export const HyperStyleDeclaration = function(layer, controller) {

	Object.defineProperty(this, "hyperStyleLayer", { // these will collide with css
		get: function() {
			return layer;
		},
//			 set: function(value) {
//				 _layer = value;
//			 },
		enumerable: false,
		configurable: false
	});

	Object.defineProperty(this, "hyperStyleController", { // these will collide with css
		get: function() {
			return controller;
		},
//			 set: function(value) {
//				 _controller = value;
//			 },
		enumerable: false,
		configurable: false
	});
};




HyperStyleDeclaration.prototype = {
	constructor: HyperStyleDeclaration
};





////export HyperStyleDeclaration; // (layer, controller)
// export const typeOfProperty = function(property,value) {
// 	return getCssOnlyType(property,value);
// }
// export const activateStyleAnimation = HyperStyle.activate; // (element, receiver, layer, delegate)
// export const addAnimation = HyperStyle.addAnimation; // (element, animation, named)
// export const setDelegateOfElement = HyperStyle.setDelegateOfElement; // (delegate,element,oldStyle)
// export const setDelegate = HyperStyle.setDelegate; // (element, delegate, oldStyle)
// export const compositeStyleAnimation = HyperStyle.composite; // (sourceLayer, sourceAnimations, time)