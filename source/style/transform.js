// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

import { isDefinedAndNotNull, interp, clamp } from "./shared.js";
import { lengthType } from "./length.js";
import { numberType } from "./number.js";

// New experimental:
// import { parseNumber } from "../matrix/number-handler.js";
// import { parseAngle, parseLengthOrPercent, parseLength } from "../matrix/dimension-handler.js";


var convertToDeg = function(num, type) {
	switch (type) {
		case "grad":
			return num / 400 * 360;
		case "rad":
			return num / 2 / Math.PI * 360;
		case "turn":
			return num * 360;
		default:
			return num;
	}
};

var extractValue = function(values, pos, hasUnits) {
	var value = Number(values[pos]);
	if (!hasUnits) {
		return value;
	}
	var type = values[pos + 1];
	if (type === "") { type = "px"; }
	var result = {};
	result[type] = value;
	return result;
};

var extractValues = function(values, numValues, hasOptionalValue,
		hasUnits) {
	var result = [];
	for (let i = 0; i < numValues; i++) {
		result.push(extractValue(values, 1 + 2 * i, hasUnits));
	}
	if (hasOptionalValue && values[1 + 2 * numValues]) {
		result.push(extractValue(values, 1 + 2 * numValues, hasUnits));
	}
	return result;
};

var SPACES = "\\s*";
var NUMBER = "[+-]?(?:\\d+|\\d*\\.\\d+)";
var RAW_OPEN_BRACKET = "\\(";
var RAW_CLOSE_BRACKET = "\\)";
var RAW_COMMA = ",";
var UNIT = "[a-zA-Z%]*";
var START = "^";

function capture(x) { return "(" + x + ")"; }
function optional(x) { return "(?:" + x + ")?"; }

var OPEN_BRACKET = [SPACES, RAW_OPEN_BRACKET, SPACES].join("");
var CLOSE_BRACKET = [SPACES, RAW_CLOSE_BRACKET, SPACES].join("");
var COMMA = [SPACES, RAW_COMMA, SPACES].join("");
var UNIT_NUMBER = [capture(NUMBER), capture(UNIT)].join("");

function transformRE(name, numParms, hasOptionalParm) {
	var tokenList = [START, SPACES, name, OPEN_BRACKET];
	for (let i = 0; i < numParms - 1; i++) {
		tokenList.push(UNIT_NUMBER);
		tokenList.push(COMMA);
	}
	tokenList.push(UNIT_NUMBER);
	if (hasOptionalParm) {
		tokenList.push(optional([COMMA, UNIT_NUMBER].join("")));
	}
	tokenList.push(CLOSE_BRACKET);
	return new RegExp(tokenList.join(""));
}

function buildMatcher(name, numValues, hasOptionalValue, hasUnits, baseValue) {
	var baseName = name;
	if (baseValue) {
		if (name[name.length - 1] === "X" || name[name.length - 1] === "Y") {
			baseName = name.substring(0, name.length - 1);
		} else if (name[name.length - 1] === "Z") {
			baseName = name.substring(0, name.length - 1) + "3d";
		}
	}

	var f = function(x) {
		var r = extractValues(x, numValues, hasOptionalValue, hasUnits);
		if (baseValue !== undefined) {
			if (name[name.length - 1] === "X") {
				r.push(baseValue);
			} else if (name[name.length - 1] === "Y") {
				r = [baseValue].concat(r);
			} else if (name[name.length - 1] === "Z") {
				r = [baseValue, baseValue].concat(r);
			} else if (hasOptionalValue) {
				while (r.length < 2) {
					if (baseValue === "copy") {
						r.push(r[0]);
					} else {
						r.push(baseValue);
					}
				}
			}
		}
		return r;
	};
	return [transformRE(name, numValues, hasOptionalValue), f, baseName];
}

function buildRotationMatcher(name, numValues, hasOptionalValue, baseValue) {
	var m = buildMatcher(name, numValues, hasOptionalValue, true, baseValue);
	var f = function(x) {
		var r = m[1](x);
		return r.map(function(v) {
			var result = 0;
			for (var type in v) {
				result += convertToDeg(v[type], type);
			}
			return result;
		});
	};
	return [m[0], f, m[2]];
}

function build3DRotationMatcher() {
	var m = buildMatcher("rotate3d", 4, false, true);
	var f = function(x) {
		var r = m[1](x);
		var out = [];
		for (let i = 0; i < 3; i++) {
			out.push(r[i].px);
		}
		out.push(r[3]);
		return out;
	};
	return [m[0], f, m[2]];
}

