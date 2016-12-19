// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

import lengthType from "./length.js";

var rectangleRE = /rect\(([^,]+),([^,]+),([^,]+),([^)]+)\)/;

const rectangleType = {

	toString: function() {
		return "rectangleType";
	},
	toJSON: function() {
		return this.toString();
	},
	inverse: function(value) { // KxDx
		return {
			top: lengthType.inverse(value.top),
			right: lengthType.inverse(value.right),
			bottom: lengthType.inverse(value.bottom),
			left: lengthType.inverse(value.left)
		}
	},
	zero: function() { return {top:0, right:0, bottom:0, left:0};},// KxDx
	add: function(base, delta) {
		return {
			top: lengthType.add(base.top, delta.top),
			right: lengthType.add(base.right, delta.right),
			bottom: lengthType.add(base.bottom, delta.bottom),
			left: lengthType.add(base.left, delta.left)
		};
	},
	subtract: function(base,delta) { // KxDx
		return this.add(base,this.inverse(delta));
	},
	interpolate: function(from, to, f) {
		return {
			top: lengthType.interpolate(from.top, to.top, f),
			right: lengthType.interpolate(from.right, to.right, f),
			bottom: lengthType.interpolate(from.bottom, to.bottom, f),
			left: lengthType.interpolate(from.left, to.left, f)
		};
	},
	toCssValue: function(value) {
		return 'rect(' +
				lengthType.toCssValue(value.top) + ',' +
				lengthType.toCssValue(value.right) + ',' +
				lengthType.toCssValue(value.bottom) + ',' +
				lengthType.toCssValue(value.left) + ')';
	},
	fromCssValue: function(value) {
		var match = rectangleRE.exec(value);
		if (!match) {
			return undefined;
		}
		var out = {
			top: lengthType.fromCssValue(match[1]),
			right: lengthType.fromCssValue(match[2]),
			bottom: lengthType.fromCssValue(match[3]),
			left: lengthType.fromCssValue(match[4])
		};
		if (out.top && out.right && out.bottom && out.left) {
			return out;
		}
		return undefined;
	}
};
export default rectangleType;