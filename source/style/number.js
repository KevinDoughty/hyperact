// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

import { interp, createObject } from "./shared.js";
import { nonNumericType } from "./nonNumeric.js";

export const numberType = {
	toString: function() {
		return "numberType";
	},
	toJSON: function() {
		return this.toString();
	},
	inverse: function(base) {
		if (base === "auto") {
			return nonNumericType.inverse(base);
		}
		var negative = base * -1;
		return negative;
	},
	zero: function() {
		return 0;
	},
	add: function(base, delta) {
		if (Number(base) !== base && Number(delta) !== delta) return 0;
		else if (Number(base) !== base) base = 0;
		else if (Number(delta) !== delta) delta = 0;
		// If base or delta are "auto", we fall back to replacement.
		if (base === "auto" || delta === "auto") {
			return nonNumericType.add(base, delta);
		}
		var result = base + delta;
		return result;
	},
	subtract: function(base,delta) { // KxDx
		//var inverse = this.inverse(delta);
		if (Number(base) !== base && Number(delta) !== delta) return 0;
		else if (Number(base) !== base) base = 0;
		else if (Number(delta) !== delta) delta = 0;
		return this.add(base,this.inverse(delta));
	},
	interpolate: function(from, to, f) {
		// If from or to are "auto", we fall back to step interpolation.
		if (from === "auto" || to === "auto") {
			return nonNumericType.interpolate(from, to);
		}
		return interp(from, to, f);
	},
	//output: function(value) { return value + ""; }, // original
	output: function(value) { return value; }, // no strings damn it. Unknown side effects
	input: function(value) {
		if (value === "auto") {
			return "auto";
		}
		var result = Number(value);
		return isNaN(result) ? undefined : result;
	}
};

export const integerType = createObject(numberType, {
	interpolate: function(from, to, f) {
		// If from or to are "auto", we fall back to step interpolation.
		if (from === "auto" || to === "auto") {
			return nonNumericType.interpolate(from, to);
		}
		return Math.floor(interp(from, to, f));
	}
});

export const opacityType = createObject(numberType, {
	zero: function() {
		return 0.0; // zero is definitely zero, I need to expose initialValue from propertyValueAliases
	},
	unspecified: function(value) { // This fixed fading in opacity but broke fading out, and I did not investigate further
		return 1.0;
		//return propertyValueAliases["opacity"].initial;
	}
});
