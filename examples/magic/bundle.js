/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ARRAY_TYPE", function() { return ARRAY_TYPE; });
/* harmony export (immutable) */ __webpack_exports__["setMatrixArrayType"] = setMatrixArrayType;
/* harmony export (immutable) */ __webpack_exports__["toRadian"] = toRadian;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */

/**
 * Common utilities
 * @module glMatrix
 */

// Configuration Constants
const EPSILON = 0.000001;
/* harmony export (immutable) */ __webpack_exports__["EPSILON"] = EPSILON;

let ARRAY_TYPE = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
const RANDOM = Math.random;
/* harmony export (immutable) */ __webpack_exports__["RANDOM"] = RANDOM;


/**
 * Sets the type of array used when creating new vectors and matrices
 *
 * @param {Type} type Array type, such as Float32Array or Array
 */
function setMatrixArrayType(type) {
  ARRAY_TYPE = type;
}

const degree = Math.PI / 180;

/**
 * Convert Degree To Radian
 *
 * @param {Number} a Angle in Degrees
 */
function toRadian(a) {
  return a * degree;
}

/**
 * Tests whether or not the arguments have approximately the same value, within an absolute
 * or relative tolerance of glMatrix.EPSILON (an absolute tolerance is used for values less
 * than or equal to 1.0, and a relative tolerance is used for larger values)
 *
 * @param {Number} a The first number to test.
 * @param {Number} b The second number to test.
 * @returns {Boolean} True if the numbers are approximately equal, false otherwise.
 */
function equals(a, b) {
  return Math.abs(a - b) <= EPSILON*Math.max(1.0, Math.abs(a), Math.abs(b));
}


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["fromMat4"] = fromMat4;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["transpose"] = transpose;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["adjoint"] = adjoint;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["translate"] = translate;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["fromTranslation"] = fromTranslation;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["fromMat2d"] = fromMat2d;
/* harmony export (immutable) */ __webpack_exports__["fromQuat"] = fromQuat;
/* harmony export (immutable) */ __webpack_exports__["normalFromMat4"] = normalFromMat4;
/* harmony export (immutable) */ __webpack_exports__["projection"] = projection;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 3x3 Matrix
 * @module mat3
 */

/**
 * Creates a new identity mat3
 *
 * @returns {mat3} a new 3x3 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](9);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Copies the upper-left 3x3 values into the given mat3.
 *
 * @param {mat3} out the receiving 3x3 matrix
 * @param {mat4} a   the source 4x4 matrix
 * @returns {mat3} out
 */
function fromMat4(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[4];
  out[4] = a[5];
  out[5] = a[6];
  out[6] = a[8];
  out[7] = a[9];
  out[8] = a[10];
  return out;
}

/**
 * Creates a new mat3 initialized with values from an existing matrix
 *
 * @param {mat3} a matrix to clone
 * @returns {mat3} a new 3x3 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](9);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Copy the values from one mat3 to another
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Create a new mat3 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} A new mat3
 */
function fromValues(m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](9);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}

/**
 * Set the components of a mat3 to the given values
 *
 * @param {mat3} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m10 Component in column 1, row 0 position (index 3)
 * @param {Number} m11 Component in column 1, row 1 position (index 4)
 * @param {Number} m12 Component in column 1, row 2 position (index 5)
 * @param {Number} m20 Component in column 2, row 0 position (index 6)
 * @param {Number} m21 Component in column 2, row 1 position (index 7)
 * @param {Number} m22 Component in column 2, row 2 position (index 8)
 * @returns {mat3} out
 */
function set(out, m00, m01, m02, m10, m11, m12, m20, m21, m22) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m10;
  out[4] = m11;
  out[5] = m12;
  out[6] = m20;
  out[7] = m21;
  out[8] = m22;
  return out;
}

/**
 * Set a mat3 to the identity matrix
 *
 * @param {mat3} out the receiving matrix
 * @returns {mat3} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Transpose the values of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1], a02 = a[2], a12 = a[5];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a01;
    out[5] = a[7];
    out[6] = a02;
    out[7] = a12;
  } else {
    out[0] = a[0];
    out[1] = a[3];
    out[2] = a[6];
    out[3] = a[1];
    out[4] = a[4];
    out[5] = a[7];
    out[6] = a[2];
    out[7] = a[5];
    out[8] = a[8];
  }

  return out;
}

/**
 * Inverts a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  let b01 = a22 * a11 - a12 * a21;
  let b11 = -a22 * a10 + a12 * a20;
  let b21 = a21 * a10 - a11 * a20;

  // Calculate the determinant
  let det = a00 * b01 + a01 * b11 + a02 * b21;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = b01 * det;
  out[1] = (-a22 * a01 + a02 * a21) * det;
  out[2] = (a12 * a01 - a02 * a11) * det;
  out[3] = b11 * det;
  out[4] = (a22 * a00 - a02 * a20) * det;
  out[5] = (-a12 * a00 + a02 * a10) * det;
  out[6] = b21 * det;
  out[7] = (-a21 * a00 + a01 * a20) * det;
  out[8] = (a11 * a00 - a01 * a10) * det;
  return out;
}

/**
 * Calculates the adjugate of a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the source matrix
 * @returns {mat3} out
 */
function adjoint(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  out[0] = (a11 * a22 - a12 * a21);
  out[1] = (a02 * a21 - a01 * a22);
  out[2] = (a01 * a12 - a02 * a11);
  out[3] = (a12 * a20 - a10 * a22);
  out[4] = (a00 * a22 - a02 * a20);
  out[5] = (a02 * a10 - a00 * a12);
  out[6] = (a10 * a21 - a11 * a20);
  out[7] = (a01 * a20 - a00 * a21);
  out[8] = (a00 * a11 - a01 * a10);
  return out;
}

/**
 * Calculates the determinant of a mat3
 *
 * @param {mat3} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  return a00 * (a22 * a11 - a12 * a21) + a01 * (-a22 * a10 + a12 * a20) + a02 * (a21 * a10 - a11 * a20);
}

/**
 * Multiplies two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function multiply(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2];
  let a10 = a[3], a11 = a[4], a12 = a[5];
  let a20 = a[6], a21 = a[7], a22 = a[8];

  let b00 = b[0], b01 = b[1], b02 = b[2];
  let b10 = b[3], b11 = b[4], b12 = b[5];
  let b20 = b[6], b21 = b[7], b22 = b[8];

  out[0] = b00 * a00 + b01 * a10 + b02 * a20;
  out[1] = b00 * a01 + b01 * a11 + b02 * a21;
  out[2] = b00 * a02 + b01 * a12 + b02 * a22;

  out[3] = b10 * a00 + b11 * a10 + b12 * a20;
  out[4] = b10 * a01 + b11 * a11 + b12 * a21;
  out[5] = b10 * a02 + b11 * a12 + b12 * a22;

  out[6] = b20 * a00 + b21 * a10 + b22 * a20;
  out[7] = b20 * a01 + b21 * a11 + b22 * a21;
  out[8] = b20 * a02 + b21 * a12 + b22 * a22;
  return out;
}

/**
 * Translate a mat3 by the given vector
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to translate
 * @param {vec2} v vector to translate by
 * @returns {mat3} out
 */
function translate(out, a, v) {
  let a00 = a[0], a01 = a[1], a02 = a[2],
    a10 = a[3], a11 = a[4], a12 = a[5],
    a20 = a[6], a21 = a[7], a22 = a[8],
    x = v[0], y = v[1];

  out[0] = a00;
  out[1] = a01;
  out[2] = a02;

  out[3] = a10;
  out[4] = a11;
  out[5] = a12;

  out[6] = x * a00 + y * a10 + a20;
  out[7] = x * a01 + y * a11 + a21;
  out[8] = x * a02 + y * a12 + a22;
  return out;
}

/**
 * Rotates a mat3 by the given angle
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function rotate(out, a, rad) {
  let a00 = a[0], a01 = a[1], a02 = a[2],
    a10 = a[3], a11 = a[4], a12 = a[5],
    a20 = a[6], a21 = a[7], a22 = a[8],

    s = Math.sin(rad),
    c = Math.cos(rad);

  out[0] = c * a00 + s * a10;
  out[1] = c * a01 + s * a11;
  out[2] = c * a02 + s * a12;

  out[3] = c * a10 - s * a00;
  out[4] = c * a11 - s * a01;
  out[5] = c * a12 - s * a02;

  out[6] = a20;
  out[7] = a21;
  out[8] = a22;
  return out;
};

/**
 * Scales the mat3 by the dimensions in the given vec2
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat3} out
 **/
function scale(out, a, v) {
  let x = v[0], y = v[1];

  out[0] = x * a[0];
  out[1] = x * a[1];
  out[2] = x * a[2];

  out[3] = y * a[3];
  out[4] = y * a[4];
  out[5] = y * a[5];

  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.translate(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat3} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 1;
  out[5] = 0;
  out[6] = v[0];
  out[7] = v[1];
  out[8] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.rotate(dest, dest, rad);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat3} out
 */
function fromRotation(out, rad) {
  let s = Math.sin(rad), c = Math.cos(rad);

  out[0] = c;
  out[1] = s;
  out[2] = 0;

  out[3] = -s;
  out[4] = c;
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat3.identity(dest);
 *     mat3.scale(dest, dest, vec);
 *
 * @param {mat3} out mat3 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat3} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;

  out[3] = 0;
  out[4] = v[1];
  out[5] = 0;

  out[6] = 0;
  out[7] = 0;
  out[8] = 1;
  return out;
}

/**
 * Copies the values from a mat2d into a mat3
 *
 * @param {mat3} out the receiving matrix
 * @param {mat2d} a the matrix to copy
 * @returns {mat3} out
 **/
function fromMat2d(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = 0;

  out[3] = a[2];
  out[4] = a[3];
  out[5] = 0;

  out[6] = a[4];
  out[7] = a[5];
  out[8] = 1;
  return out;
}

/**
* Calculates a 3x3 matrix from the given quaternion
*
* @param {mat3} out mat3 receiving operation result
* @param {quat} q Quaternion to create matrix from
*
* @returns {mat3} out
*/
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - yy - zz;
  out[3] = yx - wz;
  out[6] = zx + wy;

  out[1] = yx + wz;
  out[4] = 1 - xx - zz;
  out[7] = zy - wx;

  out[2] = zx - wy;
  out[5] = zy + wx;
  out[8] = 1 - xx - yy;

  return out;
}

/**
* Calculates a 3x3 normal matrix (transpose inverse) from the 4x4 matrix
*
* @param {mat3} out mat3 receiving operation result
* @param {mat4} a Mat4 to derive the normal matrix from
*
* @returns {mat3} out
*/
function normalFromMat4(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;

  out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;

  out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;

  return out;
}

/**
 * Generates a 2D projection matrix with the given bounds
 *
 * @param {mat3} out mat3 frustum matrix will be written into
 * @param {number} width Width of your gl context
 * @param {number} height Height of gl context
 * @returns {mat3} out
 */
function projection(out, width, height) {
    out[0] = 2 / width;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = -2 / height;
    out[5] = 0;
    out[6] = -1;
    out[7] = 1;
    out[8] = 1;
    return out;
}

/**
 * Returns a string representation of a mat3
 *
 * @param {mat3} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
          a[3] + ', ' + a[4] + ', ' + a[5] + ', ' +
          a[6] + ', ' + a[7] + ', ' + a[8] + ')';
}

/**
 * Returns Frobenius norm of a mat3
 *
 * @param {mat3} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2)))
}

/**
 * Adds two mat3's
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @returns {mat3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  return out;
}



/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat3} out the receiving matrix
 * @param {mat3} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat3} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  return out;
}

/**
 * Adds two mat3's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat3} out the receiving vector
 * @param {mat3} a the first operand
 * @param {mat3} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat3} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  out[6] = a[6] + (b[6] * scale);
  out[7] = a[7] + (b[7] * scale);
  out[8] = a[8] + (b[8] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] &&
         a[3] === b[3] && a[4] === b[4] && a[5] === b[5] &&
         a[6] === b[6] && a[7] === b[7] && a[8] === b[8];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat3} a The first matrix.
 * @param {mat3} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5], a6 = a[6], a7 = a[7], a8 = a[8];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5], b6 = b[6], b7 = b[7], b8 = b[8];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
          Math.abs(a6 - b6) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
          Math.abs(a7 - b7) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
          Math.abs(a8 - b8) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a8), Math.abs(b8)));
}

/**
 * Alias for {@link mat3.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat3.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["length"] = length;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["divide"] = divide;
/* harmony export (immutable) */ __webpack_exports__["ceil"] = ceil;
/* harmony export (immutable) */ __webpack_exports__["floor"] = floor;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["round"] = round;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["scaleAndAdd"] = scaleAndAdd;
/* harmony export (immutable) */ __webpack_exports__["distance"] = distance;
/* harmony export (immutable) */ __webpack_exports__["squaredDistance"] = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["negate"] = negate;
/* harmony export (immutable) */ __webpack_exports__["inverse"] = inverse;
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;
/* harmony export (immutable) */ __webpack_exports__["cross"] = cross;
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;
/* harmony export (immutable) */ __webpack_exports__["hermite"] = hermite;
/* harmony export (immutable) */ __webpack_exports__["bezier"] = bezier;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (immutable) */ __webpack_exports__["transformMat4"] = transformMat4;
/* harmony export (immutable) */ __webpack_exports__["transformMat3"] = transformMat3;
/* harmony export (immutable) */ __webpack_exports__["transformQuat"] = transformQuat;
/* harmony export (immutable) */ __webpack_exports__["rotateX"] = rotateX;
/* harmony export (immutable) */ __webpack_exports__["rotateY"] = rotateY;
/* harmony export (immutable) */ __webpack_exports__["rotateZ"] = rotateZ;
/* harmony export (immutable) */ __webpack_exports__["angle"] = angle;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](3);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  return out;
}

/**
 * Creates a new vec3 initialized with values from an existing vector
 *
 * @param {vec3} a vector to clone
 * @returns {vec3} a new 3D vector
 */
function clone(a) {
  var out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](3);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Calculates the length of a vec3
 *
 * @param {vec3} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
function fromValues(x, y, z) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](3);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the source vector
 * @returns {vec3} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
}

/**
 * Set the components of a vec3 to the given values
 *
 * @param {vec3} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} out
 */
function set(out, x, y, z) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  return out;
}

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
}

/**
 * Multiplies two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  return out;
}

/**
 * Divides two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  return out;
}

/**
 * Math.ceil the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to ceil
 * @returns {vec3} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  return out;
}

/**
 * Math.floor the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to floor
 * @returns {vec3} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  return out;
}

/**
 * Returns the minimum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  return out;
}

/**
 * Returns the maximum of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  return out;
}

/**
 * Math.round the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to round
 * @returns {vec3} out
 */
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  return out;
}

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
}

/**
 * Adds two vec3's after scaling the second operand by a scalar value
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec3} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  return out;
}

/**
 * Calculates the euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return Math.sqrt(x*x + y*y + z*z);
}

/**
 * Calculates the squared euclidian distance between two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  return x*x + y*y + z*z;
}

/**
 * Calculates the squared length of a vec3
 *
 * @param {vec3} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  return x*x + y*y + z*z;
}

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to negate
 * @returns {vec3} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
}

/**
 * Returns the inverse of the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to invert
 * @returns {vec3} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  return out;
}

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a vector to normalize
 * @returns {vec3} out
 */
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let len = x*x + y*y + z*z;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
    out[2] = a[2] * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec3's
 *
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2];
  let bx = b[0], by = b[1], bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
}

/**
 * Performs a linear interpolation between two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  return out;
}

/**
 * Performs a hermite interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function hermite(out, a, b, c, d, t) {
  let factorTimes2 = t * t;
  let factor1 = factorTimes2 * (2 * t - 3) + 1;
  let factor2 = factorTimes2 * (t - 2) + t;
  let factor3 = factorTimes2 * (t - 1);
  let factor4 = factorTimes2 * (3 - 2 * t);

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

/**
 * Performs a bezier interpolation with two control points
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the first operand
 * @param {vec3} b the second operand
 * @param {vec3} c the third operand
 * @param {vec3} d the fourth operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec3} out
 */
function bezier(out, a, b, c, d, t) {
  let inverseFactor = 1 - t;
  let inverseFactorTimesTwo = inverseFactor * inverseFactor;
  let factorTimes2 = t * t;
  let factor1 = inverseFactorTimesTwo * inverseFactor;
  let factor2 = 3 * t * inverseFactorTimesTwo;
  let factor3 = 3 * factorTimes2 * inverseFactor;
  let factor4 = factorTimes2 * t;

  out[0] = a[0] * factor1 + b[0] * factor2 + c[0] * factor3 + d[0] * factor4;
  out[1] = a[1] * factor1 + b[1] * factor2 + c[1] * factor3 + d[1] * factor4;
  out[2] = a[2] * factor1 + b[2] * factor2 + c[2] * factor3 + d[2] * factor4;

  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec3} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec3} out
 */
function random(out, scale) {
  scale = scale || 1.0;

  let r = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]() * 2.0 * Math.PI;
  let z = (__WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]() * 2.0) - 1.0;
  let zScale = Math.sqrt(1.0-z*z) * scale;

  out[0] = Math.cos(r) * zScale;
  out[1] = Math.sin(r) * zScale;
  out[2] = z * scale;
  return out;
}

/**
 * Transforms the vec3 with a mat4.
 * 4th vector component is implicitly '1'
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec3} out
 */
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  let w = m[3] * x + m[7] * y + m[11] * z + m[15];
  w = w || 1.0;
  out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
  out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
  out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
  return out;
}

/**
 * Transforms the vec3 with a mat3.
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {mat3} m the 3x3 matrix to transform with
 * @returns {vec3} out
 */
function transformMat3(out, a, m) {
  let x = a[0], y = a[1], z = a[2];
  out[0] = x * m[0] + y * m[3] + z * m[6];
  out[1] = x * m[1] + y * m[4] + z * m[7];
  out[2] = x * m[2] + y * m[5] + z * m[8];
  return out;
}

/**
 * Transforms the vec3 with a quat
 *
 * @param {vec3} out the receiving vector
 * @param {vec3} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec3} out
 */
function transformQuat(out, a, q) {
  // benchmarks: http://jsperf.com/quaternion-transform-vec3-implementations

  let x = a[0], y = a[1], z = a[2];
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];

  // calculate quat * vec
  let ix = qw * x + qy * z - qz * y;
  let iy = qw * y + qz * x - qx * z;
  let iz = qw * z + qx * y - qy * x;
  let iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  return out;
}

/**
 * Rotate a 3D vector around the x-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateX(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0];
  r[1] = p[1]*Math.cos(c) - p[2]*Math.sin(c);
  r[2] = p[1]*Math.sin(c) + p[2]*Math.cos(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Rotate a 3D vector around the y-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateY(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[2]*Math.sin(c) + p[0]*Math.cos(c);
  r[1] = p[1];
  r[2] = p[2]*Math.cos(c) - p[0]*Math.sin(c);

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Rotate a 3D vector around the z-axis
 * @param {vec3} out The receiving vec3
 * @param {vec3} a The vec3 point to rotate
 * @param {vec3} b The origin of the rotation
 * @param {Number} c The angle of rotation
 * @returns {vec3} out
 */
function rotateZ(out, a, b, c){
  let p = [], r=[];
  //Translate point to the origin
  p[0] = a[0] - b[0];
  p[1] = a[1] - b[1];
  p[2] = a[2] - b[2];

  //perform rotation
  r[0] = p[0]*Math.cos(c) - p[1]*Math.sin(c);
  r[1] = p[0]*Math.sin(c) + p[1]*Math.cos(c);
  r[2] = p[2];

  //translate to correct position
  out[0] = r[0] + b[0];
  out[1] = r[1] + b[1];
  out[2] = r[2] + b[2];

  return out;
}

/**
 * Get the angle between two 3D vectors
 * @param {vec3} a The first operand
 * @param {vec3} b The second operand
 * @returns {Number} The angle in radians
 */
function angle(a, b) {
  let tempA = fromValues(a[0], a[1], a[2]);
  let tempB = fromValues(b[0], b[1], b[2]);

  normalize(tempA, tempA);
  normalize(tempB, tempB);

  let cosine = dot(tempA, tempB);

  if(cosine > 1.0) {
    return 0;
  }
  else if(cosine < -1.0) {
    return Math.PI;
  } else {
    return Math.acos(cosine);
  }
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec3} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec3(' + a[0] + ', ' + a[1] + ', ' + a[2] + ')';
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec3} a The first vector.
 * @param {vec3} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2];
  let b0 = b[0], b1 = b[1], b2 = b[2];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)));
}

/**
 * Alias for {@link vec3.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;


/**
 * Alias for {@link vec3.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link vec3.divide}
 * @function
 */
const div = divide;
/* harmony export (immutable) */ __webpack_exports__["div"] = div;


/**
 * Alias for {@link vec3.distance}
 * @function
 */
const dist = distance;
/* harmony export (immutable) */ __webpack_exports__["dist"] = dist;


/**
 * Alias for {@link vec3.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["sqrDist"] = sqrDist;


/**
 * Alias for {@link vec3.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Alias for {@link vec3.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Perform some operation over an array of vec3s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec3. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec3s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 3;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2];
    }

    return a;
  };
})();
/* harmony export (immutable) */ __webpack_exports__["forEach"] = forEach;



/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["divide"] = divide;
/* harmony export (immutable) */ __webpack_exports__["ceil"] = ceil;
/* harmony export (immutable) */ __webpack_exports__["floor"] = floor;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["round"] = round;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["scaleAndAdd"] = scaleAndAdd;
/* harmony export (immutable) */ __webpack_exports__["distance"] = distance;
/* harmony export (immutable) */ __webpack_exports__["squaredDistance"] = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["length"] = length;
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["negate"] = negate;
/* harmony export (immutable) */ __webpack_exports__["inverse"] = inverse;
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (immutable) */ __webpack_exports__["transformMat4"] = transformMat4;
/* harmony export (immutable) */ __webpack_exports__["transformQuat"] = transformQuat;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 4 Dimensional Vector
 * @module vec4
 */

/**
 * Creates a new, empty vec4
 *
 * @returns {vec4} a new 4D vector
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  return out;
}

/**
 * Creates a new vec4 initialized with values from an existing vector
 *
 * @param {vec4} a vector to clone
 * @returns {vec4} a new 4D vector
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
function fromValues(x, y, z, w) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Copy the values from one vec4 to another
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the source vector
 * @returns {vec4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Set the components of a vec4 to the given values
 *
 * @param {vec4} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} out
 */
function set(out, x, y, z, w) {
  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = w;
  return out;
}

/**
 * Adds two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}

/**
 * Multiplies two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  out[2] = a[2] * b[2];
  out[3] = a[3] * b[3];
  return out;
}

/**
 * Divides two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  out[2] = a[2] / b[2];
  out[3] = a[3] / b[3];
  return out;
}

/**
 * Math.ceil the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to ceil
 * @returns {vec4} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  out[2] = Math.ceil(a[2]);
  out[3] = Math.ceil(a[3]);
  return out;
}

/**
 * Math.floor the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to floor
 * @returns {vec4} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  out[2] = Math.floor(a[2]);
  out[3] = Math.floor(a[3]);
  return out;
}

/**
 * Returns the minimum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  out[2] = Math.min(a[2], b[2]);
  out[3] = Math.min(a[3], b[3]);
  return out;
}

/**
 * Returns the maximum of two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {vec4} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  out[2] = Math.max(a[2], b[2]);
  out[3] = Math.max(a[3], b[3]);
  return out;
}

/**
 * Math.round the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to round
 * @returns {vec4} out
 */
function round(out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  out[2] = Math.round(a[2]);
  out[3] = Math.round(a[3]);
  return out;
}

/**
 * Scales a vec4 by a scalar number
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec4} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

/**
 * Adds two vec4's after scaling the second operand by a scalar value
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec4} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  return out;
}

/**
 * Calculates the euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  let w = b[3] - a[3];
  return Math.sqrt(x*x + y*y + z*z + w*w);
}

/**
 * Calculates the squared euclidian distance between two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  let x = b[0] - a[0];
  let y = b[1] - a[1];
  let z = b[2] - a[2];
  let w = b[3] - a[3];
  return x*x + y*y + z*z + w*w;
}

/**
 * Calculates the length of a vec4
 *
 * @param {vec4} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  return Math.sqrt(x*x + y*y + z*z + w*w);
}

/**
 * Calculates the squared length of a vec4
 *
 * @param {vec4} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength(a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  return x*x + y*y + z*z + w*w;
}

/**
 * Negates the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to negate
 * @returns {vec4} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = -a[3];
  return out;
}

/**
 * Returns the inverse of the components of a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to invert
 * @returns {vec4} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  out[2] = 1.0 / a[2];
  out[3] = 1.0 / a[3];
  return out;
}

/**
 * Normalize a vec4
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a vector to normalize
 * @returns {vec4} out
 */
function normalize(out, a) {
  let x = a[0];
  let y = a[1];
  let z = a[2];
  let w = a[3];
  let len = x*x + y*y + z*z + w*w;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    out[0] = x * len;
    out[1] = y * len;
    out[2] = z * len;
    out[3] = w * len;
  }
  return out;
}

/**
 * Calculates the dot product of two vec4's
 *
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
}

/**
 * Performs a linear interpolation between two vec4's
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the first operand
 * @param {vec4} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec4} out
 */
function lerp(out, a, b, t) {
  let ax = a[0];
  let ay = a[1];
  let az = a[2];
  let aw = a[3];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  out[2] = az + t * (b[2] - az);
  out[3] = aw + t * (b[3] - aw);
  return out;
}

/**
 * Generates a random vector with the given scale
 *
 * @param {vec4} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec4} out
 */
function random(out, vectorScale) {
  vectorScale = vectorScale || 1.0;

  //TODO: This is a pretty awful way of doing this. Find something better.
  out[0] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  out[1] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  out[2] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  out[3] = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]();
  normalize(out, out);
  scale(out, out, vectorScale);
  return out;
}

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec4} out
 */
function transformMat4(out, a, m) {
  let x = a[0], y = a[1], z = a[2], w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
}

/**
 * Transforms the vec4 with a quat
 *
 * @param {vec4} out the receiving vector
 * @param {vec4} a the vector to transform
 * @param {quat} q quaternion to transform with
 * @returns {vec4} out
 */
function transformQuat(out, a, q) {
  let x = a[0], y = a[1], z = a[2];
  let qx = q[0], qy = q[1], qz = q[2], qw = q[3];

  // calculate quat * vec
  let ix = qw * x + qy * z - qz * y;
  let iy = qw * y + qz * x - qx * z;
  let iz = qw * z + qx * y - qy * x;
  let iw = -qx * x - qy * y - qz * z;

  // calculate result * inverse quat
  out[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  out[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  out[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx;
  out[3] = a[3];
  return out;
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec4} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Returns whether or not the vectors have exactly the same elements in the same position (when compared with ===)
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec4} a The first vector.
 * @param {vec4} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
}

/**
 * Alias for {@link vec4.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;


/**
 * Alias for {@link vec4.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link vec4.divide}
 * @function
 */
const div = divide;
/* harmony export (immutable) */ __webpack_exports__["div"] = div;


/**
 * Alias for {@link vec4.distance}
 * @function
 */
const dist = distance;
/* harmony export (immutable) */ __webpack_exports__["dist"] = dist;


/**
 * Alias for {@link vec4.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["sqrDist"] = sqrDist;


/**
 * Alias for {@link vec4.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Alias for {@link vec4.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Perform some operation over an array of vec4s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec4. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec4s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 4;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1]; vec[2] = a[i+2]; vec[3] = a[i+3];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1]; a[i+2] = vec[2]; a[i+3] = vec[3];
    }

    return a;
  };
})();
/* harmony export (immutable) */ __webpack_exports__["forEach"] = forEach;



/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var addLeadingSlash = exports.addLeadingSlash = function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
};

var stripLeadingSlash = exports.stripLeadingSlash = function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
};

var hasBasename = exports.hasBasename = function hasBasename(path, prefix) {
  return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path);
};

var stripBasename = exports.stripBasename = function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
};

var stripTrailingSlash = exports.stripTrailingSlash = function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
};

var parsePath = exports.parsePath = function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';

  var hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
};

var createPath = exports.createPath = function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;


  var path = pathname || '/';

  if (search && search !== '?') path += search.charAt(0) === '?' ? search : '?' + search;

  if (hash && hash !== '#') path += hash.charAt(0) === '#' ? hash : '#' + hash;

  return path;
};

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

