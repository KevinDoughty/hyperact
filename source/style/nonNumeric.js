// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

import { isDefined } from "./shared.js";

const nonNumericType = {
	toString: function() {
		return "nonNumericType";
	},
	toJSON: function() {
		return this.toString();
	},
	zero: function() {
		return "";
	},
	inverse: function(value) {
		return value;
	},
	add: function(base, delta) {
		return isDefined(delta) ? delta : base;
	},
	subtract: function(base,delta) { // same as add? or return base?
		return base; // Sure why not
		//return this.add(base,this.inverse(delta));
	},
	interpolate: function(from, to, f) {
		return f < 0.5 ? from : to;
	},
	toCssValue: function(value) {
		return value;
	},
	fromCssValue: function(value) {
		return value;
	}
};
export default nonNumericType;