const transformREs = [
	buildRotationMatcher("rotate", 1, false),
	buildRotationMatcher("rotateX", 1, false),
	buildRotationMatcher("rotateY", 1, false),
	buildRotationMatcher("rotateZ", 1, false),
	build3DRotationMatcher(),
	buildRotationMatcher("skew", 1, true, 0),
	buildRotationMatcher("skewX", 1, false),
	buildRotationMatcher("skewY", 1, false),
	buildMatcher("translateX", 1, false, true, {px: 0}),
	buildMatcher("translateY", 1, false, true, {px: 0}),
	buildMatcher("translateZ", 1, false, true, {px: 0}),
	buildMatcher("translate", 1, true, true, {px: 0}),
	buildMatcher("translate3d", 3, false, true),
	buildMatcher("scale", 1, true, false, "copy"),
	buildMatcher("scaleX", 1, false, false, 1),
	buildMatcher("scaleY", 1, false, false, 1),
	buildMatcher("scaleZ", 1, false, false, 1),
	buildMatcher("scale3d", 3, false, false),
	buildMatcher("perspective", 1, false, true),
	buildMatcher("matrix", 6, false, false)
];

var decomposeMatrix = (function() {
	// this is only ever used on the perspective matrix, which has 0, 0, 0, 1 as
	// last column

	function determinant(m) {
		return m[0][0] * m[1][1] * m[2][2] +
			m[1][0] * m[2][1] * m[0][2] +
			m[2][0] * m[0][1] * m[1][2] -
			m[0][2] * m[1][1] * m[2][0] -
			m[1][2] * m[2][1] * m[0][0] -
			m[2][2] * m[0][1] * m[1][0];
	}

	// this is only ever used on the perspective matrix, which has 0, 0, 0, 1 as
	// last column
	//
	// from Wikipedia:
	//
	// [A B]^-1 = [A^-1 + A^-1B(D - CA^-1B)^-1CA^-1		-A^-1B(D - CA^-1B)^-1]
	// [C D]			[-(D - CA^-1B)^-1CA^-1								(D - CA^-1B)^-1			]
	//
	// Therefore
	//
	// [A [0]]^-1 = [A^-1			[0]]
	// [C	1 ]			[ -CA^-1		1 ]
	function inverse(m) {
		var iDet = 1 / determinant(m);
		var a = m[0][0], b = m[0][1], c = m[0][2];
		var d = m[1][0], e = m[1][1], f = m[1][2];
		var g = m[2][0], h = m[2][1], k = m[2][2];
		var Ainv = [
			[(e * k - f * h) * iDet, (c * h - b * k) * iDet, (b * f - c * e) * iDet, 0],
			[(f * g - d * k) * iDet, (a * k - c * g) * iDet, (c * d - a * f) * iDet, 0],
			[(d * h - e * g) * iDet, (g * b - a * h) * iDet, (a * e - b * d) * iDet, 0]
		];
		var lastRow = [];
		for (let i = 0; i < 3; i++) {
			var val = 0;
			for (let j = 0; j < 3; j++) {
				val += m[3][j] * Ainv[j][i];
			}
			lastRow.push(val);
		}
		lastRow.push(1);
		Ainv.push(lastRow);
		return Ainv;
	}

	function transposeMatrix4(m) {
		return [
			[m[0][0], m[1][0], m[2][0], m[3][0]],
			[m[0][1], m[1][1], m[2][1], m[3][1]],
			[m[0][2], m[1][2], m[2][2], m[3][2]],
			[m[0][3], m[1][3], m[2][3], m[3][3]]
		];
	}

	function multVecMatrix(v, m) {
		var result = [];
		for (let i = 0; i < 4; i++) {
			var val = 0;
			for (let j = 0; j < 4; j++) {
				val += v[j] * m[j][i];
			}
			result.push(val);
		}
		return result;
	}

	function normalize(v) {
		var len = length(v);
		return [v[0] / len, v[1] / len, v[2] / len];
	}

	function length(v) {
		return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	}

	function combine(v1, v2, v1s, v2s) {
		return [v1s * v1[0] + v2s * v2[0], v1s * v1[1] + v2s * v2[1], v1s * v1[2] + v2s * v2[2]];
	}

	function cross(v1, v2) {
		return [
			v1[1] * v2[2] - v1[2] * v2[1],
			v1[2] * v2[0] - v1[0] * v2[2],
			v1[0] * v2[1] - v1[1] * v2[0]
		];
	}

	function decomposeMatrix(matrix) {
		var m3d = [
			[matrix[0], matrix[1], 0, 0],
			[matrix[2], matrix[3], 0, 0],
			[0, 0, 1, 0],
			[matrix[4], matrix[5], 0, 1]
		];

		// skip normalization step as m3d[3][3] should always be 1
		if (m3d[3][3] !== 1) {
			throw "attempt to decompose non-normalized matrix";
		}

		var perspectiveMatrix = m3d.concat(); // copy m3d
		for (let i = 0; i < 3; i++) {
			perspectiveMatrix[i][3] = 0;
		}

		if (determinant(perspectiveMatrix) === 0) {
			return false;
		}

		var rhs = [];

		var perspective;
		if (m3d[0][3] !== 0 || m3d[1][3] !== 0 || m3d[2][3] !== 0) {
			rhs.push(m3d[0][3]);
			rhs.push(m3d[1][3]);
			rhs.push(m3d[2][3]);
			rhs.push(m3d[3][3]);

			var inversePerspectiveMatrix = inverse(perspectiveMatrix);
			var transposedInversePerspectiveMatrix =
					transposeMatrix4(inversePerspectiveMatrix);
			perspective = multVecMatrix(rhs, transposedInversePerspectiveMatrix);
		} else {
			perspective = [0, 0, 0, 1];
		}

		var translate = m3d[3].slice(0, 3);

		var row = [];
		row.push(m3d[0].slice(0, 3));
		var scale = [];
		scale.push(length(row[0]));
		row[0] = normalize(row[0]);

		var skew = [];
		row.push(m3d[1].slice(0, 3));
		skew.push(dot(row[0], row[1]));
		row[1] = combine(row[1], row[0], 1.0, -skew[0]);

		scale.push(length(row[1]));
		row[1] = normalize(row[1]);
		skew[0] /= scale[1];

		row.push(m3d[2].slice(0, 3));
		skew.push(dot(row[0], row[2]));
		row[2] = combine(row[2], row[0], 1.0, -skew[1]);
		skew.push(dot(row[1], row[2]));
		row[2] = combine(row[2], row[1], 1.0, -skew[2]);

		scale.push(length(row[2]));
		row[2] = normalize(row[2]);
		skew[1] /= scale[2];
		skew[2] /= scale[2];

		var pdum3 = cross(row[1], row[2]);
		if (dot(row[0], pdum3) < 0) {
			for (let i = 0; i < 3; i++) {
				scale[i] *= -1;
				row[i][0] *= -1;
				row[i][1] *= -1;
				row[i][2] *= -1;
			}
		}

		var t = row[0][0] + row[1][1] + row[2][2] + 1;
		var s;
		var quaternion;

		if (t > 1e-4) {
			s = 0.5 / Math.sqrt(t);
			quaternion = [
				(row[2][1] - row[1][2]) * s,
				(row[0][2] - row[2][0]) * s,
				(row[1][0] - row[0][1]) * s,
				0.25 / s
			];
		} else if (row[0][0] > row[1][1] && row[0][0] > row[2][2]) {
			s = Math.sqrt(1 + row[0][0] - row[1][1] - row[2][2]) * 2.0;
			quaternion = [
				0.25 * s,
				(row[0][1] + row[1][0]) / s,
				(row[0][2] + row[2][0]) / s,
				(row[2][1] - row[1][2]) / s
			];
		} else if (row[1][1] > row[2][2]) {
			s = Math.sqrt(1.0 + row[1][1] - row[0][0] - row[2][2]) * 2.0;
			quaternion = [
				(row[0][1] + row[1][0]) / s,
				0.25 * s,
				(row[1][2] + row[2][1]) / s,
				(row[0][2] - row[2][0]) / s
			];
		} else {
			s = Math.sqrt(1.0 + row[2][2] - row[0][0] - row[1][1]) * 2.0;
			quaternion = [
				(row[0][2] + row[2][0]) / s,
				(row[1][2] + row[2][1]) / s,
				0.25 * s,
				(row[1][0] - row[0][1]) / s
			];
		}

		return {
			translate: translate, scale: scale, skew: skew,
			quaternion: quaternion, perspective: perspective
		};
	}
	return decomposeMatrix;
})();

