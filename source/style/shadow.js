// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

import { isDefined } from "./shared.js";
import { colorType } from "./color.js";
import { lengthType } from "./length.js";
import { nonNumericType } from "./nonNumeric.js";

export const shadowType = {
	toString: function() {
		return "shadowType";
	},
	toJSON: function() {
		return this.toString();
	},
	inverse: function(value) {
		return nonNumericType.inverse(value);
	},
	zero: function() {
		return {
			hOffset: lengthType.zero(),
			vOffset: lengthType.zero()
		};
	},
	_addSingle: function(base, delta) {
		if (base && delta && base.inset !== delta.inset) {
			return delta;
		}
		var result = {
			inset: base ? base.inset : delta.inset,
			hOffset: lengthType.add(
					base ? base.hOffset : lengthType.zero(),
					delta ? delta.hOffset : lengthType.zero()),
			vOffset: lengthType.add(
					base ? base.vOffset : lengthType.zero(),
					delta ? delta.vOffset : lengthType.zero()),
			blur: lengthType.add(
					base && base.blur || lengthType.zero(),
					delta && delta.blur || lengthType.zero())
		};
		if (base && base.spread || delta && delta.spread) {
			result.spread = lengthType.add(
					base && base.spread || lengthType.zero(),
					delta && delta.spread || lengthType.zero());
		}
		if (base && base.color || delta && delta.color) {
			result.color = colorType.add(
					base && base.color || colorType.zero(),
					delta && delta.color || colorType.zero());
		}
		return result;
	},
	add: function(base, delta) {
		var result = [];
		for (var i = 0; i < base.length || i < delta.length; i++) {
			result.push(this._addSingle(base[i], delta[i]));
		}
		return result;
	},
	subtract: function(base,delta) { // KxDx
		return this.add(base,this.inverse(delta));
	},
	_interpolateSingle: function(from, to, f) {
		if (from && to && from.inset !== to.inset) {
			return f < 0.5 ? from : to;
		}
		var result = {
			inset: from ? from.inset : to.inset,
			hOffset: lengthType.interpolate(
					from ? from.hOffset : lengthType.zero(),
					to ? to.hOffset : lengthType.zero(), f),
			vOffset: lengthType.interpolate(
					from ? from.vOffset : lengthType.zero(),
					to ? to.vOffset : lengthType.zero(), f),
			blur: lengthType.interpolate(
					from && from.blur || lengthType.zero(),
					to && to.blur || lengthType.zero(), f)
		};
		if (from && from.spread || to && to.spread) {
			result.spread = lengthType.interpolate(
					from && from.spread || lengthType.zero(),
					to && to.spread || lengthType.zero(), f);
		}
		if (from && from.color || to && to.color) {
			result.color = colorType.interpolate(
					from && from.color || colorType.zero(),
					to && to.color || colorType.zero(), f);
		}
		return result;
	},
	interpolate: function(from, to, f) {
		var result = [];
		for (var i = 0; i < from.length || i < to.length; i++) {
			result.push(this._interpolateSingle(from[i], to[i], f));
		}
		return result;
	},
	_outputSingle: function(value) {
		return (value.inset ? "inset " : "") +
				lengthType.output(value.hOffset) + " " +
				lengthType.output(value.vOffset) + " " +
				lengthType.output(value.blur) +
				(value.spread ? " " + lengthType.output(value.spread) : "") +
				(value.color ? " " + colorType.output(value.color) : "");
	},
	output: function(value) {
		return value.map(this._outputSingle).join(", ");
	},
	input: function(value) {
		var shadowRE = /(([^(,]+(\([^)]*\))?)+)/g;
		var match;
		var shadows = [];
		while ((match = shadowRE.exec(value)) !== null) {
			shadows.push(match[0]);
		}

		var result = shadows.map(function(value) {
			if (value === "none") {
				return shadowType.zero();
			}
			value = value.replace(/^\s+|\s+$/g, "");

			var partsRE = /([^ (]+(\([^)]*\))?)/g;
			var parts = [];
			while ((match = partsRE.exec(value)) !== null) {
				parts.push(match[0]);
			}

			if (parts.length < 2 || parts.length > 7) {
				return undefined;
			}
			var result = {
				inset: false
			};

			var lengths = [];
			while (parts.length) {
				var part = parts.shift();

				var length = lengthType.input(part);
				if (length) {
					lengths.push(length);
					continue;
				}

				var color = colorType.input(part);
				if (color) {
					result.color = color;
				}

				if (part === "inset") {
					result.inset = true;
				}
			}

			if (lengths.length < 2 || lengths.length > 4) {
				return undefined;
			}
			result.hOffset = lengths[0];
			result.vOffset = lengths[1];
			if (lengths.length > 2) {
				result.blur = lengths[2];
			}
			if (lengths.length > 3) {
				result.spread = lengths[3];
			}
			return result;
		});

		return result.every(isDefined) ? result : undefined;
	}
};