if (false) {
  warning = function(condition, format, args) {
    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

module.exports = warning;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = work;
function work() {
	var plot = function plot(_ref) {
		var iterations = _ref.iterations,
		    radiusA = _ref.radiusA,
		    radiusB = _ref.radiusB,
		    a = _ref.a,
		    b = _ref.b,
		    d = _ref.d,
		    thetaThreshold = _ref.thetaThreshold,
		    divisions = _ref.divisions,
		    index = _ref.index,
		    leadingEdge = _ref.leadingEdge,
		    trailingEdge = _ref.trailingEdge,
		    ribbon = _ref.ribbon;

		var tau = Math.PI * 2;
		var radiusC = Math.min(radiusA, radiusB);
		var start = tau * index / divisions;
		var end = start + tau / divisions;
		var span = end - start;
		var full = Math.round(tau / thetaThreshold);
		var divided = Math.round(full / divisions);
		var total = divided * divisions;
		var vertices = divided;
		var slice = span / vertices;
		var lissajous = true;
		var latitudeBands = vertices;
		var longitudeBands = 1;
		var positionArray = [];
		var normalArray = [];
		var coordArray = [];
		var debuggingSpace = false;
		var length = latitudeBands; //
		for (var latNumber = 0; latNumber < length; latNumber++) {
			// vertices
			var theta1 = start + latNumber * slice;
			var theta2 = start + (latNumber + 1) * slice;
			for (var longNumber = 0; longNumber <= longitudeBands; longNumber++) {
				// ribbon
				var U = 0;
				var V = theta1 / tau;
				var phi = longNumber * ribbon;
				var asymmetry = trailingEdge;
				if (longNumber % 2) asymmetry = leadingEdge;
				var vx1 = 0,
				    vy1 = 0,
				    vz1 = 0,
				    vx2 = 0,
				    vy2 = 0,
				    vz2 = 0;
				var nx1 = 0,
				    ny1 = 0,
				    nz1 = 0,
				    nx2 = 0,
				    ny2 = 0,
				    nz2 = 0;
				var i = iterations;
				do {
					var v = i * i * asymmetry,
					    v1 = v + i * theta1,
					    v2 = v + i * theta2,
					    v3 = v + i * phi;
					var sin1 = lissajous ? Math.sin(b * v1) : Math.sin(v1);
					var cos1 = lissajous ? Math.sin(a * v1 + d) : Math.cos(v1);
					var sin2 = lissajous ? Math.sin(b * v2) : Math.sin(v2);
					var cos2 = lissajous ? Math.sin(a * v2 + d) : Math.cos(v2);
					var sin3 = lissajous ? Math.sin(b * v3) : Math.sin(v3);
					var cos3 = lissajous ? Math.sin(a * v3 + d) : Math.cos(v3);
					var x1 = sin1 * cos3 / i,
					    y1 = cos1 / i,
					    z1 = sin1 * sin3 / i,
					    x2 = sin2 * cos3 / i,
					    y2 = cos2 / i,
					    z2 = sin2 * sin3 / i;
					nx1 += x1;
					ny1 += y1;
					nz1 += z1;
					nx2 += x2;
					ny2 += y2;
					nz2 += z2;
					vx1 += radiusA * x1;
					vy1 += radiusB * y1;
					vz1 += radiusC * z1;
					vx2 += radiusA * x2;
					vy2 += radiusB * y2;
					vz2 += radiusC * z2;
				} while (--i);
				positionArray.push(vx1);
				positionArray.push(vy1);
				positionArray.push(vz1);
				positionArray.push(vx2);
				positionArray.push(vy2);
				positionArray.push(vz2);
				normalArray.push(nx1);
				normalArray.push(ny1);
				normalArray.push(nz1);
				normalArray.push(nx2);
				normalArray.push(ny2);
				normalArray.push(nz2);
				coordArray.push(U);
				coordArray.push(V);
				coordArray.push(U);
				coordArray.push(V);
			}
		}
		return {
			positionArray: positionArray,
			normalArray: normalArray,
			coordArray: coordArray
		};
	};

	self.addEventListener("message", function (e) {
		var result = plot(e.data);
		self.postMessage(result);
	}, false);

	return plot; // DRY plot function, used outside of worker
}

/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__gl_matrix_common__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__gl_matrix_mat2__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__gl_matrix_mat2d__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__gl_matrix_mat3__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gl_matrix_mat4__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__gl_matrix_quat__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__gl_matrix_vec2__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__gl_matrix_vec3__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__gl_matrix_vec4__ = __webpack_require__(3);
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "glMatrix", function() { return __WEBPACK_IMPORTED_MODULE_0__gl_matrix_common__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat2", function() { return __WEBPACK_IMPORTED_MODULE_1__gl_matrix_mat2__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat2d", function() { return __WEBPACK_IMPORTED_MODULE_2__gl_matrix_mat2d__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat3", function() { return __WEBPACK_IMPORTED_MODULE_3__gl_matrix_mat3__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "mat4", function() { return __WEBPACK_IMPORTED_MODULE_4__gl_matrix_mat4__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "quat", function() { return __WEBPACK_IMPORTED_MODULE_5__gl_matrix_quat__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "vec2", function() { return __WEBPACK_IMPORTED_MODULE_6__gl_matrix_vec2__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "vec3", function() { return __WEBPACK_IMPORTED_MODULE_7__gl_matrix_vec3__; });
/* harmony reexport (module object) */ __webpack_require__.d(__webpack_exports__, "vec4", function() { return __WEBPACK_IMPORTED_MODULE_8__gl_matrix_vec4__; });
/**
 * @fileoverview gl-matrix - High performance matrix and vector operations
 * @author Brandon Jones
 * @author Colin MacKenzie IV
 * @version 2.4.0
 */

/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */
// END HEADER













/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _warning = __webpack_require__(5);

var _warning2 = _interopRequireDefault(_warning);

var _invariant = __webpack_require__(19);

var _invariant2 = _interopRequireDefault(_invariant);

var _LocationUtils = __webpack_require__(17);

var _PathUtils = __webpack_require__(4);

var _createTransitionManager = __webpack_require__(18);

var _createTransitionManager2 = _interopRequireDefault(_createTransitionManager);

var _DOMUtils = __webpack_require__(16);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

var getHistoryState = function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {};
  }
};

/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
var createBrowserHistory = function createBrowserHistory() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  (0, _invariant2.default)(_DOMUtils.canUseDOM, 'Browser history needs a DOM');

  var globalHistory = window.history;
  var canUseHistory = (0, _DOMUtils.supportsHistory)();
  var needsHashChangeListener = !(0, _DOMUtils.supportsPopStateOnHashChange)();

  var _props$forceRefresh = props.forceRefresh,
      forceRefresh = _props$forceRefresh === undefined ? false : _props$forceRefresh,
      _props$getUserConfirm = props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === undefined ? _DOMUtils.getConfirmation : _props$getUserConfirm,
      _props$keyLength = props.keyLength,
      keyLength = _props$keyLength === undefined ? 6 : _props$keyLength;

  var basename = props.basename ? (0, _PathUtils.stripTrailingSlash)((0, _PathUtils.addLeadingSlash)(props.basename)) : '';

  var getDOMLocation = function getDOMLocation(historyState) {
    var _ref = historyState || {},
        key = _ref.key,
        state = _ref.state;

    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;


    var path = pathname + search + hash;

    (0, _warning2.default)(!basename || (0, _PathUtils.hasBasename)(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');

    if (basename) path = (0, _PathUtils.stripBasename)(path, basename);

    return (0, _LocationUtils.createLocation)(path, state, key);
  };

  var createKey = function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  };

  var transitionManager = (0, _createTransitionManager2.default)();

  var setState = function setState(nextState) {
    _extends(history, nextState);

    history.length = globalHistory.length;

    transitionManager.notifyListeners(history.location, history.action);
  };

  var handlePopState = function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if ((0, _DOMUtils.isExtraneousPopstateEvent)(event)) return;

    handlePop(getDOMLocation(event.state));
  };

  var handleHashChange = function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  };

  var forceNextPop = false;

  var handlePop = function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';

      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({ action: action, location: location });
        } else {
          revertPop(location);
        }
      });
    }
  };

  var revertPop = function revertPop(fromLocation) {
    var toLocation = history.location;

    // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    var toIndex = allKeys.indexOf(toLocation.key);

    if (toIndex === -1) toIndex = 0;

    var fromIndex = allKeys.indexOf(fromLocation.key);

    if (fromIndex === -1) fromIndex = 0;

    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  };

  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key];

  // Public interface

  var createHref = function createHref(location) {
    return basename + (0, _PathUtils.createPath)(location);
  };

  var push = function push(path, state) {
    (0, _warning2.default)(!((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored');

    var action = 'PUSH';
    var location = (0, _LocationUtils.createLocation)(path, state, createKey(), history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;

      var href = createHref(location);
      var key = location.key,
          state = location.state;


      if (canUseHistory) {
        globalHistory.pushState({ key: key, state: state }, null, href);

        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          var nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);

          nextKeys.push(location.key);
          allKeys = nextKeys;

          setState({ action: action, location: location });
        }
      } else {
        (0, _warning2.default)(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history');

        window.location.href = href;
      }
    });
  };

  var replace = function replace(path, state) {
    (0, _warning2.default)(!((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored');

    var action = 'REPLACE';
    var location = (0, _LocationUtils.createLocation)(path, state, createKey(), history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) return;

      var href = createHref(location);
      var key = location.key,
          state = location.state;


      if (canUseHistory) {
        globalHistory.replaceState({ key: key, state: state }, null, href);

        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);

          if (prevIndex !== -1) allKeys[prevIndex] = location.key;

          setState({ action: action, location: location });
        }
      } else {
        (0, _warning2.default)(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history');

        window.location.replace(href);
      }
    });
  };

  var go = function go(n) {
    globalHistory.go(n);
  };

  var goBack = function goBack() {
    return go(-1);
  };

  var goForward = function goForward() {
    return go(1);
  };

  var listenerCount = 0;

  var checkDOMListeners = function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1) {
      (0, _DOMUtils.addEventListener)(window, PopStateEvent, handlePopState);

      if (needsHashChangeListener) (0, _DOMUtils.addEventListener)(window, HashChangeEvent, handleHashChange);
    } else if (listenerCount === 0) {
      (0, _DOMUtils.removeEventListener)(window, PopStateEvent, handlePopState);

      if (needsHashChangeListener) (0, _DOMUtils.removeEventListener)(window, HashChangeEvent, handleHashChange);
    }
  };

  var isBlocked = false;

  var block = function block() {
    var prompt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  };

  var listen = function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);

    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  };

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };

  return history;
};

exports.default = createBrowserHistory;

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export typeForStyle */
/* unused harmony export registerAnimatableStyles */
/* unused harmony export activateElement */
/* unused harmony export transformType */
/* unused harmony export colorType */
/* unused harmony export nonNumericType */
/* unused harmony export integerType */
/* unused harmony export opacityType */
/* unused harmony export lengthType */
/* unused harmony export lengthAutoType */
/* unused harmony export positionType */
/* unused harmony export positionListType */
/* unused harmony export rectangleType */
/* unused harmony export shadowType */
/* unused harmony export fontWeightType */
/* unused harmony export visibilityType */
/* unused harmony export beginTransaction */
/* unused harmony export commitTransaction */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return currentTransaction; });
/* unused harmony export flushTransaction */
/* unused harmony export disableAnimation */
/* unused harmony export decorate */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return activate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return HyperNumber; });
/* unused harmony export HyperScale */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return HyperArray; });
/* unused harmony export HyperSet */
/* unused harmony export HyperPoint */
/* unused harmony export HyperSize */
/* unused harmony export HyperRect */
/* unused harmony export hyperNotFound */
/* unused harmony export hyperMakeRect */
/* unused harmony export hyperZeroRect */
/* unused harmony export hyperEqualRects */
/* unused harmony export hyperMakePoint */
/* unused harmony export hyperZeroPoint */
/* unused harmony export hyperEqualPoints */
/* unused harmony export hyperMakeSize */
/* unused harmony export hyperZeroSize */
/* unused harmony export hyperEqualSizes */
/* unused harmony export hyperMakeRange */
/* unused harmony export hyperZeroRange */
/* unused harmony export hyperNullRange */
/* unused harmony export hyperIndexInRange */
/* unused harmony export hyperEqualRanges */
/* unused harmony export hyperIntersectionRange */
var rAF = typeof window !== "undefined" && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame) || function (callback) {
	setTimeout(callback, 0);
};