function dot(v1, v2) {
	var result = 0;
	for (let i = 0; i < v1.length; i++) {
		result += v1[i] * v2[i];
	}
	return result;
}

function multiplyMatrices(a, b) {
	return [
		a[0] * b[0] + a[2] * b[1],
		a[1] * b[0] + a[3] * b[1],
		a[0] * b[2] + a[2] * b[3],
		a[1] * b[2] + a[3] * b[3],
		a[0] * b[4] + a[2] * b[5] + a[4],
		a[1] * b[4] + a[3] * b[5] + a[5]
	];
}

function convertItemToMatrix(item) {
	switch (item.t) { // TODO: lots of types to implement:
		case "rotate":
			var amount = item.d * Math.PI / 180;
			return [Math.cos(amount), Math.sin(amount), -Math.sin(amount), Math.cos(amount), 0, 0];
		case "scale":
			return [item.d[0], 0, 0, item.d[1], 0, 0];
		// TODO: Work out what to do with non-px values.
		case "translate":
			return [1, 0, 0, 1, item.d[0].px, item.d[1].px];
		case "translate3d":
			return [1, 0, 0, 1, item.d[0].px, item.d[1].px]; // This needs a 3d matrix of course
		case "matrix":
			return item.d;
		default:
			throw new Error("HyperStyle convertItemToMatrix unimplemented type:%s;",item.t);
	}
}

