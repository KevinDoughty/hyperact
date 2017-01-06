// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

import { isDefinedAndNotNull } from "./shared.js";
import { lengthType } from "./length.js";

var positionKeywordRE = /^\s*left|^\s*center|^\s*right|^\s*top|^\s*bottom/i;

export const positionType = {
	toString: function() {
		return "positionType";
	},
	toJSON: function() {
		return this.toString();
	},
	inverse: function(base) { // KxDx
		return [
			lengthType.inverse(base[0]),
			lengthType.add(base[1])
		];
	},
	zero: function() { return [{ px: 0 }, { px: 0 }]; },
	add: function(base, delta) {
		return [
			lengthType.add(base[0], delta[0]),
			lengthType.add(base[1], delta[1])
		];
	},
	subtract: function(base,delta) { // KxDx
		return this.add(base,this.inverse(delta));
	},
	interpolate: function(from, to, f) {
		return [
			lengthType.interpolate(from[0], to[0], f),
			lengthType.interpolate(from[1], to[1], f)
		];
	},
	output: function(value) {
		return value.map(lengthType.output).join(" ");
	},
	input: function(value) {
		var tokens = [];
		var remaining = value;
		while (true) {
			var result = positionType.consumeTokenFromString(remaining);
			if (!result) {
				return undefined;
			}
			tokens.push(result.value);
			remaining = result.remaining;
			if (!result.remaining.trim()) {
				break;
			}
			if (tokens.length >= 4) {
				return undefined;
			}
		}

		if (tokens.length === 1) {
			let token = tokens[0];
			return (positionType.isHorizontalToken(token) ? [token, "center"] : ["center", token]).map(positionType.resolveToken);
		}

		if (tokens.length === 2 && positionType.isHorizontalToken(tokens[0]) && positionType.isVerticalToken(tokens[1])) {
			return tokens.map(positionType.resolveToken);
		}

		if (tokens.filter(positionType.isKeyword).length !== 2) {
			return undefined;
		}

		var out = [undefined, undefined];
		var center = false;
		for (var i = 0; i < tokens.length; i++) {
			let token = tokens[i];
			if (!positionType.isKeyword(token)) {
				return undefined;
			}
			if (token === "center") {
				if (center) {
					return undefined;
				}
				center = true;
				continue;
			}
			var axis = Number(positionType.isVerticalToken(token));
			if (out[axis]) {
				return undefined;
			}
			if (i === tokens.length - 1 || positionType.isKeyword(tokens[i + 1])) {
				out[axis] = positionType.resolveToken(token);
				continue;
			}
			var percentLength = tokens[++i];
			if (token === "bottom" || token === "right") {
				percentLength = lengthType.inverse(percentLength);
				percentLength["%"] = (percentLength["%"] || 0) + 100;
			}
			out[axis] = percentLength;
		}
		if (center) {
			if (!out[0]) {
				out[0] = positionType.resolveToken("center");
			} else if (!out[1]) {
				out[1] = positionType.resolveToken("center");
			} else {
				return undefined;
			}
		}
		return out.every(isDefinedAndNotNull) ? out : undefined;
	},
	consumeTokenFromString: function(value) {
		var keywordMatch = positionKeywordRE.exec(value);
		if (keywordMatch) {
			return {
				value: keywordMatch[0].trim().toLowerCase(),
				remaining: value.substring(keywordMatch[0].length)
			};
		}
		return lengthType.consumeValueFromString(value);
	},
	resolveToken: function(token) {
		if (typeof token === "string") {
			return lengthType.input({
				left: "0%",
				center: "50%",
				right: "100%",
				top: "0%",
				bottom: "100%"
			}[token]);
		}
		return token;
	},
	isHorizontalToken: function(token) {
		if (typeof token === "string") {
			return token in { left: true, center: true, right: true };
		}
		return true;
	},
	isVerticalToken: function(token) {
		if (typeof token === "string") {
			return token in { top: true, center: true, bottom: true };
		}
		return true;
	},
	isKeyword: function(token) {
		return typeof token === "string";
	}
};