function isFunction$1(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

var now = Date.getTime;
if (Date.now) now = Date.now;
if (typeof window !== "undefined" && typeof window.performance !== "undefined" && typeof window.performance.now !== "undefined") now = window.performance.now.bind(window.performance);

function HyperTransaction(settings) {
	this.time; // set in createTransaction so value is same as parent transaction and can be frozen
	this.disableAnimation = false; // value should probably be inherited from parent transaction
	this.duration;
	this.easing;
	//this.completionHandler; // would be nice
	if (settings) Object.keys(settings).forEach(function (key) {
		this[key] = settings[key];
	}.bind(this));
}

function HyperContext() {
	this.targets = [];
	this.getPresentations = [];
	this.getAnimationCounts = [];
	this.transactions = [];
	this.ticking = false;
	this.animationFrame;
	this.displayLayers = []; // renderLayer
	this.displayFunctions = []; // strange new implementation // I don"t want to expose delegate accessor on the controller, so I pass a bound function, easier to make changes to public interface.
	this.cleanupFunctions = [];
	this.invalidateFunctions = [];
}

HyperContext.prototype = {
	createTransaction: function createTransaction(settings, automaticallyCommit) {
		var transaction = new HyperTransaction(settings);
		var length = this.transactions.length;
		var time = now() / 1000;
		if (length) time = this.transactions[length - 1].representedObject.time; // Clock stops in the outermost transaction.
		Object.defineProperty(transaction, "time", { // Manually set time of transaction here to be not configurable
			get: function get() {
				return time;
			},
			enumerable: true,
			configurable: false
		});
		this.transactions.push({ representedObject: transaction, automaticallyCommit: automaticallyCommit });
		if (automaticallyCommit) this.startTicking(); // Automatic transactions will otherwise not be closed if there is no animation or value set.
		return transaction;
	},
	currentTransaction: function currentTransaction() {
		var length = this.transactions.length;
		if (length) return this.transactions[length - 1].representedObject;
		return this.createTransaction({}, true);
	},
	beginTransaction: function beginTransaction(settings) {
		// TODO: throw on unclosed (user created) transaction
		return this.createTransaction(settings, false);
	},
	commitTransaction: function commitTransaction() {
		this.transactions.pop();
	},
	flushTransaction: function flushTransaction() {
		// TODO: prevent unterminated when called within display
		this.invalidateFunctions.forEach(function (invalidate) {
			// this won"t work if there are no animations thus not registered
			invalidate();
		});
	},
	disableAnimation: function disableAnimation(disable) {
		// If this is false, it enables animation
		if (disable !== false) disable = true; // because the function name is misleading
		var transaction = this.currentTransaction();
		transaction.disableAnimation = disable;
		this.startTicking();
	},

	registerTarget: function registerTarget(target, getPresentation, getAnimationCount, display, invalidate, cleanup) {
		var layer = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : null;

		this.startTicking();
		var index = this.targets.indexOf(target);
		if (index < 0) {
			this.targets.push(target);
			this.getPresentations.push(getPresentation);
			this.getAnimationCounts.push(getAnimationCount);
			this.displayLayers.push(layer);
			this.displayFunctions.push(display);
			this.cleanupFunctions.push(cleanup);
			this.invalidateFunctions.push(invalidate);
		}
	},

	deregisterTarget: function deregisterTarget(target) {
		var index = this.targets.indexOf(target);
		if (index > -1) {
			this.targets.splice(index, 1);
			this.getPresentations.splice(index, 1);
			this.getAnimationCounts.splice(index, 1);
			this.displayLayers.splice(index, 1);
			this.displayFunctions.splice(index, 1);
			this.cleanupFunctions.splice(index, 1);
			this.invalidateFunctions.splice(index, 1);
		}
	},

	startTicking: function startTicking() {
		// TODO: consider cancelling previous animation frame.
		if (!this.animationFrame) this.animationFrame = rAF(this.ticker.bind(this));
	},
	ticker: function ticker() {
		// Need to manually cancel animation frame if calling directly.
		this.animationFrame = undefined;
		var targets = this.targets; // experimental optimization, traverse backwards so you can remove. This has caused problems for me before, but I don"t think I was traversing backwards.
		var i = targets.length;
		while (i--) {
			var target = targets[i];
			var display = this.displayFunctions[i]; // this may not exist
			var animationCount = this.getAnimationCounts[i](); // should exist
			var getPresentation = this.getPresentations[i]; // should exist
			if (!animationCount) {
				// Deregister from inside ticker is redundant (removalCallback & removeAnimationInstance), but is still needed when needsDisplay()
				if (isFunction$1(display)) {
					var presentationLayer = getPresentation();
					display(presentationLayer);
				}
				this.invalidateFunctions[i]();
				this.deregisterTarget(target); // Deregister here to ensure one more tick after last animation has been removed. Different behavior than removalCallback & removeAnimationInstance, for example needsDisplay()
			} else {
				var _presentationLayer = getPresentation();
				if (this.displayLayers[i] !== _presentationLayer) {
					// suppress unnecessary displays
					this.displayLayers[i] = _presentationLayer;
					display(_presentationLayer);
					this.invalidateFunctions[i]();
				}
				this.cleanupFunctions[i](); // New style cleanup in ticker.
			}
		}
		var length = this.transactions.length;
		if (length) {
			var transactionWrapper = this.transactions[length - 1];
			if (transactionWrapper.automaticallyCommit) this.commitTransaction();
		}
		if (this.targets.length) this.startTicking();
	}
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var TRANSACTION_DURATION_ALONE_IS_ENOUGH$1 = true;

var animationNumber = 0;

var wetNumberType = { // WET
	zero: function zero() {
		return 0;
	},
	add: function add(a, b) {
		return a + b;
	},
	subtract: function subtract(a, b) {
		return a - b;
	},
	interpolate: function interpolate(a, b, progress) {
		return a + (b - a) * progress;
	}
};

function isFunction$2(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

function isNumber(w) {
	// WET
	return !isNaN(parseFloat(w)) && isFinite(w); // I want infinity for repeat count. Duration for testing additive.
}

function isObject(w) {
	return w && (typeof w === "undefined" ? "undefined" : _typeof(w)) === "object";
}

function HyperChain(childrenOrSettings) {
	var children = [];
	if (Array.isArray(childrenOrSettings)) children = childrenOrSettings;else if (childrenOrSettings && Array.isArray(childrenOrSettings.chain)) children = childrenOrSettings.chain;
	this.chain = children.map(function (animation) {
		return animationFromDescription(animation);
	});
	// 	this.sortIndex;
	// 	this.startTime;
	// 	this.onend;
	Object.defineProperty(this, "finished", {
		get: function get$$1() {
			if (!this.chain.length) return true;
			return this.chain[this.chain.length - 1].finished;
		},
		enumerable: false,
		configurable: false
	});
	if (childrenOrSettings && !Array.isArray(childrenOrSettings)) Object.keys(childrenOrSettings).forEach(function (key) {
		if (key !== "chain" && key !== "finished") this[key] = childrenOrSettings[key];
	}.bind(this));
}

HyperChain.prototype = {
	constructor: HyperChain,
	copy: function copy() {
		return new this.constructor(this);
	},
	runAnimation: function runAnimation(layer, key, transaction) {
		this.sortIndex = animationNumber++;
		if (this.startTime === null || typeof this.startTime === "undefined") this.startTime = transaction.time;
		var length = this.chain.length;
		var fakeTransaction = Object.assign({}, transaction);
		var startTime = this.startTime;
		for (var index = 0; index < length; index++) {
			var animation = this.chain[index];
			fakeTransaction.time = startTime;
			animation.runAnimation.call(animation, layer, key, fakeTransaction);
			if (startTime === Infinity || animation.iterations === Infinity) startTime = Infinity; // TODO: negative infinity?
			else startTime = startTime + animation.delay + animation.duration * animation.iterations;
		}
	},
	composite: function composite(onto, now) {
		var changed = false;
		var length = this.chain.length;
		for (var index = 0; index < length; index++) {
			var animation = this.chain[index];
			changed = animation.composite.call(animation, onto, now) || changed;
		}
		return changed;
	},
	convert: function convert(funky, self) {
		// mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
		if (isFunction$2(funky)) this.chain.forEach(function (animation) {
			animation.convert.call(animation, funky, self);
		});
	}
};
HyperChain.prototype.description = function (delegate) {
	var copy = Object.assign({}, this);
	copy.chain = this.chain.map(function (animation) {
		return animation.description(delegate);
	});
	return copy;
};

function HyperGroup(childrenOrSettings) {
	var children = [];
	if (Array.isArray(childrenOrSettings)) children = childrenOrSettings;else if (childrenOrSettings && childrenOrSettings.group) children = childrenOrSettings.group;

	this.group = children.map(function (animation) {
		return animationFromDescription(animation);
	});
	// 	this.sortIndex;
	// 	this.startTime;
	// 	this.onend;
	Object.defineProperty(this, "finished", {
		get: function get$$1() {
			var result = true;
			this.group.forEach(function (animation) {
				if (!animation.finished) result = false;
			});
			return result;
		},
		enumerable: false,
		configurable: false
	});
	if (childrenOrSettings && !Array.isArray(childrenOrSettings)) Object.keys(childrenOrSettings).forEach(function (key) {
		if (key !== "group" && key !== "finished") this[key] = childrenOrSettings[key];
	}.bind(this));
}

HyperGroup.prototype = {
	constructor: HyperGroup,
	copy: function copy() {
		return new this.constructor(this);
	},
	runAnimation: function runAnimation(layer, key, transaction) {
		this.sortIndex = animationNumber++;
		if (this.startTime === null || typeof this.startTime === "undefined") this.startTime = transaction.time;
		this.group.forEach(function (animation) {
			animation.runAnimation.call(animation, layer, key, transaction);
		});
	},
	composite: function composite(onto, now) {
		var changed = false;
		this.group.forEach(function (animation) {
			changed = animation.composite.call(animation, onto, now) || changed;
		});
		return changed;
	},
	convert: function convert(funky, self) {
		// mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
		if (isFunction$2(funky)) this.group.forEach(function (animation) {
			animation.convert.call(animation, funky, self);
		});
	}
};
HyperGroup.prototype.description = function (delegate) {
	var copy = Object.assign({}, this);
	copy.group = this.group.map(function (animation) {
		return animation.description(delegate);
	});
	return copy;
};

function hyperActionIsFilling(action) {
	// used in Core:cleanupAnimationAtIndex // does not apply to group & chain animations, or animations contained in a group or chain
	// Animations with a fill will be very inefficient, because composite will always return true for changed
	return action.finished && (action.fillMode === "forwards" || action.fillMode === "both"); // incomplete
} // TODO: Determine CA behavior with autoreverses && backwards fill

function HyperAction() {
	this.property; // string, property name
	this.type = wetNumberType; // Default
	this.duration; // float. In seconds. Need to validate/ensure >= 0. Initialized in runAnimation
	this.easing; // NOT FINISHED. currently callback function only, need cubic bezier and presets. Defaults to linear. Initialized in runAnimation
	this.speed; // NOT FINISHED. float. RECONSIDER. Pausing currently not possible like in Core Animation. Layers have speed, beginTime, timeOffset! Initialized in runAnimation
	this.iterations; // float >= 0. Initialized in runAnimation
	this.autoreverse; // boolean. When iterations > 1. Easing also reversed. Maybe should be named "autoreverses", maybe should be camelCased
	this.fillMode; // string. Defaults to "none". NOT FINISHED is an understatement. "forwards" and "backwards" are "both". maybe should be named "fill". maybe should just be a boolean. // I'm unsure of the effect of combining a forward fill with additive // TODO: implement removedOnCompletion
	this.index = 0; // float. Custom compositing order.
	this.delay = 0; // float. In seconds. // TODO: easing should be taken in effect after the delay
	this.blend = "relative"; // also "absolute" // Default should be "absolute" if explicit
	this.additive = true;
	this.sort;
	this.finished = false;
	this.startTime; // float // Should this be private?
	this.progress; //null; // 0 would mean first frame does not count as a change which I want for stepEnd but probably not anything else. Also complicating is separate cachedPresentationlayer and context displayLayers. No longer initialized in runAnimation
	this.onend; // NOT FINISHED. callback function, fires regardless of fillMode. Should rename. Should also implement didStart, maybe didTick, etc.
	//this.naming; // "default","exact","increment","nil" // why not a key property?
	this.remove = true;
} // Can't freeze animation objects while implementation of core cleanup sets onend function to null
HyperAction.prototype = {
	copy: function copy() {
		// TODO: "Not Optimized. Reference to a variable that requires dynamic lookup" !!! // https://github.com/GoogleChrome/devtools-docs/issues/53
		return new this.constructor(this);
		// 		const copy = new this.constructor(this.settings);
		// 		const keys = Object.getOwnPropertyNames(this);
		// 		const length = keys.length;
		// 		for (let i = 0; i < length; i++) {
		// 			Object.defineProperty(copy, keys[i], Object.getOwnPropertyDescriptor(this, keys[i]));
		// 		}
		// 		return copy;
	},
	composite: function composite(onto, now) {
		if (this.startTime === null || this.startTime === undefined) throw new Error("Cannot composite an animation that has not been started."); // return this.type.zero();
		if (this.startTime > now && this.fillMode !== "backwards" && this.fillMode !== "both") return false;
		if (this.finished && this.fillMode !== "forwards" && this.fillMode !== "both") return false;
		var elapsed = Math.max(0, now - (this.startTime + this.delay));
		var speed = this.speed; // might make speed a property of layer, not animation, might not because no sublayers / layer hierarcy
		var iterationProgress = 1;
		var combinedProgress = 1;
		var iterationDuration = this.duration;
		var combinedDuration = iterationDuration * this.iterations;
		if (combinedDuration) {
			iterationProgress = elapsed * speed / iterationDuration;
			combinedProgress = elapsed * speed / combinedDuration;
		}
		if (combinedProgress >= 1) {
			iterationProgress = 1;
			this.finished = true;
		}
		var inReverse = 0; // falsy
		if (!this.finished) {
			if (this.autoreverse === true) inReverse = Math.floor(iterationProgress) % 2;
			iterationProgress = iterationProgress % 1; // modulus for iterations
		}
		if (inReverse) iterationProgress = 1 - iterationProgress; // easing is also reversed
		if (isFunction$2(this.easing)) iterationProgress = this.easing(iterationProgress);else if (this.easing === "step-start") iterationProgress = Math.ceil(iterationProgress);else if (this.easing === "step-middle") iterationProgress = Math.round(iterationProgress);else if (this.easing === "step-end") iterationProgress = Math.floor(iterationProgress);else {
			// TODO: match web-animations syntax
			// TODO: refine regex, perform once in runAnimation
			// FIXME: step-end displays twice (actually thrice). Should I just display once, not at the start?
			var rounded = 0.5 - Math.cos(iterationProgress * Math.PI) / 2;
			if (this.easing) {
				var steps = /(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);
				if (steps) {
					var desc = steps[1];
					var count = steps[2];
					if (count > 0) {
						if (desc === "step-start") iterationProgress = Math.ceil(iterationProgress * count) / count;else if (desc === "step-middle") iterationProgress = Math.round(iterationProgress * count) / count;else if (desc === "step-end" || desc === "steps") iterationProgress = Math.floor(iterationProgress * count) / count;
					} else if (this.easing !== "linear") iterationProgress = rounded;
				} else if (this.easing !== "linear") iterationProgress = rounded;
			} else iterationProgress = rounded;
		}
		var value = void 0;
		if (this instanceof HyperKeyframes) {
			// TODO: This is just wrong
			var length = this.keyframes.length;
			if (!length) throw new Error("HyperAction composite need to be able to handle zero keyframes");
			if (length === 1) throw new Error("HyperAction composite need to be able to handle one keyframe");
			var i = length - 1;
			while (i--) {
				// TODO: test that this works in reverse
				if (iterationProgress >= this.offsets[i]) break;
			}
			var previous = i;
			var next = previous + 1;
			var frameSpan = this.offsets[next] - this.offsets[previous];
			if (frameSpan === 0) throw new Error("can't divide by zero. check your keyframe offsets.");
			var frameLocation = iterationProgress - this.offsets[previous];
			var frameProgress = frameLocation / frameSpan;
			if (this.blend === "absolute") value = this.type.interpolate(this.keyframes[previous], this.keyframes[next], frameProgress);else value = this.type.interpolate(this.delta[previous], this.delta[next], frameProgress); // sending argument to zero() for css transforms (or custom types)
		} else {
			// HyperAnimation
			if (this.blend === "absolute") value = this.type.interpolate(this.from, this.to, iterationProgress);else value = this.type.interpolate(this.delta, this.type.zero(this.to), iterationProgress); // sending argument to zero() for css transforms (or custom types)
		}
		var property = this.property;
		if (typeof property !== "undefined" && property !== null) {
			// allow animating without declaring property
			var result = value;
			var underlying = onto[property];
			if (typeof underlying === "undefined" || underlying === null) underlying = this.type.zero(this.to); // ORIGINAL // TODO: assess this // FIXME: transform functions? Underlying will never be undefined as it is a registered property, added to modelLayer. Unless you can animate properties that have not been registered, which is what I want
			if (this.additive) result = this.type.add(underlying, value);
			if (this.sort && Array.isArray(result)) result.sort(this.sort);
			onto[property] = result;
		}
		var changed = iterationProgress !== this.progress || this.finished; // Animations with a fill will be very inefficient.
		this.progress = iterationProgress;
		return changed;
	}
};

function HyperKeyframes(settings) {
	HyperAction.call(this);
	var children = [];
	if (settings && Array.isArray(settings.keyframes)) children = settings.keyframes;
	this.keyframes = children;
	var length = this.keyframes.length;

	if (settings) Object.keys(settings).forEach(function (key) {
		if (key !== "keyframes") this[key] = settings[key];
	}.bind(this));

	// TODO: lots of validation
	// TODO: composite assumes offsets are in order, and not equal (need to prevent dividing by zero)

	if (!Array.isArray(this.offsets) || this.offsets.length !== length) {
		// TODO: handle zero or one frames
		if (length < 2) this.offsets = [];else this.offsets = this.keyframes.map(function (item, index) {
			return index / (length - 1);
		});
	} else this.offsets.sort(function (a, b) {
		// TODO: maybe verify all offset are actually numbers, between 0 and 1
		return a - b;
	});
	this.progress = null;
}

HyperKeyframes.prototype = Object.create(HyperAction.prototype);
HyperKeyframes.prototype.constructor = HyperKeyframes;
HyperKeyframes.prototype.copy = function () {
	return new this.constructor(this);
};
HyperKeyframes.prototype.runAnimation = function (layer, key, transaction) {
	if (isFunction$2(this.type)) this.type = new this.type();
	if (this.type && isFunction$2(this.type.zero) && isFunction$2(this.type.add) && isFunction$2(this.type.subtract) && isFunction$2(this.type.interpolate)) {
		if (this.blend !== "absolute" && this.keyframes.length) {
			var last = this.keyframes.length - 1;
			var array = [];
			for (var i = 0; i < last; i++) {
				array[i] = this.type.subtract(this.keyframes[i], this.keyframes[last]);
			}
			array[last] = this.type.zero(this.keyframes[last]);
			this.delta = array;
		}
		if (this.duration === null || typeof this.duration === "undefined") this.duration = transaction.duration; // This is consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
		if (this.easing === null || typeof this.easing === "undefined") this.easing = transaction.easing; // This is (probably) consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
		if (this.speed === null || typeof this.speed === "undefined") this.speed = 1.0; // need better validation
		if (this.iterations === null || typeof this.iterations === "undefined") this.iterations = 1; // negative values have no effect
		if (typeof this.startTime === "undefined" || this.startTime === null) this.startTime = transaction.time;
		this.sortIndex = animationNumber++;
	} else throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");
};
HyperKeyframes.prototype.convert = function (funky, self) {
	// mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
	if (isFunction$2(funky) && this.property) {
		var properties = ["keyframes", "delta"];
		properties.forEach(function (item) {
			var _this = this;

			// HyperKeyframes
			if (this[item]) {
				var array = this[item].slice(0);
				this[item] = array.map(function (value) {
					return funky.call(self, _this.property, value); // intentionally allows animations with an undefined property
				});
			}
		}.bind(this));
	}
};
HyperKeyframes.prototype.description = function (delegate) {
	var copy = Object.assign({}, this);
	this.convert.call(copy, delegate.output, delegate);
	return copy;
};

function HyperAnimation(settings) {
	HyperAction.call(this);
	this.from; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.to; // type specific. Subclasses must implement zero, add, subtract and interpolate. invert is no longer used
	this.delta; // Should this be private?

	if (settings) Object.keys(settings).forEach(function (key) {
		this[key] = settings[key];
	}.bind(this));
	this.progress = null;
}

HyperAnimation.prototype = Object.create(HyperAction.prototype);
HyperAnimation.prototype.constructor = HyperAnimation;
HyperAnimation.prototype.runAnimation = function (layer, key, transaction) {
	if (!this.type) {
		this.type = wetNumberType; // questionable if I should do this here
	}
	if (isFunction$2(this.type)) this.type = new this.type();
	if (this.type && isFunction$2(this.type.zero) && isFunction$2(this.type.add) && isFunction$2(this.type.subtract) && isFunction$2(this.type.interpolate)) {
		if (!this.from) this.from = this.type.zero(this.to);
		if (!this.to) this.to = this.type.zero(this.from);
		if (this.blend !== "absolute") this.delta = this.type.subtract(this.from, this.to);
		if (this.duration === null || typeof this.duration === "undefined") this.duration = transaction.duration; // This is consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
		if (this.easing === null || typeof this.easing === "undefined") this.easing = transaction.easing; // This is (probably) consistent with CA behavior // TODO: need better validation. Currently split across constructor, setter, and here
		if (this.speed === null || typeof this.speed === "undefined") this.speed = 1.0; // need better validation
		if (this.iterations === null || typeof this.iterations === "undefined") this.iterations = 1; // negative values have no effect
		//this.progress = 0.0; // keep progress null so first tick is considered a change
		if (typeof this.startTime === "undefined" || this.startTime === null) this.startTime = transaction.time;
		this.sortIndex = animationNumber++;
	} else throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");
};
HyperAnimation.prototype.convert = function (funky, self) {
	// mutates // animation from, to, and delta // Now with description method for output, this is only called in addAnimation
	if (isFunction$2(funky) && this.property) {
		var properties = ["from", "to", "delta"]; // addAnimation only has from and to, delta is calcuated from ugly values in runAnimation
		properties.forEach(function (item) {
			// HyperAnimation
			var value = this[item];
			if (value !== null && typeof value !== "undefined") this[item] = funky.call(self, this.property, value); // intentionally allows animations with an undefined property
		}.bind(this));
	}
};
HyperAnimation.prototype.description = function (delegate) {
	var copy = Object.assign({}, this);
	this.convert.call(copy, delegate.output, delegate);
	return copy;
};

function animationFromDescription(description) {
	var animation = void 0;
	if (!description && (TRANSACTION_DURATION_ALONE_IS_ENOUGH$1 || description !== 0)) return description; // TODO: if animationForKey returns null, stops. But defaultAnimation does not behave like CA animation dict and should
	if (description instanceof HyperAction || description instanceof HyperKeyframes || description instanceof HyperGroup || description instanceof HyperChain) {
		animation = description.copy.call(description);
	} else if (Array.isArray(description)) {
		animation = new HyperGroup(description);
	} else if (isObject(description)) {
		// TODO: if has both keyframes and from/to, descriptions could return a group of both. But why?
		if (TRANSACTION_DURATION_ALONE_IS_ENOUGH$1 && isFunction$2(description.add) && isFunction$2(description.subtract) && isFunction$2(description.zero) && isFunction$2(description.interpolate)) {
			// quack
			animation = new HyperAnimation({ type: description }); // for registerAnimatableProperty and implicit animation from transaction duration alone
		} else if (Array.isArray(description.keyframes)) animation = new HyperKeyframes(description);else if (Array.isArray(description.group)) animation = new HyperGroup(description);else if (Array.isArray(description.chain)) animation = new HyperChain(description);else animation = new HyperAnimation(description);
	} else if (isNumber(description)) animation = new HyperAnimation({ duration: description });else if (description === true) animation = new HyperAnimation({});else throw new Error("is this an animation:" + JSON.stringify(description));
	// TODO: What happened to instantiating if description is a function?
	return animation;
}

var TRANSACTION_DURATION_ALONE_IS_ENOUGH = true; // original was false and required a default animation, but CA behavior is true
var DELEGATE_DOUBLE_WHAMMY = true; // allow delegate the ability to convert key, to mangle for makeshift key paths.
var ENSURE_ONE_MORE_TICK = true; // true is needed to display one more time after all animations have ended. // false is needed to removeAllAnimations after unmount

var delegateMethods = ["display", "animationForKey", "input", "output"]; // animationForKey // hyperAction // reaction
var controllerMethods = ["addAnimation", "animationNamed", "needsDisplay", "registerAnimatableProperty", "removeAllAnimations", "removeAnimation"];
var controllerProperties = ["layer", "presentation", "model", "previous", "animations", "animationNames", "animationCount"];

var hyperContext = new HyperContext();

var beginTransaction = hyperContext.beginTransaction.bind(hyperContext);
var commitTransaction = hyperContext.commitTransaction.bind(hyperContext);
var currentTransaction = hyperContext.currentTransaction.bind(hyperContext);
var flushTransaction = hyperContext.flushTransaction.bind(hyperContext);
var disableAnimation = hyperContext.disableAnimation.bind(hyperContext);

function isFunction(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

function prepAnimationObjectFromAddAnimation(animation, delegate) {
	// If this is only called from addAnimation, why is it here?
	if (animation instanceof HyperAnimation || animation instanceof HyperKeyframes) {
		if (delegate && animation.property && isFunction(delegate.typeOfProperty)) {
			var type = delegate.typeOfProperty.call(delegate, animation.property);
			if (type) animation.type = type;
		}
	} else if (animation instanceof HyperGroup) {
		// recursive
		animation.group.forEach(function (childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate);
		});
	} else if (animation instanceof HyperChain) {
		// recursive
		animation.chain.forEach(function (childAnimation) {
			prepAnimationObjectFromAddAnimation(childAnimation, delegate);
		});
	} else throw new Error("not an animation");
}

function convertedKey(property, funky, self) {
	// DELEGATE_DOUBLE_WHAMMY // from addAnimation
	if (isFunction(funky)) return funky.call(self, property);
	return property;
}
function convertedValueOfPropertyWithFunction(value, property, funky, self) {
	// mutates // from register, modelLayer, and previousBacking
	if (isFunction(funky)) return funky.call(self, property, value);
	return value;
}
function convertPropertyOfLayerWithFunction(property, object, funky, self) {
	// mutates
	if (object && isFunction(funky)) {
		if (property === null || typeof property === "undefined") throw new Error("convert property undefined");
		var value = object[property];
		if (value !== null && typeof value !== "undefined") object[property] = funky.call(self, property, value);
	}
}
function convertPropertiesOfLayerWithFunction(properties, object, funky, self) {
	// mutates
	properties.forEach(function (property) {
		if (property === null || typeof property === "undefined") throw new Error("convert properties undefined");
		convertPropertyOfLayerWithFunction(property, object, funky, self);
	});
}

function presentationTransform(presentationLayer, sourceAnimations, time, shouldSortAnimations) {
	// COMPOSITING // This function is separated out here for now defunct hyperstyle behavior allowing manual composting given layer and animations.
	if (!sourceAnimations || !sourceAnimations.length) return false;
	if (shouldSortAnimations) {
		// animation index. No connection to setType animation sorting
		sourceAnimations.sort(function (a, b) {
			var A = a.index || 0;
			var B = b.index || 0;
			var result = A - B;
			if (!result) result = a.startTime - b.startTime;
			if (!result) result = a.sortIndex - b.sortIndex; // animation number is needed because sort is not guaranteed to be stable
			return result;
		});
	}
	var progressChanged = false;
	sourceAnimations.forEach(function (animation) {
		progressChanged = animation.composite(presentationLayer, time) || progressChanged; // progressChanged is a premature optimization
	});
	return progressChanged;
}

function implicitAnimation(property, prettyValue, prettyPrevious, prettyPresentation, delegate, defaultAnimation, transaction) {
	// TODO: Ensure modelLayer is fully populated before calls to animationForKey so you can use other props conditionally to determine animation
	var description = void 0;
	if (isFunction(delegate.animationForKey)) description = delegate.animationForKey.call(delegate, property, prettyValue, prettyPrevious, prettyPresentation); // TODO: rename action or implicit
	if (TRANSACTION_DURATION_ALONE_IS_ENOUGH && description === null) return null; // null stops, undefined continues
	var animation = animationFromDescription(description);
	if (!animation) {
		animation = animationFromDescription(defaultAnimation); // default is not converted to ugly in registerAnimatableProperty
		if (animation && TRANSACTION_DURATION_ALONE_IS_ENOUGH) {
			if (!animation.duration && animation.duration !== 0) {
				if (transaction.duration) animation.duration = transaction.duration;
			} // Implement transaction tests before refactoring!
			if (!animation.duration) return null; // setting value inside zero duration transaction must not animate, but allow zero duration animations otherwise.
		}
	}
	if (animation && (animation instanceof HyperAnimation || animation instanceof HyperKeyframes)) {
		if (animation.property === null || typeof animation.property === "undefined") animation.property = property;
		if (animation instanceof HyperAnimation) {
			if (animation.from === null || typeof animation.from === "undefined") {
				if (animation.blend === "absolute") animation.from = prettyPresentation;else animation.from = prettyPrevious;
			}
			if (animation.to === null || typeof animation.to === "undefined") animation.to = prettyValue;
		}
		if (animation.easing === null || typeof animation.easing === "undefined") animation.easing = transaction.easing;
		if (animation.duration === null || typeof animation.duration === "undefined") animation.duration = transaction.duration;
		if (!animation.duration) animation.duration = 0.0;
	}
	return animation;
}

function decorate(controller, delegate, layerInstance) {
	// deprecated
	return activate(controller, delegate, layerInstance);
}

function activate(controller, delegate, layerInstance) {
	// layer, delegate, controller?
	if (!controller) {
		// "Nothing to hyperactivate." // TODO: layer, delegate, controller
		if (!delegate) delegate = {};
		if (!layerInstance) layerInstance = delegate;
	} else {
		if (controller.registerAnimatableProperty || controller.addAnimation) throw new Error("Already hyperactive"); // TODO: be more thorough
		if (!delegate) delegate = controller;
		if (!layerInstance) layerInstance = controller;
	}
	var allAnimations = [];
	var allNames = [];
	var namedAnimations = {};
	var defaultAnimations = {}; // Shouldn't defaultAnimations be passed as delegate.animationDict instead of being registered with registerAnimatableProperty?
	var shouldSortAnimations = false;
	var modelBacking = {};
	var previousBacking = {}; // modelBacking and previousBacking merge like react and there is no way to delete.
	var presentationBacking = null;
	var registeredProperties = [];
	var activeBacking = modelBacking;

	function valueForKey(property) {
		// don't let this become re-entrant (do not animate delegate.output)
		if (DELEGATE_DOUBLE_WHAMMY) property = convertedKey(property, delegate.keyOutput, delegate);
		var prettyValue = convertedValueOfPropertyWithFunction(activeBacking[property], property, delegate.output, delegate);
		return prettyValue;
	}

	function setValueForKey(prettyValue, property) {
		var layer = {};
		layer[property] = prettyValue;
		setValuesOfLayer(layer);
	}
	function setValuesOfLayer(layer) {
		var transaction = hyperContext.currentTransaction();
		var presentationLayer = getPresentation(); // Generate presentation even if not accessed for implicit animation. Required for test "registered implicit presentation"
		var result = {};
		Object.keys(layer).forEach(function (prettyKey) {
			var uglyKey = prettyKey;
			var prettyValue = layer[prettyKey];
			if (DELEGATE_DOUBLE_WHAMMY) uglyKey = convertedKey(prettyKey, delegate.keyInput, delegate);
			registerAnimatableProperty(uglyKey); // automatic registration
			var uglyValue = convertedValueOfPropertyWithFunction(prettyValue, prettyKey, delegate.input, delegate);
			var uglyPrevious = modelBacking[uglyKey];
			previousBacking[uglyKey] = uglyPrevious;
			modelBacking[uglyKey] = uglyValue;
			result[prettyKey] = prettyValue;
		});
		if (!transaction.disableAnimation) {
			Object.keys(result).forEach(function (prettyKey) {
				// using result not layer because key might be different
				var uglyKey = prettyKey;
				if (DELEGATE_DOUBLE_WHAMMY) uglyKey = convertedKey(prettyKey, delegate.keyInput, delegate);
				var prettyValue = result[prettyKey];
				var prettyPrevious = convertedValueOfPropertyWithFunction(previousBacking[uglyKey], prettyKey, delegate.output, delegate);
				if (prettyValue !== prettyPrevious) {
					var prettyPresentation = presentationLayer[prettyKey];
					var animation = implicitAnimation(prettyKey, prettyValue, prettyPrevious, prettyPresentation, delegate, defaultAnimations[prettyKey], transaction);
					if (animation) addAnimation(animation); // There is room for optimization, reduce copying and converting between pretty and ugly
					else needsDisplay();
				}
			});
		}
	}

	function invalidate() {
		// note that you cannot invalidate if there are no animations
		presentationBacking = null;
	}

	function cleanupAndRemoveAnimationAtIndex(animation, index) {
		if (index > -1) {
			allAnimations.splice(index, 1);
			var name = allNames[index];
			allNames.splice(index, 1);
			delete namedAnimations[name];
		}
	}
	function cleanupAnimationAtIndex(animation, index, finishedWithCallback) {
		if (animation instanceof HyperGroup) {
			// recursive
			animation.group.forEach(function (childAnimation) {
				cleanupAnimationAtIndex(childAnimation, -1, finishedWithCallback);
			});
		} else if (animation instanceof HyperChain) {
			// recursive
			animation.chain.forEach(function (childAnimation) {
				cleanupAnimationAtIndex(childAnimation, -1, finishedWithCallback);
			});
		} else if (!(animation instanceof HyperAnimation) && !(animation instanceof HyperKeyframes)) throw new Error("not an animation");
		if (animation.finished) {
			if (!hyperActionIsFilling(animation)) cleanupAndRemoveAnimationAtIndex(animation, index);
			if (isFunction(animation.onend)) finishedWithCallback.push(animation);
		}
	}

	function animationCleanup() {
		// for the context to remove // animations contained within groups ignore remove (removedOnCompletion) but should fire onend
		var i = allAnimations.length;
		var finishedWithCallback = [];
		while (i--) {
			var animation = allAnimations[i];
			cleanupAnimationAtIndex(animation, i, finishedWithCallback);
		}
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(layerInstance);
			}
		}
		finishedWithCallback.forEach(function (animation) {
			animation.onend.call(animation, true);
			animation.onend = null; // fill modes might otherwise cause onend to get called again. Can't freeze animation object.
		});
	}

	function removeAnimationInstance(animation) {
		// called from public removeAnimation
		var index = allAnimations.indexOf(animation);
		if (index > -1) {
			allAnimations.splice(index, 1);
			var name = allNames[index];
			allNames.splice(index, 1);
			delete namedAnimations[name];
			if (isFunction(animation.onend)) animation.onend.call(animation, false);
		}
		if (!ENSURE_ONE_MORE_TICK) {
			if (!allAnimations.length) {
				hyperContext.deregisterTarget(layerInstance);
			}
		}
	}

	function isAllowableProperty(key) {
		// don't trigger animation on functions themselves
		return (layerInstance !== controller || controllerMethods.indexOf(key) < 0 && controllerProperties.indexOf(key) < 0) && (layerInstance !== delegate || delegateMethods.indexOf(key) < 0);
	}

	function registerAnimatableProperty(property, defaultAnimation) {
		// Workaround for lack of Proxy // Needed to trigger implicit animation. // FIXME: defaultValue is broken. TODO: Proper default animations dictionary. // TODO: default animation should always be the value true
		if (!isAllowableProperty(property)) return;
		var firstTime = false;
		if (registeredProperties.indexOf(property) === -1) firstTime = true;
		if (firstTime) registeredProperties.push(property);
		var descriptor = Object.getOwnPropertyDescriptor(layerInstance, property);
		if (defaultAnimation) defaultAnimations[property] = defaultAnimation; // maybe set to defaultValue not defaultAnimation
		else if (defaultAnimations[property] === null) delete defaultAnimations[property]; // property is still animatable
		if (!descriptor || descriptor.configurable === true) {
			var uglyValue = convertedValueOfPropertyWithFunction(layerInstance[property], property, delegate.input, delegate);
			modelBacking[property] = uglyValue; // need to populate but can't use setValueForKey. No mount animations here, this function registers
			if (typeof uglyValue === "undefined") modelBacking[property] = null;
			if (firstTime) Object.defineProperty(layerInstance, property, { // ACCESSORS
				get: function get() {
					return valueForKey(property);
				},
				set: function set(value) {
					setValueForKey(value, property);
				},
				enumerable: true,
				configurable: true
			});
		}
	}
	function getLayer() {
		return layerInstance;
	}
	function setLayer(layer) {
		if (layer) {
			setValuesOfLayer(layer);
		}
	}
	function getAnimationCount() {
		return allAnimations.length;
	}
	function getAnimations() {
		return allAnimations.map(function (animation) {
			return animation.description.call(animation, delegate);
		});
	}
	function getAnimationNames() {
		return Object.keys(namedAnimations);
	}
	function baseLayer() {
		// model, presentation, and previous layers start from this
		return Object.keys(layerInstance).filter(isAllowableProperty).reduce(function (accumulator, current) {
			accumulator[current] = layerInstance[current];
			return accumulator;
		}, {});
	}
	function getPresentation() {
		var transactionTime = hyperContext.currentTransaction().time;
		if (presentationBacking !== null) return presentationBacking;
		var presentationLayer = Object.assign(baseLayer(), modelBacking);
		var changed = true; // true is needed to ensure last frame. But you don't want this to default to true any other time with no animations. Need some other way to detect if last frame
		var length = allAnimations.length;
		if (length) changed = presentationTransform(presentationLayer, allAnimations, transactionTime, shouldSortAnimations);
		shouldSortAnimations = false;
		if (changed || presentationBacking === null) {
			convertPropertiesOfLayerWithFunction(Object.keys(presentationLayer), presentationLayer, delegate.output, delegate);
			Object.freeze(presentationLayer);
			if (length) presentationBacking = presentationLayer;else presentationBacking = null;
			return presentationLayer;
		}
		return presentationBacking;
	}
	function getModel() {
		var layer = baseLayer();
		registeredProperties.forEach(function (key) {
			var value = convertedValueOfPropertyWithFunction(modelBacking[key], key, delegate.output, delegate);
			Object.defineProperty(layer, key, { // modelInstance has defined properties. Must redefine.
				value: value,
				enumerable: true,
				configurable: false
			});
		});
		Object.freeze(layer);
		return layer;
	}
	function getPrevious() {
		var layer = baseLayer(); //Object.assign({},layerInstance);
		registeredProperties.forEach(function (key) {
			var value = convertedValueOfPropertyWithFunction(previousBacking[key], key, delegate.output, delegate);
			Object.defineProperty(layer, key, {
				value: value,
				enumerable: true,
				configurable: false
			});
			previousBacking[key] = modelBacking[key];
		});
		Object.freeze(layer);
		return layer;
	}
	function needsDisplay() {
		// This should be used instead of directly calling display
		presentationBacking = null;
		if (!allAnimations.length) registerWithContext(); // This might not be sufficient to produce a new presentationLayer
	}
	function addAnimation(description, name) {
		// does not register. // should be able to pass a description if type is registered
		if (delegate && isFunction(delegate.animationFromDescription)) description = delegate.animationFromDescription(description); // deprecate this
		var copy = animationFromDescription(description);
		if (!(copy instanceof HyperAnimation) && !(copy instanceof HyperKeyframes) && !(copy instanceof HyperGroup) && !(copy instanceof HyperChain)) throw new Error("Not a valid animation:" + JSON.stringify(copy));
		copy.convert.call(copy, delegate.input, delegate); // delta is calculated from ugly values in runAnimation
		prepAnimationObjectFromAddAnimation(copy, delegate);
		if (!allAnimations.length) registerWithContext();
		allAnimations.push(copy);
		if (name !== null && typeof name !== "undefined") {
			var previous = namedAnimations[name];
			if (previous) removeAnimationInstance(previous); // after pushing to allAnimations, so context doesn't stop ticking
			namedAnimations[name] = copy;
		}
		if (typeof name === "undefined" || name === null || name === false) allNames.push(null);else allNames.push(name);
		shouldSortAnimations = true;
		var transaction = hyperContext.currentTransaction();
		copy.runAnimation(layerInstance, name, transaction);
	}
	function removeAnimation(name) {
		var animation = namedAnimations[name];
		if (animation) {
			removeAnimationInstance(animation);
		}
	}
	function removeAllAnimations() {
		allAnimations.length = 0;
		allNames.length = 0;
		namedAnimations = {};
		allAnimations.forEach(function (animation) {
			if (isFunction(animation.onend)) animation.onend.call(animation, false);
		});
		if (!ENSURE_ONE_MORE_TICK) {
			hyperContext.deregisterTarget(layerInstance);
		}
	}
	function animationNamed(name) {
		var animation = namedAnimations[name];
		if (animation) {
			return animation.description.call(animation, delegate);
		}
		return null;
	}

	function registerWithContext() {
		var display = function display() {};
		if (isFunction(delegate.display)) display = function display(presentation) {
			// layer returns calculated values during display
			activeBacking = getPresentation();
			delegate.display.call(delegate, presentation);
			activeBacking = modelBacking;
		};
		hyperContext.registerTarget(layerInstance, getPresentation, getAnimationCount, display, invalidate, animationCleanup, modelBacking);
	}

	Object.keys(layerInstance).forEach(function (key) {
		// more initialization
		if (TRANSACTION_DURATION_ALONE_IS_ENOUGH) registerAnimatableProperty(key, true); // second argument true because you should animate every property if transaction has a duration. TODO: ensure this does not interfere with automatic registration when setting values
		else registerAnimatableProperty(key);
	});

	if (controller) {
		controller.registerAnimatableProperty = registerAnimatableProperty;
		controller.needsDisplay = needsDisplay;
		controller.addAnimation = addAnimation;
		controller.removeAnimation = removeAnimation;
		controller.removeAllAnimations = removeAllAnimations;
		controller.animationNamed = animationNamed;
		Object.defineProperty(controller, "layer", { // TODO: I don't like this. Need a merge function.
			get: getLayer,
			set: setLayer,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "animationCount", { // Performs better than asking for animations.length, especially with delegate.input and delegate.output
			get: getAnimationCount,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "animations", { // TODO: cache this like presentationLayer
			get: getAnimations,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "animationNames", {
			get: getAnimationNames,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "presentation", {
			get: getPresentation,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "model", {
			get: getModel,
			enumerable: false,
			configurable: false
		});
		Object.defineProperty(controller, "previous", {
			get: getPrevious,
			enumerable: false,
			configurable: false
		});
	}

	return controller; // TODO: should return the deactivate function // or maybe the layerInstance
}

function isFunction$3(w) {
	// WET
	return w && {}.toString.call(w) === "[object Function]";
}

function HyperNumber() {/*#__PURE__*/}
HyperNumber.prototype = {
	constructor: HyperNumber,
	zero: function zero() {
		return 0;
	},
	add: function add(a, b) {
		return a + b;
	},
	subtract: function subtract(a, b) {
		// subtract b from a
		return a - b;
	},
	interpolate: function interpolate(a, b, progress) {
		return a + (b - a) * progress;
	},
	toString: function toString() {
		return "HyperNumber";
	},
	toJSON: function toJSON() {
		return this.toString();
	}
};

function HyperScale() {/*#__PURE__*/}
HyperScale.prototype = {
	constructor: HyperScale,
	zero: function zero() {
		return 1;
	},
	add: function add(a, b) {
		return a * b;
	},
	subtract: function subtract(a, b) {
		// subtract b from a
		if (b === 0) return 0;
		return a / b;
	},
	interpolate: function interpolate(a, b, progress) {
		return a + (b - a) * progress;
	},
	toString: function toString() {
		return "HyperScale";
	},
	toJSON: function toJSON() {
		return this.toString();
	}
};

function HyperArray(type, length, settings) {
	this.type = type;
	if (isFunction$3(type)) this.type = new type(settings);
	this.length = length;
}
HyperArray.prototype = {
	constructor: HyperArray,
	zero: function zero() {
		var array = [];
		var i = this.length;
		while (i--) {
			array.push(this.type.zero());
		}return array;
	},
	add: function add(a, b) {
		var array = [];
		for (var i = 0; i < this.length; i++) {
			array.push(this.type.add(a[i], b[i]));
		}
		return array;
	},
	subtract: function subtract(a, b) {
		// subtract b from a
		var array = [];
		for (var i = 0; i < this.length; i++) {
			array.push(this.type.subtract(a[i], b[i]));
		}
		return array;
	},
	interpolate: function interpolate(a, b, progress) {
		var array = [];
		for (var i = 0; i < this.length; i++) {
			array.push(this.type.interpolate(a[i], b[i], progress));
		}
		return array;
	},
	toString: function toString() {
		return "HyperArray";
	},
	toJSON: function toJSON() {
		return this.toString();
	}
};

function HyperSet(settings) {
	if (isFunction$3(settings)) this.sort = settings;else if (settings && isFunction$3(settings.sort)) this.sort = settings.sort;
	this.debug = "HyperSet";
}
HyperSet.prototype = {
	constructor: HyperSet,
	zero: function zero() {
		return [];
	},
	add: function add(a, b) {
		// add b to a
		if (!Array.isArray(a) && !Array.isArray(b)) return [];
		if (!Array.isArray(a)) return b;
		if (!Array.isArray(b)) return a;

		var array = [];
		var aLength = a.length;
		var bLength = b.length;
		var i = 0;
		var j = 0;
		if (isFunction$3(this.sort)) while (i < aLength || j < bLength) {
			if (i === aLength) {
				array.push(b[j]);
				j++;
			} else if (j === bLength) {
				array.push(a[i]);
				i++;
			} else {
				var A = a[i];
				var B = b[j];
				var sort = this.sort(A, B);
				if (sort === 0) {
					// sort is used to determine identity, not just equality.
					array.push(A);
					i++;
					j++;
				} else if (sort < 0) {
					array.push(A);
					i++;
				} else if (sort > 0) {
					array.push(B);
					j++;
				} else throw new Error("HyperSet invalid sort function, add a:" + A + "; b:" + B + "; result:" + sort + ";");
			}
		} else {
			array = a.slice(0);
			i = b.length;
			while (i--) {
				if (a.indexOf(b[i]) < 0) array.push(b[i]);
			}
		}
		return array;
	},
	subtract: function subtract(a, b) {
		// remove b from a
		if (!Array.isArray(a) && !Array.isArray(b)) return [];
		if (!Array.isArray(a)) return b;
		if (!Array.isArray(b)) return a;

		var array = [];
		var aLength = a.length;
		var bLength = b.length;
		var i = 0;
		var j = 0;
		if (isFunction$3(this.sort)) while (i < aLength || j < bLength) {
			if (i === aLength) {
				break;
			} else if (j === bLength) {
				array.push(a[i]);
				i++;
			} else {
				var A = a[i];
				var B = b[j];
				var sort = this.sort(A, B);
				if (sort === 0) {
					// sort is used to determine identity, not just equality.
					i++;
					j++;
				} else if (sort < 0) {
					array.push(A);
					i++;
				} else if (sort > 0) {
					j++;
				} else throw new Error("HyperSet invalid sort function, subtract a:" + A + "; b:" + B + "; result:" + sort + ";");
			}
		} else {
			array = a.slice(0);
			i = b.length;
			while (i--) {
				var loc = array.indexOf(b[i]);
				if (loc > -1) array.splice(loc, 1);
			}
		}
		return array;
	},
	interpolate: function interpolate(a, b, progress) {
		if (progress >= 1) return b;
		return a;
	},
	toString: function toString() {
		return "HyperSet";
	},
	toJSON: function toJSON() {
		return this.toString();
	}
};

/*#__PURE__*/var HyperPoint = function () {
	function HyperPoint() {
		/*#__PURE__*/

		classCallCheck(this, HyperPoint);
	}

	createClass(HyperPoint, [{
		key: "zero",
		value: function zero() {
			return hyperZeroPoint();
		}
	}, {
		key: "add",
		value: function add(a, b) {
			return hyperMakePoint(a.x + b.x, a.y + b.y);
		}
	}, {
		key: "subtract",
		value: function subtract(a, b) {
			// subtract b from a
			return hyperMakePoint(a.x - b.x, a.y - b.y);
		}
	}, {
		key: "interpolate",
		value: function interpolate(a, b, progress) {
			return hyperMakePoint(a.x + (b.x - a.x) * progress, a.y + (b.y - a.y) * progress);
		}
	}, {
		key: "toString",
		value: function toString() {
			return "HyperPoint";
		}
	}, {
		key: "toJSON",
		value: function toJSON() {
			return this.toString();
		}
	}]);
	return HyperPoint;
}();

/*#__PURE__*/var HyperSize = function () {
	function HyperSize() {
		/*#__PURE__*/

		classCallCheck(this, HyperSize);
	}

	createClass(HyperSize, [{
		key: "zero",
		value: function zero() {
			return hyperZeroSize();
		}
	}, {
		key: "add",
		value: function add(a, b) {
			return hyperMakeSize(a.width + b.width, a.height + b.height);
		}
	}, {
		key: "subtract",
		value: function subtract(a, b) {
			// subtract b from a
			return hyperMakeSize(a.width - b.width, a.height - b.height);
		}
	}, {
		key: "interpolate",
		value: function interpolate(a, b, progress) {
			return hyperMakeSize(a.width + (b.width - a.width) * progress, a.height + (b.height - a.height) * progress);
		}
	}, {
		key: "toString",
		value: function toString() {
			return "HyperSize";
		}
	}, {
		key: "toJSON",
		value: function toJSON() {
			return this.toString();
		}
	}]);
	return HyperSize;
}();

/*#__PURE__*/var HyperRect = function () {
	function HyperRect() {
		/*#__PURE__*/

		classCallCheck(this, HyperRect);
	}

	createClass(HyperRect, [{
		key: "zero",
		value: function zero() {
			return hyperZeroRect();
		}
	}, {
		key: "add",
		value: function add(a, b) {
			return {
				origin: HyperPoint.prototype.add(a.origin, b.origin),
				size: HyperSize.prototype.add(a.size, b.size)
			};
		}
	}, {
		key: "subtract",
		value: function subtract(a, b) {
			// subtract b from a
			return {
				origin: HyperPoint.prototype.subtract(a.origin, b.origin),
				size: HyperSize.prototype.subtract(a.size, b.size)
			};
		}
	}, {
		key: "interpolate",
		value: function interpolate(a, b, progress) {
			return {
				origin: HyperPoint.prototype.interpolate(a.origin, b.origin, progress),
				size: HyperSize.prototype.interpolate(a.size, b.size, progress)
			};
		}
	}, {
		key: "toString",
		value: function toString() {
			return "HyperRect";
		}
	}, {
		key: "toJSON",
		value: function toJSON() {
			return this.toString();
		}
	}]);
	return HyperRect;
}();

// export function HyperRange() { // TODO: negative values? // This should union the whole range, not add the individual values. NSUnionRange, not NSIntersectionRange, which is a range containing the indices that exist in both ranges.
// 	throw new Error("HyperRange not supported");
// }
// HyperRange.prototype = {
// 	constructor: HyperRange,
// 	zero: function() {
// 		return hyperNullRange();
// 	},
// 	add: function(a,b) { // union?
// 		if (a.location === hyperNotFound && b.location === hyperNotFound) return hyperNullRange();
// 		if (a.length === 0 && b.length === 0) return hyperNullRange();
// 		if (a.location === hyperNotFound || a.length === 0) return b;
// 		if (b.location === hyperNotFound || b.length === 0) return a;
// 		const finalLocation = Math.min( a.location, b.location );
// 		const finalEnd = Math.max( a.location + a.length, b.location + b.length );
// 		const result = hyperMakeRange(finalLocation, finalEnd - finalLocation );
// 		return result;
// 	},
// 	subtract: function(a,b) { // Subtraction is completely different.
// 		let result = a;
// 		if (a.location === hyperNotFound && b.location === hyperNotFound) result = hyperNullRange();
// 		else if (a.length === 0 && b.length === 0) result = hyperNullRange();
// 		else if (a.location === hyperNotFound || a.length === 0) result = hyperNullRange();
// 		else if (b.location === hyperNotFound || b.length === 0) result = a;
// 		else if (b.location <= a.location && b.location + b.length >= a.location + a.length) result = hyperNullRange();
// 		else if (b.location <= a.location && b.location + b.length > a.location && b.location + b.length < a.location + a.length) result = hyperMakeRange(b.location + b.length, (a.location + a.length) - (b.location + b.length));
// 		else if (b.location > a.location && b.location < a.location + a.length && b.location + b.length >= a.location + a.length) result = hyperMakeRange(a.location, (b.location + b.length) - a.location);
// 		return result;
// 	},
// 	interpolate: function(a,b,progress) {
// 		if (progress >= 1) return b;
// 		return a;
// 	},
// 	intersection: function(a,b) { // 0,1 and 1,1 do not intersect
// 		if (a.location === hyperNotFound || b.location === hyperNotFound || a.length === 0 || b.length === 0) return hyperNullRange();
// 		if (a.location + a.length <= b.location || b.location + b.length <= a.location) return hyperNullRange(); // TODO: Consider location should be NSNotFound (INT_MAX) not zero.
// 		const finalLocation = Math.max( a.location, b.location );
// 		const finalEnd = Math.min( a.location + a.length, b.location + b.length );
// 		return hyperMakeRange(finalLocation, finalEnd - finalLocation);
// 	}
// };

var hyperNotFound = Number.MAX_VALUE;
// struct convenience constructors:
function hyperMakeRect(x, y, width, height) {
	return {
		origin: hyperMakePoint(x, y),
		size: hyperMakeSize(width, height)
	};
}
function hyperZeroRect() {
	return hyperMakeRect(0, 0, 0, 0);
}
function hyperEqualRects(a, b) {
	return hyperEqualPoints(a.origin, b.origin) && hyperEqualSizes(a.size, b.size);
}

function hyperMakePoint(x, y) {
	return {
		x: x,
		y: y
	};
}
function hyperZeroPoint() {
	return hyperMakePoint(0, 0);
}
function hyperEqualPoints(a, b) {
	return a.x === b.x && a.y === b.y;
}

function hyperMakeSize(width, height) {
	return {
		width: width,
		height: height
	};
}
function hyperZeroSize() {
	return hyperMakeSize(0, 0);
}
function hyperEqualSizes(a, b) {
	return a.width === b.width && a.height && b.height;
}

function hyperMakeRange(location, length) {
	return {
		location: location,
		length: length
	};
}
function hyperZeroRange() {
	return hyperMakeRange(0, 0);
}
function hyperNullRange() {
	return hyperMakeRange(hyperNotFound, 0);
}
function hyperIndexInRange(index, range) {
	return index > range.location && index < range.location + range.length;
}
function hyperEqualRanges(a, b) {
	return a.location === b.location && a.length === b.length;
}
function hyperIntersectionRange(a, b) {
	if (a.location + a.length <= b.location || b.location + b.length <= a.location) return hyperNullRange();
	var location = Math.max(a.location, b.location);
	var end = Math.min(a.location + a.length, b.location + b.length);
	return { location: location, length: end - location };
}

function updateIndices(object, style, length) {
	// See all that stuff in there, Homie? That's why your robot didn't work.
	//while (length < style.length) {
	while (length < Object.keys(style).length) {
		Object.defineProperty(object, length, {
			configurable: true,
			enumerable: false,
			get: function (index) {
				return function () {
					return style[index];
				};
			}(length)
		});
		length++;
	}
	//while (length > style.length) {
	while (length > Object.keys(style).length) {
		length--;
		Object.defineProperty(object, length, {
			configurable: true,
			enumerable: false,
			value: undefined
		});
	}
	return length;
}

function prepareDocument(animatables, HyperStyleDeclaration) {

	if (typeof document !== "undefined") {

		//		const dict = animatables;

		var styles = Object.keys(document.documentElement.style);
		var dict = {};
		styles.forEach(function (key) {
			dict[key] = false;
		});
		Object.assign(dict, animatables);
		// Every property change will trigger call to animationForKey even if types are not declared,
		// so you can animate one style in response to change in another,
		// typically left/top to become transform, no other use cases really.
		// Maybe display change could be given a group animation with opacity fade.
		// There needs to be a discrete default, with no interpolation, just a step-end timing function

		for (var property in dict) {
			//document.documentElement.style) {
			// 		if (cssStyleDeclarationAttribute[property] || property in cssStyleDeclarationMethodModifiesStyle) {
			// 			continue;
			// 		}
			(function (property) {

				Object.defineProperty(HyperStyleDeclaration.prototype, property, {

					// This needs to be completely reassessed.
					// It's now different from the original web-animations technique.
					// web-animations-legacy depended on the original style object.
					// Whatever the problem, changes are not appearing on non-animated properties.

					// I am missing: _surrogateElement, updateIndices()

					get: function get() {
						var layer = this.hyperStyleLayer;
						var ugly = layer[property];
						var type = animatables[property];
						if (type) return type.output(ugly);
						return ugly;
					},
					set: function set(value) {
						this.hyperStyleLayer[property] = value; // This will produce animations from and to the ugly values, not CSS values.
						//this.hyperStyleController.registerAnimatableProperty(property); // automatic registration
						if (animatables[property]) {
							this.hyperStyleController.registerAnimatableProperty(property, animatables[property]); // automatic registration
						}
						this.hyperStyleLength = updateIndices(this, this.hyperStyleLayer, this.hyperStyleLength);
					},
					configurable: true,
					enumerable: true
				});
			})(property);
		}
	}
}
// This function is a fallback for when we can't replace an element's style with
// AnimatatedCSSStyleDeclaration and must patch the existing style to behave
// in a similar way.
// Only the methods listed in cssStyleDeclarationMethodModifiesStyle will
// be patched to behave in the same manner as a native implementation,
// getter properties like style.left or style[0] will be tainted by the
// polyfill's animation engine.

// var patchInlineStyleForAnimation = function(style) {
// 	var surrogateElement = document.createElement('div');
// 	copyInlineStyle(style, surrogateElement.style);
// 	var isAnimatedProperty = {};
// 	for (var method in cssStyleDeclarationMethodModifiesStyle) {
// 		if (!(method in style)) {
// 			continue;
// 		}
// 		Object.defineProperty(style, method, configureDescriptor({
// 			value: (function(method, originalMethod, modifiesStyle) {
// 				return function() {
// 					var result = surrogateElement.style[method].apply(
// 							surrogateElement.style, arguments);
// 					if (modifiesStyle) {
// 						if (!isAnimatedProperty[arguments[0]]) {
// 							originalMethod.apply(style, arguments);
// 						}
// 						animatedInlineStyleChanged(); //retick
// 					}
// 					return result;
// 				}
// 			})(method, style[method], cssStyleDeclarationMethodModifiesStyle[method])
// 		}));
// 	}
// 	style._clearAnimatedProperty = function(property) {
// 		this[property] = surrogateElement.style[property];
// 		isAnimatedProperty[property] = false;
// 	};
// 	style._setAnimatedProperty = function(property, value) {
// 		this[property] = value;
// 		isAnimatedProperty[property] = true;
// 	};
// };


// var propertyTypes = {
// 	backgroundColor: colorType,
// 	backgroundPosition: positionListType,
// 	borderBottomColor: colorType,
// 	borderBottomLeftRadius: percentLengthType,
// 	borderBottomRightRadius: percentLengthType,
// 	borderBottomWidth: lengthType,
// 	borderLeftColor: colorType,
// 	borderLeftWidth: lengthType,
// 	borderRightColor: colorType,
// 	borderRightWidth: lengthType,
// 	borderSpacing: lengthType,
// 	borderTopColor: colorType,
// 	borderTopLeftRadius: percentLengthType,
// 	borderTopRightRadius: percentLengthType,
// 	borderTopWidth: lengthType,
// 	bottom: percentLengthAutoType,
// 	boxShadow: shadowType,
// 	clip: typeWithKeywords(['auto'], rectangleType),
// 	color: colorType,
// 	cx: lengthType,
// 	// TODO: Handle these keywords properly.
// 	fontSize: typeWithKeywords(['smaller', 'larger'], percentLengthType),
// 	fontWeight: typeWithKeywords(['lighter', 'bolder'], fontWeightType),
// 	height: percentLengthAutoType,
// 	left: percentLengthAutoType,
// 	letterSpacing: typeWithKeywords(['normal'], lengthType),
// 	lineHeight: percentLengthType, // TODO: Should support numberType as well.
// 	marginBottom: lengthAutoType,
// 	marginLeft: lengthAutoType,
// 	marginRight: lengthAutoType,
// 	marginTop: lengthAutoType,
// 	maxHeight: typeWithKeywords(
// 			['none', 'max-content', 'min-content', 'fill-available', 'fit-content'],
// 			percentLengthType),
// 	maxWidth: typeWithKeywords(
// 			['none', 'max-content', 'min-content', 'fill-available', 'fit-content'],
// 			percentLengthType),
// 	minHeight: typeWithKeywords(
// 			['max-content', 'min-content', 'fill-available', 'fit-content'],
// 			percentLengthType),
// 	minWidth: typeWithKeywords(
// 			['max-content', 'min-content', 'fill-available', 'fit-content'],
// 			percentLengthType),
// 	//opacity: numberType, // does NOT use 1 as the default underlying value when not specified. animations relative to zero not one. Need to use propertyValueAliases
// 	opacity: opacityType, //
// 	outlineColor: typeWithKeywords(['invert'], colorType),
// 	outlineOffset: lengthType,
// 	outlineWidth: lengthType,
// 	paddingBottom: lengthType,
// 	paddingLeft: lengthType,
// 	paddingRight: lengthType,
// 	paddingTop: lengthType,
// 	right: percentLengthAutoType,
// 	textIndent: typeWithKeywords(['each-line', 'hanging'], percentLengthType),
// 	textShadow: shadowType,
// 	top: percentLengthAutoType,
// 	transform: transformType,
// 	WebkitTransform: transformType, // React?
// 	webkitTransform: transformType, // temporary
// 	msTransform: transformType, // temporary
// 	verticalAlign: typeWithKeywords([
// 		'baseline',
// 		'sub',
// 		'super',
// 		'text-top',
// 		'text-bottom',
// 		'middle',
// 		'top',
// 		'bottom'
// 	], percentLengthType),
// 	visibility: visibilityType,
// 	width: typeWithKeywords([
// 		'border-box',
// 		'content-box',
// 		'auto',
// 		'max-content',
// 		'min-content',
// 		'available',
// 		'fit-content'
// 	], percentLengthType),
// 	wordSpacing: typeWithKeywords(['normal'], percentLengthType),
// 	x: lengthType,
// 	y: lengthType,
// 	zIndex: typeWithKeywords(['auto'], integerType)
// };

// var svgProperties = {
// 	'cx': 1,
// 	'width': 1,
// 	'x': 1,
// 	'y': 1
// };

// var borderWidthAliases = {
// 	initial: '3px',
// 	thin: '1px',
// 	medium: '3px',
// 	thick: '5px'
// };

// var propertyValueAliases = {
// 	backgroundColor: { initial: 'transparent' },
// 	backgroundPosition: { initial: '0% 0%' },
// 	borderBottomColor: { initial: 'currentColor' },
// 	borderBottomLeftRadius: { initial: '0px' },
// 	borderBottomRightRadius: { initial: '0px' },
// 	borderBottomWidth: borderWidthAliases,
// 	borderLeftColor: { initial: 'currentColor' },
// 	borderLeftWidth: borderWidthAliases,
// 	borderRightColor: { initial: 'currentColor' },
// 	borderRightWidth: borderWidthAliases,
// 	// Spec says this should be 0 but in practise it is 2px.
// 	borderSpacing: { initial: '2px' },
// 	borderTopColor: { initial: 'currentColor' },
// 	borderTopLeftRadius: { initial: '0px' },
// 	borderTopRightRadius: { initial: '0px' },
// 	borderTopWidth: borderWidthAliases,
// 	bottom: { initial: 'auto' },
// 	clip: { initial: 'rect(0px, 0px, 0px, 0px)' },
// 	color: { initial: 'black' }, // Depends on user agent.
// 	fontSize: {
// 		initial: '100%',
// 		'xx-small': '60%',
// 		'x-small': '75%',
// 		'small': '89%',
// 		'medium': '100%',
// 		'large': '120%',
// 		'x-large': '150%',
// 		'xx-large': '200%'
// 	},
// 	fontWeight: {
// 		initial: '400',
// 		normal: '400',
// 		bold: '700'
// 	},
// 	height: { initial: 'auto' },
// 	left: { initial: 'auto' },
// 	letterSpacing: { initial: 'normal' },
// 	lineHeight: {
// 		initial: '120%',
// 		normal: '120%'
// 	},
// 	marginBottom: { initial: '0px' },
// 	marginLeft: { initial: '0px' },
// 	marginRight: { initial: '0px' },
// 	marginTop: { initial: '0px' },
// 	maxHeight: { initial: 'none' },
// 	maxWidth: { initial: 'none' },
// 	minHeight: { initial: '0px' },
// 	minWidth: { initial: '0px' },
// 	opacity: { initial: '1.0' },
// 	outlineColor: { initial: 'invert' },
// 	outlineOffset: { initial: '0px' },
// 	outlineWidth: borderWidthAliases,
// 	paddingBottom: { initial: '0px' },
// 	paddingLeft: { initial: '0px' },
// 	paddingRight: { initial: '0px' },
// 	paddingTop: { initial: '0px' },
// 	right: { initial: 'auto' },
// 	textIndent: { initial: '0px' },
// 	textShadow: {
// 		initial: '0px 0px 0px transparent',
// 		none: '0px 0px 0px transparent'
// 	},
// 	top: { initial: 'auto' },
// 	transform: {
// 		initial: "matrix(1, 0, 0, 1, 0, 0)",
// 		none: "matrix(1, 0, 0, 1, 0, 0)"
// 	},
// 	verticalAlign: { initial: '0px' },
// 	visibility: { initial: 'visible' },
// 	width: { initial: 'auto' },
// 	wordSpacing: { initial: 'normal' },
// 	zIndex: { initial: 'auto' }
// };

//import { animationFromDescription } from "../actions.js";
function typeForStyle(property) {
	return usedPropertyTypes[property]; // || nonNumericType;
}

var usedPropertyTypes = {};
function registerAnimatableStyles(dict) {
	Object.assign(usedPropertyTypes, dict);
	prepareDocument(dict, HyperStyleDeclaration);
}

function isFunction$4(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

function activateElement(element, controller, delegate) {
	// compare to activate(controller, delegate, layerInstance)
	if (typeof window === "undefined") return;
	if ((typeof delegate === "undefined" || delegate === null) && (typeof controller === "undefined" || controller === null)) controller = element;else if ((typeof delegate === "undefined" || delegate === null) && typeof controller !== "undefined" && controller !== null && controller !== element) delegate = controller;else if (typeof controller === "undefined" || controller === null) controller = element; // should really be the HyperStyleDeclaration, not the element itself.

	var hyperStyleDelegate = {};

	var target = null; // allows calling activateElement with undefined element to be set later
	var original = element ? element.style : null;

	hyperStyleDelegate.typeOfProperty = function (property) {
		if (delegate && isFunction$4(delegate.typeOfProperty)) return delegate.typeOfProperty.call(delegate, property); // Not very useful.
		return typeForStyle(property);
	};
	hyperStyleDelegate.input = function (property, prettyValue) {
		if (delegate && isFunction$4(delegate.input)) return delegate.input.call(delegate, property, prettyValue); // Not as useful because it includes unit suffix. Also unsure about native
		var type = typeForStyle(property);
		var uglyValue = type ? type.input(prettyValue) : prettyValue; // allow registering properties with no declared type
		return uglyValue;
	};
	hyperStyleDelegate.output = function (property, uglyValue) {
		// value is the ugly value // BUG FIXME: sometimes a string
		if (delegate && isFunction$4(delegate.output)) return delegate.output.call(delegate, property, uglyValue);
		var type = typeForStyle(property);
		var result = void 0;
		if (uglyValue === null || typeof uglyValue === "undefined") result = type.zero();else result = type ? type.output(uglyValue) : uglyValue; // allow registering properties with no declared type
		return result;
	};
	hyperStyleDelegate.animationForKey = function (key, prettyValue, prettyPrevious, prettyPresentation) {
		// sometimesUglySometimesPrettyPrevious // prettyPrevious needs to be uglyPrevious. This is a Pyon problem
		if (prettyPrevious === null || typeof prettyPrevious === "undefined") prettyPrevious = prettyValue;
		var description = void 0; // initially undefined
		if (delegate && isFunction$4(delegate.animationForKey)) description = delegate.animationForKey(key, prettyValue, prettyPrevious, prettyPresentation, target);else if (delegate && isFunction$4(delegate)) description = delegate(key, prettyValue, prettyPrevious, prettyPresentation, target);
		return description;
		// 		const animation = animationFromDescription(description);
		// 		if (animation && typeof animation.property === "undefined") animation.property = key;
		// 		return animation;
	};
	// 	hyperStyleDelegate.animationFromDescription = function(description) { // deprecate this because delegate.typeOfProperty is enough?
	// 		const animation = animationFromDescription(description);
	// 		if (animation.property) animation.type = typeForStyle(animation.property); // TODO: or discrete type if undefined
	// 		return animation;
	// 	};
	hyperStyleDelegate.display = function () {
		var presentation = controller.presentation; // TODO: this should be provided
		var presentationKeys = Object.keys(presentation);
		presentationKeys.forEach(function (key) {
			var value = presentation[key];
			original[key] = value; // HyperStyleDeclaration is meant to be mutated.
		});
		var previousKeys = Object.keys(previousLayer);
		previousKeys.forEach(function (key) {
			// Must nullify properties that are no longer animated, if not on presentation.
			if (presentationKeys.indexOf(key) === -1) {
				// FIXME: Sort & walk keys? Not too bad if animating few properties.
				original[key] = "";
			}
		});
		previousLayer = presentation;
	};

	var layer = {};
	var hyperStyleDeclaration = new HyperStyleDeclaration(layer, controller);
	var previousLayer = {};
	activate(controller, hyperStyleDelegate, layer); // controller can be undefined only if element is not

	function setElement(what) {
		if (target) return; // you can only assign element once, either as argument or with this function
		target = what;
		original = target.style;
		Object.keys(original).forEach(function (key) {
			if (typeof original[key] !== "undefined" && original[key] !== null && original[key].length !== 0) {
				// most properties on original style object should be an empty string
				layer[key] = original[key];
			}
		});
		for (var property in usedPropertyTypes) {
			var prettyValue = original[property];
			var uglyValue = hyperStyleDelegate.input(property, prettyValue);
			layer[property] = uglyValue;
			controller.registerAnimatableProperty(property, true);
		}
		try {
			Object.defineProperty(target, "style", {
				get: function get() {
					return hyperStyleDeclaration;
				},
				configurable: true,
				enumerable: true
			});
		} catch (error) {
			//patchInlineStyleForAnimation(target.style);
			console.warn("not animatable by any craft known to Pyon");
		}
		target.style.hyperStyleInitialized = true;
	}

	if (element) setElement(element);
	return setElement;
}

var HyperStyleDeclaration = function HyperStyleDeclaration(layer, controller) {
	this.hyperStyleLength = 0;
	Object.defineProperty(this, "hyperStyleLayer", { // these will collide with css
		get: function get() {
			return layer;
		},
		enumerable: false,
		configurable: false
	});
	Object.defineProperty(this, "hyperStyleController", { // these will collide with css
		get: function get() {
			return controller;
		},
		enumerable: false,
		configurable: false
	});
};

HyperStyleDeclaration.prototype = {
	constructor: HyperStyleDeclaration
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var nonNumericType = {
	toString: function toString() {
		return "nonNumericType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	zero: function zero() {
		return "";
	},
	inverse: function inverse(value) {
		return value;
	},
	add: function add(base, delta) {
		return isDefined(delta) ? delta : base;
	},
	subtract: function subtract(base, delta) {
		// same as add? or return base?
		return base; // Sure why not
		//return this.add(base,this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		return f < 0.5 ? from : to;
	},
	output: function output(value) {
		return value;
	},
	input: function input(value) {
		return value;
	}
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var SVG_NS = "http://www.w3.org/2000/svg";

// Tree shaking is only possible in cases where the constructor args and shape of the object match,
// (ie no work other than assignment is done in the constructor.)
function createObject(proto, obj) {
	var newObject = Object.create(proto);
	Object.getOwnPropertyNames(obj).forEach(function (name) {
		Object.defineProperty(newObject, name, Object.getOwnPropertyDescriptor(obj, name));
	});
	return newObject;
}

function typeWithKeywords(keywords, type) {
	//console.log("HyperStyle typeWithKeywords:%s; type:%s;",keywords,type);
	var isKeyword;
	if (keywords.length === 1) {
		var keyword = keywords[0];
		isKeyword = function isKeyword(value) {
			return value === keyword;
		};
	} else {
		isKeyword = function isKeyword(value) {
			return keywords.indexOf(value) >= 0;
		};
	}
	return createObject(type, {
		add: function add(base, delta) {
			if (isKeyword(base) || isKeyword(delta)) {
				return delta;
			}
			return type.add(base, delta);
		},
		subtract: function subtract(base, delta) {
			if (isKeyword(base) || isKeyword(delta)) {
				return base;
			}
			return type.subtract(base, delta);
		},
		zero: function zero(value) {
			return ""; // should be "none" if possible
		},
		interpolate: function interpolate(from, to, f) {
			if (isKeyword(from) || isKeyword(to)) {
				return nonNumericType.interpolate(from, to, f);
			}
			return type.interpolate(from, to, f);
		},
		output: function output(value, svgMode) {
			return isKeyword(value) ? value : type.output(value, svgMode);
		},
		input: function input(value) {
			return isKeyword(value) ? value : type.input(value);
		}
	});
}

function clamp(x, min, max) {
	return Math.max(Math.min(x, max), min);
}

function interp(from, to, f, type) {
	if (Array.isArray(from) || Array.isArray(to)) {
		return interpArray(from, to, f, type);
	}
	var zero = type === "scale" ? 1.0 : 0.0;
	to = isDefinedAndNotNull(to) ? to : zero;
	from = isDefinedAndNotNull(from) ? from : zero;
	return to * f + from * (1 - f);
}

function interpArray(from, to, f, type) {
	// 	ASSERT_ENABLED && assert(Array.isArray(from) || from === null, "From is not an array or null");
	// 	ASSERT_ENABLED && assert( Array.isArray(to) || to === null, "To is not an array or null");
	// 	ASSERT_ENABLED && assert( from === null || to === null || from.length === to.length, "Arrays differ in length " + from + " : " + to);
	var length = from ? from.length : to.length;
	var result = [];
	for (var i = 0; i < length; i++) {
		result[i] = interp(from ? from[i] : null, to ? to[i] : null, f, type);
	}
	return result;
}

function isDefinedAndNotNull(val) {
	return isDefined(val) && val !== null;
}

function isDefined(val) {
	return typeof val !== "undefined";
}

function detectFeatures() {
	if (typeof document === "undefined") return {
		calcFunction: "calc",
		transformProperty: "transform"
	};
	var el = createDummyElement();
	el.style.cssText = "width: calc(0px);" + "width: -webkit-calc(0px);";
	var calcFunction = el.style.width.split("(")[0];
	var transformCandidates = ["transform", "webkitTransform", "msTransform"];
	var transformProperty = transformCandidates.filter(function (property) {
		return property in el.style;
	})[0];
	return {
		calcFunction: calcFunction,
		transformProperty: transformProperty
	};
}

function createDummyElement() {
	return document.documentElement.namespaceURI === SVG_NS ? document.createElementNS(SVG_NS, "g") : document.createElement("div");
}

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var features;

// This regular expression is intentionally permissive, so that
// platform-prefixed versions of calc will still be accepted as
// input. While we are restrictive with the transform property
// name, we need to be able to read underlying calc values from
// computedStyle so can"t easily restrict the input here.
var outerCalcRE = /^\s*(-webkit-)?calc\s*\(\s*([^)]*)\)/;
var valueRE = /^\s*(-?[0-9]+(\.[0-9])?[0-9]*)([a-zA-Z%]*)/;
var operatorRE = /^\s*([+-])/;
var autoRE = /^\s*auto/i;

var lengthType = {
	toString: function toString() {
		return "lengthType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	zero: function zero() {
		return { px: 0 };
	},
	add: function add(base, delta) {
		if (delta === null || delta === undefined) {
			delta = {}; // bug fix / hack. transformType does this too. So should the rest. If element is removed from dom, CompositedPropertyMap can"t applyAnimatedValues when additive. Lack of a transform also has this problem
		}
		if (base === null || base === undefined) {
			base = {}; // bug fix / hack. transformType does this too. So should the rest. If element is removed from dom, CompositedPropertyMap can"t applyAnimatedValues when additive. Lack of a transform also has this problem
		}
		var out = {};
		for (var value in base) {
			out[value] = base[value] + (delta[value] || 0);
		}
		for (var _value in delta) {
			if (_value in base) {
				continue;
			}
			out[_value] = delta[_value];
		}
		return out;
	},
	subtract: function subtract(base, delta) {
		var inverse = this.inverse(delta);
		var sum = this.add(base, inverse);
		return sum;
	},
	interpolate: function interpolate(from, to, f) {
		var out = {};
		for (var value in from) {
			out[value] = interp(from[value], to[value], f);
		}
		for (var _value2 in to) {
			if (_value2 in out) {
				continue;
			}
			out[_value2] = interp(0, to[_value2], f);
		}
		return out;
	},
	output: function output(value) {
		if (!features) features = detectFeatures(); // !!!
		var s = "";
		var singleValue = true;
		for (var item in value) {
			if (s === "") {
				s = value[item] + item;
			} else if (singleValue) {
				if (value[item] !== 0) {
					s = features.calcFunction + "(" + s + " + " + value[item] + item + ")";
					singleValue = false;
				}
			} else if (value[item] !== 0) {
				s = s.substring(0, s.length - 1) + " + " + value[item] + item + ")";
			}
		}
		return s;
	},
	input: function input(value) {
		var result = lengthType.consumeValueFromString(value);
		if (result) {
			return result.value;
		}
		return undefined;
	},
	consumeValueFromString: function consumeValueFromString(value) {
		if (!isDefinedAndNotNull(value)) {
			return undefined;
		}
		var autoMatch = autoRE.exec(value);
		if (autoMatch) {
			return {
				value: { auto: true },
				remaining: value.substring(autoMatch[0].length)
			};
		}
		var out = {};
		var calcMatch = outerCalcRE.exec(value);
		if (!calcMatch) {
			var singleValue = valueRE.exec(value);
			if (singleValue && singleValue.length === 4) {
				out[singleValue[3]] = Number(singleValue[1]);
				return {
					value: out,
					remaining: value.substring(singleValue[0].length)
				};
			}
			return undefined;
		}
		var remaining = value.substring(calcMatch[0].length);
		var calcInnards = calcMatch[2];
		var firstTime = true;
		while (true) {
			var reversed = false;
			if (firstTime) {
				firstTime = false;
			} else {
				var op = operatorRE.exec(calcInnards);
				if (!op) {
					return undefined;
				}
				if (op[1] === "-") {
					reversed = true;
				}
				calcInnards = calcInnards.substring(op[0].length);
			}
			value = valueRE.exec(calcInnards);
			if (!value) {
				return undefined;
			}
			var valueUnit = value[3];
			var valueNumber = Number(value[1]);
			if (!isDefinedAndNotNull(out[valueUnit])) {
				out[valueUnit] = 0;
			}
			if (reversed) {
				out[valueUnit] -= valueNumber;
			} else {
				out[valueUnit] += valueNumber;
			}
			calcInnards = calcInnards.substring(value[0].length);
			if (/\s*/.exec(calcInnards)[0].length === calcInnards.length) {
				return {
					value: out,
					remaining: remaining
				};
			}
		}
	},
	inverse: function inverse(value) {
		var out = {};
		for (var unit in value) {
			out[unit] = -value[unit];
		}
		return out;
	}
};

var lengthAutoType = typeWithKeywords(["auto"], lengthType);

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

//import { interp, createObject } from "./shared.js";
function NumberType() {} // Used privately by transformType only
NumberType.prototype = {
	//export const cssNumberType = {
	toString: function toString() {
		return "NumberType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(base) {
		if (base === "auto") {
			return nonNumericType.inverse(base);
		}
		var negative = base * -1;
		return negative;
	},
	zero: function zero() {
		return 0;
	},
	add: function add(base, delta) {
		if (Number(base) !== base && Number(delta) !== delta) return 0;else if (Number(base) !== base) base = 0;else if (Number(delta) !== delta) delta = 0;
		// If base or delta are "auto", we fall back to replacement.
		if (base === "auto" || delta === "auto") {
			return nonNumericType.add(base, delta);
		}
		var result = base + delta;
		return result;
	},
	subtract: function subtract(base, delta) {
		// KxDx
		//var inverse = this.inverse(delta);
		if (Number(base) !== base && Number(delta) !== delta) return 0;else if (Number(base) !== base) base = 0;else if (Number(delta) !== delta) delta = 0;
		return this.add(base, this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		// If from or to are "auto", we fall back to step interpolation.
		if (from === "auto" || to === "auto") {
			return nonNumericType.interpolate(from, to);
		}
		return interp(from, to, f);
	},
	//output: function(value) { return value + ""; }, // original
	output: function output(value) {
		return value;
	}, // no strings damn it. Unknown side effects. Because used by transformType ?
	input: function input(value) {
		if (value === "auto") {
			return "auto";
		}
		var result = Number(value);
		return isNaN(result) ? undefined : result;
	}
};
var numberType = new NumberType(); // Private, only used by transformType

function IntegerType() {}
IntegerType.prototype = Object.create(NumberType.prototype, {
	//export const cssIntegerType = createObject(cssNumberType, {
	toString: function toString() {
		return "IntergerType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	interpolate: function interpolate(from, to, f) {
		// If from or to are "auto", we fall back to step interpolation.
		if (from === "auto" || to === "auto") {
			return nonNumericType.interpolate(from, to);
		}
		return Math.floor(interp(from, to, f));
	}
});
var integerType = new IntegerType();

function OpacityType() {}
OpacityType.prototype = Object.create(NumberType, {
	//export const cssOpacityType = createObject(cssNumberType, {
	toString: function toString() {
		return "OpacityType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	zero: function zero() {
		return 0.0; // zero is definitely zero, I need to expose initialValue from propertyValueAliases
	},
	unspecified: function unspecified(value) {
		// This fixed fading in opacity but broke fading out, and I did not investigate further
		return 1.0;
		//return propertyValueAliases["opacity"].initial;
	}
});
var opacityType = new OpacityType();

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

// New experimental:
// import { parseNumber } from "../matrix/number-handler.js";
// import { parseAngle, parseLengthOrPercent, parseLength } from "../matrix/dimension-handler.js";


var convertToDeg = function convertToDeg(num, type) {
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

var extractValue = function extractValue(values, pos, hasUnits) {
	var value = Number(values[pos]);
	if (!hasUnits) {
		return value;
	}
	var type = values[pos + 1];
	if (type === "") {
		type = "px";
	}
	var result = {};
	result[type] = value;
	return result;
};

var extractValues = function extractValues(values, numValues, hasOptionalValue, hasUnits) {
	var result = [];
	for (var i = 0; i < numValues; i++) {
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

function capture(x) {
	return "(" + x + ")";
}
function optional(x) {
	return "(?:" + x + ")?";
}

var OPEN_BRACKET = [SPACES, RAW_OPEN_BRACKET, SPACES].join("");
var CLOSE_BRACKET = [SPACES, RAW_CLOSE_BRACKET, SPACES].join("");
var COMMA = [SPACES, RAW_COMMA, SPACES].join("");
var UNIT_NUMBER = [capture(NUMBER), capture(UNIT)].join("");

function transformRE(name, numParms, hasOptionalParm) {
	var tokenList = [START, SPACES, name, OPEN_BRACKET];
	for (var i = 0; i < numParms - 1; i++) {
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

	var f = function f(x) {
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
	var f = function f(x) {
		var r = m[1](x);
		return r.map(function (v) {
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
	var f = function f(x) {
		var r = m[1](x);
		var out = [];
		for (var i = 0; i < 3; i++) {
			out.push(r[i].px);
		}
		out.push(r[3]);
		return out;
	};
	return [m[0], f, m[2]];
}

var transformREs = [buildRotationMatcher("rotate", 1, false), buildRotationMatcher("rotateX", 1, false), buildRotationMatcher("rotateY", 1, false), buildRotationMatcher("rotateZ", 1, false), build3DRotationMatcher(), buildRotationMatcher("skew", 1, true, 0), buildRotationMatcher("skewX", 1, false), buildRotationMatcher("skewY", 1, false), buildMatcher("translateX", 1, false, true, { px: 0 }), buildMatcher("translateY", 1, false, true, { px: 0 }), buildMatcher("translateZ", 1, false, true, { px: 0 }), buildMatcher("translate", 1, true, true, { px: 0 }), buildMatcher("translate3d", 3, false, true), buildMatcher("scale", 1, true, false, "copy"), buildMatcher("scaleX", 1, false, false, 1), buildMatcher("scaleY", 1, false, false, 1), buildMatcher("scaleZ", 1, false, false, 1), buildMatcher("scale3d", 3, false, false), buildMatcher("perspective", 1, false, true), buildMatcher("matrix", 6, false, false)];

var decomposeMatrix = function () {
	// this is only ever used on the perspective matrix, which has 0, 0, 0, 1 as
	// last column

	function determinant(m) {
		return m[0][0] * m[1][1] * m[2][2] + m[1][0] * m[2][1] * m[0][2] + m[2][0] * m[0][1] * m[1][2] - m[0][2] * m[1][1] * m[2][0] - m[1][2] * m[2][1] * m[0][0] - m[2][2] * m[0][1] * m[1][0];
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
		var a = m[0][0],
		    b = m[0][1],
		    c = m[0][2];
		var d = m[1][0],
		    e = m[1][1],
		    f = m[1][2];
		var g = m[2][0],
		    h = m[2][1],
		    k = m[2][2];
		var Ainv = [[(e * k - f * h) * iDet, (c * h - b * k) * iDet, (b * f - c * e) * iDet, 0], [(f * g - d * k) * iDet, (a * k - c * g) * iDet, (c * d - a * f) * iDet, 0], [(d * h - e * g) * iDet, (g * b - a * h) * iDet, (a * e - b * d) * iDet, 0]];
		var lastRow = [];
		for (var i = 0; i < 3; i++) {
			var val = 0;
			for (var j = 0; j < 3; j++) {
				val += m[3][j] * Ainv[j][i];
			}
			lastRow.push(val);
		}
		lastRow.push(1);
		Ainv.push(lastRow);
		return Ainv;
	}

	function transposeMatrix4(m) {
		return [[m[0][0], m[1][0], m[2][0], m[3][0]], [m[0][1], m[1][1], m[2][1], m[3][1]], [m[0][2], m[1][2], m[2][2], m[3][2]], [m[0][3], m[1][3], m[2][3], m[3][3]]];
	}

	function multVecMatrix(v, m) {
		var result = [];
		for (var i = 0; i < 4; i++) {
			var val = 0;
			for (var j = 0; j < 4; j++) {
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
		return [v1[1] * v2[2] - v1[2] * v2[1], v1[2] * v2[0] - v1[0] * v2[2], v1[0] * v2[1] - v1[1] * v2[0]];
	}

	function decomposeMatrix(matrix) {
		var m3d = [[matrix[0], matrix[1], 0, 0], [matrix[2], matrix[3], 0, 0], [0, 0, 1, 0], [matrix[4], matrix[5], 0, 1]];

		// skip normalization step as m3d[3][3] should always be 1
		if (m3d[3][3] !== 1) {
			throw "attempt to decompose non-normalized matrix";
		}

		var perspectiveMatrix = m3d.concat(); // copy m3d
		for (var i = 0; i < 3; i++) {
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
			var transposedInversePerspectiveMatrix = transposeMatrix4(inversePerspectiveMatrix);
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
			for (var _i = 0; _i < 3; _i++) {
				scale[_i] *= -1;
				row[_i][0] *= -1;
				row[_i][1] *= -1;
				row[_i][2] *= -1;
			}
		}

		var t = row[0][0] + row[1][1] + row[2][2] + 1;
		var s;
		var quaternion;

		if (t > 1e-4) {
			s = 0.5 / Math.sqrt(t);
			quaternion = [(row[2][1] - row[1][2]) * s, (row[0][2] - row[2][0]) * s, (row[1][0] - row[0][1]) * s, 0.25 / s];
		} else if (row[0][0] > row[1][1] && row[0][0] > row[2][2]) {
			s = Math.sqrt(1 + row[0][0] - row[1][1] - row[2][2]) * 2.0;
			quaternion = [0.25 * s, (row[0][1] + row[1][0]) / s, (row[0][2] + row[2][0]) / s, (row[2][1] - row[1][2]) / s];
		} else if (row[1][1] > row[2][2]) {
			s = Math.sqrt(1.0 + row[1][1] - row[0][0] - row[2][2]) * 2.0;
			quaternion = [(row[0][1] + row[1][0]) / s, 0.25 * s, (row[1][2] + row[2][1]) / s, (row[0][2] - row[2][0]) / s];
		} else {
			s = Math.sqrt(1.0 + row[2][2] - row[0][0] - row[1][1]) * 2.0;
			quaternion = [(row[0][2] + row[2][0]) / s, (row[1][2] + row[2][1]) / s, 0.25 * s, (row[1][0] - row[0][1]) / s];
		}

		return {
			translate: translate, scale: scale, skew: skew,
			quaternion: quaternion, perspective: perspective
		};
	}
	return decomposeMatrix;
}();

function dot(v1, v2) {
	var result = 0;
	for (var i = 0; i < v1.length; i++) {
		result += v1[i] * v2[i];
	}
	return result;
}

function multiplyMatrices(a, b) {
	return [a[0] * b[0] + a[2] * b[1], a[1] * b[0] + a[3] * b[1], a[0] * b[2] + a[2] * b[3], a[1] * b[2] + a[3] * b[3], a[0] * b[4] + a[2] * b[5] + a[4], a[1] * b[4] + a[3] * b[5] + a[5]];
}

function convertItemToMatrix(item) {
	switch (item.t) {// TODO: lots of types to implement:
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
			throw new Error("HyperStyle convertItemToMatrix unimplemented type:%s;", item.t);
	}
}

function convertToMatrix(transformList) {
	return transformList.map(convertItemToMatrix).reduce(multiplyMatrices);
}

var composeMatrix = function () {
	function multiply(a, b) {
		var result = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
		for (var i = 0; i < 4; i++) {
			for (var j = 0; j < 4; j++) {
				for (var k = 0; k < 4; k++) {
					result[i][j] += b[i][k] * a[k][j];
				}
			}
		}
		return result;
	}

	function composeMatrix(translate, scale, skew, quat, perspective) {
		var matrix = [[1, 0, 0, 0], [0, 1, 0, 0], [0, 0, 1, 0], [0, 0, 0, 1]];

		for (var i = 0; i < 4; i++) {
			matrix[i][3] = perspective[i];
		}

		for (var _i2 = 0; _i2 < 3; _i2++) {
			for (var j = 0; j < 3; j++) {
				matrix[3][_i2] += translate[j] * matrix[j][_i2];
			}
		}

		var x = quat[0],
		    y = quat[1],
		    z = quat[2],
		    w = quat[3];

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

		for (var _i3 = 0; _i3 < 3; _i3++) {
			for (var _j = 0; _j < 3; _j++) {
				matrix[_i3][_j] *= scale[_i3];
			}
		}

		return { t: "matrix", d: [matrix[0][0], matrix[0][1], matrix[1][0], matrix[1][1], matrix[3][0], matrix[3][1]] };
	}
	return composeMatrix;
}();

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
		for (var i = 0; i < 4; i++) {
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
			return { t: type, d: interp(from.d, to.d, f, type) }; // are rotate and skew ok here? should be wrapped in an array. and rotate is not unitless...
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
			for (var j = 0; j < maxVal; j++) {
				var fromVal = from.d ? from.d[j] : {};
				var toVal = to.d ? to.d[j] : {};
				result.push(lengthType.interpolate(fromVal, toVal, f));
			}
			return { t: type, d: result };
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

var transformType = {
	toString: function toString() {
		return "transformType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(value) {
		// KxDx // TODO: SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// TODO: fix this :) matrix is way off // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		if (!value || !value.length) {
			// This happens often...
			//console.log("transformType inverse with no base!");
			value = this.zero();
		}
		var delta = this.zero(value);
		//console.log("inverse delta:%s;",JSON.stringify(delta));
		var out = [];
		for (var i = 0; i < value.length; i++) {
			switch (value[i].t) {
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					out.push({ t: value[i].t, d: [numberType.inverse(value[i].d[0])] }); // new style, have to unwrap then re-wrap
					break;
				case "skew":
					out.push({ t: value[i].t, d: [numberType.inverse(value[i].d[0]), numberType.inverse(value[i].d[1])] });
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
				case "perspective":
					out.push({ t: value[i].t, d: [numberType.inverse(value[i].d[0])] });
					break;
				case "translate":
					out.push({ t: value[i].t, d: [{ px: numberType.inverse(value[i].d[0].px) }, { px: numberType.inverse(value[i].d[1].px) }] });
					break;
				case "translate3d":
					out.push({ t: value[i].t, d: [{ px: numberType.inverse(value[i].d[0].px) }, { px: numberType.inverse(value[i].d[1].px) }, { px: numberType.inverse(value[i].d[2].px) }] });
					break;
				case "scale":
					out.push({ t: value[i].t, d: [delta[i].d[0] / value[i].d[0], delta[i].d[1] / value[i].d[1]] }); // inverse of 2 is 1/2
					break;
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					out.push({ t: value[i].t, d: [delta[i].d[0] / value[i].d[0]] }); // inverse of 2 is 1/2
					break;
				case "scale3d":
					out.push({ t: value[i].t, d: [delta[i].d[0] / value[i].d[0], delta[i].d[1] / value[i].d[1], -1 / value[i].d[2]] }); // inverse of 2 is 1/2
					break;
				case "matrix":
					out.push({ t: value[i].t, d: [numberType.inverse(value[i].d[0]), numberType.inverse(value[i].d[1]), numberType.inverse(value[i].d[2]), numberType.inverse(value[i].d[3]), numberType.inverse(value[i].d[4]), numberType.inverse(value[i].d[5])] });
					break;
			}
		}
		return out;
	},

	add: function add(base, delta) {
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
			for (var i = diff; i < baseLength; i++) {
				if (base[i].t !== delta[j].t) {
					match = false;
					break;
				}
				j++;
			}
			if (match) return this.sum(base, delta);
		}
		return base.concat(delta);
	},

	sum: function sum(value, delta) {
		// add is for the full values, sum is for their components // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// TODO: fix this :) matrix is way off // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// 		console.log("SUM base:%s;",JSON.stringify(value));
		// 		console.log("SUM delta:%s;",JSON.stringify(delta));
		var out = [];
		var valueLength = value.length;
		var deltaLength = delta.length;
		var diff = valueLength - deltaLength;
		var j = 0;
		for (var i = 0; i < valueLength; i++) {
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
						out.push({ t: value[i].t, d: [numberType.add(value[i].d[0], delta[j].d[0])] }); // new style, have to unwrap then re-wrap
						break;
					case "skew":
						out.push({ t: value[i].t, d: [numberType.add(value[i].d[0], delta[j].d[0]), numberType.add(value[i].d[1], delta[j].d[1])] });
						break;
					case "translateX":
					case "translateY":
					case "translateZ":
					case "perspective":
						out.push({ t: value[i].t, d: [numberType.add(value[i].d[0], delta[j].d[0])] });
						break;
					case "translate":
						out.push({ t: value[i].t, d: [{ px: numberType.add(value[i].d[0].px, delta[j].d[0].px) }, { px: numberType.add(value[i].d[1].px, delta[j].d[1].px) }] });
						break;
					case "translate3d":
						out.push({ t: value[i].t, d: [{ px: numberType.add(value[i].d[0].px, delta[j].d[0].px) }, { px: numberType.add(value[i].d[1].px, delta[j].d[1].px) }, { px: numberType.add(value[i].d[2].px, delta[j].d[2].px) }] });
						break;
					case "scale":
						out.push({ t: value[i].t, d: [value[i].d[0] * delta[j].d[0], value[i].d[1] * delta[j].d[1]] });
						break;
					case "scaleX":
					case "scaleY":
					case "scaleZ":
						out.push({ t: value[i].t, d: [value[i].d[0] * delta[j].d[0]] });
						break;
					case "scale3d":
						out.push({ t: value[i].t, d: [value[i].d[0] * delta[j].d[0], value[i].d[1] * delta[j].d[1], value[i].d[2] * delta[j].d[2]] });
						break;
					case "matrix":
						out.push({ t: value[i].t, d: [numberType.add(value[i].d[0], delta[j].d[0]), numberType.add(value[i].d[1], delta[j].d[1]), numberType.add(value[i].d[2], delta[j].d[2]), numberType.add(value[i].d[3], delta[j].d[3]), numberType.add(value[i].d[4], delta[j].d[4]), numberType.add(value[i].d[5], delta[j].d[5])] });
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

	zero: function zero(value) {
		// KxDx // requires an old value for type // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		// TODO: fix this :) matrix is way off // need SVG mode! see output // Using numberType not lengthType for transforms and perspective, probably should revert back
		//console.log("zero value:%s;",JSON.stringify(value));
		var identity2dMatrix = [1, 0, 0, 1, 0, 0];
		if (!value) return [{ t: "matrix", d: identity2dMatrix }];
		var out = [];
		for (var i = 0; i < value.length; i++) {
			switch (value[i].t) {
				// TODO: rotate3d(1, 2.0, 3.0, 10deg);
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					out.push({ t: value[i].t, d: [0] }); // new style
					break;
				case "skew":
					out.push({ t: value[i].t, d: [0, 0] });
					break;
				case "translateX":
				case "translateY":
				case "translateZ":
				case "perspective":
					out.push({ t: value[i].t, d: [0] });
					break;
				case "translate":
					out.push({ t: value[i].t, d: [{ px: 0 }, { px: 0 }] });
					break;
				case "translate3d":
					out.push({ t: value[i].t, d: [{ px: 0 }, { px: 0 }, { px: 0 }] });
					break;
				case "scale":
					out.push({ t: value[i].t, d: [1, 1] });
					break;
				case "scaleX":
				case "scaleY":
				case "scaleZ":
					out.push({ t: value[i].t, d: [1] });
					break;
				case "scale3d":
					out.push({ t: value[i].t, d: [1, 1, 1] });
					break;
				case "matrix":
					out.push({ t: value[i].t, d: identity2dMatrix });
					break;
			}
		}
		return out;
	},

	subtract: function subtract(base, delta) {
		var inverse = this.inverse(delta);
		var result = this.add(base, inverse);
		return result;
	},

	interpolate: function interpolate(from, to, f) {
		// ugly values
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
			out.push(interpTransformValue(from[i], { t: null, d: null }, f));
		}
		for (; i < to.length; i++) {
			out.push(interpTransformValue({ t: null, d: null }, to[i], f));
		}
		return out;
	},

	output: function output(value, svgMode) {
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
		for (var i = 0; i < value.length; i++) {
			switch (value[i].t) {
				// TODO: rotate3d(1, 2.0, 3.0, 10deg);
				case "rotate":
				case "rotateX":
				case "rotateY":
				case "rotateZ":
				case "skewX":
				case "skewY":
					unit = svgMode ? "" : "deg";
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
					out += value[i].t + "(" + lengthType.output(value[i].d[0]) + ") ";
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
					out += value[i].t + "(" + value[i].d[0] + ", " + value[i].d[1] + ", " + value[i].d[2] + ") ";
					break;
				case "matrix":
					out += value[i].t + "(" + n(value[i].d[0]) + ", " + n(value[i].d[1]) + ", " + n(value[i].d[2]) + ", " + n(value[i].d[3]) + ", " + n(value[i].d[4]) + ", " + n(value[i].d[5]) + ") ";
					break;
			}
		}
		var result = out.substring(0, out.length - 1);
		//console.log("tranform output result:%s;",JSON.stringify(result));
		return result;
	},

	input: function input(value) {

		// 		if (typeof value !== "string") return null;
		// 		return parseTransform(value) || [];

		var result = [];
		while (typeof value === "string" && value.length > 0) {
			var r;
			for (var i = 0; i < transformREs.length; i++) {
				var reSpec = transformREs[i];
				r = reSpec[0].exec(value);
				if (r) {
					result.push({ t: reSpec[2], d: reSpec[1](r) });
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

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var colorRE = new RegExp("(hsla?|rgba?)\\(" + "([\\-0-9]+%?),?\\s*" + "([\\-0-9]+%?),?\\s*" + "([\\-0-9]+%?)(?:,?\\s*([\\-0-9\\.]+%?))?" + "\\)");
var colorHashRE = new RegExp("#([0-9A-Fa-f][0-9A-Fa-f]?)" + "([0-9A-Fa-f][0-9A-Fa-f]?)" + "([0-9A-Fa-f][0-9A-Fa-f]?)");

function hsl2rgb(h, s, l) {
	// Cribbed from http://dev.w3.org/csswg/css-color/#hsl-color
	// Wrap to 0->360 degrees (IE -10 === 350) then normalize
	h = (h % 360 + 360) % 360 / 360;
	s = s / 100;
	l = l / 100;
	function hue2rgb(m1, m2, h) {
		if (h < 0) {
			h += 1;
		}
		if (h > 1) {
			h -= 1;
		}
		if (h * 6 < 1) {
			return m1 + (m2 - m1) * h * 6;
		}
		if (h * 2 < 1) {
			return m2;
		}
		if (h * 3 < 2) {
			return m1 + (m2 - m1) * (2 / 3 - h) * 6;
		}
		return m1;
	}
	var m2;
	if (l <= 0.5) {
		m2 = l * (s + 1);
	} else {
		m2 = l + s - l * s;
	}

	var m1 = l * 2 - m2;
	var r = Math.ceil(hue2rgb(m1, m2, h + 1 / 3) * 255);
	var g = Math.ceil(hue2rgb(m1, m2, h) * 255);
	var b = Math.ceil(hue2rgb(m1, m2, h - 1 / 3) * 255);
	return [r, g, b];
}

var namedColors = {
	aliceblue: [240, 248, 255, 1],
	antiquewhite: [250, 235, 215, 1],
	aqua: [0, 255, 255, 1],
	aquamarine: [127, 255, 212, 1],
	azure: [240, 255, 255, 1],
	beige: [245, 245, 220, 1],
	bisque: [255, 228, 196, 1],
	black: [0, 0, 0, 1],
	blanchedalmond: [255, 235, 205, 1],
	blue: [0, 0, 255, 1],
	blueviolet: [138, 43, 226, 1],
	brown: [165, 42, 42, 1],
	burlywood: [222, 184, 135, 1],
	cadetblue: [95, 158, 160, 1],
	chartreuse: [127, 255, 0, 1],
	chocolate: [210, 105, 30, 1],
	coral: [255, 127, 80, 1],
	cornflowerblue: [100, 149, 237, 1],
	cornsilk: [255, 248, 220, 1],
	crimson: [220, 20, 60, 1],
	cyan: [0, 255, 255, 1],
	darkblue: [0, 0, 139, 1],
	darkcyan: [0, 139, 139, 1],
	darkgoldenrod: [184, 134, 11, 1],
	darkgray: [169, 169, 169, 1],
	darkgreen: [0, 100, 0, 1],
	darkgrey: [169, 169, 169, 1],
	darkkhaki: [189, 183, 107, 1],
	darkmagenta: [139, 0, 139, 1],
	darkolivegreen: [85, 107, 47, 1],
	darkorange: [255, 140, 0, 1],
	darkorchid: [153, 50, 204, 1],
	darkred: [139, 0, 0, 1],
	darksalmon: [233, 150, 122, 1],
	darkseagreen: [143, 188, 143, 1],
	darkslateblue: [72, 61, 139, 1],
	darkslategray: [47, 79, 79, 1],
	darkslategrey: [47, 79, 79, 1],
	darkturquoise: [0, 206, 209, 1],
	darkviolet: [148, 0, 211, 1],
	deeppink: [255, 20, 147, 1],
	deepskyblue: [0, 191, 255, 1],
	dimgray: [105, 105, 105, 1],
	dimgrey: [105, 105, 105, 1],
	dodgerblue: [30, 144, 255, 1],
	firebrick: [178, 34, 34, 1],
	floralwhite: [255, 250, 240, 1],
	forestgreen: [34, 139, 34, 1],
	fuchsia: [255, 0, 255, 1],
	gainsboro: [220, 220, 220, 1],
	ghostwhite: [248, 248, 255, 1],
	gold: [255, 215, 0, 1],
	goldenrod: [218, 165, 32, 1],
	gray: [128, 128, 128, 1],
	green: [0, 128, 0, 1],
	greenyellow: [173, 255, 47, 1],
	grey: [128, 128, 128, 1],
	honeydew: [240, 255, 240, 1],
	hotpink: [255, 105, 180, 1],
	indianred: [205, 92, 92, 1],
	indigo: [75, 0, 130, 1],
	ivory: [255, 255, 240, 1],
	khaki: [240, 230, 140, 1],
	lavender: [230, 230, 250, 1],
	lavenderblush: [255, 240, 245, 1],
	lawngreen: [124, 252, 0, 1],
	lemonchiffon: [255, 250, 205, 1],
	lightblue: [173, 216, 230, 1],
	lightcoral: [240, 128, 128, 1],
	lightcyan: [224, 255, 255, 1],
	lightgoldenrodyellow: [250, 250, 210, 1],
	lightgray: [211, 211, 211, 1],
	lightgreen: [144, 238, 144, 1],
	lightgrey: [211, 211, 211, 1],
	lightpink: [255, 182, 193, 1],
	lightsalmon: [255, 160, 122, 1],
	lightseagreen: [32, 178, 170, 1],
	lightskyblue: [135, 206, 250, 1],
	lightslategray: [119, 136, 153, 1],
	lightslategrey: [119, 136, 153, 1],
	lightsteelblue: [176, 196, 222, 1],
	lightyellow: [255, 255, 224, 1],
	lime: [0, 255, 0, 1],
	limegreen: [50, 205, 50, 1],
	linen: [250, 240, 230, 1],
	magenta: [255, 0, 255, 1],
	maroon: [128, 0, 0, 1],
	mediumaquamarine: [102, 205, 170, 1],
	mediumblue: [0, 0, 205, 1],
	mediumorchid: [186, 85, 211, 1],
	mediumpurple: [147, 112, 219, 1],
	mediumseagreen: [60, 179, 113, 1],
	mediumslateblue: [123, 104, 238, 1],
	mediumspringgreen: [0, 250, 154, 1],
	mediumturquoise: [72, 209, 204, 1],
	mediumvioletred: [199, 21, 133, 1],
	midnightblue: [25, 25, 112, 1],
	mintcream: [245, 255, 250, 1],
	mistyrose: [255, 228, 225, 1],
	moccasin: [255, 228, 181, 1],
	navajowhite: [255, 222, 173, 1],
	navy: [0, 0, 128, 1],
	oldlace: [253, 245, 230, 1],
	olive: [128, 128, 0, 1],
	olivedrab: [107, 142, 35, 1],
	orange: [255, 165, 0, 1],
	orangered: [255, 69, 0, 1],
	orchid: [218, 112, 214, 1],
	palegoldenrod: [238, 232, 170, 1],
	palegreen: [152, 251, 152, 1],
	paleturquoise: [175, 238, 238, 1],
	palevioletred: [219, 112, 147, 1],
	papayawhip: [255, 239, 213, 1],
	peachpuff: [255, 218, 185, 1],
	peru: [205, 133, 63, 1],
	pink: [255, 192, 203, 1],
	plum: [221, 160, 221, 1],
	powderblue: [176, 224, 230, 1],
	purple: [128, 0, 128, 1],
	red: [255, 0, 0, 1],
	rosybrown: [188, 143, 143, 1],
	royalblue: [65, 105, 225, 1],
	saddlebrown: [139, 69, 19, 1],
	salmon: [250, 128, 114, 1],
	sandybrown: [244, 164, 96, 1],
	seagreen: [46, 139, 87, 1],
	seashell: [255, 245, 238, 1],
	sienna: [160, 82, 45, 1],
	silver: [192, 192, 192, 1],
	skyblue: [135, 206, 235, 1],
	slateblue: [106, 90, 205, 1],
	slategray: [112, 128, 144, 1],
	slategrey: [112, 128, 144, 1],
	snow: [255, 250, 250, 1],
	springgreen: [0, 255, 127, 1],
	steelblue: [70, 130, 180, 1],
	tan: [210, 180, 140, 1],
	teal: [0, 128, 128, 1],
	thistle: [216, 191, 216, 1],
	tomato: [255, 99, 71, 1],
	transparent: [0, 0, 0, 0],
	turquoise: [64, 224, 208, 1],
	violet: [238, 130, 238, 1],
	wheat: [245, 222, 179, 1],
	white: [255, 255, 255, 1],
	whitesmoke: [245, 245, 245, 1],
	yellow: [255, 255, 0, 1],
	yellowgreen: [154, 205, 50, 1]
};

var colorType = typeWithKeywords(["currentColor"], {
	toString: function toString() {
		return "ColorType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(value) {
		// KxDx
		return this.subtract(value, [255, 255, 255, 1]);
	},
	zero: function zero() {
		return [0, 0, 0, 0];
	},
	_premultiply: function _premultiply(value) {
		var alpha = value[3];
		return [value[0] * alpha, value[1] * alpha, value[2] * alpha];
	},
	add: function add(base, delta) {
		var alpha = Math.min(base[3] + delta[3], 1);
		if (alpha === 0) {
			return [0, 0, 0, 0];
		}
		base = this._premultiply(base);
		delta = this._premultiply(delta);
		return [(base[0] + delta[0]) / alpha, (base[1] + delta[1]) / alpha, (base[2] + delta[2]) / alpha, alpha];
	},
	subtract: function subtract(base, delta) {
		var alpha = Math.min(base[3] + delta[3], 1);
		if (alpha === 0) {
			return [0, 0, 0, 0];
		}
		base = this._premultiply(base);
		delta = this._premultiply(delta);
		return [(base[0] - delta[0]) / alpha, (base[1] - delta[1]) / alpha, (base[2] - delta[2]) / alpha, alpha];
	},
	interpolate: function interpolate(from, to, f) {
		var alpha = clamp(interp(from[3], to[3], f), 0, 1);
		if (alpha === 0) {
			return [0, 0, 0, 0];
		}
		from = this._premultiply(from);
		to = this._premultiply(to);
		return [interp(from[0], to[0], f) / alpha, interp(from[1], to[1], f) / alpha, interp(from[2], to[2], f) / alpha, alpha];
	},
	output: function output(value) {
		return "rgba(" + Math.round(value[0]) + ", " + Math.round(value[1]) + ", " + Math.round(value[2]) + ", " + value[3] + ")";
	},
	input: function input(value) {
		// http://dev.w3.org/csswg/css-color/#color
		var out = [];

		var regexHashResult = colorHashRE.exec(value);
		if (regexHashResult) {
			if (value.length !== 4 && value.length !== 7) {
				return undefined;
			}
			regexHashResult.shift();
			for (var i = 0; i < 3; i++) {
				if (regexHashResult[i].length === 1) {
					regexHashResult[i] = regexHashResult[i] + regexHashResult[i];
				}
				var v = Math.max(Math.min(parseInt(regexHashResult[i], 16), 255), 0);
				out[i] = v;
			}
			out.push(1.0);
		}

		var regexResult = colorRE.exec(value);
		if (regexResult) {
			regexResult.shift();
			var type = regexResult.shift().substr(0, 3);
			for (var _i = 0; _i < 3; _i++) {
				var m = 1;
				if (regexResult[_i][regexResult[_i].length - 1] === "%") {
					regexResult[_i] = regexResult[_i].substr(0, regexResult[_i].length - 1);
					m = 255.0 / 100.0;
				}
				if (type === "rgb") {
					out[_i] = clamp(Math.round(parseInt(regexResult[_i], 10) * m), 0, 255);
				} else {
					out[_i] = parseInt(regexResult[_i], 10);
				}
			}

			// Convert hsl values to rgb value
			if (type === "hsl") {
				out = hsl2rgb.apply(null, out);
			}

			if (typeof regexResult[3] !== "undefined") {
				out[3] = Math.max(Math.min(parseFloat(regexResult[3]), 1.0), 0.0);
			} else {
				out.push(1.0);
			}
		}

		if (out.some(isNaN)) {
			return undefined;
		}
		if (out.length > 0) {
			return out;
		}
		return namedColors[value];
	}
});

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var positionKeywordRE = /^\s*left|^\s*center|^\s*right|^\s*top|^\s*bottom/i;

var positionType = {
	toString: function toString() {
		return "positionType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(base) {
		// KxDx
		return [lengthType.inverse(base[0]), lengthType.add(base[1])];
	},
	zero: function zero() {
		return [{ px: 0 }, { px: 0 }];
	},
	add: function add(base, delta) {
		return [lengthType.add(base[0], delta[0]), lengthType.add(base[1], delta[1])];
	},
	subtract: function subtract(base, delta) {
		// KxDx
		return this.add(base, this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		return [lengthType.interpolate(from[0], to[0], f), lengthType.interpolate(from[1], to[1], f)];
	},
	output: function output(value) {
		return value.map(lengthType.output).join(" ");
	},
	input: function input(value) {
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
			var token = tokens[0];
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
			var _token = tokens[i];
			if (!positionType.isKeyword(_token)) {
				return undefined;
			}
			if (_token === "center") {
				if (center) {
					return undefined;
				}
				center = true;
				continue;
			}
			var axis = Number(positionType.isVerticalToken(_token));
			if (out[axis]) {
				return undefined;
			}
			if (i === tokens.length - 1 || positionType.isKeyword(tokens[i + 1])) {
				out[axis] = positionType.resolveToken(_token);
				continue;
			}
			var percentLength = tokens[++i];
			if (_token === "bottom" || _token === "right") {
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
	consumeTokenFromString: function consumeTokenFromString(value) {
		var keywordMatch = positionKeywordRE.exec(value);
		if (keywordMatch) {
			return {
				value: keywordMatch[0].trim().toLowerCase(),
				remaining: value.substring(keywordMatch[0].length)
			};
		}
		return lengthType.consumeValueFromString(value);
	},
	resolveToken: function resolveToken(token) {
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
	isHorizontalToken: function isHorizontalToken(token) {
		if (typeof token === "string") {
			return token in { left: true, center: true, right: true };
		}
		return true;
	},
	isVerticalToken: function isVerticalToken(token) {
		if (typeof token === "string") {
			return token in { top: true, center: true, bottom: true };
		}
		return true;
	},
	isKeyword: function isKeyword(token) {
		return typeof token === "string";
	}
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

// Spec: http://dev.w3.org/csswg/css-backgrounds/#background-position
var positionListType = {
	toString: function toString() {
		return "positionListType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(base) {
		// KxDx
		var out = [];
		var maxLength = base.length;
		for (var i = 0; i < maxLength; i++) {
			var basePosition = base[i] ? base[i] : positionType.zero();
			out.push(positionType.inverse(basePosition));
		}
		return out;
	},
	zero: function zero() {
		return [positionType.zero()];
	},
	add: function add(base, delta) {
		var out = [];
		var maxLength = Math.max(base.length, delta.length);
		for (var i = 0; i < maxLength; i++) {
			var basePosition = base[i] ? base[i] : positionType.zero();
			var deltaPosition = delta[i] ? delta[i] : positionType.zero();
			out.push(positionType.add(basePosition, deltaPosition));
		}
		return out;
	},
	subtract: function subtract(base, delta) {
		// KxDx
		return this.add(base, this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		var out = [];
		var maxLength = Math.max(from.length, to.length);
		for (var i = 0; i < maxLength; i++) {
			var fromPosition = from[i] ? from[i] : positionType.zero();
			var toPosition = to[i] ? to[i] : positionType.zero();
			out.push(positionType.interpolate(fromPosition, toPosition, f));
		}
		return out;
	},
	output: function output(value) {
		return value.map(positionType.output).join(", ");
	},
	input: function input(value) {
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

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var rectangleRE = /rect\(([^,]+),([^,]+),([^,]+),([^)]+)\)/;

var rectangleType = {

	toString: function toString() {
		return "rectangleType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(value) {
		// KxDx
		return {
			top: lengthType.inverse(value.top),
			right: lengthType.inverse(value.right),
			bottom: lengthType.inverse(value.bottom),
			left: lengthType.inverse(value.left)
		};
	},
	zero: function zero() {
		return { top: 0, right: 0, bottom: 0, left: 0 };
	}, // KxDx
	add: function add(base, delta) {
		return {
			top: lengthType.add(base.top, delta.top),
			right: lengthType.add(base.right, delta.right),
			bottom: lengthType.add(base.bottom, delta.bottom),
			left: lengthType.add(base.left, delta.left)
		};
	},
	subtract: function subtract(base, delta) {
		// KxDx
		return this.add(base, this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		return {
			top: lengthType.interpolate(from.top, to.top, f),
			right: lengthType.interpolate(from.right, to.right, f),
			bottom: lengthType.interpolate(from.bottom, to.bottom, f),
			left: lengthType.interpolate(from.left, to.left, f)
		};
	},
	output: function output(value) {
		return "rect(" + lengthType.output(value.top) + "," + lengthType.output(value.right) + "," + lengthType.output(value.bottom) + "," + lengthType.output(value.left) + ")";
	},
	input: function input(value) {
		var match = rectangleRE.exec(value);
		if (!match) {
			return undefined;
		}
		var out = {
			top: lengthType.input(match[1]),
			right: lengthType.input(match[2]),
			bottom: lengthType.input(match[3]),
			left: lengthType.input(match[4])
		};
		if (out.top && out.right && out.bottom && out.left) {
			return out;
		}
		return undefined;
	}
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var shadowType = {
	toString: function toString() {
		return "shadowType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(value) {
		return nonNumericType.inverse(value);
	},
	zero: function zero() {
		return {
			hOffset: lengthType.zero(),
			vOffset: lengthType.zero()
		};
	},
	_addSingle: function _addSingle(base, delta) {
		if (base && delta && base.inset !== delta.inset) {
			return delta;
		}
		var result = {
			inset: base ? base.inset : delta.inset,
			hOffset: lengthType.add(base ? base.hOffset : lengthType.zero(), delta ? delta.hOffset : lengthType.zero()),
			vOffset: lengthType.add(base ? base.vOffset : lengthType.zero(), delta ? delta.vOffset : lengthType.zero()),
			blur: lengthType.add(base && base.blur || lengthType.zero(), delta && delta.blur || lengthType.zero())
		};
		if (base && base.spread || delta && delta.spread) {
			result.spread = lengthType.add(base && base.spread || lengthType.zero(), delta && delta.spread || lengthType.zero());
		}
		if (base && base.color || delta && delta.color) {
			result.color = colorType.add(base && base.color || colorType.zero(), delta && delta.color || colorType.zero());
		}
		return result;
	},
	add: function add(base, delta) {
		var result = [];
		for (var i = 0; i < base.length || i < delta.length; i++) {
			result.push(this._addSingle(base[i], delta[i]));
		}
		return result;
	},
	subtract: function subtract(base, delta) {
		// KxDx
		return this.add(base, this.inverse(delta));
	},
	_interpolateSingle: function _interpolateSingle(from, to, f) {
		if (from && to && from.inset !== to.inset) {
			return f < 0.5 ? from : to;
		}
		var result = {
			inset: from ? from.inset : to.inset,
			hOffset: lengthType.interpolate(from ? from.hOffset : lengthType.zero(), to ? to.hOffset : lengthType.zero(), f),
			vOffset: lengthType.interpolate(from ? from.vOffset : lengthType.zero(), to ? to.vOffset : lengthType.zero(), f),
			blur: lengthType.interpolate(from && from.blur || lengthType.zero(), to && to.blur || lengthType.zero(), f)
		};
		if (from && from.spread || to && to.spread) {
			result.spread = lengthType.interpolate(from && from.spread || lengthType.zero(), to && to.spread || lengthType.zero(), f);
		}
		if (from && from.color || to && to.color) {
			result.color = colorType.interpolate(from && from.color || colorType.zero(), to && to.color || colorType.zero(), f);
		}
		return result;
	},
	interpolate: function interpolate(from, to, f) {
		var result = [];
		for (var i = 0; i < from.length || i < to.length; i++) {
			result.push(this._interpolateSingle(from[i], to[i], f));
		}
		return result;
	},
	_outputSingle: function _outputSingle(value) {
		return (value.inset ? "inset " : "") + lengthType.output(value.hOffset) + " " + lengthType.output(value.vOffset) + " " + lengthType.output(value.blur) + (value.spread ? " " + lengthType.output(value.spread) : "") + (value.color ? " " + colorType.output(value.color) : "");
	},
	output: function output(value) {
		return value.map(this._outputSingle).join(", ");
	},
	input: function input(value) {
		var shadowRE = /(([^(,]+(\([^)]*\))?)+)/g;
		var match;
		var shadows = [];
		while ((match = shadowRE.exec(value)) !== null) {
			shadows.push(match[0]);
		}

		var result = shadows.map(function (value) {
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

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var fontWeightType = {
	toString: function toString() {
		return "fontWeightType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	inverse: function inverse(value) {
		// KxDx
		return value * -1;
	},
	add: function add(base, delta) {
		return base + delta;
	},
	subtract: function subtract(base, delta) {
		// KxDx
		return this.add(base, this.inverse(delta));
	},
	interpolate: function interpolate(from, to, f) {
		return interp(from, to, f);
	},
	output: function output(value) {
		value = Math.round(value / 100) * 100;
		value = clamp(value, 100, 900);
		if (value === 400) {
			return "normal";
		}
		if (value === 700) {
			return "bold";
		}
		return String(value);
	},
	input: function input(value) {
		// TODO: support lighter / darker ?
		var out = Number(value);
		if (isNaN(out) || out < 100 || out > 900 || out % 100 !== 0) {
			return undefined;
		}
		return out;
	}
};

// This file is a heavily modified derivative work of:
// https://github.com/web-animations/web-animations-js-legacy

var visibilityType = createObject(nonNumericType, {
	toString: function toString() {
		return "visibilityType";
	},
	toJSON: function toJSON() {
		return this.toString();
	},
	zero: function zero() {
		return "hidden"; // Sure, why not.
	},
	unspecified: function unspecified() {
		return "visible";
	},
	add: function add(a, b) {
		if (a !== "visible" && b !== "visible") {
			return nonNumericType.add(a, b);
		}
		return "visible";
	},
	subtract: function subtract(a, b) {
		if (b === "visible" && a === "visible") return "hidden";
		return a;
	},
	interpolate: function interpolate(from, to, f) {
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
	input: function input(value) {
		if (["visible", "hidden", "collapse"].indexOf(value) !== -1) {
			return value;
		}
		return undefined;
	}
});




/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__hyperact_mjs__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__worker_js__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_history_createBrowserHistory__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_history_createBrowserHistory___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_history_createBrowserHistory__);



var glMatrix = __webpack_require__(7);
var vec3 = glMatrix.vec3;
var mat3 = glMatrix.mat3;
var mat4 = glMatrix.mat4;


var history = __WEBPACK_IMPORTED_MODULE_2_history_createBrowserHistory___default()();

var numberOfWorkers = 4;

var iterations = 50;

var vertices = 2500;

var duration = 5.0;
var interval = 1.0;
var omega = 20;
var zeta = 0.75;

var beginning = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__hyperact_mjs__["a" /* currentTransaction */])().time;
var state = {
	asymmetry: 0,
	leadingEdge: 0,
	trailingEdge: 0,
	a: 1,
	b: 2,
	d: 0,
	ribbon: 0,
	radiusA: 0,
	radiusB: 0
};
if (history.location.state) {
	var copy = Object.assign({}, history.location.state);
	Object.keys(state).forEach(function (key) {
		if (typeof copy[key] === "undefined") copy[key] = state.key;
	});
	state = copy;
}

window.onpopstate = function (event) {
	state = event.state;
};

var lissajous = true;
var lissajousMax = 3;
var lissajousMin = 1;

var radius = 1.0;

var toggling = false;

var tau = Math.PI * 2;
var thetaThreshold = tau / vertices;
var thickness = 0.002;
var additional = 0;
var base = 25;
var messy = false;

var stretchOnHold = false;

var running = true;

var timer = void 0;
var working = 0;
var queued = false;
var animated = false;
var workers = [];
var date = performance.now();
var incompleteLayer = [];
if (!numberOfWorkers) incompleteLayer = {
	positionArray: [],
	normalArray: [],
	coordArray: []
};

var plot = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__worker_js__["a" /* work */])();
var blob = new Blob(["(" + __WEBPACK_IMPORTED_MODULE_1__worker_js__["a" /* work */].toString() + ")()"], { type: "application/javascript" });
//const blob = new Blob(Array.prototype.map.call(document.querySelectorAll('script[type=\'text\/js-worker\']'), function (oScript) { return oScript.textContent; }),{type: 'text/javascript'});
var url = URL.createObjectURL(blob);

var _loop = function _loop(i) {
	var worker = new Worker(window.URL.createObjectURL(blob));
	worker.addEventListener("message", function (e) {
		respond(i, e.data);
	}, false);
	workers.push(worker);
};

for (var i = 0; i < numberOfWorkers; i++) {
	_loop(i);
}

var canvas = document.createElement("canvas");
document.body.appendChild(canvas);

var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
if (!gl) throw new Error("no web gl");

var layer = Object.assign(manual(), {
	progress: [0.0, 0.0, 0.0],
	light: [-1.0, -1.0, -1.0],
	ambient: [0.5, 0.5, 0.5],
	directional: [1, 1, 1],
	rotation: [0, 0, Math.PI / 2]
});
var delegate = {
	display: function display(presentation) {
		applyBuffers(presentation);
		drawScene();
	},
	animationForKey: function animationForKey(key, value, previous) {
		if (key === "positionArray" || key === "normalArray") {
			var animation = {
				type: new __WEBPACK_IMPORTED_MODULE_0__hyperact_mjs__["b" /* HyperArray */](new __WEBPACK_IMPORTED_MODULE_0__hyperact_mjs__["c" /* HyperNumber */](), value.length),
				duration: duration,
				easing: easing
			};
			if (!previous.length) animation.from = value.map(function () {
				return 0;
			});
			return animation;
		} else if (key === "progress" || key === "light" || key === "directional") {
			var _animation = {
				type: new __WEBPACK_IMPORTED_MODULE_0__hyperact_mjs__["b" /* HyperArray */](new __WEBPACK_IMPORTED_MODULE_0__hyperact_mjs__["c" /* HyperNumber */](), 3),
				duration: duration,
				easing: easing
			};
			if (!previous.length) _animation.from = value.map(function () {
				return 0;
			});
			return _animation;
		}
	}
};
var controller = {};
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__hyperact_mjs__["d" /* activate */])(controller, delegate, layer);

var shaderProgram = initShaders();

var positionBuffer = initBuffer(3, layer.positionArray.slice(0));
var normalBuffer = initBuffer(3, layer.normalArray.slice(0));
var coordBuffer = initBuffer(2, layer.coordArray.slice(0));

gl.enable(gl.BLEND);
gl.blendEquation(gl.FUNC_ADD);
gl.blendFunc(gl.SRC_COLOR, gl.ONE); // http://delphic.me.uk/webglalpha.html // http://mrdoob.github.io/webgl-blendfunctions/blendfunc.html

randomize();
resize();
layout();

document.addEventListener("keydown", keyDown);
document.addEventListener("mousedown", mouseDown);
document.addEventListener("mouseup", mouseUp);
window.addEventListener("resize", resize);

function getShader(gl, id) {
	// http://learningwebgl.com/blog/?page_id=1217
	var shaderScript = document.getElementById(id);
	if (!shaderScript) return null;
	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
	var shader = void 0;
	if (shaderScript.type == "x-shader/x-fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);else if (shaderScript.type == "x-shader/x-vertex") shader = gl.createShader(gl.VERTEX_SHADER);else return null;
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
	console.log(gl.getShaderInfoLog(shader));
	return null;
}

function initShaders() {
	// http://learningwebgl.com/blog/?p=1253
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	var shaderProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}

	gl.useProgram(shaderProgram);

	shaderProgram.vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPosition);

	shaderProgram.textureCoord = gl.getAttribLocation(shaderProgram, "textureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoord);

	shaderProgram.vertexNormal = gl.getAttribLocation(shaderProgram, "vertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormal);

	shaderProgram.perspectiveMatrix = gl.getUniformLocation(shaderProgram, "perspectiveMatrix");
	shaderProgram.modelMatrix = gl.getUniformLocation(shaderProgram, "modelMatrix");
	shaderProgram.normalMatrix = gl.getUniformLocation(shaderProgram, "normalMatrix");

	shaderProgram.ambientColor = gl.getUniformLocation(shaderProgram, "ambientColor");
	shaderProgram.lightingDirection = gl.getUniformLocation(shaderProgram, "lightingDirection");
	shaderProgram.directionalColor = gl.getUniformLocation(shaderProgram, "directionalColor");

	shaderProgram.progress = gl.getUniformLocation(shaderProgram, "progress");

	return shaderProgram;
}

function initBuffer(size, array) {
	// must plot before
	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.DYNAMIC_DRAW); // gl.STATIC_DRAW
	buffer.itemSize = size;
	buffer.numItems = array.length / size;
	return buffer;
}

function applyBuffers(layer) {
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(layer.positionArray));
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(layer.normalArray));
	gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(layer.coordArray));
}

function rotateMatrix(matrix) {
	var presentation = controller.presentation;
	var rotation = presentation.rotation;
	mat4.rotate(matrix, matrix, rotation[0], vec3.fromValues(1, 0, 0));
	mat4.rotate(matrix, matrix, rotation[1], vec3.fromValues(0, 1, 0));
	mat4.rotate(matrix, matrix, rotation[2], vec3.fromValues(0, 0, 1));
}

function lightScene() {
	var presentation = controller.presentation;
	var light = presentation.light;
	var ambient = presentation.ambient;
	var directional = presentation.directional;

	var adjusted = vec3.create();
	vec3.normalize(adjusted, light, adjusted);
	vec3.scale(adjusted, adjusted, -1);

	gl.uniform3f(shaderProgram.ambientColor, ambient[0], ambient[1], ambient[2]);
	gl.uniform3fv(shaderProgram.lightingDirection, adjusted);
	gl.uniform3f(shaderProgram.directionalColor, directional[0], directional[1], directional[2]);
}
function colorScene() {
	var progress = controller.presentation.progress;
	gl.uniform3fv(shaderProgram.progress, progress);
}

function drawScene(deltaTime) {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	colorScene();
	lightScene();

	var normalMatrix = mat3.create();
	var perspectiveMatrix = mat4.create();
	mat4.perspective(perspectiveMatrix, 50, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);

	var modelMatrix = mat4.create();

	mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, 0, -10));

	rotateMatrix(modelMatrix, deltaTime);

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPosition, positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoord, coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormal, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.uniformMatrix3fv(shaderProgram.normalMatrix, false, normalMatrix);
	gl.uniformMatrix4fv(shaderProgram.perspectiveMatrix, false, perspectiveMatrix);
	gl.uniformMatrix4fv(shaderProgram.modelMatrix, false, modelMatrix);

	gl.drawArrays(gl.TRIANGLE_STRIP, 0, positionBuffer.numItems);
}

function keyDown(e) {
	console.log(state);
}

function mouseDown(e) {
	running = !running && toggling;
	randomize();
	layout();
};

function mouseUp(e) {
	if (stretchOnHold) {
		trailingEdge = leadingEdge;
		layout();
	}
}

function manual() {
	var result = {};
	var nextPositionArray = [];
	var nextNormalArray = [];
	var nextCoordArray = [];
	var count = Math.max(1, numberOfWorkers);
	for (var index = 0; index < count; index++) {
		var nextLayer = plot({ iterations: iterations, radiusA: state.radiusA, radiusB: state.radiusB, a: state.a, b: state.b, d: state.d, thetaThreshold: thetaThreshold, divisions: count, index: index, leadingEdge: state.leadingEdge, trailingEdge: state.trailingEdge, ribbon: state.ribbon });
		nextPositionArray = nextPositionArray.concat(nextLayer.positionArray);
		nextNormalArray = nextNormalArray.concat(nextLayer.normalArray);
		nextCoordArray = nextCoordArray.concat(nextLayer.coordArray);
	}
	result.positionArray = nextPositionArray.slice(0);
	result.normalArray = nextNormalArray.slice(0);
	result.coordArray = nextCoordArray.slice(0);
	result.progress = [0.0, 0.0, 0.0];
	return result;
}

function randomize() {
	var asymmetry = void 0,
	    leadingEdge = void 0,
	    trailingEdge = void 0,
	    a = void 0,
	    b = void 0,
	    d = void 0,
	    ribbon = void 0;

	var scale = 1.0;
	var x = Math.random() * 2 * scale - 1 * scale;
	var y = Math.random() * 2 * scale - 1 * scale;
	var z = -1;
	var light = [x, y, z];
	layer.light = light;

	var X = Math.random() * 1;
	var Y = Math.random() * 1;
	var Z = Math.random() * 1;
	var ambient = [X, Y, Z];
	layer.directional = ambient;

	var progress = Math.random();
	layer.progress = [progress, 0, 0];

	var numerator = Math.ceil(Math.random() * base);
	var denominator = numerator + Math.ceil(Math.random() * base);

	if (messy) asymmetry = Math.random() * tau;else asymmetry = numerator / denominator * tau;
	if (Math.round(Math.random())) {
		asymmetry += Math.random() * additional;
	}
	leadingEdge = asymmetry;
	if (!stretchOnHold || running) trailingEdge = asymmetry;

	a = lissajousMin + Math.ceil(Math.random() * lissajousMax);
	b = a + 1;
	d = Math.random() * tau;

	ribbon = thickness * tau / a;

	state = {
		asymmetry: asymmetry,
		leadingEdge: leadingEdge,
		trailingEdge: trailingEdge,
		a: a,
		b: b,
		d: d,
		ribbon: ribbon,
		radiusA: radius,
		radiusB: radius
	};
	history.replace({ state: state });
}

function layout() {
	if (working) {
		queued = true;
		return;
	}
	queued = false;
	date = performance.now();

	if (numberOfWorkers) incompleteLayer = [];else incompleteLayer = {
		positionArray: [],
		normalArray: [],
		coordArray: []
	};

	if (running) randomize();

	for (var index = 0; index < numberOfWorkers; index++) {
		working++;
		workers[index].postMessage({ iterations: iterations, radiusA: state.radiusA, radiusB: state.radiusB, a: state.a, b: state.b, d: state.d, thetaThreshold: thetaThreshold, divisions: numberOfWorkers, index: index, leadingEdge: state.leadingEdge, trailingEdge: state.trailingEdge, ribbon: state.ribbon });
	}
	if (!numberOfWorkers) respond(0, manual());
}

function respond(index, data) {
	if (numberOfWorkers) incompleteLayer[index] = data;else incompleteLayer = data;
	if (numberOfWorkers) working--;
	if (!numberOfWorkers || !working) {
		stroke();
		var now = performance.now();
		date = now;
		if (timer && timer.clearTimeout) timer.clearTimeout();
		if (timer && timer.cancelTimeout) timer.cancelTimeout();
		timer = null;
		var clock = Math.random() * interval * 1000;
		if (running) timer = setTimeout(layout, clock);else if (queued) layout();
	}
}

function stroke() {
	var previousPositionArray = layer.positionArray;
	var previousNormalArray = layer.normalArray;
	var previousCoordArray = layer.coordArray;
	if (numberOfWorkers) {
		var nextPositionArray = [];
		var nextNormalArray = [];
		var nextCoordArray = [];
		for (var i = 0; i < numberOfWorkers; i++) {
			var nextLayerArray = incompleteLayer[i];
			nextPositionArray = nextPositionArray.concat(nextLayerArray.positionArray);
			nextNormalArray = nextNormalArray.concat(nextLayerArray.normalArray);
			nextCoordArray = nextCoordArray.concat(nextLayerArray.coordArray);
		}
		layer.positionArray = nextPositionArray.slice(0);
		layer.normalArray = nextNormalArray.slice(0);
		layer.coordArray = nextCoordArray.slice(0);
	} else {
		layer.positionArray = incompleteLayer.positionArray.slice(0);
		layer.normalArray = incompleteLayer.normalArray.slice(0);
		layer.coordArray = incompleteLayer.coordArray.slice(0);
	}
}

function resize(e) {
	var width = window.innerWidth;
	var height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	gl.viewportWidth = width;
	gl.viewportHeight = height;

	state = Object.assign({}, state, { radiusA: radius, radiusB: radius });
	history.replace({ state: state });
	delegate.display(controller.presentation);
}

function easing(progress) {
	var beta = Math.sqrt(1.0 - zeta * zeta);
	progress = 1 - Math.cos(progress * Math.PI / 2);
	progress = 1 / beta * Math.exp(-zeta * omega * progress) * Math.sin(beta * omega * progress + Math.atan(beta / zeta));
	return 1 - progress;
}

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["transpose"] = transpose;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["adjoint"] = adjoint;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["LDU"] = LDU;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 2x2 Matrix
 * @module mat2
 */

/**
 * Creates a new identity mat2
 *
 * @returns {mat2} a new 2x2 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Creates a new mat2 initialized with values from an existing matrix
 *
 * @param {mat2} a matrix to clone
 * @returns {mat2} a new 2x2 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Copy the values from one mat2 to another
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  return out;
}

/**
 * Set a mat2 to the identity matrix
 *
 * @param {mat2} out the receiving matrix
 * @returns {mat2} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Create a new mat2 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out A new 2x2 matrix
 */
function fromValues(m00, m01, m10, m11) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}

/**
 * Set the components of a mat2 to the given values
 *
 * @param {mat2} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m10 Component in column 1, row 0 position (index 2)
 * @param {Number} m11 Component in column 1, row 1 position (index 3)
 * @returns {mat2} out
 */
function set(out, m00, m01, m10, m11) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m10;
  out[3] = m11;
  return out;
}

/**
 * Transpose the values of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache
  // some values
  if (out === a) {
    let a1 = a[1];
    out[1] = a[2];
    out[2] = a1;
  } else {
    out[0] = a[0];
    out[1] = a[2];
    out[2] = a[1];
    out[3] = a[3];
  }

  return out;
}

/**
 * Inverts a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function invert(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];

  // Calculate the determinant
  let det = a0 * a3 - a2 * a1;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] =  a3 * det;
  out[1] = -a1 * det;
  out[2] = -a2 * det;
  out[3] =  a0 * det;

  return out;
}

/**
 * Calculates the adjugate of a mat2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the source matrix
 * @returns {mat2} out
 */
function adjoint(out, a) {
  // Caching this value is nessecary if out == a
  let a0 = a[0];
  out[0] =  a[3];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] =  a0;

  return out;
}

/**
 * Calculates the determinant of a mat2
 *
 * @param {mat2} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  return a[0] * a[3] - a[2] * a[1];
}

/**
 * Multiplies two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
function multiply(out, a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  return out;
}

/**
 * Rotates a mat2 by the given angle
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
function rotate(out, a, rad) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  out[0] = a0 *  c + a2 * s;
  out[1] = a1 *  c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  return out;
}

/**
 * Scales the mat2 by the dimensions in the given vec2
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to rotate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2} out
 **/
function scale(out, a, v) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let v0 = v[0], v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.rotate(dest, dest, rad);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2} out
 */
function fromRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2.identity(dest);
 *     mat2.scale(dest, dest, vec);
 *
 * @param {mat2} out mat2 receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  return out;
}

/**
 * Returns a string representation of a mat2
 *
 * @param {mat2} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat2(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Returns Frobenius norm of a mat2
 *
 * @param {mat2} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2)))
}

/**
 * Returns L, D and U matrices (Lower triangular, Diagonal and Upper triangular) by factorizing the input matrix
 * @param {mat2} L the lower triangular matrix
 * @param {mat2} D the diagonal matrix
 * @param {mat2} U the upper triangular matrix
 * @param {mat2} a the input matrix to factorize
 */

function LDU(L, D, U, a) {
  L[2] = a[2]/a[0];
  U[0] = a[0];
  U[1] = a[1];
  U[3] = a[3] - L[2] * U[1];
  return [L, D, U];
}

/**
 * Adds two mat2's
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @returns {mat2} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2} a The first matrix.
 * @param {mat2} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)));
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2} out the receiving matrix
 * @param {mat2} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  return out;
}

/**
 * Adds two mat2's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2} out the receiving vector
 * @param {mat2} a the first operand
 * @param {mat2} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  return out;
}

/**
 * Alias for {@link mat2.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat2.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["translate"] = translate;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["fromTranslation"] = fromTranslation;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 2x3 Matrix
 * @module mat2d
 *
 * @description
 * A mat2d contains six elements defined as:
 * <pre>
 * [a, c, tx,
 *  b, d, ty]
 * </pre>
 * This is a short form for the 3x3 matrix:
 * <pre>
 * [a, c, tx,
 *  b, d, ty,
 *  0, 0, 1]
 * </pre>
 * The last row is ignored so the array is shorter and operations are faster.
 */

/**
 * Creates a new identity mat2d
 *
 * @returns {mat2d} a new 2x3 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](6);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Creates a new mat2d initialized with values from an existing matrix
 *
 * @param {mat2d} a matrix to clone
 * @returns {mat2d} a new 2x3 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](6);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}

/**
 * Copy the values from one mat2d to another
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  return out;
}

/**
 * Set a mat2d to the identity matrix
 *
 * @param {mat2d} out the receiving matrix
 * @returns {mat2d} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Create a new mat2d with the given values
 *
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} A new mat2d
 */
function fromValues(a, b, c, d, tx, ty) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](6);
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}

/**
 * Set the components of a mat2d to the given values
 *
 * @param {mat2d} out the receiving matrix
 * @param {Number} a Component A (index 0)
 * @param {Number} b Component B (index 1)
 * @param {Number} c Component C (index 2)
 * @param {Number} d Component D (index 3)
 * @param {Number} tx Component TX (index 4)
 * @param {Number} ty Component TY (index 5)
 * @returns {mat2d} out
 */
function set(out, a, b, c, d, tx, ty) {
  out[0] = a;
  out[1] = b;
  out[2] = c;
  out[3] = d;
  out[4] = tx;
  out[5] = ty;
  return out;
}

/**
 * Inverts a mat2d
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the source matrix
 * @returns {mat2d} out
 */
function invert(out, a) {
  let aa = a[0], ab = a[1], ac = a[2], ad = a[3];
  let atx = a[4], aty = a[5];

  let det = aa * ad - ab * ac;
  if(!det){
    return null;
  }
  det = 1.0 / det;

  out[0] = ad * det;
  out[1] = -ab * det;
  out[2] = -ac * det;
  out[3] = aa * det;
  out[4] = (ac * aty - ad * atx) * det;
  out[5] = (ab * atx - aa * aty) * det;
  return out;
}

/**
 * Calculates the determinant of a mat2d
 *
 * @param {mat2d} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  return a[0] * a[3] - a[1] * a[2];
}

/**
 * Multiplies two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
function multiply(out, a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
  out[0] = a0 * b0 + a2 * b1;
  out[1] = a1 * b0 + a3 * b1;
  out[2] = a0 * b2 + a2 * b3;
  out[3] = a1 * b2 + a3 * b3;
  out[4] = a0 * b4 + a2 * b5 + a4;
  out[5] = a1 * b4 + a3 * b5 + a5;
  return out;
}

/**
 * Rotates a mat2d by the given angle
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
function rotate(out, a, rad) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  out[0] = a0 *  c + a2 * s;
  out[1] = a1 *  c + a3 * s;
  out[2] = a0 * -s + a2 * c;
  out[3] = a1 * -s + a3 * c;
  out[4] = a4;
  out[5] = a5;
  return out;
}

/**
 * Scales the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to scale the matrix by
 * @returns {mat2d} out
 **/
function scale(out, a, v) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let v0 = v[0], v1 = v[1];
  out[0] = a0 * v0;
  out[1] = a1 * v0;
  out[2] = a2 * v1;
  out[3] = a3 * v1;
  out[4] = a4;
  out[5] = a5;
  return out;
}

/**
 * Translates the mat2d by the dimensions in the given vec2
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to translate
 * @param {vec2} v the vec2 to translate the matrix by
 * @returns {mat2d} out
 **/
function translate(out, a, v) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let v0 = v[0], v1 = v[1];
  out[0] = a0;
  out[1] = a1;
  out[2] = a2;
  out[3] = a3;
  out[4] = a0 * v0 + a2 * v1 + a4;
  out[5] = a1 * v0 + a3 * v1 + a5;
  return out;
}

/**
 * Creates a matrix from a given angle
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.rotate(dest, dest, rad);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat2d} out
 */
function fromRotation(out, rad) {
  let s = Math.sin(rad), c = Math.cos(rad);
  out[0] = c;
  out[1] = s;
  out[2] = -s;
  out[3] = c;
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.scale(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Scaling vector
 * @returns {mat2d} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = v[1];
  out[4] = 0;
  out[5] = 0;
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat2d.identity(dest);
 *     mat2d.translate(dest, dest, vec);
 *
 * @param {mat2d} out mat2d receiving operation result
 * @param {vec2} v Translation vector
 * @returns {mat2d} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  out[4] = v[0];
  out[5] = v[1];
  return out;
}

/**
 * Returns a string representation of a mat2d
 *
 * @param {mat2d} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat2d(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' +
          a[3] + ', ' + a[4] + ', ' + a[5] + ')';
}

/**
 * Returns Frobenius norm of a mat2d
 *
 * @param {mat2d} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + 1))
}

/**
 * Adds two mat2d's
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @returns {mat2d} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  return out;
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat2d} out the receiving matrix
 * @param {mat2d} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat2d} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  return out;
}

/**
 * Adds two mat2d's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat2d} out the receiving vector
 * @param {mat2d} a the first operand
 * @param {mat2d} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat2d} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] && a[4] === b[4] && a[5] === b[5];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat2d} a The first matrix.
 * @param {mat2d} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3], a4 = a[4], a5 = a[5];
  let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3], b4 = b[4], b5 = b[5];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)));
}

/**
 * Alias for {@link mat2d.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat2d.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["transpose"] = transpose;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["adjoint"] = adjoint;
/* harmony export (immutable) */ __webpack_exports__["determinant"] = determinant;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["translate"] = translate;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["rotate"] = rotate;
/* harmony export (immutable) */ __webpack_exports__["rotateX"] = rotateX;
/* harmony export (immutable) */ __webpack_exports__["rotateY"] = rotateY;
/* harmony export (immutable) */ __webpack_exports__["rotateZ"] = rotateZ;
/* harmony export (immutable) */ __webpack_exports__["fromTranslation"] = fromTranslation;
/* harmony export (immutable) */ __webpack_exports__["fromScaling"] = fromScaling;
/* harmony export (immutable) */ __webpack_exports__["fromRotation"] = fromRotation;
/* harmony export (immutable) */ __webpack_exports__["fromXRotation"] = fromXRotation;
/* harmony export (immutable) */ __webpack_exports__["fromYRotation"] = fromYRotation;
/* harmony export (immutable) */ __webpack_exports__["fromZRotation"] = fromZRotation;
/* harmony export (immutable) */ __webpack_exports__["fromRotationTranslation"] = fromRotationTranslation;
/* harmony export (immutable) */ __webpack_exports__["getTranslation"] = getTranslation;
/* harmony export (immutable) */ __webpack_exports__["getScaling"] = getScaling;
/* harmony export (immutable) */ __webpack_exports__["getRotation"] = getRotation;
/* harmony export (immutable) */ __webpack_exports__["fromRotationTranslationScale"] = fromRotationTranslationScale;
/* harmony export (immutable) */ __webpack_exports__["fromRotationTranslationScaleOrigin"] = fromRotationTranslationScaleOrigin;
/* harmony export (immutable) */ __webpack_exports__["fromQuat"] = fromQuat;
/* harmony export (immutable) */ __webpack_exports__["frustum"] = frustum;
/* harmony export (immutable) */ __webpack_exports__["perspective"] = perspective;
/* harmony export (immutable) */ __webpack_exports__["perspectiveFromFieldOfView"] = perspectiveFromFieldOfView;
/* harmony export (immutable) */ __webpack_exports__["ortho"] = ortho;
/* harmony export (immutable) */ __webpack_exports__["lookAt"] = lookAt;
/* harmony export (immutable) */ __webpack_exports__["targetTo"] = targetTo;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["frob"] = frob;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalar"] = multiplyScalar;
/* harmony export (immutable) */ __webpack_exports__["multiplyScalarAndAdd"] = multiplyScalarAndAdd;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 4x4 Matrix
 * @module mat4
 */

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](16);
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](16);
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  out[3] = a[3];
  out[4] = a[4];
  out[5] = a[5];
  out[6] = a[6];
  out[7] = a[7];
  out[8] = a[8];
  out[9] = a[9];
  out[10] = a[10];
  out[11] = a[11];
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Create a new mat4 with the given values
 *
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} A new mat4
 */
function fromValues(m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](16);
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}

/**
 * Set the components of a mat4 to the given values
 *
 * @param {mat4} out the receiving matrix
 * @param {Number} m00 Component in column 0, row 0 position (index 0)
 * @param {Number} m01 Component in column 0, row 1 position (index 1)
 * @param {Number} m02 Component in column 0, row 2 position (index 2)
 * @param {Number} m03 Component in column 0, row 3 position (index 3)
 * @param {Number} m10 Component in column 1, row 0 position (index 4)
 * @param {Number} m11 Component in column 1, row 1 position (index 5)
 * @param {Number} m12 Component in column 1, row 2 position (index 6)
 * @param {Number} m13 Component in column 1, row 3 position (index 7)
 * @param {Number} m20 Component in column 2, row 0 position (index 8)
 * @param {Number} m21 Component in column 2, row 1 position (index 9)
 * @param {Number} m22 Component in column 2, row 2 position (index 10)
 * @param {Number} m23 Component in column 2, row 3 position (index 11)
 * @param {Number} m30 Component in column 3, row 0 position (index 12)
 * @param {Number} m31 Component in column 3, row 1 position (index 13)
 * @param {Number} m32 Component in column 3, row 2 position (index 14)
 * @param {Number} m33 Component in column 3, row 3 position (index 15)
 * @returns {mat4} out
 */
function set(out, m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33) {
  out[0] = m00;
  out[1] = m01;
  out[2] = m02;
  out[3] = m03;
  out[4] = m10;
  out[5] = m11;
  out[6] = m12;
  out[7] = m13;
  out[8] = m20;
  out[9] = m21;
  out[10] = m22;
  out[11] = m23;
  out[12] = m30;
  out[13] = m31;
  out[14] = m32;
  out[15] = m33;
  return out;
}


/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
  // If we are transposing ourselves we can skip a few steps but have to cache some values
  if (out === a) {
    let a01 = a[1], a02 = a[2], a03 = a[3];
    let a12 = a[6], a13 = a[7];
    let a23 = a[11];

    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a01;
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a02;
    out[9] = a12;
    out[11] = a[14];
    out[12] = a03;
    out[13] = a13;
    out[14] = a23;
  } else {
    out[0] = a[0];
    out[1] = a[4];
    out[2] = a[8];
    out[3] = a[12];
    out[4] = a[1];
    out[5] = a[5];
    out[6] = a[9];
    out[7] = a[13];
    out[8] = a[2];
    out[9] = a[6];
    out[10] = a[10];
    out[11] = a[14];
    out[12] = a[3];
    out[13] = a[7];
    out[14] = a[11];
    out[15] = a[15];
  }

  return out;
}

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

  if (!det) {
    return null;
  }
  det = 1.0 / det;

  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

  return out;
}

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function adjoint(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
  out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
  out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
  out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
  out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
  out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
  out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
  out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
  out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
  out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
  out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
  out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
  out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
  out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
  out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
  out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
  return out;
}

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  let b00 = a00 * a11 - a01 * a10;
  let b01 = a00 * a12 - a02 * a10;
  let b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11;
  let b04 = a01 * a13 - a03 * a11;
  let b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30;
  let b07 = a20 * a32 - a22 * a30;
  let b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31;
  let b10 = a21 * a33 - a23 * a31;
  let b11 = a22 * a33 - a23 * a32;

  // Calculate the determinant
  return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
}

/**
 * Multiplies two mat4s
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

  // Cache only the current line of the second matrix
  let b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
  out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
  out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
  out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

  b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
  out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
  out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
  out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
  out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
  return out;
}

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
  let x = v[0], y = v[1], z = v[2];
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;

  if (a === out) {
    out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
    out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
    out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
    out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
  } else {
    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
    out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
    out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

    out[12] = a00 * x + a10 * y + a20 * z + a[12];
    out[13] = a01 * x + a11 * y + a21 * z + a[13];
    out[14] = a02 * x + a12 * y + a22 * z + a[14];
    out[15] = a03 * x + a13 * y + a23 * z + a[15];
  }

  return out;
}

/**
 * Scales the mat4 by the dimensions in the given vec3 not using vectorization
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
  let x = v[0], y = v[1], z = v[2];

  out[0] = a[0] * x;
  out[1] = a[1] * x;
  out[2] = a[2] * x;
  out[3] = a[3] * x;
  out[4] = a[4] * y;
  out[5] = a[5] * y;
  out[6] = a[6] * y;
  out[7] = a[7] * y;
  out[8] = a[8] * z;
  out[9] = a[9] * z;
  out[10] = a[10] * z;
  out[11] = a[11] * z;
  out[12] = a[12];
  out[13] = a[13];
  out[14] = a[14];
  out[15] = a[15];
  return out;
}

/**
 * Rotates a mat4 by the given angle around the given axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.sqrt(x * x + y * y + z * z);
  let s, c, t;
  let a00, a01, a02, a03;
  let a10, a11, a12, a13;
  let a20, a21, a22, a23;
  let b00, b01, b02;
  let b10, b11, b12;
  let b20, b21, b22;

  if (Math.abs(len) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]) { return null; }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
  a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
  a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

  // Construct the elements of the rotation matrix
  b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
  b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
  b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

  // Perform rotation-specific matrix multiplication
  out[0] = a00 * b00 + a10 * b01 + a20 * b02;
  out[1] = a01 * b00 + a11 * b01 + a21 * b02;
  out[2] = a02 * b00 + a12 * b01 + a22 * b02;
  out[3] = a03 * b00 + a13 * b01 + a23 * b02;
  out[4] = a00 * b10 + a10 * b11 + a20 * b12;
  out[5] = a01 * b10 + a11 * b11 + a21 * b12;
  out[6] = a02 * b10 + a12 * b11 + a22 * b12;
  out[7] = a03 * b10 + a13 * b11 + a23 * b12;
  out[8] = a00 * b20 + a10 * b21 + a20 * b22;
  out[9] = a01 * b20 + a11 * b21 + a21 * b22;
  out[10] = a02 * b20 + a12 * b21 + a22 * b22;
  out[11] = a03 * b20 + a13 * b21 + a23 * b22;

  if (a !== out) { // If the source and destination differ, copy the unchanged last row
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }
  return out;
}

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a10 = a[4];
  let a11 = a[5];
  let a12 = a[6];
  let a13 = a[7];
  let a20 = a[8];
  let a21 = a[9];
  let a22 = a[10];
  let a23 = a[11];

  if (a !== out) { // If the source and destination differ, copy the unchanged rows
    out[0]  = a[0];
    out[1]  = a[1];
    out[2]  = a[2];
    out[3]  = a[3];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[4] = a10 * c + a20 * s;
  out[5] = a11 * c + a21 * s;
  out[6] = a12 * c + a22 * s;
  out[7] = a13 * c + a23 * s;
  out[8] = a20 * c - a10 * s;
  out[9] = a21 * c - a11 * s;
  out[10] = a22 * c - a12 * s;
  out[11] = a23 * c - a13 * s;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a00 = a[0];
  let a01 = a[1];
  let a02 = a[2];
  let a03 = a[3];
  let a20 = a[8];
  let a21 = a[9];
  let a22 = a[10];
  let a23 = a[11];

  if (a !== out) { // If the source and destination differ, copy the unchanged rows
    out[4]  = a[4];
    out[5]  = a[5];
    out[6]  = a[6];
    out[7]  = a[7];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c - a20 * s;
  out[1] = a01 * c - a21 * s;
  out[2] = a02 * c - a22 * s;
  out[3] = a03 * c - a23 * s;
  out[8] = a00 * s + a20 * c;
  out[9] = a01 * s + a21 * c;
  out[10] = a02 * s + a22 * c;
  out[11] = a03 * s + a23 * c;
  return out;
}

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);
  let a00 = a[0];
  let a01 = a[1];
  let a02 = a[2];
  let a03 = a[3];
  let a10 = a[4];
  let a11 = a[5];
  let a12 = a[6];
  let a13 = a[7];

  if (a !== out) { // If the source and destination differ, copy the unchanged last row
    out[8]  = a[8];
    out[9]  = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
  }

  // Perform axis-specific matrix multiplication
  out[0] = a00 * c + a10 * s;
  out[1] = a01 * c + a11 * s;
  out[2] = a02 * c + a12 * s;
  out[3] = a03 * c + a13 * s;
  out[4] = a10 * c - a00 * s;
  out[5] = a11 * c - a01 * s;
  out[6] = a12 * c - a02 * s;
  out[7] = a13 * c - a03 * s;
  return out;
}

/**
 * Creates a matrix from a vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromTranslation(out, v) {
  out[0] = 1;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a vector scaling
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.scale(dest, dest, vec);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {vec3} v Scaling vector
 * @returns {mat4} out
 */
function fromScaling(out, v) {
  out[0] = v[0];
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = v[1];
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = v[2];
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a given angle around a given axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotate(dest, dest, rad, axis);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function fromRotation(out, rad, axis) {
  let x = axis[0], y = axis[1], z = axis[2];
  let len = Math.sqrt(x * x + y * y + z * z);
  let s, c, t;

  if (Math.abs(len) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]) { return null; }

  len = 1 / len;
  x *= len;
  y *= len;
  z *= len;

  s = Math.sin(rad);
  c = Math.cos(rad);
  t = 1 - c;

  // Perform rotation-specific matrix multiplication
  out[0] = x * x * t + c;
  out[1] = y * x * t + z * s;
  out[2] = z * x * t - y * s;
  out[3] = 0;
  out[4] = x * y * t - z * s;
  out[5] = y * y * t + c;
  out[6] = z * y * t + x * s;
  out[7] = 0;
  out[8] = x * z * t + y * s;
  out[9] = y * z * t - x * s;
  out[10] = z * z * t + c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the X axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateX(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromXRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = 1;
  out[1]  = 0;
  out[2]  = 0;
  out[3]  = 0;
  out[4] = 0;
  out[5] = c;
  out[6] = s;
  out[7] = 0;
  out[8] = 0;
  out[9] = -s;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Y axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateY(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromYRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = c;
  out[1]  = 0;
  out[2]  = -s;
  out[3]  = 0;
  out[4] = 0;
  out[5] = 1;
  out[6] = 0;
  out[7] = 0;
  out[8] = s;
  out[9] = 0;
  out[10] = c;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from the given angle around the Z axis
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.rotateZ(dest, dest, rad);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function fromZRotation(out, rad) {
  let s = Math.sin(rad);
  let c = Math.cos(rad);

  // Perform axis-specific matrix multiplication
  out[0]  = c;
  out[1]  = s;
  out[2]  = 0;
  out[3]  = 0;
  out[4] = -s;
  out[5] = c;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 1;
  out[11] = 0;
  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;
  return out;
}

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - (yy + zz);
  out[1] = xy + wz;
  out[2] = xz - wy;
  out[3] = 0;
  out[4] = xy - wz;
  out[5] = 1 - (xx + zz);
  out[6] = yz + wx;
  out[7] = 0;
  out[8] = xz + wy;
  out[9] = yz - wx;
  out[10] = 1 - (xx + yy);
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Returns the translation vector component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslation,
 *  the returned vector will be the same as the translation vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive translation component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getTranslation(out, mat) {
  out[0] = mat[12];
  out[1] = mat[13];
  out[2] = mat[14];

  return out;
}

/**
 * Returns the scaling factor component of a transformation
 *  matrix. If a matrix is built with fromRotationTranslationScale
 *  with a normalized Quaternion paramter, the returned vector will be
 *  the same as the scaling vector
 *  originally supplied.
 * @param  {vec3} out Vector to receive scaling factor component
 * @param  {mat4} mat Matrix to be decomposed (input)
 * @return {vec3} out
 */
function getScaling(out, mat) {
  let m11 = mat[0];
  let m12 = mat[1];
  let m13 = mat[2];
  let m21 = mat[4];
  let m22 = mat[5];
  let m23 = mat[6];
  let m31 = mat[8];
  let m32 = mat[9];
  let m33 = mat[10];

  out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
  out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
  out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);

  return out;
}

/**
 * Returns a quaternion representing the rotational component
 *  of a transformation matrix. If a matrix is built with
 *  fromRotationTranslation, the returned quaternion will be the
 *  same as the quaternion originally supplied.
 * @param {quat} out Quaternion to receive the rotation component
 * @param {mat4} mat Matrix to be decomposed (input)
 * @return {quat} out
 */
function getRotation(out, mat) {
  // Algorithm taken from http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
  let trace = mat[0] + mat[5] + mat[10];
  let S = 0;

  if (trace > 0) {
    S = Math.sqrt(trace + 1.0) * 2;
    out[3] = 0.25 * S;
    out[0] = (mat[6] - mat[9]) / S;
    out[1] = (mat[8] - mat[2]) / S;
    out[2] = (mat[1] - mat[4]) / S;
  } else if ((mat[0] > mat[5])&(mat[0] > mat[10])) {
    S = Math.sqrt(1.0 + mat[0] - mat[5] - mat[10]) * 2;
    out[3] = (mat[6] - mat[9]) / S;
    out[0] = 0.25 * S;
    out[1] = (mat[1] + mat[4]) / S;
    out[2] = (mat[8] + mat[2]) / S;
  } else if (mat[5] > mat[10]) {
    S = Math.sqrt(1.0 + mat[5] - mat[0] - mat[10]) * 2;
    out[3] = (mat[8] - mat[2]) / S;
    out[0] = (mat[1] + mat[4]) / S;
    out[1] = 0.25 * S;
    out[2] = (mat[6] + mat[9]) / S;
  } else {
    S = Math.sqrt(1.0 + mat[10] - mat[0] - mat[5]) * 2;
    out[3] = (mat[1] - mat[4]) / S;
    out[0] = (mat[8] + mat[2]) / S;
    out[1] = (mat[6] + mat[9]) / S;
    out[2] = 0.25 * S;
  }

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @returns {mat4} out
 */
function fromRotationTranslationScale(out, q, v, s) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;
  let sx = s[0];
  let sy = s[1];
  let sz = s[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0];
  out[13] = v[1];
  out[14] = v[2];
  out[15] = 1;

  return out;
}

/**
 * Creates a matrix from a quaternion rotation, vector translation and vector scale, rotating and scaling around the given origin
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     mat4.translate(dest, origin);
 *     let quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *     mat4.scale(dest, scale)
 *     mat4.translate(dest, negativeOrigin);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @param {vec3} s Scaling vector
 * @param {vec3} o The origin vector around which to scale and rotate
 * @returns {mat4} out
 */
function fromRotationTranslationScaleOrigin(out, q, v, s, o) {
  // Quaternion math
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let xy = x * y2;
  let xz = x * z2;
  let yy = y * y2;
  let yz = y * z2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  let sx = s[0];
  let sy = s[1];
  let sz = s[2];

  let ox = o[0];
  let oy = o[1];
  let oz = o[2];

  out[0] = (1 - (yy + zz)) * sx;
  out[1] = (xy + wz) * sx;
  out[2] = (xz - wy) * sx;
  out[3] = 0;
  out[4] = (xy - wz) * sy;
  out[5] = (1 - (xx + zz)) * sy;
  out[6] = (yz + wx) * sy;
  out[7] = 0;
  out[8] = (xz + wy) * sz;
  out[9] = (yz - wx) * sz;
  out[10] = (1 - (xx + yy)) * sz;
  out[11] = 0;
  out[12] = v[0] + ox - (out[0] * ox + out[4] * oy + out[8] * oz);
  out[13] = v[1] + oy - (out[1] * ox + out[5] * oy + out[9] * oz);
  out[14] = v[2] + oz - (out[2] * ox + out[6] * oy + out[10] * oz);
  out[15] = 1;

  return out;
}

/**
 * Calculates a 4x4 matrix from the given quaternion
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat} q Quaternion to create matrix from
 *
 * @returns {mat4} out
 */
function fromQuat(out, q) {
  let x = q[0], y = q[1], z = q[2], w = q[3];
  let x2 = x + x;
  let y2 = y + y;
  let z2 = z + z;

  let xx = x * x2;
  let yx = y * x2;
  let yy = y * y2;
  let zx = z * x2;
  let zy = z * y2;
  let zz = z * z2;
  let wx = w * x2;
  let wy = w * y2;
  let wz = w * z2;

  out[0] = 1 - yy - zz;
  out[1] = yx + wz;
  out[2] = zx - wy;
  out[3] = 0;

  out[4] = yx - wz;
  out[5] = 1 - xx - zz;
  out[6] = zy + wx;
  out[7] = 0;

  out[8] = zx + wy;
  out[9] = zy - wx;
  out[10] = 1 - xx - yy;
  out[11] = 0;

  out[12] = 0;
  out[13] = 0;
  out[14] = 0;
  out[15] = 1;

  return out;
}

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
function frustum(out, left, right, bottom, top, near, far) {
  let rl = 1 / (right - left);
  let tb = 1 / (top - bottom);
  let nf = 1 / (near - far);
  out[0] = (near * 2) * rl;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = (near * 2) * tb;
  out[6] = 0;
  out[7] = 0;
  out[8] = (right + left) * rl;
  out[9] = (top + bottom) * tb;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (far * near * 2) * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
  let f = 1.0 / Math.tan(fovy / 2);
  let nf = 1 / (near - far);
  out[0] = f / aspect;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = f;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = (far + near) * nf;
  out[11] = -1;
  out[12] = 0;
  out[13] = 0;
  out[14] = (2 * far * near) * nf;
  out[15] = 0;
  return out;
}

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Object} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspectiveFromFieldOfView(out, fov, near, far) {
  let upTan = Math.tan(fov.upDegrees * Math.PI/180.0);
  let downTan = Math.tan(fov.downDegrees * Math.PI/180.0);
  let leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0);
  let rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0);
  let xScale = 2.0 / (leftTan + rightTan);
  let yScale = 2.0 / (upTan + downTan);

  out[0] = xScale;
  out[1] = 0.0;
  out[2] = 0.0;
  out[3] = 0.0;
  out[4] = 0.0;
  out[5] = yScale;
  out[6] = 0.0;
  out[7] = 0.0;
  out[8] = -((leftTan - rightTan) * xScale * 0.5);
  out[9] = ((upTan - downTan) * yScale * 0.5);
  out[10] = far / (near - far);
  out[11] = -1.0;
  out[12] = 0.0;
  out[13] = 0.0;
  out[14] = (far * near) / (near - far);
  out[15] = 0.0;
  return out;
}

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function ortho(out, left, right, bottom, top, near, far) {
  let lr = 1 / (left - right);
  let bt = 1 / (bottom - top);
  let nf = 1 / (near - far);
  out[0] = -2 * lr;
  out[1] = 0;
  out[2] = 0;
  out[3] = 0;
  out[4] = 0;
  out[5] = -2 * bt;
  out[6] = 0;
  out[7] = 0;
  out[8] = 0;
  out[9] = 0;
  out[10] = 2 * nf;
  out[11] = 0;
  out[12] = (left + right) * lr;
  out[13] = (top + bottom) * bt;
  out[14] = (far + near) * nf;
  out[15] = 1;
  return out;
}

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
  let x0, x1, x2, y0, y1, y2, z0, z1, z2, len;
  let eyex = eye[0];
  let eyey = eye[1];
  let eyez = eye[2];
  let upx = up[0];
  let upy = up[1];
  let upz = up[2];
  let centerx = center[0];
  let centery = center[1];
  let centerz = center[2];

  if (Math.abs(eyex - centerx) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"] &&
      Math.abs(eyey - centery) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"] &&
      Math.abs(eyez - centerz) < __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]) {
    return mat4.identity(out);
  }

  z0 = eyex - centerx;
  z1 = eyey - centery;
  z2 = eyez - centerz;

  len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
  z0 *= len;
  z1 *= len;
  z2 *= len;

  x0 = upy * z2 - upz * z1;
  x1 = upz * z0 - upx * z2;
  x2 = upx * z1 - upy * z0;
  len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
  if (!len) {
    x0 = 0;
    x1 = 0;
    x2 = 0;
  } else {
    len = 1 / len;
    x0 *= len;
    x1 *= len;
    x2 *= len;
  }

  y0 = z1 * x2 - z2 * x1;
  y1 = z2 * x0 - z0 * x2;
  y2 = z0 * x1 - z1 * x0;

  len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
  if (!len) {
    y0 = 0;
    y1 = 0;
    y2 = 0;
  } else {
    len = 1 / len;
    y0 *= len;
    y1 *= len;
    y2 *= len;
  }

  out[0] = x0;
  out[1] = y0;
  out[2] = z0;
  out[3] = 0;
  out[4] = x1;
  out[5] = y1;
  out[6] = z1;
  out[7] = 0;
  out[8] = x2;
  out[9] = y2;
  out[10] = z2;
  out[11] = 0;
  out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
  out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
  out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
  out[15] = 1;

  return out;
}

/**
 * Generates a matrix that makes something look at something else.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function targetTo(out, eye, target, up) {
  let eyex = eye[0],
      eyey = eye[1],
      eyez = eye[2],
      upx = up[0],
      upy = up[1],
      upz = up[2];

  let z0 = eyex - target[0],
      z1 = eyey - target[1],
      z2 = eyez - target[2];

  let len = z0*z0 + z1*z1 + z2*z2;
  if (len > 0) {
    len = 1 / Math.sqrt(len);
    z0 *= len;
    z1 *= len;
    z2 *= len;
  }

  let x0 = upy * z2 - upz * z1,
      x1 = upz * z0 - upx * z2,
      x2 = upx * z1 - upy * z0;

  out[0] = x0;
  out[1] = x1;
  out[2] = x2;
  out[3] = 0;
  out[4] = z1 * x2 - z2 * x1;
  out[5] = z2 * x0 - z0 * x2;
  out[6] = z0 * x1 - z1 * x0;
  out[7] = 0;
  out[8] = z0;
  out[9] = z1;
  out[10] = z2;
  out[11] = 0;
  out[12] = eyex;
  out[13] = eyey;
  out[14] = eyez;
  out[15] = 1;
  return out;
};

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} a matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
  return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
          a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
          a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' +
          a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
}

/**
 * Returns Frobenius norm of a mat4
 *
 * @param {mat4} a the matrix to calculate Frobenius norm of
 * @returns {Number} Frobenius norm
 */
function frob(a) {
  return(Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2) + Math.pow(a[3], 2) + Math.pow(a[4], 2) + Math.pow(a[5], 2) + Math.pow(a[6], 2) + Math.pow(a[7], 2) + Math.pow(a[8], 2) + Math.pow(a[9], 2) + Math.pow(a[10], 2) + Math.pow(a[11], 2) + Math.pow(a[12], 2) + Math.pow(a[13], 2) + Math.pow(a[14], 2) + Math.pow(a[15], 2) ))
}

/**
 * Adds two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  out[3] = a[3] + b[3];
  out[4] = a[4] + b[4];
  out[5] = a[5] + b[5];
  out[6] = a[6] + b[6];
  out[7] = a[7] + b[7];
  out[8] = a[8] + b[8];
  out[9] = a[9] + b[9];
  out[10] = a[10] + b[10];
  out[11] = a[11] + b[11];
  out[12] = a[12] + b[12];
  out[13] = a[13] + b[13];
  out[14] = a[14] + b[14];
  out[15] = a[15] + b[15];
  return out;
}

/**
 * Subtracts matrix b from matrix a
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  out[3] = a[3] - b[3];
  out[4] = a[4] - b[4];
  out[5] = a[5] - b[5];
  out[6] = a[6] - b[6];
  out[7] = a[7] - b[7];
  out[8] = a[8] - b[8];
  out[9] = a[9] - b[9];
  out[10] = a[10] - b[10];
  out[11] = a[11] - b[11];
  out[12] = a[12] - b[12];
  out[13] = a[13] - b[13];
  out[14] = a[14] - b[14];
  out[15] = a[15] - b[15];
  return out;
}

/**
 * Multiply each element of the matrix by a scalar.
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {Number} b amount to scale the matrix's elements by
 * @returns {mat4} out
 */
function multiplyScalar(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  out[3] = a[3] * b;
  out[4] = a[4] * b;
  out[5] = a[5] * b;
  out[6] = a[6] * b;
  out[7] = a[7] * b;
  out[8] = a[8] * b;
  out[9] = a[9] * b;
  out[10] = a[10] * b;
  out[11] = a[11] * b;
  out[12] = a[12] * b;
  out[13] = a[13] * b;
  out[14] = a[14] * b;
  out[15] = a[15] * b;
  return out;
}

/**
 * Adds two mat4's after multiplying each element of the second operand by a scalar value.
 *
 * @param {mat4} out the receiving vector
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @param {Number} scale the amount to scale b's elements by before adding
 * @returns {mat4} out
 */
function multiplyScalarAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  out[2] = a[2] + (b[2] * scale);
  out[3] = a[3] + (b[3] * scale);
  out[4] = a[4] + (b[4] * scale);
  out[5] = a[5] + (b[5] * scale);
  out[6] = a[6] + (b[6] * scale);
  out[7] = a[7] + (b[7] * scale);
  out[8] = a[8] + (b[8] * scale);
  out[9] = a[9] + (b[9] * scale);
  out[10] = a[10] + (b[10] * scale);
  out[11] = a[11] + (b[11] * scale);
  out[12] = a[12] + (b[12] * scale);
  out[13] = a[13] + (b[13] * scale);
  out[14] = a[14] + (b[14] * scale);
  out[15] = a[15] + (b[15] * scale);
  return out;
}

/**
 * Returns whether or not the matrices have exactly the same elements in the same position (when compared with ===)
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3] &&
         a[4] === b[4] && a[5] === b[5] && a[6] === b[6] && a[7] === b[7] &&
         a[8] === b[8] && a[9] === b[9] && a[10] === b[10] && a[11] === b[11] &&
         a[12] === b[12] && a[13] === b[13] && a[14] === b[14] && a[15] === b[15];
}

/**
 * Returns whether or not the matrices have approximately the same elements in the same position.
 *
 * @param {mat4} a The first matrix.
 * @param {mat4} b The second matrix.
 * @returns {Boolean} True if the matrices are equal, false otherwise.
 */
function equals(a, b) {
  let a0  = a[0],  a1  = a[1],  a2  = a[2],  a3  = a[3];
  let a4  = a[4],  a5  = a[5],  a6  = a[6],  a7  = a[7];
  let a8  = a[8],  a9  = a[9],  a10 = a[10], a11 = a[11];
  let a12 = a[12], a13 = a[13], a14 = a[14], a15 = a[15];

  let b0  = b[0],  b1  = b[1],  b2  = b[2],  b3  = b[3];
  let b4  = b[4],  b5  = b[5],  b6  = b[6],  b7  = b[7];
  let b8  = b[8],  b9  = b[9],  b10 = b[10], b11 = b[11];
  let b12 = b[12], b13 = b[13], b14 = b[14], b15 = b[15];

  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)) &&
          Math.abs(a2 - b2) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a2), Math.abs(b2)) &&
          Math.abs(a3 - b3) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a3), Math.abs(b3)) &&
          Math.abs(a4 - b4) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a4), Math.abs(b4)) &&
          Math.abs(a5 - b5) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a5), Math.abs(b5)) &&
          Math.abs(a6 - b6) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a6), Math.abs(b6)) &&
          Math.abs(a7 - b7) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a7), Math.abs(b7)) &&
          Math.abs(a8 - b8) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a8), Math.abs(b8)) &&
          Math.abs(a9 - b9) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a9), Math.abs(b9)) &&
          Math.abs(a10 - b10) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a10), Math.abs(b10)) &&
          Math.abs(a11 - b11) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a11), Math.abs(b11)) &&
          Math.abs(a12 - b12) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a12), Math.abs(b12)) &&
          Math.abs(a13 - b13) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a13), Math.abs(b13)) &&
          Math.abs(a14 - b14) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a14), Math.abs(b14)) &&
          Math.abs(a15 - b15) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a15), Math.abs(b15)));
}