function convertToMatrix(transformList) {
	return transformList.map(convertItemToMatrix).reduce(multiplyMatrices);
}

var composeMatrix = (function() {
	function multiply(a, b) {
		var result = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 4; j++) {
				for (var k = 0; k < 4; k++) {
					result[i][j] += b[i][k] * a[k][j];
				}
			}
		}
		return result;
	}

	function composeMatrix(translate, scale, skew, quat, perspective) {
		var matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

		for (let i = 0; i < 4; i++) {
			matrix[i][3] = perspective[i];
		}

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				matrix[3][i] += translate[j] * matrix[j][i];
			}
		}

		var x = quat[0], y = quat[1], z = quat[2], w = quat[3];

		var rotMatrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

		rotMatrix[0][0] = 1 - 2 * (y * y + z * z);
		rotMatrix[0][1] = 2 * (x * y - z * w);
		rotMatrix[0][2] = 2 * (x * z + y * w);
		rotMatrix[1][0] = 2 * (x * y + z * w);
		rotMatrix[1][1] = 1 - 2 * (x * x + z * z);
		rotMatrix[1][2] = 2 * (y * z - x * w);
		rotMatrix[2][0] = 2 * (x * z - y * w);
		rotMatrix[2][1] = 2 * (y * z + x * w);
		rotMatrix[2][2] = 1 - 2 * (x * x + y * y);

		matrix = multiply(matrix, rotMatrix);

		var temp = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];
		if (skew[2]) {
			temp[2][1] = skew[2];
			matrix = multiply(matrix, temp);
		}

		if (skew[1]) {
			temp[2][1] = 0;
			temp[2][0] = skew[0];
			matrix = multiply(matrix, temp);
		}

		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				matrix[i][j] *= scale[i];
			}
		}

		return {t: "matrix", d: [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[3][0], matrix[3][1]]};
	}
	return composeMatrix;
})();

function interpolateTransformsWithMatrices(from, to, f) {
	var fromM = decomposeMatrix(convertToMatrix(from));
	var toM = decomposeMatrix(convertToMatrix(to));

	var product = dot(fromM.quaternion, toM.quaternion);
	product = clamp(product, -1.0, 1.0);

	var quat = [];
	if (product === 1.0) {
		quat = fromM.quaternion;
	} else {
		var theta = Math.acos(product);
		var w = Math.sin(f * theta) * 1 / Math.sqrt(1 - product * product);
		for (let i = 0; i < 4; i++) {
			quat.push(fromM.quaternion[i] * (Math.cos(f * theta) - product * w) + toM.quaternion[i] * w);
		}
	}

	var translate = interp(fromM.translate, toM.translate, f);
	var scale = interp(fromM.scale, toM.scale, f);
	var skew = interp(fromM.skew, toM.skew, f);
	var perspective = interp(fromM.perspective, toM.perspective, f);

	return composeMatrix(translate, scale, skew, quat, perspective);
}

