// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

import { positionType } from "./position.js";
import { isDefinedAndNotNull } from "./shared.js";

// Spec: http://dev.w3.org/csswg/css-backgrounds/#background-position
export const positionListType = {
	toString: function() {
		return "positionListType";
	},
	toJSON: function() {
		return this.toString();
	},
	inverse: function(base) { // KxDx
		var out = [];
		var maxLength = base.length;
		for (var i = 0; i < maxLength; i++) {
			var basePosition = base[i] ? base[i] : positionType.zero();
			out.push(positionType.inverse(basePosition));
		}
		return out;
	},
	zero: function() { return [positionType.zero()]; },
	add: function(base, delta) {
		var out = [];
		var maxLength = Math.max(base.length, delta.length);
		for (var i = 0; i < maxLength; i++) {
			var basePosition = base[i] ? base[i] : positionType.zero();
			var deltaPosition = delta[i] ? delta[i] : positionType.zero();
			out.push(positionType.add(basePosition, deltaPosition));
		}
		return out;
	},
	subtract: function(base,delta) { // KxDx
		return this.add(base,this.inverse(delta));
	},
	interpolate: function(from, to, f) {
		var out = [];
		var maxLength = Math.max(from.length, to.length);
		for (var i = 0; i < maxLength; i++) {
			var fromPosition = from[i] ? from[i] : positionType.zero();
			var toPosition = to[i] ? to[i] : positionType.zero();
			out.push(positionType.interpolate(fromPosition, toPosition, f));
		}
		return out;
	},
	output: function(value) {
		return value.map(positionType.output).join(", ");
	},
	input: function(value) {
		if (!isDefinedAndNotNull(value)) {
			return undefined;
		}
		if (!value.trim()) {
			return [positionType.input("0% 0%")];
		}
		var positionValues = value.split(",");
		var out = positionValues.map(positionType.input);
		return out.every(isDefinedAndNotNull) ? out : undefined;
	}
};