/**
 * Alias for {@link mat4.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link mat4.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;



/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["identity"] = identity;
/* harmony export (immutable) */ __webpack_exports__["setAxisAngle"] = setAxisAngle;
/* harmony export (immutable) */ __webpack_exports__["getAxisAngle"] = getAxisAngle;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["rotateX"] = rotateX;
/* harmony export (immutable) */ __webpack_exports__["rotateY"] = rotateY;
/* harmony export (immutable) */ __webpack_exports__["rotateZ"] = rotateZ;
/* harmony export (immutable) */ __webpack_exports__["calculateW"] = calculateW;
/* harmony export (immutable) */ __webpack_exports__["slerp"] = slerp;
/* harmony export (immutable) */ __webpack_exports__["invert"] = invert;
/* harmony export (immutable) */ __webpack_exports__["conjugate"] = conjugate;
/* harmony export (immutable) */ __webpack_exports__["fromMat3"] = fromMat3;
/* harmony export (immutable) */ __webpack_exports__["fromEuler"] = fromEuler;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mat3__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__vec3__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__vec4__ = __webpack_require__(3);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */






/**
 * Quaternion
 * @module quat
 */

/**
 * Creates a new identity quat
 *
 * @returns {quat} a new quaternion
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](4);
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Set a quat to the identity quaternion
 *
 * @param {quat} out the receiving quaternion
 * @returns {quat} out
 */
