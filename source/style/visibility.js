// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

import { createObject } from "./shared.js";
import { nonNumericType } from "./nonNumeric.js";

export const visibilityType = createObject(nonNumericType, {
	toString: function() {
		return "visibilityType";
	},
	toJSON: function() {
		return this.toString();
	},
	zero: function() {
		return "hidden"; // Sure, why not.
	},
	unspecified: function() {
		return "visible";
	},
	add: function(a,b) {
		if (a !== "visible" && b !== "visible") {
			return nonNumericType.add(a,b);
		}
		return "visible";
	},
	subtract: function(a,b) {
		if (b === "visible" && a === "visible") return "hidden";
		return a;
	},
	interpolate: function(from, to, f) {
		if (from !== "visible" && to !== "visible") {
			return nonNumericType.interpolate(from, to, f);
		}
		if (f <= 0) {
			return from;
		}
		if (f >= 1) {
			return to;
		}
		return "visible";
	},
	input: function(value) {
		if (["visible", "hidden", "collapse"].indexOf(value) !== -1) {
			return value;
		}
		return undefined;
	}
});