function interpTransformValue(from, to, f) {
	//console.log("interpTransformValue:%s; from:%s; to:%s;",f,JSON.stringify(from),JSON.stringify(to));
	var type = from.t ? from.t : to.t;
	switch (type) {
		// Transforms with unitless parameters.
		case "rotate":
		case "rotateX":
		case "rotateY":
		case "rotateZ":
		case "scale":
		case "scaleX":
		case "scaleY":
		case "scaleZ":
		case "scale3d":
		case "skew":
		case "skewX":
		case "skewY":
		case "matrix":
			return {t: type, d: interp(from.d, to.d, f, type)}; // are rotate and skew ok here? should be wrapped in an array. and rotate is not unitless...
		default:
			// Transforms with lengthType parameters.
			var result = [];
			var maxVal = 0;
			if (from.d && to.d) {
				maxVal = Math.max(from.d.length, to.d.length);
			} else if (from.d) {
				maxVal = from.d.length;
			} else if (to.d) {
				maxVal = to.d.length;
			}
			for (let j = 0; j < maxVal; j++) {
				var fromVal = from.d ? from.d[j] : {};
				var toVal = to.d ? to.d[j] : {};
				result.push(lengthType.interpolate(fromVal, toVal, f));
			}
			return {t: type, d: result};
	}
}

// The CSSWG decided to disallow scientific notation in CSS property strings
// (see http://lists.w3.org/Archives/Public/www-style/2010Feb/0050.html).
// We need this function to hakonitize all numbers before adding them to
// property strings.
// TODO: Apply this function to all property strings
function n(num) {
	return Number(num).toFixed(4);
}