function identity(out) {
  out[0] = 0;
  out[1] = 0;
  out[2] = 0;
  out[3] = 1;
  return out;
}

/**
 * Sets a quat from the given angle and rotation axis,
 * then returns it.
 *
 * @param {quat} out the receiving quaternion
 * @param {vec3} axis the axis around which to rotate
 * @param {Number} rad the angle in radians
 * @returns {quat} out
 **/
function setAxisAngle(out, axis, rad) {
  rad = rad * 0.5;
  let s = Math.sin(rad);
  out[0] = s * axis[0];
  out[1] = s * axis[1];
  out[2] = s * axis[2];
  out[3] = Math.cos(rad);
  return out;
}

/**
 * Gets the rotation axis and angle for a given
 *  quaternion. If a quaternion is created with
 *  setAxisAngle, this method will return the same
 *  values as providied in the original parameter list
 *  OR functionally equivalent values.
 * Example: The quaternion formed by axis [0, 0, 1] and
 *  angle -90 is the same as the quaternion formed by
 *  [0, 0, 1] and 270. This method favors the latter.
 * @param  {vec3} out_axis  Vector receiving the axis of rotation
 * @param  {quat} q     Quaternion to be decomposed
 * @return {Number}     Angle, in radians, of the rotation
 */
function getAxisAngle(out_axis, q) {
  let rad = Math.acos(q[3]) * 2.0;
  let s = Math.sin(rad / 2.0);
  if (s != 0.0) {
    out_axis[0] = q[0] / s;
    out_axis[1] = q[1] / s;
    out_axis[2] = q[2] / s;
  } else {
    // If s is zero, return any axis (no rotation - axis does not matter)
    out_axis[0] = 1;
    out_axis[1] = 0;
    out_axis[2] = 0;
  }
  return rad;
}

