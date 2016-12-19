// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var SVG_NS = 'http://www.w3.org/2000/svg';

export function typeWithKeywords(keywords, type) {
	//console.log("HyperStyle typeWithKeywords:%s; type:%s;",keywords,type);
	var isKeyword;
	if (keywords.length === 1) {
		var keyword = keywords[0];
		isKeyword = function(value) {
			return value === keyword;
		};
	} else {
		isKeyword = function(value) {
			return keywords.indexOf(value) >= 0;
		};
	}
	return createObject(type, {
		add: function(base, delta) {
			if (isKeyword(base) || isKeyword(delta)) {
				return delta;
			}
			return type.add(base, delta);
		},
		subtract: function(base, delta) {
			if (isKeyword(base) || isKeyword(delta)) {
				return base;
			}
			return type.subtract(base, delta);
		},
		zero: function(value) {
			return ""; // should be "none" if possible
		},
		interpolate: function(from, to, f) {
			if (isKeyword(from) || isKeyword(to)) {
				return nonNumericType.interpolate(from, to, f);
			}
			return type.interpolate(from, to, f);
		},
		toCssValue: function(value, svgMode) {
			return isKeyword(value) ? value : type.toCssValue(value, svgMode);
		},
		fromCssValue: function(value) {
			return isKeyword(value) ? value : type.fromCssValue(value);
		}
	});
};

export function createObject(proto, obj) {
	if (proto === null || typeof proto === "undefined") throw new Error("HyperStyle createObject no proto damn it");
	//console.log("createObject proto:%s; object:%s;",proto,obj);
	var newObject = Object.create(proto);
	Object.getOwnPropertyNames(obj).forEach(function(name) {
		Object.defineProperty( newObject, name, Object.getOwnPropertyDescriptor(obj, name));
	});
	return newObject;
};

export function clamp(x, min, max) {
	return Math.max(Math.min(x, max), min);
};

export function interp(from, to, f, type) {
	if (Array.isArray(from) || Array.isArray(to)) {
		return interpArray(from, to, f, type);
	}
	var zero = type === 'scale' ? 1.0 : 0.0;
	to = isDefinedAndNotNull(to) ? to : zero;
	from = isDefinedAndNotNull(from) ? from : zero;
	return to * f + from * (1 - f);
};

export function interpArray(from, to, f, type) {
// 	ASSERT_ENABLED && assert(Array.isArray(from) || from === null, 'From is not an array or null');
// 	ASSERT_ENABLED && assert( Array.isArray(to) || to === null, 'To is not an array or null');
// 	ASSERT_ENABLED && assert( from === null || to === null || from.length === to.length, 'Arrays differ in length ' + from + ' : ' + to);
	var length = from ? from.length : to.length;
	var result = [];
	for (var i = 0; i < length; i++) {
		result[i] = interp(from ? from[i] : null, to ? to[i] : null, f, type);
	}
	return result;
};

export function isDefinedAndNotNull(val) {
	return isDefined(val) && (val !== null);
};

export function isDefined(val) {
	return typeof val !== 'undefined';
};

export function detectFeatures() {
	if (typeof document === "undefined") return {
		calcFunction: "calc",
		transformProperty: "transform"
	};
	var el = createDummyElement();
	el.style.cssText = 'width: calc(0px);' + 'width: -webkit-calc(0px);';
	var calcFunction = el.style.width.split('(')[0];
	var transformCandidates = [
		'transform',
		'webkitTransform',
		'msTransform'
	];
	var transformProperty = transformCandidates.filter(function(property) {
		return property in el.style;
	})[0];
	return {
		calcFunction: calcFunction,
		transformProperty: transformProperty
	};
}

function createDummyElement() {
	return document.documentElement.namespaceURI == SVG_NS ? document.createElementNS(SVG_NS, 'g') : document.createElement('div');
}