export const transformType = {
	toString: function() {
		return "transformType";
	},
	toJSON: function() {
		return this.toString();
	},
	inverse: function(value) { // KxDx // TODO: SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// TODO: fix this :) matrix is way off // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		if (!value || !value.length) { // This happens often...
			//console.log("transformType inverse with no base!");
			value = this.zero();
		}
		var delta = this.zero(value);
		//console.log("inverse delta:%s;",JSON.stringify(delta));
		var out = [];
		for (let i = 0; i < value.length; i++) {
			switch (value[i].t) {
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					out.push({t : value[i].t, d : [numberType.inverse(value[i].d[0])]}); // new style, have to unwrap then re-wrap
					break;
				case "skew":
					out.push({ t : value[i].t, d : [numberType.inverse(value[i].d[0]), numberType.inverse(value[i].d[1])] });
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
				case "perspective":
					out.push({t : value[i].t, d : [numberType.inverse(value[i].d[0])]});
					break;
				case "translate":
					out.push({t : value[i].t, d : [{px : numberType.inverse(value[i].d[0].px)}, {px : numberType.inverse(value[i].d[1].px)}] });
					break;
				case "translate3d":
					out.push({t : value[i].t, d : [{px : numberType.inverse(value[i].d[0].px)}, {px : numberType.inverse(value[i].d[1].px)}, {px : numberType.inverse(value[i].d[2].px)} ] });
					break;
				case "scale":
					out.push({ t : value[i].t, d : [delta[i].d[0]/value[i].d[0], delta[i].d[1]/value[i].d[1]] }); // inverse of 2 is 1/2
					break;
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					out.push({t : value[i].t, d : [ delta[i].d[0]/value[i].d[0]]}); // inverse of 2 is 1/2
					break;
				case "scale3d":
					out.push({ t : value[i].t, d : [ delta[i].d[0]/value[i].d[0], delta[i].d[1]/value[i].d[1], -1/value[i].d[2]] }); // inverse of 2 is 1/2
					break;
				case "matrix":
					out.push({ t : value[i].t, d : [numberType.inverse(value[i].d[0]), numberType.inverse(value[i].d[1]), numberType.inverse(value[i].d[2]), numberType.inverse(value[i].d[3]), numberType.inverse(value[i].d[4]), numberType.inverse(value[i].d[5])] });
					break;
			}
		}
		return out;
	},

	add: function(base, delta) {
		//console.log("ADD base:%s;",JSON.stringify(base));
		//console.log("ADD delta:%s;",JSON.stringify(delta));
		if (!base || !base.length) return delta;
		if (!delta || !delta.length) return base;
		var baseLength = base.length;
		var deltaLength = delta.length;
		if (baseLength && deltaLength && baseLength >= deltaLength) {
			var diff = baseLength - deltaLength;
			var match = true;
			var j = 0;
			for (let i = diff; i < baseLength; i++) {
				if (base[i].t !== delta[j].t) {
					match = false;
					break;
				}
				j++;
			}
			if (match) return this.sum(base,delta);
		}
		return base.concat(delta);
	},

	sum: function(value,delta) { // add is for the full values, sum is for their components // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// TODO: fix this :) matrix is way off // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
// 		console.log("SUM base:%s;",JSON.stringify(value));
// 		console.log("SUM delta:%s;",JSON.stringify(delta));
		var out = [];
		var valueLength = value.length;
		var deltaLength = delta.length;
		var diff = valueLength-deltaLength;
		var j = 0;
		for (let i = 0; i < valueLength; i++) {
			if (i < diff) {
				out.push(value[i]);
			} else {
				switch (value[i].t) {
					// TODO: rotate3d(1, 2.0, 3.0, 10deg);
					case "rotate":
					case "rotateX":
					case "rotateY":
					case "rotateZ":
					case "skewX":
					case "skewY":
						out.push({t : value[i].t, d : [numberType.add(value[i].d[0],delta[j].d[0])]}); // new style, have to unwrap then re-wrap
						break;
					case "skew":
						out.push({ t : value[i].t, d : [numberType.add(value[i].d[0],delta[j].d[0]), numberType.add(value[i].d[1],delta[j].d[1])] });
						break;
					case "translateX":
					case "translateY":
					case "translateZ":
					case "perspective":
						out.push({t : value[i].t, d : [numberType.add(value[i].d[0],delta[j].d[0])]	});
						break;
					case "translate":
						out.push({t : value[i].t, d : [{px : numberType.add(value[i].d[0].px,delta[j].d[0].px)}, {px : numberType.add(value[i].d[1].px,delta[j].d[1].px)}] });
						break;
					case "translate3d":
						out.push({t : value[i].t, d : [{px : numberType.add(value[i].d[0].px,delta[j].d[0].px)}, {px : numberType.add(value[i].d[1].px,delta[j].d[1].px)}, {px : numberType.add(value[i].d[2].px,delta[j].d[2].px)} ] });
						break;
					case "scale":
						out.push({ t : value[i].t, d : [value[i].d[0] * delta[j].d[0], value[i].d[1] * delta[j].d[1]] });
						break;
					case "scaleX":
					case "scaleY":
					case "scaleZ":
						out.push({t : value[i].t, d : [value[i].d[0] * delta[j].d[0]]});
						break;
					case "scale3d":
						out.push({ t : value[i].t, d : [value[i].d[0] * delta[j].d[0], value[i].d[1] * delta[j].d[1], value[i].d[2] * delta[j].d[2]] });
						break;
					case "matrix":
						out.push({ t : value[i].t, d : [numberType.add(value[i].d[0],delta[j].d[0]), numberType.add(value[i].d[1],delta[j].d[1]), numberType.add(value[i].d[2],delta[j].d[2]), numberType.add(value[i].d[3],delta[j].d[3]), numberType.add(value[i].d[4],delta[j].d[4]), numberType.add(value[i].d[5],delta[j].d[5])] });
						break;
					case "matrix3d":
						break;
						//console.warn("TransformType sum matrix3d not supported");
					default:
						//throw new Error("TransformType sum no type?"+JSON.stringify(value[i].t));
				}
				j++;
			}
		}
		return out;
	},

	zero: function(value) { // KxDx // requires an old value for type // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// TODO: fix this :) matrix is way off // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		//console.log("zero value:%s;",JSON.stringify(value));
		var identity2dMatrix = [1, 0, 0, 1, 0 ,0];
		if (!value) return [{ t : "matrix", d : identity2dMatrix }];
		var out = [];
		for (let i = 0; i < value.length; i++) {
			switch (value[i].t) {
				// TODO: rotate3d(1, 2.0, 3.0, 10deg);
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					out.push({t : value[i].t, d : [0]}); // new style
					break;
				case "skew":
					out.push({ t : value[i].t, d : [0,0] });
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
				case "perspective":
					out.push({t : value[i].t, d : [0]	});
					break;
				case "translate":
					out.push({t : value[i].t, d : [{px : 0}, {px : 0}] });
					break;
				case "translate3d":
					out.push({t : value[i].t, d : [{px : 0}, {px : 0}, {px : 0} ] });
					break;
				case "scale":
					out.push({ t : value[i].t, d : [1, 1] });
					break;
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					out.push({t : value[i].t, d : [1]});
					break;
				case "scale3d":
					out.push({ t : value[i].t, d : [1, 1, 1] });
					break;
				case "matrix":
					out.push({ t : value[i].t, d : identity2dMatrix });
					break;
			}
		}
		return out;
	},

	subtract: function(base,delta) {
		var inverse = this.inverse(delta);
		var result = this.add(base,inverse);
		return result;
	},

	interpolate: function(from, to, f) { // ugly values
		// console.log("!!! transform interpolate:%s; from:%s; to:%s;",f,JSON.stringify(from),JSON.stringify(to));
		var out = [];
		var i;
		for (i = 0; i < Math.min(from.length, to.length); i++) {
			if (from[i].t !== to[i].t) {
				break;
			}
			out.push(interpTransformValue(from[i], to[i], f));
		}
		if (i < Math.min(from.length, to.length)) {
			out.push(interpolateTransformsWithMatrices(from.slice(i), to.slice(i), f));
			return out;
		}

		for (; i < from.length; i++) {
			out.push(interpTransformValue(from[i], {t: null, d: null}, f));
		}
		for (; i < to.length; i++) {
			out.push(interpTransformValue({t: null, d: null}, to[i], f));
		}
		return out;
	},

	output: function(value, svgMode) {
		// TODO: fix this :)

// 		return value.map(function(args, i) {
// 			console.log("%s args:%s;",i,JSON.stringify(args));
// 			var stringifiedArgs = args.map(function(arg, j) {
// 				console.log("%s arg:%s;",j,JSON.stringify(arg));
// 				return types[i][1][j](arg);
// 			}).join(',');
// 			console.log("stringified:%s;",JSON.stringify(stringified));
// 			if (types[i][0] == 'matrix' && stringifiedArgs.split(',').length == 16)
// 				types[i][0] = 'matrix3d';
// 			return types[i][0] + '(' + stringifiedArgs + ')';
// 		}).join(' ');

		//if (typeof value === "string") throw new Error("this should not be a string");
		if (value === null || typeof value === "undefined") return "";
		if (typeof value === "string") return value;
		var out = "";
		var unit;
		for (let i = 0; i < value.length; i++) {
			switch (value[i].t) {
				// TODO: rotate3d(1, 2.0, 3.0, 10deg);
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					unit = (svgMode ? "" : "deg");
					out += value[i].t + "(" + value[i].d[0] + unit + ") "; // modified. value[i].d is wrapped in an array, converting array to string worked previously but this is correct. If you don"t like it, fix input and change inverse, sum, and zero
					break;
				case "skew":
					unit = svgMode ? "" : "deg";
					out += value[i].t + "(" + value[i].d[0] + unit;
					if (value[i].d[1] === 0) {
						out += ") ";
					} else {
						out += ", " + value[i].d[1] + unit + ") ";
					}
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
				case "perspective":
					out += value[i].t + "(" + lengthType.output(value[i].d[0]) +
							") ";
					break;
				case "translate":
					if (svgMode) {
						if (value[i].d[1] === undefined) {
							out += value[i].t + "(" + value[i].d[0].px + ") ";
						} else {
							out += value[i].t + "(" + value[i].d[0].px + ", " + value[i].d[1].px + ") ";
						}
						break;
					}
					if (value[i].d[1] === undefined) {
						out += value[i].t + "(" + lengthType.output(value[i].d[0]) + ") ";
					} else {
						out += value[i].t + "(" + lengthType.output(value[i].d[0]) + ", " + lengthType.output(value[i].d[1]) + ") ";
					}
					break;
				case "translate3d":
					var values = value[i].d.map(lengthType.output);
					out += value[i].t + "(" + values[0] + ", " + values[1] + ", " + values[2] + ") ";
					break;
				case "scale":
					if (value[i].d[0] === value[i].d[1]) {
						out += value[i].t + "(" + value[i].d[0] + ") ";
					} else {
						out += value[i].t + "(" + value[i].d[0] + ", " + value[i].d[1] + ") ";
					}
					break;
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					out += value[i].t + "(" + value[i].d[0] + ") ";
					break;
				case "scale3d":
					out += value[i].t + "(" + value[i].d[0] + ", " +
					value[i].d[1] + ", " + value[i].d[2] + ") ";
					break;
				case "matrix":
					out += value[i].t + "(" +
					n(value[i].d[0]) + ", " + n(value[i].d[1]) + ", " +
					n(value[i].d[2]) + ", " + n(value[i].d[3]) + ", " +
					n(value[i].d[4]) + ", " + n(value[i].d[5]) + ") ";
					break;
			}
		}
		var result = out.substring(0, out.length - 1);
		//console.log("tranform output result:%s;",JSON.stringify(result));
		return result;


	},

	input: function(value) {

// 		if (typeof value !== "string") return null;
// 		return parseTransform(value) || [];

		var result = [];
		while (typeof value === "string" && value.length > 0) {
			var r;
			for (let i = 0; i < transformREs.length; i++) {
				var reSpec = transformREs[i];
				r = reSpec[0].exec(value);
				if (r) {
					result.push({t: reSpec[2], d: reSpec[1](r)});
					value = value.substring(r[0].length);
					break;
				}
			}
			if (!isDefinedAndNotNull(r)) {
				return result;
			}
		}
		//console.log("input result:%s;",JSON.stringify(result));
		return result;
	}
};