/**
 * Multiplies two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 */
function multiply(out, a, b) {
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  out[0] = ax * bw + aw * bx + ay * bz - az * by;
  out[1] = ay * bw + aw * by + az * bx - ax * bz;
  out[2] = az * bw + aw * bz + ax * by - ay * bx;
  out[3] = aw * bw - ax * bx - ay * by - az * bz;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the X axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateX(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw + aw * bx;
  out[1] = ay * bw + az * bx;
  out[2] = az * bw - ay * bx;
  out[3] = aw * bw - ax * bx;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the Y axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateY(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let by = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw - az * by;
  out[1] = ay * bw + aw * by;
  out[2] = az * bw + ax * by;
  out[3] = aw * bw - ay * by;
  return out;
}

/**
 * Rotates a quaternion by the given angle about the Z axis
 *
 * @param {quat} out quat receiving operation result
 * @param {quat} a quat to rotate
 * @param {number} rad angle (in radians) to rotate
 * @returns {quat} out
 */
function rotateZ(out, a, rad) {
  rad *= 0.5;

  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bz = Math.sin(rad), bw = Math.cos(rad);

  out[0] = ax * bw + ay * bz;
  out[1] = ay * bw - ax * bz;
  out[2] = az * bw + aw * bz;
  out[3] = aw * bw - az * bz;
  return out;
}

/**
 * Calculates the W component of a quat from the X, Y, and Z components.
 * Assumes that quaternion is 1 unit in length.
 * Any existing W component will be ignored.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate W component of
 * @returns {quat} out
 */
function calculateW(out, a) {
  let x = a[0], y = a[1], z = a[2];

  out[0] = x;
  out[1] = y;
  out[2] = z;
  out[3] = Math.sqrt(Math.abs(1.0 - x * x - y * y - z * z));
  return out;
}

/**
 * Performs a spherical linear interpolation between two quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 */
function slerp(out, a, b, t) {
  // benchmarks:
  //    http://jsperf.com/quaternion-slerp-implementations
  let ax = a[0], ay = a[1], az = a[2], aw = a[3];
  let bx = b[0], by = b[1], bz = b[2], bw = b[3];

  let omega, cosom, sinom, scale0, scale1;

  // calc cosine
  cosom = ax * bx + ay * by + az * bz + aw * bw;
  // adjust signs (if necessary)
  if ( cosom < 0.0 ) {
    cosom = -cosom;
    bx = - bx;
    by = - by;
    bz = - bz;
    bw = - bw;
  }
  // calculate coefficients
  if ( (1.0 - cosom) > 0.000001 ) {
    // standard case (slerp)
    omega  = Math.acos(cosom);
    sinom  = Math.sin(omega);
    scale0 = Math.sin((1.0 - t) * omega) / sinom;
    scale1 = Math.sin(t * omega) / sinom;
  } else {
    // "from" and "to" quaternions are very close
    //  ... so we can do a linear interpolation
    scale0 = 1.0 - t;
    scale1 = t;
  }
  // calculate final values
  out[0] = scale0 * ax + scale1 * bx;
  out[1] = scale0 * ay + scale1 * by;
  out[2] = scale0 * az + scale1 * bz;
  out[3] = scale0 * aw + scale1 * bw;

  return out;
}

/**
 * Calculates the inverse of a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate inverse of
 * @returns {quat} out
 */
function invert(out, a) {
  let a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3];
  let dot = a0*a0 + a1*a1 + a2*a2 + a3*a3;
  let invDot = dot ? 1.0/dot : 0;

  // TODO: Would be faster to return [0,0,0,0] immediately if dot == 0

  out[0] = -a0*invDot;
  out[1] = -a1*invDot;
  out[2] = -a2*invDot;
  out[3] = a3*invDot;
  return out;
}

/**
 * Calculates the conjugate of a quat
 * If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quat to calculate conjugate of
 * @returns {quat} out
 */
function conjugate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  out[3] = a[3];
  return out;
}

/**
 * Creates a quaternion from the given 3x3 rotation matrix.
 *
 * NOTE: The resultant quaternion is not normalized, so you should be sure
 * to renormalize the quaternion yourself where necessary.
 *
 * @param {quat} out the receiving quaternion
 * @param {mat3} m rotation matrix
 * @returns {quat} out
 * @function
 */
function fromMat3(out, m) {
  // Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
  // article "Quaternion Calculus and Fast Animation".
  let fTrace = m[0] + m[4] + m[8];
  let fRoot;

  if ( fTrace > 0.0 ) {
    // |w| > 1/2, may as well choose w > 1/2
    fRoot = Math.sqrt(fTrace + 1.0);  // 2w
    out[3] = 0.5 * fRoot;
    fRoot = 0.5/fRoot;  // 1/(4w)
    out[0] = (m[5]-m[7])*fRoot;
    out[1] = (m[6]-m[2])*fRoot;
    out[2] = (m[1]-m[3])*fRoot;
  } else {
    // |w| <= 1/2
    let i = 0;
    if ( m[4] > m[0] )
      i = 1;
    if ( m[8] > m[i*3+i] )
      i = 2;
    let j = (i+1)%3;
    let k = (i+2)%3;

    fRoot = Math.sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0);
    out[i] = 0.5 * fRoot;
    fRoot = 0.5 / fRoot;
    out[3] = (m[j*3+k] - m[k*3+j]) * fRoot;
    out[j] = (m[j*3+i] + m[i*3+j]) * fRoot;
    out[k] = (m[k*3+i] + m[i*3+k]) * fRoot;
  }

  return out;
}