// The following has been modified from original source:
// https://github.com/web-animations/web-animations-js/blob/dev/src/transform-handler.js


// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//	 You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//	 See the License for the specific language governing permissions and
// limitations under the License.



// var _ = null;
// function cast(pattern) {
// 	return function(contents) {
// 		var i = 0;
// 		return pattern.map(function(x) { return x === _ ? contents[i++] : x; });
// 	};
// }

// function id(x) { return x; }

// var Opx = {px: 0};
// var Odeg = {deg: 0};

// // type: [argTypes, convertTo3D, convertTo2D]
// // In the argument types string, lowercase characters represent optional arguments
// var transformFunctions = {
// 	matrix: ["NNNNNN", [_, _, 0, 0, _, _, 0, 0, 0, 0, 1, 0, _, _, 0, 1], id],
// 	matrix3d: ["NNNNNNNNNNNNNNNN", id],
// 	rotate: ["A"],
// 	rotatex: ["A"],
// 	rotatey: ["A"],
// 	rotatez: ["A"],
// 	rotate3d: ["NNNA"],
// 	perspective: ["L"],
// 	scale: ["Nn", cast([_, _, 1]), id],
// 	scalex: ["N", cast([_, 1, 1]), cast([_, 1])],
// 	scaley: ["N", cast([1, _, 1]), cast([1, _])],
// 	scalez: ["N", cast([1, 1, _])],
// 	scale3d: ["NNN", id],
// 	skew: ["Aa", null, id],
// 	skewx: ["A", null, cast([_, Odeg])],
// 	skewy: ["A", null, cast([Odeg, _])],
// 	translate: ["Tt", cast([_, _, Opx]), id],
// 	translatex: ["T", cast([_, Opx, Opx]), cast([_, Opx])],
// 	translatey: ["T", cast([Opx, _, Opx]), cast([Opx, _])],
// 	translatez: ["L", cast([Opx, Opx, _])],
// 	translate3d: ["TTL", id]
// };

// function parseTransform(string) {
// 	string = string.toLowerCase().trim();
// 	if (string == "none")
// 		return [];
// 	// FIXME: Using a RegExp means calcs won"t work here
// 	var transformRegExp = /\s*(\w+)\(([^)]*)\)/g;
// 	var result = [];
// 	var match;
// 	var prevLastIndex = 0;
// 	while ((match = transformRegExp.exec(string))) {
// 		if (match.index != prevLastIndex)
// 			return;
// 		prevLastIndex = match.index + match[0].length;
// 		var functionName = match[1];
// 		var functionData = transformFunctions[functionName];
// 		if (!functionData)
// 			return;
// 		var args = match[2].split(",");
// 		var argTypes = functionData[0];
// 		if (argTypes.length < args.length)
// 			return;

// 		var parsedArgs = [];
// 		for (var i = 0; i < argTypes.length; i++) {
// 			var arg = args[i];
// 			var type = argTypes[i];
// 			var parsedArg;
// 			if (!arg)
// 				parsedArg = ({a: Odeg,
// 											n: parsedArgs[0],
// 											t: Opx})[type];
// 			else
// 				parsedArg = ({A: function(s) { return s.trim() == "0" ? Odeg : parseAngle(s); },
// 											N: parseNumber,
// 											T: parseLengthOrPercent,
// 											L: parseLength})[type.toUpperCase()](arg);
// 			if (parsedArg === undefined)
// 				return;
// 			parsedArgs.push(parsedArg);
// 		}
// 		result.push({t: functionName, d: parsedArgs});
// 		//if (transformRegExp.lastIndex == string.length) console.log("PARSE:%s; RESULT:%s;",string,JSON.stringify(result));
// 		if (transformRegExp.lastIndex == string.length)
// 			return result;
// 	}
// };