/**
 * Creates a quaternion from the given euler angle x, y, z.
 *
 * @param {quat} out the receiving quaternion
 * @param {x} Angle to rotate around X axis in degrees.
 * @param {y} Angle to rotate around Y axis in degrees.
 * @param {z} Angle to rotate around Z axis in degrees.
 * @returns {quat} out
 * @function
 */
function fromEuler(out, x, y, z) {
    let halfToRad = 0.5 * Math.PI / 180.0;
    x *= halfToRad;
    y *= halfToRad;
    z *= halfToRad;

    let sx = Math.sin(x);
    let cx = Math.cos(x);
    let sy = Math.sin(y);
    let cy = Math.cos(y);
    let sz = Math.sin(z);
    let cz = Math.cos(z);

    out[0] = sx * cy * cz - cx * sy * sz;
    out[1] = cx * sy * cz + sx * cy * sz;
    out[2] = cx * cy * sz - sx * sy * cz;
    out[3] = cx * cy * cz + sx * sy * sz;

    return out;
}

/**
 * Returns a string representation of a quatenion
 *
 * @param {quat} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'quat(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ')';
}

/**
 * Creates a new quat initialized with values from an existing quaternion
 *
 * @param {quat} a quaternion to clone
 * @returns {quat} a new quaternion
 * @function
 */
const clone = __WEBPACK_IMPORTED_MODULE_3__vec4__["clone"];
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;


/**
 * Creates a new quat initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} a new quaternion
 * @function
 */
const fromValues = __WEBPACK_IMPORTED_MODULE_3__vec4__["fromValues"];
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;


/**
 * Copy the values from one quat to another
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the source quaternion
 * @returns {quat} out
 * @function
 */
const copy = __WEBPACK_IMPORTED_MODULE_3__vec4__["copy"];
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;


/**
 * Set the components of a quat to the given values
 *
 * @param {quat} out the receiving quaternion
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {quat} out
 * @function
 */
const set = __WEBPACK_IMPORTED_MODULE_3__vec4__["set"];
/* harmony export (immutable) */ __webpack_exports__["set"] = set;


/**
 * Adds two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {quat} out
 * @function
 */
const add = __WEBPACK_IMPORTED_MODULE_3__vec4__["add"];
/* harmony export (immutable) */ __webpack_exports__["add"] = add;


/**
 * Alias for {@link quat.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Scales a quat by a scalar number
 *
 * @param {quat} out the receiving vector
 * @param {quat} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {quat} out
 * @function
 */
const scale = __WEBPACK_IMPORTED_MODULE_3__vec4__["scale"];
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;


/**
 * Calculates the dot product of two quat's
 *
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @returns {Number} dot product of a and b
 * @function
 */
const dot = __WEBPACK_IMPORTED_MODULE_3__vec4__["dot"];
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;


/**
 * Performs a linear interpolation between two quat's
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {quat} out
 * @function
 */
const lerp = __WEBPACK_IMPORTED_MODULE_3__vec4__["lerp"];
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;


/**
 * Calculates the length of a quat
 *
 * @param {quat} a vector to calculate length of
 * @returns {Number} length of a
 */
const length = __WEBPACK_IMPORTED_MODULE_3__vec4__["length"];
/* harmony export (immutable) */ __webpack_exports__["length"] = length;


/**
 * Alias for {@link quat.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Calculates the squared length of a quat
 *
 * @param {quat} a vector to calculate squared length of
 * @returns {Number} squared length of a
 * @function
 */
const squaredLength = __WEBPACK_IMPORTED_MODULE_3__vec4__["squaredLength"];
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;


/**
 * Alias for {@link quat.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Normalize a quat
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a quaternion to normalize
 * @returns {quat} out
 * @function
 */
const normalize = __WEBPACK_IMPORTED_MODULE_3__vec4__["normalize"];
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;


/**
 * Returns whether or not the quaternions have exactly the same elements in the same position (when compared with ===)
 *
 * @param {quat} a The first quaternion.
 * @param {quat} b The second quaternion.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
const exactEquals = __WEBPACK_IMPORTED_MODULE_3__vec4__["exactEquals"];
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;


/**
 * Returns whether or not the quaternions have approximately the same elements in the same position.
 *
 * @param {quat} a The first vector.
 * @param {quat} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
const equals = __WEBPACK_IMPORTED_MODULE_3__vec4__["equals"];
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;


/**
 * Sets a quaternion to represent the shortest rotation from one
 * vector to another.
 *
 * Both vectors are assumed to be unit length.
 *
 * @param {quat} out the receiving quaternion.
 * @param {vec3} a the initial vector
 * @param {vec3} b the destination vector
 * @returns {quat} out
 */
const rotationTo = (function() {
  let tmpvec3 = __WEBPACK_IMPORTED_MODULE_2__vec3__["create"]();
  let xUnitVec3 = __WEBPACK_IMPORTED_MODULE_2__vec3__["fromValues"](1,0,0);
  let yUnitVec3 = __WEBPACK_IMPORTED_MODULE_2__vec3__["fromValues"](0,1,0);

  return function(out, a, b) {
    let dot = __WEBPACK_IMPORTED_MODULE_2__vec3__["dot"](a, b);
    if (dot < -0.999999) {
      __WEBPACK_IMPORTED_MODULE_2__vec3__["cross"](tmpvec3, xUnitVec3, a);
      if (__WEBPACK_IMPORTED_MODULE_2__vec3__["len"](tmpvec3) < 0.000001)
        __WEBPACK_IMPORTED_MODULE_2__vec3__["cross"](tmpvec3, yUnitVec3, a);
      __WEBPACK_IMPORTED_MODULE_2__vec3__["normalize"](tmpvec3, tmpvec3);
      setAxisAngle(out, tmpvec3, Math.PI);
      return out;
    } else if (dot > 0.999999) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 1;
      return out;
    } else {
      __WEBPACK_IMPORTED_MODULE_2__vec3__["cross"](tmpvec3, a, b);
      out[0] = tmpvec3[0];
      out[1] = tmpvec3[1];
      out[2] = tmpvec3[2];
      out[3] = 1 + dot;
      return normalize(out, out);
    }
  };
})();
/* harmony export (immutable) */ __webpack_exports__["rotationTo"] = rotationTo;


/**
 * Performs a spherical linear interpolation with two control points
 *
 * @param {quat} out the receiving quaternion
 * @param {quat} a the first operand
 * @param {quat} b the second operand
 * @param {quat} c the third operand
 * @param {quat} d the fourth operand
 * @param {Number} t interpolation amount
 * @returns {quat} out
 */
const sqlerp = (function () {
  let temp1 = create();
  let temp2 = create();

  return function (out, a, b, c, d, t) {
    slerp(temp1, a, d, t);
    slerp(temp2, b, c, t);
    slerp(out, temp1, temp2, 2 * t * (1 - t));

    return out;
  };
}());
/* harmony export (immutable) */ __webpack_exports__["sqlerp"] = sqlerp;


/**
 * Sets the specified quaternion with values corresponding to the given
 * axes. Each axis is a vec3 and is expected to be unit length and
 * perpendicular to all other specified axes.
 *
 * @param {vec3} view  the vector representing the viewing direction
 * @param {vec3} right the vector representing the local "right" direction
 * @param {vec3} up    the vector representing the local "up" direction
 * @returns {quat} out
 */
const setAxes = (function() {
  let matr = __WEBPACK_IMPORTED_MODULE_1__mat3__["create"]();

  return function(out, view, right, up) {
    matr[0] = right[0];
    matr[3] = right[1];
    matr[6] = right[2];

    matr[1] = up[0];
    matr[4] = up[1];
    matr[7] = up[2];

    matr[2] = -view[0];
    matr[5] = -view[1];
    matr[8] = -view[2];

    return normalize(out, fromMat3(out, matr));
  };
})();
/* harmony export (immutable) */ __webpack_exports__["setAxes"] = setAxes;



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (immutable) */ __webpack_exports__["create"] = create;
/* harmony export (immutable) */ __webpack_exports__["clone"] = clone;
/* harmony export (immutable) */ __webpack_exports__["fromValues"] = fromValues;
/* harmony export (immutable) */ __webpack_exports__["copy"] = copy;
/* harmony export (immutable) */ __webpack_exports__["set"] = set;
/* harmony export (immutable) */ __webpack_exports__["add"] = add;
/* harmony export (immutable) */ __webpack_exports__["subtract"] = subtract;
/* harmony export (immutable) */ __webpack_exports__["multiply"] = multiply;
/* harmony export (immutable) */ __webpack_exports__["divide"] = divide;
/* harmony export (immutable) */ __webpack_exports__["ceil"] = ceil;
/* harmony export (immutable) */ __webpack_exports__["floor"] = floor;
/* harmony export (immutable) */ __webpack_exports__["min"] = min;
/* harmony export (immutable) */ __webpack_exports__["max"] = max;
/* harmony export (immutable) */ __webpack_exports__["round"] = round;
/* harmony export (immutable) */ __webpack_exports__["scale"] = scale;
/* harmony export (immutable) */ __webpack_exports__["scaleAndAdd"] = scaleAndAdd;
/* harmony export (immutable) */ __webpack_exports__["distance"] = distance;
/* harmony export (immutable) */ __webpack_exports__["squaredDistance"] = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["length"] = length;
/* harmony export (immutable) */ __webpack_exports__["squaredLength"] = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["negate"] = negate;
/* harmony export (immutable) */ __webpack_exports__["inverse"] = inverse;
/* harmony export (immutable) */ __webpack_exports__["normalize"] = normalize;
/* harmony export (immutable) */ __webpack_exports__["dot"] = dot;
/* harmony export (immutable) */ __webpack_exports__["cross"] = cross;
/* harmony export (immutable) */ __webpack_exports__["lerp"] = lerp;
/* harmony export (immutable) */ __webpack_exports__["random"] = random;
/* harmony export (immutable) */ __webpack_exports__["transformMat2"] = transformMat2;
/* harmony export (immutable) */ __webpack_exports__["transformMat2d"] = transformMat2d;
/* harmony export (immutable) */ __webpack_exports__["transformMat3"] = transformMat3;
/* harmony export (immutable) */ __webpack_exports__["transformMat4"] = transformMat4;
/* harmony export (immutable) */ __webpack_exports__["str"] = str;
/* harmony export (immutable) */ __webpack_exports__["exactEquals"] = exactEquals;
/* harmony export (immutable) */ __webpack_exports__["equals"] = equals;
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common__ = __webpack_require__(0);
/* Copyright (c) 2015, Brandon Jones, Colin MacKenzie IV.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE. */



/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
function create() {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](2);
  out[0] = 0;
  out[1] = 0;
  return out;
}

/**
 * Creates a new vec2 initialized with values from an existing vector
 *
 * @param {vec2} a vector to clone
 * @returns {vec2} a new 2D vector
 */
function clone(a) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](2);
  out[0] = a[0];
  out[1] = a[1];
  return out;
}

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
function fromValues(x, y) {
  let out = new __WEBPACK_IMPORTED_MODULE_0__common__["ARRAY_TYPE"](2);
  out[0] = x;
  out[1] = y;
  return out;
}

/**
 * Copy the values from one vec2 to another
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the source vector
 * @returns {vec2} out
 */
function copy(out, a) {
  out[0] = a[0];
  out[1] = a[1];
  return out;
}

/**
 * Set the components of a vec2 to the given values
 *
 * @param {vec2} out the receiving vector
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} out
 */
function set(out, x, y) {
  out[0] = x;
  out[1] = y;
  return out;
}

/**
 * Adds two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function add(out, a, b) {
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  return out;
}

/**
 * Subtracts vector b from vector a
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function subtract(out, a, b) {
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  return out;
}

/**
 * Multiplies two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function multiply(out, a, b) {
  out[0] = a[0] * b[0];
  out[1] = a[1] * b[1];
  return out;
};

/**
 * Divides two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function divide(out, a, b) {
  out[0] = a[0] / b[0];
  out[1] = a[1] / b[1];
  return out;
};

/**
 * Math.ceil the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to ceil
 * @returns {vec2} out
 */
function ceil(out, a) {
  out[0] = Math.ceil(a[0]);
  out[1] = Math.ceil(a[1]);
  return out;
};

/**
 * Math.floor the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to floor
 * @returns {vec2} out
 */
function floor(out, a) {
  out[0] = Math.floor(a[0]);
  out[1] = Math.floor(a[1]);
  return out;
};

/**
 * Returns the minimum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function min(out, a, b) {
  out[0] = Math.min(a[0], b[0]);
  out[1] = Math.min(a[1], b[1]);
  return out;
};

/**
 * Returns the maximum of two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec2} out
 */
function max(out, a, b) {
  out[0] = Math.max(a[0], b[0]);
  out[1] = Math.max(a[1], b[1]);
  return out;
};

/**
 * Math.round the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to round
 * @returns {vec2} out
 */
function round (out, a) {
  out[0] = Math.round(a[0]);
  out[1] = Math.round(a[1]);
  return out;
};

/**
 * Scales a vec2 by a scalar number
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec2} out
 */
function scale(out, a, b) {
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  return out;
};

/**
 * Adds two vec2's after scaling the second operand by a scalar value
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} scale the amount to scale b by before adding
 * @returns {vec2} out
 */
function scaleAndAdd(out, a, b, scale) {
  out[0] = a[0] + (b[0] * scale);
  out[1] = a[1] + (b[1] * scale);
  return out;
};

/**
 * Calculates the euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} distance between a and b
 */
function distance(a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return Math.sqrt(x*x + y*y);
};

/**
 * Calculates the squared euclidian distance between two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} squared distance between a and b
 */
function squaredDistance(a, b) {
  var x = b[0] - a[0],
    y = b[1] - a[1];
  return x*x + y*y;
};

/**
 * Calculates the length of a vec2
 *
 * @param {vec2} a vector to calculate length of
 * @returns {Number} length of a
 */
function length(a) {
  var x = a[0],
    y = a[1];
  return Math.sqrt(x*x + y*y);
};

/**
 * Calculates the squared length of a vec2
 *
 * @param {vec2} a vector to calculate squared length of
 * @returns {Number} squared length of a
 */
function squaredLength (a) {
  var x = a[0],
    y = a[1];
  return x*x + y*y;
};

/**
 * Negates the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to negate
 * @returns {vec2} out
 */
function negate(out, a) {
  out[0] = -a[0];
  out[1] = -a[1];
  return out;
};

/**
 * Returns the inverse of the components of a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to invert
 * @returns {vec2} out
 */
function inverse(out, a) {
  out[0] = 1.0 / a[0];
  out[1] = 1.0 / a[1];
  return out;
};

/**
 * Normalize a vec2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a vector to normalize
 * @returns {vec2} out
 */
function normalize(out, a) {
  var x = a[0],
    y = a[1];
  var len = x*x + y*y;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
    out[0] = a[0] * len;
    out[1] = a[1] * len;
  }
  return out;
};

/**
 * Calculates the dot product of two vec2's
 *
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {Number} dot product of a and b
 */
function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
};

/**
 * Computes the cross product of two vec2's
 * Note that the cross product must by definition produce a 3D vector
 *
 * @param {vec3} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @returns {vec3} out
 */
function cross(out, a, b) {
  var z = a[0] * b[1] - a[1] * b[0];
  out[0] = out[1] = 0;
  out[2] = z;
  return out;
};

/**
 * Performs a linear interpolation between two vec2's
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the first operand
 * @param {vec2} b the second operand
 * @param {Number} t interpolation amount between the two inputs
 * @returns {vec2} out
 */
function lerp(out, a, b, t) {
  var ax = a[0],
    ay = a[1];
  out[0] = ax + t * (b[0] - ax);
  out[1] = ay + t * (b[1] - ay);
  return out;
};

/**
 * Generates a random vector with the given scale
 *
 * @param {vec2} out the receiving vector
 * @param {Number} [scale] Length of the resulting vector. If ommitted, a unit vector will be returned
 * @returns {vec2} out
 */
function random(out, scale) {
  scale = scale || 1.0;
  var r = __WEBPACK_IMPORTED_MODULE_0__common__["RANDOM"]() * 2.0 * Math.PI;
  out[0] = Math.cos(r) * scale;
  out[1] = Math.sin(r) * scale;
  return out;
};

/**
 * Transforms the vec2 with a mat2
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat2(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y;
  out[1] = m[1] * x + m[3] * y;
  return out;
};

/**
 * Transforms the vec2 with a mat2d
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat2d} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat2d(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[2] * y + m[4];
  out[1] = m[1] * x + m[3] * y + m[5];
  return out;
};

/**
 * Transforms the vec2 with a mat3
 * 3rd vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat3} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat3(out, a, m) {
  var x = a[0],
    y = a[1];
  out[0] = m[0] * x + m[3] * y + m[6];
  out[1] = m[1] * x + m[4] * y + m[7];
  return out;
};

/**
 * Transforms the vec2 with a mat4
 * 3rd vector component is implicitly '0'
 * 4th vector component is implicitly '1'
 *
 * @param {vec2} out the receiving vector
 * @param {vec2} a the vector to transform
 * @param {mat4} m matrix to transform with
 * @returns {vec2} out
 */
function transformMat4(out, a, m) {
  let x = a[0];
  let y = a[1];
  out[0] = m[0] * x + m[4] * y + m[12];
  out[1] = m[1] * x + m[5] * y + m[13];
  return out;
}

/**
 * Returns a string representation of a vector
 *
 * @param {vec2} a vector to represent as a string
 * @returns {String} string representation of the vector
 */
function str(a) {
  return 'vec2(' + a[0] + ', ' + a[1] + ')';
}

/**
 * Returns whether or not the vectors exactly have the same elements in the same position (when compared with ===)
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function exactEquals(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

/**
 * Returns whether or not the vectors have approximately the same elements in the same position.
 *
 * @param {vec2} a The first vector.
 * @param {vec2} b The second vector.
 * @returns {Boolean} True if the vectors are equal, false otherwise.
 */
function equals(a, b) {
  let a0 = a[0], a1 = a[1];
  let b0 = b[0], b1 = b[1];
  return (Math.abs(a0 - b0) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a0), Math.abs(b0)) &&
          Math.abs(a1 - b1) <= __WEBPACK_IMPORTED_MODULE_0__common__["EPSILON"]*Math.max(1.0, Math.abs(a1), Math.abs(b1)));
}

/**
 * Alias for {@link vec2.length}
 * @function
 */
const len = length;
/* harmony export (immutable) */ __webpack_exports__["len"] = len;


/**
 * Alias for {@link vec2.subtract}
 * @function
 */
const sub = subtract;
/* harmony export (immutable) */ __webpack_exports__["sub"] = sub;


/**
 * Alias for {@link vec2.multiply}
 * @function
 */
const mul = multiply;
/* harmony export (immutable) */ __webpack_exports__["mul"] = mul;


/**
 * Alias for {@link vec2.divide}
 * @function
 */
const div = divide;
/* harmony export (immutable) */ __webpack_exports__["div"] = div;


/**
 * Alias for {@link vec2.distance}
 * @function
 */
const dist = distance;
/* harmony export (immutable) */ __webpack_exports__["dist"] = dist;


/**
 * Alias for {@link vec2.squaredDistance}
 * @function
 */
const sqrDist = squaredDistance;
/* harmony export (immutable) */ __webpack_exports__["sqrDist"] = sqrDist;


/**
 * Alias for {@link vec2.squaredLength}
 * @function
 */
const sqrLen = squaredLength;
/* harmony export (immutable) */ __webpack_exports__["sqrLen"] = sqrLen;


/**
 * Perform some operation over an array of vec2s.
 *
 * @param {Array} a the array of vectors to iterate over
 * @param {Number} stride Number of elements between the start of each vec2. If 0 assumes tightly packed
 * @param {Number} offset Number of elements to skip at the beginning of the array
 * @param {Number} count Number of vec2s to iterate over. If 0 iterates over entire array
 * @param {Function} fn Function to call for each vector in the array
 * @param {Object} [arg] additional argument to pass to fn
 * @returns {Array} a
 * @function
 */
const forEach = (function() {
  let vec = create();

  return function(a, stride, offset, count, fn, arg) {
    let i, l;
    if(!stride) {
      stride = 2;
    }

    if(!offset) {
      offset = 0;
    }

    if(count) {
      l = Math.min((count * stride) + offset, a.length);
    } else {
      l = a.length;
    }

    for(i = offset; i < l; i += stride) {
      vec[0] = a[i]; vec[1] = a[i+1];
      fn(vec, vec, arg);
      a[i] = vec[0]; a[i+1] = vec[1];
    }

    return a;
  };
})();
/* harmony export (immutable) */ __webpack_exports__["forEach"] = forEach;



/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
var canUseDOM = exports.canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var addEventListener = exports.addEventListener = function addEventListener(node, event, listener) {
  return node.addEventListener ? node.addEventListener(event, listener, false) : node.attachEvent('on' + event, listener);
};

var removeEventListener = exports.removeEventListener = function removeEventListener(node, event, listener) {
  return node.removeEventListener ? node.removeEventListener(event, listener, false) : node.detachEvent('on' + event, listener);
};

var getConfirmation = exports.getConfirmation = function getConfirmation(message, callback) {
  return callback(window.confirm(message));
}; // eslint-disable-line no-alert

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
var supportsHistory = exports.supportsHistory = function supportsHistory() {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) return false;

  return window.history && 'pushState' in window.history;
};

/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
var supportsPopStateOnHashChange = exports.supportsPopStateOnHashChange = function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
};

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
var supportsGoWithoutReloadUsingHash = exports.supportsGoWithoutReloadUsingHash = function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
};

/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */
var isExtraneousPopstateEvent = exports.isExtraneousPopstateEvent = function isExtraneousPopstateEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;
exports.locationsAreEqual = exports.createLocation = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _resolvePathname = __webpack_require__(20);

var _resolvePathname2 = _interopRequireDefault(_resolvePathname);

var _valueEqual = __webpack_require__(21);

var _valueEqual2 = _interopRequireDefault(_valueEqual);

var _PathUtils = __webpack_require__(4);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createLocation = exports.createLocation = function createLocation(path, state, key, currentLocation) {
  var location = void 0;
  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = (0, _PathUtils.parsePath)(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = _extends({}, path);

    if (location.pathname === undefined) location.pathname = '';

    if (location.search) {
      if (location.search.charAt(0) !== '?') location.search = '?' + location.search;
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') location.hash = '#' + location.hash;
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) location.state = state;
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) location.key = key;

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = (0, _resolvePathname2.default)(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
};

var locationsAreEqual = exports.locationsAreEqual = function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && (0, _valueEqual2.default)(a.state, b.state);
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _warning = __webpack_require__(5);

var _warning2 = _interopRequireDefault(_warning);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var createTransitionManager = function createTransitionManager() {
  var prompt = null;

  var setPrompt = function setPrompt(nextPrompt) {
    (0, _warning2.default)(prompt == null, 'A history supports only one prompt at a time');

    prompt = nextPrompt;

    return function () {
      if (prompt === nextPrompt) prompt = null;
    };
  };

  var confirmTransitionTo = function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
          (0, _warning2.default)(false, 'A history needs a getUserConfirmation function in order to use a prompt message');

          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  };

  var listeners = [];

  var appendListener = function appendListener(fn) {
    var isActive = true;

    var listener = function listener() {
      if (isActive) fn.apply(undefined, arguments);
    };

    listeners.push(listener);

    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  };

  var notifyListeners = function notifyListeners() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(undefined, args);
    });
  };

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
};

exports.default = createTransitionManager;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  if (false) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

module.exports = invariant;


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
}

// About 1.5x faster than the two-arg version of Array#splice()
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }

  list.pop();
}

// This implementation is based heavily on node's url.parse
function resolvePathname(to) {
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var toParts = to && to.split('/') || [];
  var fromParts = from && from.split('/') || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) return '/';

  var hasTrailingSlash = void 0;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) for (; up--; up) {
    fromParts.unshift('..');
  }if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) fromParts.unshift('');

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') result += '/';

  return result;
}

/* harmony default export */ __webpack_exports__["default"] = (resolvePathname);

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function valueEqual(a, b) {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (Array.isArray(a)) {
    return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
      return valueEqual(item, b[index]);
    });
  }

  var aType = typeof a === 'undefined' ? 'undefined' : _typeof(a);
  var bType = typeof b === 'undefined' ? 'undefined' : _typeof(b);

  if (aType !== bType) return false;

  if (aType === 'object') {
    var aValue = a.valueOf();
    var bValue = b.valueOf();

    if (aValue !== a || bValue !== b) return valueEqual(aValue, bValue);

    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    return aKeys.every(function (key) {
      return valueEqual(a[key], b[key]);
    });
  }

  return false;
}

/* harmony default export */ __webpack_exports__["default"] = (valueEqual);

/***/ })
/******/ ]);