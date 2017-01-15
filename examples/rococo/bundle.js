/******/ (function(modules) {
    // webpackBootstrap
    /******/
    // The module cache
    /******/
    var installedModules = {};
    /******/
    /******/
    // The require function
    /******/
    function __webpack_require__(moduleId) {
        /******/
        /******/
        // Check if module is in cache
        /******/
        if (installedModules[moduleId]) /******/
        return installedModules[moduleId].exports;
        /******/
        /******/
        // Create a new module (and put it into the cache)
        /******/
        var module = installedModules[moduleId] = {
            /******/
            i: moduleId,
            /******/
            l: false,
            /******/
            exports: {}
        };
        /******/
        /******/
        // Execute the module function
        /******/
        modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
        /******/
        /******/
        // Flag the module as loaded
        /******/
        module.l = true;
        /******/
        /******/
        // Return the exports of the module
        /******/
        return module.exports;
    }
    /******/
    /******/
    /******/
    // expose the modules object (__webpack_modules__)
    /******/
    __webpack_require__.m = modules;
    /******/
    /******/
    // expose the module cache
    /******/
    __webpack_require__.c = installedModules;
    /******/
    /******/
    // identity function for calling harmony imports with the correct context
    /******/
    __webpack_require__.i = function(value) {
        return value;
    };
    /******/
    /******/
    // define getter function for harmony exports
    /******/
    __webpack_require__.d = function(exports, name, getter) {
        /******/
        if (!__webpack_require__.o(exports, name)) {
            /******/
            Object.defineProperty(exports, name, {
                /******/
                configurable: false,
                /******/
                enumerable: true,
                /******/
                get: getter
            });
        }
    };
    /******/
    /******/
    // getDefaultExport function for compatibility with non-harmony modules
    /******/
    __webpack_require__.n = function(module) {
        /******/
        var getter = module && module.__esModule ? /******/
        function getDefault() {
            return module["default"];
        } : /******/
        function getModuleExports() {
            return module;
        };
        /******/
        __webpack_require__.d(getter, "a", getter);
        /******/
        return getter;
    };
    /******/
    /******/
    // Object.prototype.hasOwnProperty.call
    /******/
    __webpack_require__.o = function(object, property) {
        return Object.prototype.hasOwnProperty.call(object, property);
    };
    /******/
    /******/
    // __webpack_public_path__
    /******/
    __webpack_require__.p = "";
    /******/
    /******/
    // Load entry module and return exports
    /******/
    return __webpack_require__(__webpack_require__.s = 2);
})([ /* 0 */
/***/
function(module, exports, __webpack_require__) {
    "use strict";
    /* WEBPACK VAR INJECTION */
    (function(module) {
        var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
        "use strict";
        var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
            return typeof obj;
        } : function(obj) {
            return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
        };
        !function(e, t) {
            "object" == (false ? "undefined" : _typeof(exports)) && "object" == (false ? "undefined" : _typeof(module)) ? module.exports = t() : true ? !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], 
            __WEBPACK_AMD_DEFINE_FACTORY__ = t, __WEBPACK_AMD_DEFINE_RESULT__ = typeof __WEBPACK_AMD_DEFINE_FACTORY__ === "function" ? __WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__) : __WEBPACK_AMD_DEFINE_FACTORY__, 
            __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) : "object" == (typeof exports === "undefined" ? "undefined" : _typeof(exports)) ? exports.Hyperact = t() : e.Hyperact = t();
        }(undefined, function() {
            return function(e) {
                function t(r) {
                    if (n[r]) return n[r].exports;
                    var i = n[r] = {
                        i: r,
                        l: !1,
                        exports: {}
                    };
                    return e[r].call(i.exports, i, i.exports, t), i.l = !0, i.exports;
                }
                var n = {};
                return t.m = e, t.c = n, t.i = function(e) {
                    return e;
                }, t.d = function(e, n, r) {
                    t.o(e, n) || Object.defineProperty(e, n, {
                        configurable: !1,
                        enumerable: !0,
                        get: r
                    });
                }, t.n = function(e) {
                    var n = e && e.__esModule ? function() {
                        return e.default;
                    } : function() {
                        return e;
                    };
                    return t.d(n, "a", n), n;
                }, t.o = function(e, t) {
                    return Object.prototype.hasOwnProperty.call(e, t);
                }, t.p = "", t(t.s = 17);
            }([ function(e, t, n) {
                "use strict";
                function r(e, t) {
                    var n;
                    if (1 === e.length) {
                        var r = e[0];
                        n = function n(e) {
                            return e === r;
                        };
                    } else n = function n(t) {
                        return e.indexOf(t) >= 0;
                    };
                    return i(t, {
                        add: function add(e, r) {
                            return n(e) || n(r) ? r : t.add(e, r);
                        },
                        subtract: function subtract(e, r) {
                            return n(e) || n(r) ? e : t.subtract(e, r);
                        },
                        zero: function zero(e) {
                            return "";
                        },
                        interpolate: function interpolate(e, r, i) {
                            return n(e) || n(r) ? f.nonNumericType.interpolate(e, r, i) : t.interpolate(e, r, i);
                        },
                        output: function output(e, r) {
                            return n(e) ? e : t.output(e, r);
                        },
                        input: function input(e) {
                            return n(e) ? e : t.input(e);
                        }
                    });
                }
                function i(e, t) {
                    if (null === e || "undefined" == typeof e) throw new Error("HyperStyle createObject no proto damn it");
                    var n = Object.create(e);
                    return Object.getOwnPropertyNames(t).forEach(function(e) {
                        Object.defineProperty(n, e, Object.getOwnPropertyDescriptor(t, e));
                    }), n;
                }
                function o(e, t, n) {
                    return Math.max(Math.min(e, n), t);
                }
                function a(e, t, n, r) {
                    if (Array.isArray(e) || Array.isArray(t)) return u(e, t, n, r);
                    var i = "scale" === r ? 1 : 0;
                    return t = s(t) ? t : i, e = s(e) ? e : i, t * n + e * (1 - n);
                }
                function u(e, t, n, r) {
                    for (var i = e ? e.length : t.length, o = [], u = 0; u < i; u++) {
                        o[u] = a(e ? e[u] : null, t ? t[u] : null, n, r);
                    }
                    return o;
                }
                function s(e) {
                    return c(e) && null !== e;
                }
                function c(e) {
                    return "undefined" != typeof e;
                }
                function l() {
                    if ("undefined" == typeof document) return {
                        calcFunction: "calc",
                        transformProperty: "transform"
                    };
                    var e = p();
                    e.style.cssText = "width: calc(0px);width: -webkit-calc(0px);";
                    var t = e.style.width.split("(")[0], n = [ "transform", "webkitTransform", "msTransform" ], r = n.filter(function(t) {
                        return t in e.style;
                    })[0];
                    return {
                        calcFunction: t,
                        transformProperty: r
                    };
                }
                function p() {
                    return document.documentElement.namespaceURI === h ? document.createElementNS(h, "g") : document.createElement("div");
                }
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.typeWithKeywords = r, t.createObject = i, t.clamp = o, t.interp = a, t.interpArray = u, 
                t.isDefinedAndNotNull = s, t.isDefined = c, t.detectFeatures = l;
                var f = n(2), h = "http://www.w3.org/2000/svg";
            }, function(e, t, n) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.lengthAutoType = t.lengthType = void 0;
                var r, i = n(0), o = /^\s*(-webkit-)?calc\s*\(\s*([^)]*)\)/, a = /^\s*(-?[0-9]+(\.[0-9])?[0-9]*)([a-zA-Z%]*)/, u = /^\s*([+-])/, s = /^\s*auto/i, c = t.lengthType = {
                    toString: function toString() {
                        return "lengthType";
                    },
                    toJSON: function toJSON() {
                        return this.toString();
                    },
                    zero: function zero() {
                        return {
                            px: 0
                        };
                    },
                    add: function add(e, t) {
                        null !== t && void 0 !== t || (t = {}), null !== e && void 0 !== e || (e = {});
                        var n = {};
                        for (var r in e) {
                            n[r] = e[r] + (t[r] || 0);
                        }
                        for (var i in t) {
                            i in e || (n[i] = t[i]);
                        }
                        return n;
                    },
                    subtract: function subtract(e, t) {
                        var n = this.inverse(t), r = this.add(e, n);
                        return r;
                    },
                    interpolate: function interpolate(e, t, n) {
                        var r = {};
                        for (var o in e) {
                            r[o] = (0, i.interp)(e[o], t[o], n);
                        }
                        for (var a in t) {
                            a in r || (r[a] = (0, i.interp)(0, t[a], n));
                        }
                        return r;
                    },
                    output: function output(e) {
                        r || (r = (0, i.detectFeatures)());
                        var t = "", n = !0;
                        for (var o in e) {
                            "" === t ? t = e[o] + o : n ? 0 !== e[o] && (t = r.calcFunction + "(" + t + " + " + e[o] + o + ")", 
                            n = !1) : 0 !== e[o] && (t = t.substring(0, t.length - 1) + " + " + e[o] + o + ")");
                        }
                        return t;
                    },
                    input: function input(e) {
                        var t = c.consumeValueFromString(e);
                        if (t) return t.value;
                    },
                    consumeValueFromString: function consumeValueFromString(e) {
                        if ((0, i.isDefinedAndNotNull)(e)) {
                            var t = s.exec(e);
                            if (t) return {
                                value: {
                                    auto: !0
                                },
                                remaining: e.substring(t[0].length)
                            };
                            var n = {}, r = o.exec(e);
                            if (r) for (var c = e.substring(r[0].length), l = r[2], p = !0; ;) {
                                var f = !1;
                                if (p) p = !1; else {
                                    var h = u.exec(l);
                                    if (!h) return;
                                    "-" === h[1] && (f = !0), l = l.substring(h[0].length);
                                }
                                if (e = a.exec(l), !e) return;
                                var d = e[3], y = Number(e[1]);
                                if ((0, i.isDefinedAndNotNull)(n[d]) || (n[d] = 0), f ? n[d] -= y : n[d] += y, l = l.substring(e[0].length), 
                                /\s*/.exec(l)[0].length === l.length) return {
                                    value: n,
                                    remaining: c
                                };
                            } else {
                                var g = a.exec(e);
                                if (g && 4 === g.length) return n[g[3]] = Number(g[1]), {
                                    value: n,
                                    remaining: e.substring(g[0].length)
                                };
                            }
                        }
                    },
                    inverse: function inverse(e) {
                        var t = {};
                        for (var n in e) {
                            t[n] = -e[n];
                        }
                        return t;
                    }
                };
                t.lengthAutoType = (0, i.typeWithKeywords)([ "auto" ], c);
            }, function(e, t, n) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.nonNumericType = void 0;
                var r = n(0);
                t.nonNumericType = {
                    toString: function toString() {
                        return "nonNumericType";
                    },
                    toJSON: function toJSON() {
                        return this.toString();
                    },
                    zero: function zero() {
                        return "";
                    },
                    inverse: function inverse(e) {
                        return e;
                    },
                    add: function add(e, t) {
                        return (0, r.isDefined)(t) ? t : e;
                    },
                    subtract: function subtract(e, t) {
                        return e;
                    },
                    interpolate: function interpolate(e, t, n) {
                        return n < .5 ? e : t;
                    },
                    output: function output(e) {
                        return e;
                    },
                    input: function input(e) {
                        return e;
                    }
                };
            }, function(e, t, n) {
                "use strict";
                function r(e, t, n) {
                    function r(e, t, n) {
                        return n < 0 && (n += 1), n > 1 && (n -= 1), 6 * n < 1 ? e + (t - e) * n * 6 : 2 * n < 1 ? t : 3 * n < 2 ? e + (t - e) * (2 / 3 - n) * 6 : e;
                    }
                    e = (e % 360 + 360) % 360 / 360, t /= 100, n /= 100;
                    var i;
                    i = n <= .5 ? n * (t + 1) : n + t - n * t;
                    var o = 2 * n - i, a = Math.ceil(255 * r(o, i, e + 1 / 3)), u = Math.ceil(255 * r(o, i, e)), s = Math.ceil(255 * r(o, i, e - 1 / 3));
                    return [ a, u, s ];
                }
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.colorType = void 0;
                var i = n(0), o = new RegExp("(hsla?|rgba?)\\(([\\-0-9]+%?),?\\s*([\\-0-9]+%?),?\\s*([\\-0-9]+%?)(?:,?\\s*([\\-0-9\\.]+%?))?\\)"), a = new RegExp("#([0-9A-Fa-f][0-9A-Fa-f]?)([0-9A-Fa-f][0-9A-Fa-f]?)([0-9A-Fa-f][0-9A-Fa-f]?)"), u = {
                    aliceblue: [ 240, 248, 255, 1 ],
                    antiquewhite: [ 250, 235, 215, 1 ],
                    aqua: [ 0, 255, 255, 1 ],
                    aquamarine: [ 127, 255, 212, 1 ],
                    azure: [ 240, 255, 255, 1 ],
                    beige: [ 245, 245, 220, 1 ],
                    bisque: [ 255, 228, 196, 1 ],
                    black: [ 0, 0, 0, 1 ],
                    blanchedalmond: [ 255, 235, 205, 1 ],
                    blue: [ 0, 0, 255, 1 ],
                    blueviolet: [ 138, 43, 226, 1 ],
                    brown: [ 165, 42, 42, 1 ],
                    burlywood: [ 222, 184, 135, 1 ],
                    cadetblue: [ 95, 158, 160, 1 ],
                    chartreuse: [ 127, 255, 0, 1 ],
                    chocolate: [ 210, 105, 30, 1 ],
                    coral: [ 255, 127, 80, 1 ],
                    cornflowerblue: [ 100, 149, 237, 1 ],
                    cornsilk: [ 255, 248, 220, 1 ],
                    crimson: [ 220, 20, 60, 1 ],
                    cyan: [ 0, 255, 255, 1 ],
                    darkblue: [ 0, 0, 139, 1 ],
                    darkcyan: [ 0, 139, 139, 1 ],
                    darkgoldenrod: [ 184, 134, 11, 1 ],
                    darkgray: [ 169, 169, 169, 1 ],
                    darkgreen: [ 0, 100, 0, 1 ],
                    darkgrey: [ 169, 169, 169, 1 ],
                    darkkhaki: [ 189, 183, 107, 1 ],
                    darkmagenta: [ 139, 0, 139, 1 ],
                    darkolivegreen: [ 85, 107, 47, 1 ],
                    darkorange: [ 255, 140, 0, 1 ],
                    darkorchid: [ 153, 50, 204, 1 ],
                    darkred: [ 139, 0, 0, 1 ],
                    darksalmon: [ 233, 150, 122, 1 ],
                    darkseagreen: [ 143, 188, 143, 1 ],
                    darkslateblue: [ 72, 61, 139, 1 ],
                    darkslategray: [ 47, 79, 79, 1 ],
                    darkslategrey: [ 47, 79, 79, 1 ],
                    darkturquoise: [ 0, 206, 209, 1 ],
                    darkviolet: [ 148, 0, 211, 1 ],
                    deeppink: [ 255, 20, 147, 1 ],
                    deepskyblue: [ 0, 191, 255, 1 ],
                    dimgray: [ 105, 105, 105, 1 ],
                    dimgrey: [ 105, 105, 105, 1 ],
                    dodgerblue: [ 30, 144, 255, 1 ],
                    firebrick: [ 178, 34, 34, 1 ],
                    floralwhite: [ 255, 250, 240, 1 ],
                    forestgreen: [ 34, 139, 34, 1 ],
                    fuchsia: [ 255, 0, 255, 1 ],
                    gainsboro: [ 220, 220, 220, 1 ],
                    ghostwhite: [ 248, 248, 255, 1 ],
                    gold: [ 255, 215, 0, 1 ],
                    goldenrod: [ 218, 165, 32, 1 ],
                    gray: [ 128, 128, 128, 1 ],
                    green: [ 0, 128, 0, 1 ],
                    greenyellow: [ 173, 255, 47, 1 ],
                    grey: [ 128, 128, 128, 1 ],
                    honeydew: [ 240, 255, 240, 1 ],
                    hotpink: [ 255, 105, 180, 1 ],
                    indianred: [ 205, 92, 92, 1 ],
                    indigo: [ 75, 0, 130, 1 ],
                    ivory: [ 255, 255, 240, 1 ],
                    khaki: [ 240, 230, 140, 1 ],
                    lavender: [ 230, 230, 250, 1 ],
                    lavenderblush: [ 255, 240, 245, 1 ],
                    lawngreen: [ 124, 252, 0, 1 ],
                    lemonchiffon: [ 255, 250, 205, 1 ],
                    lightblue: [ 173, 216, 230, 1 ],
                    lightcoral: [ 240, 128, 128, 1 ],
                    lightcyan: [ 224, 255, 255, 1 ],
                    lightgoldenrodyellow: [ 250, 250, 210, 1 ],
                    lightgray: [ 211, 211, 211, 1 ],
                    lightgreen: [ 144, 238, 144, 1 ],
                    lightgrey: [ 211, 211, 211, 1 ],
                    lightpink: [ 255, 182, 193, 1 ],
                    lightsalmon: [ 255, 160, 122, 1 ],
                    lightseagreen: [ 32, 178, 170, 1 ],
                    lightskyblue: [ 135, 206, 250, 1 ],
                    lightslategray: [ 119, 136, 153, 1 ],
                    lightslategrey: [ 119, 136, 153, 1 ],
                    lightsteelblue: [ 176, 196, 222, 1 ],
                    lightyellow: [ 255, 255, 224, 1 ],
                    lime: [ 0, 255, 0, 1 ],
                    limegreen: [ 50, 205, 50, 1 ],
                    linen: [ 250, 240, 230, 1 ],
                    magenta: [ 255, 0, 255, 1 ],
                    maroon: [ 128, 0, 0, 1 ],
                    mediumaquamarine: [ 102, 205, 170, 1 ],
                    mediumblue: [ 0, 0, 205, 1 ],
                    mediumorchid: [ 186, 85, 211, 1 ],
                    mediumpurple: [ 147, 112, 219, 1 ],
                    mediumseagreen: [ 60, 179, 113, 1 ],
                    mediumslateblue: [ 123, 104, 238, 1 ],
                    mediumspringgreen: [ 0, 250, 154, 1 ],
                    mediumturquoise: [ 72, 209, 204, 1 ],
                    mediumvioletred: [ 199, 21, 133, 1 ],
                    midnightblue: [ 25, 25, 112, 1 ],
                    mintcream: [ 245, 255, 250, 1 ],
                    mistyrose: [ 255, 228, 225, 1 ],
                    moccasin: [ 255, 228, 181, 1 ],
                    navajowhite: [ 255, 222, 173, 1 ],
                    navy: [ 0, 0, 128, 1 ],
                    oldlace: [ 253, 245, 230, 1 ],
                    olive: [ 128, 128, 0, 1 ],
                    olivedrab: [ 107, 142, 35, 1 ],
                    orange: [ 255, 165, 0, 1 ],
                    orangered: [ 255, 69, 0, 1 ],
                    orchid: [ 218, 112, 214, 1 ],
                    palegoldenrod: [ 238, 232, 170, 1 ],
                    palegreen: [ 152, 251, 152, 1 ],
                    paleturquoise: [ 175, 238, 238, 1 ],
                    palevioletred: [ 219, 112, 147, 1 ],
                    papayawhip: [ 255, 239, 213, 1 ],
                    peachpuff: [ 255, 218, 185, 1 ],
                    peru: [ 205, 133, 63, 1 ],
                    pink: [ 255, 192, 203, 1 ],
                    plum: [ 221, 160, 221, 1 ],
                    powderblue: [ 176, 224, 230, 1 ],
                    purple: [ 128, 0, 128, 1 ],
                    red: [ 255, 0, 0, 1 ],
                    rosybrown: [ 188, 143, 143, 1 ],
                    royalblue: [ 65, 105, 225, 1 ],
                    saddlebrown: [ 139, 69, 19, 1 ],
                    salmon: [ 250, 128, 114, 1 ],
                    sandybrown: [ 244, 164, 96, 1 ],
                    seagreen: [ 46, 139, 87, 1 ],
                    seashell: [ 255, 245, 238, 1 ],
                    sienna: [ 160, 82, 45, 1 ],
                    silver: [ 192, 192, 192, 1 ],
                    skyblue: [ 135, 206, 235, 1 ],
                    slateblue: [ 106, 90, 205, 1 ],
                    slategray: [ 112, 128, 144, 1 ],
                    slategrey: [ 112, 128, 144, 1 ],
                    snow: [ 255, 250, 250, 1 ],
                    springgreen: [ 0, 255, 127, 1 ],
                    steelblue: [ 70, 130, 180, 1 ],
                    tan: [ 210, 180, 140, 1 ],
                    teal: [ 0, 128, 128, 1 ],
                    thistle: [ 216, 191, 216, 1 ],
                    tomato: [ 255, 99, 71, 1 ],
                    transparent: [ 0, 0, 0, 0 ],
                    turquoise: [ 64, 224, 208, 1 ],
                    violet: [ 238, 130, 238, 1 ],
                    wheat: [ 245, 222, 179, 1 ],
                    white: [ 255, 255, 255, 1 ],
                    whitesmoke: [ 245, 245, 245, 1 ],
                    yellow: [ 255, 255, 0, 1 ],
                    yellowgreen: [ 154, 205, 50, 1 ]
                };
                t.colorType = (0, i.typeWithKeywords)([ "currentColor" ], {
                    inverse: function inverse(e) {
                        return this.subtract(e, [ 255, 255, 255, 1 ]);
                    },
                    zero: function zero() {
                        return [ 0, 0, 0, 0 ];
                    },
                    _premultiply: function _premultiply(e) {
                        var t = e[3];
                        return [ e[0] * t, e[1] * t, e[2] * t ];
                    },
                    add: function add(e, t) {
                        var n = Math.min(e[3] + t[3], 1);
                        return 0 === n ? [ 0, 0, 0, 0 ] : (e = this._premultiply(e), t = this._premultiply(t), 
                        [ (e[0] + t[0]) / n, (e[1] + t[1]) / n, (e[2] + t[2]) / n, n ]);
                    },
                    subtract: function subtract(e, t) {
                        var n = Math.min(e[3] + t[3], 1);
                        return 0 === n ? [ 0, 0, 0, 0 ] : (e = this._premultiply(e), t = this._premultiply(t), 
                        [ (e[0] - t[0]) / n, (e[1] - t[1]) / n, (e[2] - t[2]) / n, n ]);
                    },
                    interpolate: function interpolate(e, t, n) {
                        var r = (0, i.clamp)((0, i.interp)(e[3], t[3], n), 0, 1);
                        return 0 === r ? [ 0, 0, 0, 0 ] : (e = this._premultiply(e), t = this._premultiply(t), 
                        [ (0, i.interp)(e[0], t[0], n) / r, (0, i.interp)(e[1], t[1], n) / r, (0, i.interp)(e[2], t[2], n) / r, r ]);
                    },
                    output: function output(e) {
                        return "rgba(" + Math.round(e[0]) + ", " + Math.round(e[1]) + ", " + Math.round(e[2]) + ", " + e[3] + ")";
                    },
                    input: function input(e) {
                        var t = [], n = a.exec(e);
                        if (n) {
                            if (4 !== e.length && 7 !== e.length) return;
                            n.shift();
                            for (var s = 0; s < 3; s++) {
                                1 === n[s].length && (n[s] = n[s] + n[s]);
                                var c = Math.max(Math.min(parseInt(n[s], 16), 255), 0);
                                t[s] = c;
                            }
                            t.push(1);
                        }
                        var l = o.exec(e);
                        if (l) {
                            l.shift();
                            for (var p = l.shift().substr(0, 3), f = 0; f < 3; f++) {
                                var h = 1;
                                "%" === l[f][l[f].length - 1] && (l[f] = l[f].substr(0, l[f].length - 1), h = 2.55), 
                                "rgb" === p ? t[f] = (0, i.clamp)(Math.round(parseInt(l[f], 10) * h), 0, 255) : t[f] = parseInt(l[f], 10);
                            }
                            "hsl" === p && (t = r.apply(null, t)), "undefined" != typeof l[3] ? t[3] = Math.max(Math.min(parseFloat(l[3]), 1), 0) : t.push(1);
                        }
                        if (!t.some(isNaN)) return t.length > 0 ? t : u[e];
                    }
                });
            }, function(e, t, n) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.opacityType = t.integerType = t.numberType = void 0;
                var r = n(0), i = n(2), o = t.numberType = {
                    toString: function toString() {
                        return "numberType";
                    },
                    toJSON: function toJSON() {
                        return this.toString();
                    },
                    inverse: function inverse(e) {
                        if ("auto" === e) return i.nonNumericType.inverse(e);
                        var t = e * -1;
                        return t;
                    },
                    zero: function zero() {
                        return 0;
                    },
                    add: function add(e, t) {
                        if (Number(e) !== e && Number(t) !== t) return 0;
                        if (Number(e) !== e ? e = 0 : Number(t) !== t && (t = 0), "auto" === e || "auto" === t) return i.nonNumericType.add(e, t);
                        var n = e + t;
                        return n;
                    },
                    subtract: function subtract(e, t) {
                        return Number(e) !== e && Number(t) !== t ? 0 : (Number(e) !== e ? e = 0 : Number(t) !== t && (t = 0), 
                        this.add(e, this.inverse(t)));
                    },
                    interpolate: function interpolate(e, t, n) {
                        return "auto" === e || "auto" === t ? i.nonNumericType.interpolate(e, t) : (0, r.interp)(e, t, n);
                    },
                    output: function output(e) {
                        return e;
                    },
                    input: function input(e) {
                        if ("auto" === e) return "auto";
                        var t = Number(e);
                        return isNaN(t) ? void 0 : t;
                    }
                };
                t.integerType = (0, r.createObject)(o, {
                    interpolate: function interpolate(e, t, n) {
                        return "auto" === e || "auto" === t ? i.nonNumericType.interpolate(e, t) : Math.floor((0, 
                        r.interp)(e, t, n));
                    }
                }), t.opacityType = (0, r.createObject)(o, {
                    zero: function zero() {
                        return 0;
                    },
                    unspecified: function unspecified(e) {
                        return 1;
                    }
                });
            }, function(e, t, n) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.fontWeightType = void 0;
                var r = n(0);
                t.fontWeightType = {
                    toString: function toString() {
                        return "fontWeightType";
                    },
                    toJSON: function toJSON() {
                        return this.toString();
                    },
                    inverse: function inverse(e) {
                        return e * -1;
                    },
                    add: function add(e, t) {
                        return e + t;
                    },
                    subtract: function subtract(e, t) {
                        return this.add(e, this.inverse(t));
                    },
                    interpolate: function interpolate(e, t, n) {
                        return (0, r.interp)(e, t, n);
                    },
                    output: function output(e) {
                        return e = 100 * Math.round(e / 100), e = (0, r.clamp)(e, 100, 900), 400 === e ? "normal" : 700 === e ? "bold" : String(e);
                    },
                    input: function input(e) {
                        var t = Number(e);
                        if (!(isNaN(t) || t < 100 || t > 900 || t % 100 !== 0)) return t;
                    }
                };
            }, function(e, t, n) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.positionType = void 0;
                var r = n(0), i = n(1), o = /^\s*left|^\s*center|^\s*right|^\s*top|^\s*bottom/i, a = t.positionType = {
                    toString: function toString() {
                        return "positionType";
                    },
                    toJSON: function toJSON() {
                        return this.toString();
                    },
                    inverse: function inverse(e) {
                        return [ i.lengthType.inverse(e[0]), i.lengthType.add(e[1]) ];
                    },
                    zero: function zero() {
                        return [ {
                            px: 0
                        }, {
                            px: 0
                        } ];
                    },
                    add: function add(e, t) {
                        return [ i.lengthType.add(e[0], t[0]), i.lengthType.add(e[1], t[1]) ];
                    },
                    subtract: function subtract(e, t) {
                        return this.add(e, this.inverse(t));
                    },
                    interpolate: function interpolate(e, t, n) {
                        return [ i.lengthType.interpolate(e[0], t[0], n), i.lengthType.interpolate(e[1], t[1], n) ];
                    },
                    output: function output(e) {
                        return e.map(i.lengthType.output).join(" ");
                    },
                    input: function input(e) {
                        for (var t = [], n = e; ;) {
                            var o = a.consumeTokenFromString(n);
                            if (!o) return;
                            if (t.push(o.value), n = o.remaining, !o.remaining.trim()) break;
                            if (t.length >= 4) return;
                        }
                        if (1 === t.length) {
                            var u = t[0];
                            return (a.isHorizontalToken(u) ? [ u, "center" ] : [ "center", u ]).map(a.resolveToken);
                        }
                        if (2 === t.length && a.isHorizontalToken(t[0]) && a.isVerticalToken(t[1])) return t.map(a.resolveToken);
                        if (2 === t.filter(a.isKeyword).length) {
                            for (var s = [ void 0, void 0 ], c = !1, l = 0; l < t.length; l++) {
                                var p = t[l];
                                if (!a.isKeyword(p)) return;
                                if ("center" !== p) {
                                    var f = Number(a.isVerticalToken(p));
                                    if (s[f]) return;
                                    if (l === t.length - 1 || a.isKeyword(t[l + 1])) s[f] = a.resolveToken(p); else {
                                        var h = t[++l];
                                        "bottom" !== p && "right" !== p || (h = i.lengthType.inverse(h), h["%"] = (h["%"] || 0) + 100), 
                                        s[f] = h;
                                    }
                                } else {
                                    if (c) return;
                                    c = !0;
                                }
                            }
                            if (c) if (s[0]) {
                                if (s[1]) return;
                                s[1] = a.resolveToken("center");
                            } else s[0] = a.resolveToken("center");
                            return s.every(r.isDefinedAndNotNull) ? s : void 0;
                        }
                    },
                    consumeTokenFromString: function consumeTokenFromString(e) {
                        var t = o.exec(e);
                        return t ? {
                            value: t[0].trim().toLowerCase(),
                            remaining: e.substring(t[0].length)
                        } : i.lengthType.consumeValueFromString(e);
                    },
                    resolveToken: function resolveToken(e) {
                        return "string" == typeof e ? i.lengthType.input({
                            left: "0%",
                            center: "50%",
                            right: "100%",
                            top: "0%",
                            bottom: "100%"
                        }[e]) : e;
                    },
                    isHorizontalToken: function isHorizontalToken(e) {
                        return "string" != typeof e || e in {
                            left: !0,
                            center: !0,
                            right: !0
                        };
                    },
                    isVerticalToken: function isVerticalToken(e) {
                        return "string" != typeof e || e in {
                            top: !0,
                            center: !0,
                            bottom: !0
                        };
                    },
                    isKeyword: function isKeyword(e) {
                        return "string" == typeof e;
                    }
                };
            }, function(e, t, n) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.positionListType = void 0;
                var r = n(6), i = n(0);
                t.positionListType = {
                    toString: function toString() {
                        return "positionListType";
                    },
                    toJSON: function toJSON() {
                        return this.toString();
                    },
                    inverse: function inverse(e) {
                        for (var t = [], n = e.length, i = 0; i < n; i++) {
                            var o = e[i] ? e[i] : r.positionType.zero();
                            t.push(r.positionType.inverse(o));
                        }
                        return t;
                    },
                    zero: function zero() {
                        return [ r.positionType.zero() ];
                    },
                    add: function add(e, t) {
                        for (var n = [], i = Math.max(e.length, t.length), o = 0; o < i; o++) {
                            var a = e[o] ? e[o] : r.positionType.zero(), u = t[o] ? t[o] : r.positionType.zero();
                            n.push(r.positionType.add(a, u));
                        }
                        return n;
                    },
                    subtract: function subtract(e, t) {
                        return this.add(e, this.inverse(t));
                    },
                    interpolate: function interpolate(e, t, n) {
                        for (var i = [], o = Math.max(e.length, t.length), a = 0; a < o; a++) {
                            var u = e[a] ? e[a] : r.positionType.zero(), s = t[a] ? t[a] : r.positionType.zero();
                            i.push(r.positionType.interpolate(u, s, n));
                        }
                        return i;
                    },
                    output: function output(e) {
                        return e.map(r.positionType.output).join(", ");
                    },
                    input: function input(e) {
                        if ((0, i.isDefinedAndNotNull)(e)) {
                            if (!e.trim()) return [ r.positionType.input("0% 0%") ];
                            var t = e.split(","), n = t.map(r.positionType.input);
                            return n.every(i.isDefinedAndNotNull) ? n : void 0;
                        }
                    }
                };
            }, function(e, t, n) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.rectangleType = void 0;
                var r = n(1), i = /rect\(([^,]+),([^,]+),([^,]+),([^)]+)\)/;
                t.rectangleType = {
                    toString: function toString() {
                        return "rectangleType";
                    },
                    toJSON: function toJSON() {
                        return this.toString();
                    },
                    inverse: function inverse(e) {
                        return {
                            top: r.lengthType.inverse(e.top),
                            right: r.lengthType.inverse(e.right),
                            bottom: r.lengthType.inverse(e.bottom),
                            left: r.lengthType.inverse(e.left)
                        };
                    },
                    zero: function zero() {
                        return {
                            top: 0,
                            right: 0,
                            bottom: 0,
                            left: 0
                        };
                    },
                    add: function add(e, t) {
                        return {
                            top: r.lengthType.add(e.top, t.top),
                            right: r.lengthType.add(e.right, t.right),
                            bottom: r.lengthType.add(e.bottom, t.bottom),
                            left: r.lengthType.add(e.left, t.left)
                        };
                    },
                    subtract: function subtract(e, t) {
                        return this.add(e, this.inverse(t));
                    },
                    interpolate: function interpolate(e, t, n) {
                        return {
                            top: r.lengthType.interpolate(e.top, t.top, n),
                            right: r.lengthType.interpolate(e.right, t.right, n),
                            bottom: r.lengthType.interpolate(e.bottom, t.bottom, n),
                            left: r.lengthType.interpolate(e.left, t.left, n)
                        };
                    },
                    output: function output(e) {
                        return "rect(" + r.lengthType.output(e.top) + "," + r.lengthType.output(e.right) + "," + r.lengthType.output(e.bottom) + "," + r.lengthType.output(e.left) + ")";
                    },
                    input: function input(e) {
                        var t = i.exec(e);
                        if (t) {
                            var n = {
                                top: r.lengthType.input(t[1]),
                                right: r.lengthType.input(t[2]),
                                bottom: r.lengthType.input(t[3]),
                                left: r.lengthType.input(t[4])
                            };
                            return n.top && n.right && n.bottom && n.left ? n : void 0;
                        }
                    }
                };
            }, function(e, t, n) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.shadowType = void 0;
                var r = n(0), i = n(3), o = n(1), a = n(2), u = t.shadowType = {
                    toString: function toString() {
                        return "shadowType";
                    },
                    toJSON: function toJSON() {
                        return this.toString();
                    },
                    inverse: function inverse(e) {
                        return a.nonNumericType.inverse(e);
                    },
                    zero: function zero() {
                        return {
                            hOffset: o.lengthType.zero(),
                            vOffset: o.lengthType.zero()
                        };
                    },
                    _addSingle: function _addSingle(e, t) {
                        if (e && t && e.inset !== t.inset) return t;
                        var n = {
                            inset: e ? e.inset : t.inset,
                            hOffset: o.lengthType.add(e ? e.hOffset : o.lengthType.zero(), t ? t.hOffset : o.lengthType.zero()),
                            vOffset: o.lengthType.add(e ? e.vOffset : o.lengthType.zero(), t ? t.vOffset : o.lengthType.zero()),
                            blur: o.lengthType.add(e && e.blur || o.lengthType.zero(), t && t.blur || o.lengthType.zero())
                        };
                        return (e && e.spread || t && t.spread) && (n.spread = o.lengthType.add(e && e.spread || o.lengthType.zero(), t && t.spread || o.lengthType.zero())), 
                        (e && e.color || t && t.color) && (n.color = i.colorType.add(e && e.color || i.colorType.zero(), t && t.color || i.colorType.zero())), 
                        n;
                    },
                    add: function add(e, t) {
                        for (var n = [], r = 0; r < e.length || r < t.length; r++) {
                            n.push(this._addSingle(e[r], t[r]));
                        }
                        return n;
                    },
                    subtract: function subtract(e, t) {
                        return this.add(e, this.inverse(t));
                    },
                    _interpolateSingle: function _interpolateSingle(e, t, n) {
                        if (e && t && e.inset !== t.inset) return n < .5 ? e : t;
                        var r = {
                            inset: e ? e.inset : t.inset,
                            hOffset: o.lengthType.interpolate(e ? e.hOffset : o.lengthType.zero(), t ? t.hOffset : o.lengthType.zero(), n),
                            vOffset: o.lengthType.interpolate(e ? e.vOffset : o.lengthType.zero(), t ? t.vOffset : o.lengthType.zero(), n),
                            blur: o.lengthType.interpolate(e && e.blur || o.lengthType.zero(), t && t.blur || o.lengthType.zero(), n)
                        };
                        return (e && e.spread || t && t.spread) && (r.spread = o.lengthType.interpolate(e && e.spread || o.lengthType.zero(), t && t.spread || o.lengthType.zero(), n)), 
                        (e && e.color || t && t.color) && (r.color = i.colorType.interpolate(e && e.color || i.colorType.zero(), t && t.color || i.colorType.zero(), n)), 
                        r;
                    },
                    interpolate: function interpolate(e, t, n) {
                        for (var r = [], i = 0; i < e.length || i < t.length; i++) {
                            r.push(this._interpolateSingle(e[i], t[i], n));
                        }
                        return r;
                    },
                    _outputSingle: function _outputSingle(e) {
                        return (e.inset ? "inset " : "") + o.lengthType.output(e.hOffset) + " " + o.lengthType.output(e.vOffset) + " " + o.lengthType.output(e.blur) + (e.spread ? " " + o.lengthType.output(e.spread) : "") + (e.color ? " " + i.colorType.output(e.color) : "");
                    },
                    output: function output(e) {
                        return e.map(this._outputSingle).join(", ");
                    },
                    input: function input(e) {
                        for (var t, n = /(([^(,]+(\([^)]*\))?)+)/g, a = []; null !== (t = n.exec(e)); ) {
                            a.push(t[0]);
                        }
                        var s = a.map(function(e) {
                            if ("none" === e) return u.zero();
                            e = e.replace(/^\s+|\s+$/g, "");
                            for (var n = /([^ (]+(\([^)]*\))?)/g, r = []; null !== (t = n.exec(e)); ) {
                                r.push(t[0]);
                            }
                            if (!(r.length < 2 || r.length > 7)) {
                                for (var a = {
                                    inset: !1
                                }, s = []; r.length; ) {
                                    var c = r.shift(), l = o.lengthType.input(c);
                                    if (l) s.push(l); else {
                                        var p = i.colorType.input(c);
                                        p && (a.color = p), "inset" === c && (a.inset = !0);
                                    }
                                }
                                if (!(s.length < 2 || s.length > 4)) return a.hOffset = s[0], a.vOffset = s[1], 
                                s.length > 2 && (a.blur = s[2]), s.length > 3 && (a.spread = s[3]), a;
                            }
                        });
                        return s.every(r.isDefined) ? s : void 0;
                    }
                };
            }, function(e, t, n) {
                "use strict";
                function r(e) {
                    return "(" + e + ")";
                }
                function i(e) {
                    return "(?:" + e + ")?";
                }
                function o(e, t, n) {
                    for (var r = [ M, x, e, N ], o = 0; o < t - 1; o++) {
                        r.push(F), r.push(S);
                    }
                    return r.push(F), n && r.push(i([ S, F ].join(""))), r.push(P), new RegExp(r.join(""));
                }
                function a(e, t, n, r, i) {
                    var a = e;
                    i && ("X" === e[e.length - 1] || "Y" === e[e.length - 1] ? a = e.substring(0, e.length - 1) : "Z" === e[e.length - 1] && (a = e.substring(0, e.length - 1) + "3d"));
                    var u = function u(o) {
                        var a = w(o, t, n, r);
                        if (void 0 !== i) if ("X" === e[e.length - 1]) a.push(i); else if ("Y" === e[e.length - 1]) a = [ i ].concat(a); else if ("Z" === e[e.length - 1]) a = [ i, i ].concat(a); else if (n) for (;a.length < 2; ) {
                            "copy" === i ? a.push(a[0]) : a.push(i);
                        }
                        return a;
                    };
                    return [ o(e, t, n), u, a ];
                }
                function u(e, t, n, r) {
                    var i = a(e, t, n, !0, r), o = function o(e) {
                        var t = i[1](e);
                        return t.map(function(e) {
                            var t = 0;
                            for (var n in e) {
                                t += b(e[n], n);
                            }
                            return t;
                        });
                    };
                    return [ i[0], o, i[2] ];
                }
                function s() {
                    var e = a("rotate3d", 4, !1, !0), t = function t(_t) {
                        for (var n = e[1](_t), r = [], i = 0; i < 3; i++) {
                            r.push(n[i].px);
                        }
                        return r.push(n[3]), r;
                    };
                    return [ e[0], t, e[2] ];
                }
                function c(e, t) {
                    for (var n = 0, r = 0; r < e.length; r++) {
                        n += e[r] * t[r];
                    }
                    return n;
                }
                function l(e, t) {
                    return [ e[0] * t[0] + e[2] * t[1], e[1] * t[0] + e[3] * t[1], e[0] * t[2] + e[2] * t[3], e[1] * t[2] + e[3] * t[3], e[0] * t[4] + e[2] * t[5] + e[4], e[1] * t[4] + e[3] * t[5] + e[5] ];
                }
                function p(e) {
                    switch (e.t) {
                      case "rotate":
                        var t = e.d * Math.PI / 180;
                        return [ Math.cos(t), Math.sin(t), -Math.sin(t), Math.cos(t), 0, 0 ];

                      case "scale":
                        return [ e.d[0], 0, 0, e.d[1], 0, 0 ];

                      case "translate":
                        return [ 1, 0, 0, 1, e.d[0].px, e.d[1].px ];

                      case "translate3d":
                        return [ 1, 0, 0, 1, e.d[0].px, e.d[1].px ];

                      case "matrix":
                        return e.d;

                      default:
                        throw new Error("HyperStyle convertItemToMatrix unimplemented type:%s;", e.t);
                    }
                }
                function f(e) {
                    return e.map(p).reduce(l);
                }
                function h(e, t, n) {
                    var r = E(f(e)), i = E(f(t)), o = c(r.quaternion, i.quaternion);
                    o = (0, g.clamp)(o, -1, 1);
                    var a = [];
                    if (1 === o) a = r.quaternion; else for (var u = Math.acos(o), s = 1 * Math.sin(n * u) / Math.sqrt(1 - o * o), l = 0; l < 4; l++) {
                        a.push(r.quaternion[l] * (Math.cos(n * u) - o * s) + i.quaternion[l] * s);
                    }
                    var p = (0, g.interp)(r.translate, i.translate, n), h = (0, g.interp)(r.scale, i.scale, n), d = (0, 
                    g.interp)(r.skew, i.skew, n), y = (0, g.interp)(r.perspective, i.perspective, n);
                    return H(p, h, d, a, y);
                }
                function d(e, t, n) {
                    var r = e.t ? e.t : t.t;
                    switch (r) {
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
                        return {
                            t: r,
                            d: (0, g.interp)(e.d, t.d, n, r)
                        };

                      default:
                        var i = [], o = 0;
                        e.d && t.d ? o = Math.max(e.d.length, t.d.length) : e.d ? o = e.d.length : t.d && (o = t.d.length);
                        for (var a = 0; a < o; a++) {
                            var u = e.d ? e.d[a] : {}, s = t.d ? t.d[a] : {};
                            i.push(m.lengthType.interpolate(u, s, n));
                        }
                        return {
                            t: r,
                            d: i
                        };
                    }
                }
                function y(e) {
                    return Number(e).toFixed(4);
                }
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.transformType = void 0;
                var g = n(0), m = n(1), v = n(4), b = function b(e, t) {
                    switch (t) {
                      case "grad":
                        return e / 400 * 360;

                      case "rad":
                        return e / 2 / Math.PI * 360;

                      case "turn":
                        return 360 * e;

                      default:
                        return e;
                    }
                }, T = function T(e, t, n) {
                    var r = Number(e[t]);
                    if (!n) return r;
                    var i = e[t + 1];
                    "" === i && (i = "px");
                    var o = {};
                    return o[i] = r, o;
                }, w = function w(e, t, n, r) {
                    for (var i = [], o = 0; o < t; o++) {
                        i.push(T(e, 1 + 2 * o, r));
                    }
                    return n && e[1 + 2 * t] && i.push(T(e, 1 + 2 * t, r)), i;
                }, x = "\\s*", k = "[+-]?(?:\\d+|\\d*\\.\\d+)", O = "\\(", A = "\\)", j = ",", z = "[a-zA-Z%]*", M = "^", N = [ x, O, x ].join(""), P = [ x, A, x ].join(""), S = [ x, j, x ].join(""), F = [ r(k), r(z) ].join(""), _ = [ u("rotate", 1, !1), u("rotateX", 1, !1), u("rotateY", 1, !1), u("rotateZ", 1, !1), s(), u("skew", 1, !0, 0), u("skewX", 1, !1), u("skewY", 1, !1), a("translateX", 1, !1, !0, {
                    px: 0
                }), a("translateY", 1, !1, !0, {
                    px: 0
                }), a("translateZ", 1, !1, !0, {
                    px: 0
                }), a("translate", 1, !0, !0, {
                    px: 0
                }), a("translate3d", 3, !1, !0), a("scale", 1, !0, !1, "copy"), a("scaleX", 1, !1, !1, 1), a("scaleY", 1, !1, !1, 1), a("scaleZ", 1, !1, !1, 1), a("scale3d", 3, !1, !1), a("perspective", 1, !1, !0), a("matrix", 6, !1, !1) ], E = function() {
                    function e(e) {
                        return e[0][0] * e[1][1] * e[2][2] + e[1][0] * e[2][1] * e[0][2] + e[2][0] * e[0][1] * e[1][2] - e[0][2] * e[1][1] * e[2][0] - e[1][2] * e[2][1] * e[0][0] - e[2][2] * e[0][1] * e[1][0];
                    }
                    function t(t) {
                        for (var n = 1 / e(t), r = t[0][0], i = t[0][1], o = t[0][2], a = t[1][0], u = t[1][1], s = t[1][2], c = t[2][0], l = t[2][1], p = t[2][2], f = [ [ (u * p - s * l) * n, (o * l - i * p) * n, (i * s - o * u) * n, 0 ], [ (s * c - a * p) * n, (r * p - o * c) * n, (o * a - r * s) * n, 0 ], [ (a * l - u * c) * n, (c * i - r * l) * n, (r * u - i * a) * n, 0 ] ], h = [], d = 0; d < 3; d++) {
                            for (var y = 0, g = 0; g < 3; g++) {
                                y += t[3][g] * f[g][d];
                            }
                            h.push(y);
                        }
                        return h.push(1), f.push(h), f;
                    }
                    function n(e) {
                        return [ [ e[0][0], e[1][0], e[2][0], e[3][0] ], [ e[0][1], e[1][1], e[2][1], e[3][1] ], [ e[0][2], e[1][2], e[2][2], e[3][2] ], [ e[0][3], e[1][3], e[2][3], e[3][3] ] ];
                    }
                    function r(e, t) {
                        for (var n = [], r = 0; r < 4; r++) {
                            for (var i = 0, o = 0; o < 4; o++) {
                                i += e[o] * t[o][r];
                            }
                            n.push(i);
                        }
                        return n;
                    }
                    function i(e) {
                        var t = o(e);
                        return [ e[0] / t, e[1] / t, e[2] / t ];
                    }
                    function o(e) {
                        return Math.sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2]);
                    }
                    function a(e, t, n, r) {
                        return [ n * e[0] + r * t[0], n * e[1] + r * t[1], n * e[2] + r * t[2] ];
                    }
                    function u(e, t) {
                        return [ e[1] * t[2] - e[2] * t[1], e[2] * t[0] - e[0] * t[2], e[0] * t[1] - e[1] * t[0] ];
                    }
                    function s(s) {
                        var l = [ [ s[0], s[1], 0, 0 ], [ s[2], s[3], 0, 0 ], [ 0, 0, 1, 0 ], [ s[4], s[5], 0, 1 ] ];
                        if (1 !== l[3][3]) throw "attempt to decompose non-normalized matrix";
                        for (var p = l.concat(), f = 0; f < 3; f++) {
                            p[f][3] = 0;
                        }
                        if (0 === e(p)) return !1;
                        var h, d = [];
                        if (0 !== l[0][3] || 0 !== l[1][3] || 0 !== l[2][3]) {
                            d.push(l[0][3]), d.push(l[1][3]), d.push(l[2][3]), d.push(l[3][3]);
                            var y = t(p), g = n(y);
                            h = r(d, g);
                        } else h = [ 0, 0, 0, 1 ];
                        var m = l[3].slice(0, 3), v = [];
                        v.push(l[0].slice(0, 3));
                        var b = [];
                        b.push(o(v[0])), v[0] = i(v[0]);
                        var T = [];
                        v.push(l[1].slice(0, 3)), T.push(c(v[0], v[1])), v[1] = a(v[1], v[0], 1, -T[0]), 
                        b.push(o(v[1])), v[1] = i(v[1]), T[0] /= b[1], v.push(l[2].slice(0, 3)), T.push(c(v[0], v[2])), 
                        v[2] = a(v[2], v[0], 1, -T[1]), T.push(c(v[1], v[2])), v[2] = a(v[2], v[1], 1, -T[2]), 
                        b.push(o(v[2])), v[2] = i(v[2]), T[1] /= b[2], T[2] /= b[2];
                        var w = u(v[1], v[2]);
                        if (c(v[0], w) < 0) for (var x = 0; x < 3; x++) {
                            b[x] *= -1, v[x][0] *= -1, v[x][1] *= -1, v[x][2] *= -1;
                        }
                        var k, O, A = v[0][0] + v[1][1] + v[2][2] + 1;
                        return A > 1e-4 ? (k = .5 / Math.sqrt(A), O = [ (v[2][1] - v[1][2]) * k, (v[0][2] - v[2][0]) * k, (v[1][0] - v[0][1]) * k, .25 / k ]) : v[0][0] > v[1][1] && v[0][0] > v[2][2] ? (k = 2 * Math.sqrt(1 + v[0][0] - v[1][1] - v[2][2]), 
                        O = [ .25 * k, (v[0][1] + v[1][0]) / k, (v[0][2] + v[2][0]) / k, (v[2][1] - v[1][2]) / k ]) : v[1][1] > v[2][2] ? (k = 2 * Math.sqrt(1 + v[1][1] - v[0][0] - v[2][2]), 
                        O = [ (v[0][1] + v[1][0]) / k, .25 * k, (v[1][2] + v[2][1]) / k, (v[0][2] - v[2][0]) / k ]) : (k = 2 * Math.sqrt(1 + v[2][2] - v[0][0] - v[1][1]), 
                        O = [ (v[0][2] + v[2][0]) / k, (v[1][2] + v[2][1]) / k, .25 * k, (v[1][0] - v[0][1]) / k ]), 
                        {
                            translate: m,
                            scale: b,
                            skew: T,
                            quaternion: O,
                            perspective: h
                        };
                    }
                    return s;
                }(), H = function() {
                    function e(e, t) {
                        for (var n = [ [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ], [ 0, 0, 0, 0 ] ], r = 0; r < 4; r++) {
                            for (var i = 0; i < 4; i++) {
                                for (var o = 0; o < 4; o++) {
                                    n[r][i] += t[r][o] * e[o][i];
                                }
                            }
                        }
                        return n;
                    }
                    function t(t, n, r, i, o) {
                        for (var a = [ [ 1, 0, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 0, 1 ] ], u = 0; u < 4; u++) {
                            a[u][3] = o[u];
                        }
                        for (var s = 0; s < 3; s++) {
                            for (var c = 0; c < 3; c++) {
                                a[3][s] += t[c] * a[c][s];
                            }
                        }
                        var l = i[0], p = i[1], f = i[2], h = i[3], d = [ [ 1, 0, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 0, 1 ] ];
                        d[0][0] = 1 - 2 * (p * p + f * f), d[0][1] = 2 * (l * p - f * h), d[0][2] = 2 * (l * f + p * h), 
                        d[1][0] = 2 * (l * p + f * h), d[1][1] = 1 - 2 * (l * l + f * f), d[1][2] = 2 * (p * f - l * h), 
                        d[2][0] = 2 * (l * f - p * h), d[2][1] = 2 * (p * f + l * h), d[2][2] = 1 - 2 * (l * l + p * p), 
                        a = e(a, d);
                        var y = [ [ 1, 0, 0, 0 ], [ 0, 1, 0, 0 ], [ 0, 0, 1, 0 ], [ 0, 0, 0, 1 ] ];
                        r[2] && (y[2][1] = r[2], a = e(a, y)), r[1] && (y[2][1] = 0, y[2][0] = r[0], a = e(a, y));
                        for (var g = 0; g < 3; g++) {
                            for (var m = 0; m < 3; m++) {
                                a[g][m] *= n[g];
                            }
                        }
                        return {
                            t: "matrix",
                            d: [ a[0][0], a[0][1], a[1][0], a[1][1], a[3][0], a[3][1] ]
                        };
                    }
                    return t;
                }();
                t.transformType = {
                    toString: function toString() {
                        return "transformType";
                    },
                    toJSON: function toJSON() {
                        return this.toString();
                    },
                    inverse: function inverse(e) {
                        e && e.length || (e = this.zero());
                        for (var t = this.zero(e), n = [], r = 0; r < e.length; r++) {
                            switch (e[r].t) {
                              case "rotate":
                              case "rotateX":
                              case "rotateY":
                              case "rotateZ":
                              case "skewX":
                              case "skewY":
                                n.push({
                                    t: e[r].t,
                                    d: [ v.numberType.inverse(e[r].d[0]) ]
                                });
                                break;

                              case "skew":
                                n.push({
                                    t: e[r].t,
                                    d: [ v.numberType.inverse(e[r].d[0]), v.numberType.inverse(e[r].d[1]) ]
                                });
                                break;

                              case "translateX":
                              case "translateY":
                              case "translateZ":
                              case "perspective":
                                n.push({
                                    t: e[r].t,
                                    d: [ v.numberType.inverse(e[r].d[0]) ]
                                });
                                break;

                              case "translate":
                                n.push({
                                    t: e[r].t,
                                    d: [ {
                                        px: v.numberType.inverse(e[r].d[0].px)
                                    }, {
                                        px: v.numberType.inverse(e[r].d[1].px)
                                    } ]
                                });
                                break;

                              case "translate3d":
                                n.push({
                                    t: e[r].t,
                                    d: [ {
                                        px: v.numberType.inverse(e[r].d[0].px)
                                    }, {
                                        px: v.numberType.inverse(e[r].d[1].px)
                                    }, {
                                        px: v.numberType.inverse(e[r].d[2].px)
                                    } ]
                                });
                                break;

                              case "scale":
                                n.push({
                                    t: e[r].t,
                                    d: [ t[r].d[0] / e[r].d[0], t[r].d[1] / e[r].d[1] ]
                                });
                                break;

                              case "scaleX":
                              case "scaleY":
                              case "scaleZ":
                                n.push({
                                    t: e[r].t,
                                    d: [ t[r].d[0] / e[r].d[0] ]
                                });
                                break;

                              case "scale3d":
                                n.push({
                                    t: e[r].t,
                                    d: [ t[r].d[0] / e[r].d[0], t[r].d[1] / e[r].d[1], -1 / e[r].d[2] ]
                                });
                                break;

                              case "matrix":
                                n.push({
                                    t: e[r].t,
                                    d: [ v.numberType.inverse(e[r].d[0]), v.numberType.inverse(e[r].d[1]), v.numberType.inverse(e[r].d[2]), v.numberType.inverse(e[r].d[3]), v.numberType.inverse(e[r].d[4]), v.numberType.inverse(e[r].d[5]) ]
                                });
                            }
                        }
                        return n;
                    },
                    add: function add(e, t) {
                        if (!e || !e.length) return t;
                        if (!t || !t.length) return e;
                        var n = e.length, r = t.length;
                        if (n && r && n >= r) {
                            for (var i = n - r, o = !0, a = 0, u = i; u < n; u++) {
                                if (e[u].t !== t[a].t) {
                                    o = !1;
                                    break;
                                }
                                a++;
                            }
                            if (o) return this.sum(e, t);
                        }
                        return e.concat(t);
                    },
                    sum: function sum(e, t) {
                        for (var n = [], r = e.length, i = t.length, o = r - i, a = 0, u = 0; u < r; u++) {
                            if (u < o) n.push(e[u]); else {
                                switch (e[u].t) {
                                  case "rotate":
                                  case "rotateX":
                                  case "rotateY":
                                  case "rotateZ":
                                  case "skewX":
                                  case "skewY":
                                    n.push({
                                        t: e[u].t,
                                        d: [ v.numberType.add(e[u].d[0], t[a].d[0]) ]
                                    });
                                    break;

                                  case "skew":
                                    n.push({
                                        t: e[u].t,
                                        d: [ v.numberType.add(e[u].d[0], t[a].d[0]), v.numberType.add(e[u].d[1], t[a].d[1]) ]
                                    });
                                    break;

                                  case "translateX":
                                  case "translateY":
                                  case "translateZ":
                                  case "perspective":
                                    n.push({
                                        t: e[u].t,
                                        d: [ v.numberType.add(e[u].d[0], t[a].d[0]) ]
                                    });
                                    break;

                                  case "translate":
                                    n.push({
                                        t: e[u].t,
                                        d: [ {
                                            px: v.numberType.add(e[u].d[0].px, t[a].d[0].px)
                                        }, {
                                            px: v.numberType.add(e[u].d[1].px, t[a].d[1].px)
                                        } ]
                                    });
                                    break;

                                  case "translate3d":
                                    n.push({
                                        t: e[u].t,
                                        d: [ {
                                            px: v.numberType.add(e[u].d[0].px, t[a].d[0].px)
                                        }, {
                                            px: v.numberType.add(e[u].d[1].px, t[a].d[1].px)
                                        }, {
                                            px: v.numberType.add(e[u].d[2].px, t[a].d[2].px)
                                        } ]
                                    });
                                    break;

                                  case "scale":
                                    n.push({
                                        t: e[u].t,
                                        d: [ e[u].d[0] * t[a].d[0], e[u].d[1] * t[a].d[1] ]
                                    });
                                    break;

                                  case "scaleX":
                                  case "scaleY":
                                  case "scaleZ":
                                    n.push({
                                        t: e[u].t,
                                        d: [ e[u].d[0] * t[a].d[0] ]
                                    });
                                    break;

                                  case "scale3d":
                                    n.push({
                                        t: e[u].t,
                                        d: [ e[u].d[0] * t[a].d[0], e[u].d[1] * t[a].d[1], e[u].d[2] * t[a].d[2] ]
                                    });
                                    break;

                                  case "matrix":
                                    n.push({
                                        t: e[u].t,
                                        d: [ v.numberType.add(e[u].d[0], t[a].d[0]), v.numberType.add(e[u].d[1], t[a].d[1]), v.numberType.add(e[u].d[2], t[a].d[2]), v.numberType.add(e[u].d[3], t[a].d[3]), v.numberType.add(e[u].d[4], t[a].d[4]), v.numberType.add(e[u].d[5], t[a].d[5]) ]
                                    });
                                    break;

                                  case "matrix3d":                                }
                                a++;
                            }
                        }
                        return n;
                    },
                    zero: function zero(e) {
                        var t = [ 1, 0, 0, 1, 0, 0 ];
                        if (!e) return [ {
                            t: "matrix",
                            d: t
                        } ];
                        for (var n = [], r = 0; r < e.length; r++) {
                            switch (e[r].t) {
                              case "rotate":
                              case "rotateX":
                              case "rotateY":
                              case "rotateZ":
                              case "skewX":
                              case "skewY":
                                n.push({
                                    t: e[r].t,
                                    d: [ 0 ]
                                });
                                break;

                              case "skew":
                                n.push({
                                    t: e[r].t,
                                    d: [ 0, 0 ]
                                });
                                break;

                              case "translateX":
                              case "translateY":
                              case "translateZ":
                              case "perspective":
                                n.push({
                                    t: e[r].t,
                                    d: [ 0 ]
                                });
                                break;

                              case "translate":
                                n.push({
                                    t: e[r].t,
                                    d: [ {
                                        px: 0
                                    }, {
                                        px: 0
                                    } ]
                                });
                                break;

                              case "translate3d":
                                n.push({
                                    t: e[r].t,
                                    d: [ {
                                        px: 0
                                    }, {
                                        px: 0
                                    }, {
                                        px: 0
                                    } ]
                                });
                                break;

                              case "scale":
                                n.push({
                                    t: e[r].t,
                                    d: [ 1, 1 ]
                                });
                                break;

                              case "scaleX":
                              case "scaleY":
                              case "scaleZ":
                                n.push({
                                    t: e[r].t,
                                    d: [ 1 ]
                                });
                                break;

                              case "scale3d":
                                n.push({
                                    t: e[r].t,
                                    d: [ 1, 1, 1 ]
                                });
                                break;

                              case "matrix":
                                n.push({
                                    t: e[r].t,
                                    d: t
                                });
                            }
                        }
                        return n;
                    },
                    subtract: function subtract(e, t) {
                        var n = this.inverse(t), r = this.add(e, n);
                        return r;
                    },
                    interpolate: function interpolate(e, t, n) {
                        var r, i = [];
                        for (r = 0; r < Math.min(e.length, t.length) && e[r].t === t[r].t; r++) {
                            i.push(d(e[r], t[r], n));
                        }
                        if (r < Math.min(e.length, t.length)) return i.push(h(e.slice(r), t.slice(r), n)), 
                        i;
                        for (;r < e.length; r++) {
                            i.push(d(e[r], {
                                t: null,
                                d: null
                            }, n));
                        }
                        for (;r < t.length; r++) {
                            i.push(d({
                                t: null,
                                d: null
                            }, t[r], n));
                        }
                        return i;
                    },
                    output: function output(e, t) {
                        if (null === e || "undefined" == typeof e) return "";
                        if ("string" == typeof e) return e;
                        for (var n, r = "", i = 0; i < e.length; i++) {
                            switch (e[i].t) {
                              case "rotate":
                              case "rotateX":
                              case "rotateY":
                              case "rotateZ":
                              case "skewX":
                              case "skewY":
                                n = t ? "" : "deg", r += e[i].t + "(" + e[i].d[0] + n + ") ";
                                break;

                              case "skew":
                                n = t ? "" : "deg", r += e[i].t + "(" + e[i].d[0] + n, r += 0 === e[i].d[1] ? ") " : ", " + e[i].d[1] + n + ") ";
                                break;

                              case "translateX":
                              case "translateY":
                              case "translateZ":
                              case "perspective":
                                r += e[i].t + "(" + m.lengthType.output(e[i].d[0]) + ") ";
                                break;

                              case "translate":
                                if (t) {
                                    r += void 0 === e[i].d[1] ? e[i].t + "(" + e[i].d[0].px + ") " : e[i].t + "(" + e[i].d[0].px + ", " + e[i].d[1].px + ") ";
                                    break;
                                }
                                r += void 0 === e[i].d[1] ? e[i].t + "(" + m.lengthType.output(e[i].d[0]) + ") " : e[i].t + "(" + m.lengthType.output(e[i].d[0]) + ", " + m.lengthType.output(e[i].d[1]) + ") ";
                                break;

                              case "translate3d":
                                var o = e[i].d.map(m.lengthType.output);
                                r += e[i].t + "(" + o[0] + ", " + o[1] + ", " + o[2] + ") ";
                                break;

                              case "scale":
                                r += e[i].d[0] === e[i].d[1] ? e[i].t + "(" + e[i].d[0] + ") " : e[i].t + "(" + e[i].d[0] + ", " + e[i].d[1] + ") ";
                                break;

                              case "scaleX":
                              case "scaleY":
                              case "scaleZ":
                                r += e[i].t + "(" + e[i].d[0] + ") ";
                                break;

                              case "scale3d":
                                r += e[i].t + "(" + e[i].d[0] + ", " + e[i].d[1] + ", " + e[i].d[2] + ") ";
                                break;

                              case "matrix":
                                r += e[i].t + "(" + y(e[i].d[0]) + ", " + y(e[i].d[1]) + ", " + y(e[i].d[2]) + ", " + y(e[i].d[3]) + ", " + y(e[i].d[4]) + ", " + y(e[i].d[5]) + ") ";
                            }
                        }
                        var a = r.substring(0, r.length - 1);
                        return a;
                    },
                    input: function input(e) {
                        for (var t = []; "string" == typeof e && e.length > 0; ) {
                            for (var n, r = 0; r < _.length; r++) {
                                var i = _[r];
                                if (n = i[0].exec(e)) {
                                    t.push({
                                        t: i[2],
                                        d: i[1](n)
                                    }), e = e.substring(n[0].length);
                                    break;
                                }
                            }
                            if (!(0, g.isDefinedAndNotNull)(n)) return t;
                        }
                        return t;
                    }
                };
            }, function(e, t, n) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.visibilityType = void 0;
                var r = n(0), i = n(2);
                t.visibilityType = (0, r.createObject)(i.nonNumericType, {
                    toString: function toString() {
                        return "visibilityType";
                    },
                    toJSON: function toJSON() {
                        return this.toString();
                    },
                    zero: function zero() {
                        return "hidden";
                    },
                    unspecified: function unspecified() {
                        return "visible";
                    },
                    add: function add(e, t) {
                        return "visible" !== e && "visible" !== t ? i.nonNumericType.add(e, t) : "visible";
                    },
                    subtract: function subtract(e, t) {
                        return "visible" === t && "visible" === e ? "hidden" : e;
                    },
                    interpolate: function interpolate(e, t, n) {
                        return "visible" !== e && "visible" !== t ? i.nonNumericType.interpolate(e, t, n) : n <= 0 ? e : n >= 1 ? t : "visible";
                    },
                    input: function input(e) {
                        if ([ "visible", "hidden", "collapse" ].indexOf(e) !== -1) return e;
                    }
                });
            }, function(e, t, n) {
                "use strict";
                function r(e) {
                    return e && "[object Function]" === {}.toString.call(e);
                }
                function i(e, t) {
                    if (e instanceof y.HyperAnimation) {
                        if (t.typeForProperty && e.property) {
                            var n = t.typeForProperty.call(t, e.property, e.to);
                            n && (e.type = n);
                        }
                    } else if (e instanceof y.HyperGroup) e.group.forEach(function(e) {
                        i(e, t);
                    }); else {
                        if (!(e instanceof y.HyperChain)) throw new Error("not an animation");
                        e.chain.forEach(function(e) {
                            i(e, t);
                        });
                    }
                }
                function o(e, t, n) {
                    return r(t) ? t.call(n, e) : e;
                }
                function a(e, t, n, i) {
                    return r(n) ? n.call(i, t, e) : e;
                }
                function u(e, t, n, i) {
                    if (t && r(n)) {
                        if (null === e || "undefined" == typeof e) throw new Error("convert property undefined");
                        var o = t[e];
                        null !== o && "undefined" != typeof o && (t[e] = n.call(i, e, o));
                    }
                }
                function s(e, t, n, r) {
                    e.forEach(function(e) {
                        if (null === e || "undefined" == typeof e) throw new Error("convert properties undefined");
                        u(e, t, n, r);
                    });
                }
                function c(e, t, n, i) {
                    t && r(n) && (t instanceof y.HyperAnimation ? e.forEach(function(e) {
                        var r = t[e];
                        t.property && null !== r && "undefined" != typeof r && (t[e] = n.call(i, t.property, r));
                    }) : t instanceof y.HyperGroup ? t.group.forEach(function(t) {
                        c(e, t, n, i);
                    }) : t instanceof y.HyperChain && t.chain.forEach(function(t) {
                        c(e, t, n, i);
                    }));
                }
                function l(e, t, n, r) {
                    if (!t || !t.length) return !1;
                    r && t.sort(function(e, t) {
                        var n = e.index || 0, r = t.index || 0, i = n - r;
                        return i || (i = e.startTime - t.startTime), i || (i = e.sortIndex - t.sortIndex), 
                        i;
                    });
                    var i = !1;
                    return t.forEach(function(t) {
                        i = t.composite(e, n) || i;
                    }), i;
                }
                function p(e, t, n, i, o, a, u) {
                    var s = void 0;
                    r(o.animationForKey) && (s = o.animationForKey.call(o, e, t, n, i));
                    var c = (0, y.animationFromDescription)(s);
                    return c || (c = (0, y.animationFromDescription)(a)), c && c instanceof y.HyperAnimation && (null !== c.property && "undefined" != typeof c.property || (c.property = e), 
                    null !== c.from && "undefined" != typeof c.from || ("absolute" === c.blend ? c.from = i : c.from = n), 
                    null !== c.to && "undefined" != typeof c.to || (c.to = t), null !== c.easing && "undefined" != typeof c.easing || (c.easing = u.easing), 
                    null !== c.duration && "undefined" != typeof c.duration || (c.duration = u.duration), 
                    c.duration || (c.duration = 0)), c;
                }
                function f(e, t, n) {
                    return h(e, t, n);
                }
                function h(e, t, n) {
                    function u(e) {
                        g && (e = o(e, t.keyOutput, t));
                        var n = a(R[e], e, t.output, t);
                        return n;
                    }
                    function f(e, t) {
                        var n = {};
                        n[t] = e, h(n);
                    }
                    function h(n) {
                        var r = w.currentTransaction(), i = e.presentation, u = {};
                        Object.keys(n).forEach(function(r) {
                            var i = r, s = n[r];
                            g && (i = o(r, t.keyInput, t)), e.registerAnimatableProperty(i);
                            var c = a(s, r, t.input, t), l = E[i];
                            H[i] = l, E[i] = c, u[r] = s;
                        }), r.disableAnimation || Object.keys(u).forEach(function(n) {
                            var s = n;
                            g && (s = o(n, t.keyInput, t));
                            var c = u[n], l = i[n], f = a(H[s], n, t.output, t), h = p(n, c, f, l, t, F[n], r);
                            h ? e.addAnimation(h) : e.needsDisplay();
                        });
                    }
                    function d() {
                        X = -1;
                    }
                    function x() {
                        var n = function n() {};
                        r(t.display) && (n = function n() {
                            R = e.presentation, t.display.call(t), R = E;
                        }), w.registerTarget(e, n, d, A);
                    }
                    function k(e, t) {
                        if (t > -1) {
                            N.splice(t, 1);
                            var n = P[t];
                            P.splice(t, 1), delete S[n];
                        }
                    }
                    function O(e, t, n) {
                        if (e instanceof y.HyperGroup) e.group.forEach(function(e) {
                            O(e, -1, n);
                        }); else if (e instanceof y.HyperChain) e.chain.forEach(function(e) {
                            O(e, -1, n);
                        }); else if (!(e instanceof y.HyperAnimation)) throw new Error("not an animation");
                        e.finished && (k(e, t), r(e.onend) && n.push(e));
                    }
                    function A() {
                        for (var t = N.length, n = []; t--; ) {
                            var r = N[t];
                            O(r, t, n);
                        }
                        m || N.length || w.deregisterTarget(e), n.forEach(function(e) {
                            e.onend.call(e, !0), e.onend = null;
                        });
                    }
                    function j(t) {
                        var n = N.indexOf(t);
                        if (n > -1) {
                            N.splice(n, 1);
                            var i = P[n];
                            P.splice(n, 1), delete S[i], r(t.onend) && t.onend.call(t, !1);
                        }
                        m || N.length || w.deregisterTarget(e);
                    }
                    function z(r) {
                        return (n !== e || b.indexOf(r) < 0 && T.indexOf(r) < 0) && (n !== t || v.indexOf(r) < 0);
                    }
                    function M() {
                        return Object.keys(n).filter(z).reduce(function(e, t) {
                            return e[t] = n[t], e;
                        }, {});
                    }
                    if (!e) throw new Error("Nothing to hyperactivate.");
                    if (e.registerAnimatableProperty || e.addAnimation) throw new Error("Already hyperactive");
                    t || (t = e), n || (n = e);
                    var N = [], P = [], S = {}, F = {}, _ = !1, E = {}, H = {}, W = null, q = [], R = E, X = -1;
                    return e.registerAnimatableProperty = function(e, r) {
                        if (z(e)) {
                            var i = !1;
                            q.indexOf(e) === -1 && (i = !0), i && q.push(e);
                            var o = Object.getOwnPropertyDescriptor(n, e);
                            if (r ? F[e] = r : null === F[e] && delete F[e], !o || o.configurable === !0) {
                                var s = a(n[e], e, t.input, t);
                                E[e] = s, "undefined" == typeof s && (E[e] = null), i && Object.defineProperty(n, e, {
                                    get: function get() {
                                        return u(e);
                                    },
                                    set: function set(t) {
                                        f(t, e);
                                    },
                                    enumerable: !0,
                                    configurable: !0
                                });
                            }
                        }
                    }, Object.defineProperty(e, "layer", {
                        get: function get() {
                            return n;
                        },
                        set: function set(e) {
                            e && h(e);
                        },
                        enumerable: !1,
                        configurable: !1
                    }), Object.defineProperty(e, "animationCount", {
                        get: function get() {
                            return N.length;
                        },
                        enumerable: !1,
                        configurable: !1
                    }), Object.defineProperty(e, "animations", {
                        get: function get() {
                            var e = N.map(function(e) {
                                var n = e.copy.call(e);
                                return c([ "from", "to", "delta" ], n, t.output, t), n;
                            });
                            return e;
                        },
                        enumerable: !1,
                        configurable: !1
                    }), Object.defineProperty(e, "animationNames", {
                        get: function get() {
                            return Object.keys(S);
                        },
                        enumerable: !1,
                        configurable: !1
                    }), Object.defineProperty(e, "presentation", {
                        get: function get() {
                            var e = w.currentTransaction().time;
                            if (e === X && null !== W) return W;
                            var n = Object.assign(M(), E), r = !0;
                            return N.length && (r = l(n, N, e, _)), (r || null === W) && (s(Object.keys(n), n, t.output, t), 
                            W = n, Object.freeze(W)), X = e, _ = !1, W;
                        },
                        enumerable: !1,
                        configurable: !1
                    }), Object.defineProperty(e, "model", {
                        get: function get() {
                            var e = M();
                            return q.forEach(function(n) {
                                var r = a(E[n], n, t.output, t);
                                Object.defineProperty(e, n, {
                                    value: r,
                                    enumerable: !0,
                                    configurable: !1
                                });
                            }), Object.freeze(e), e;
                        },
                        enumerable: !1,
                        configurable: !1
                    }), Object.defineProperty(e, "previous", {
                        get: function get() {
                            var e = M();
                            return q.forEach(function(n) {
                                var r = a(H[n], n, t.output, t);
                                Object.defineProperty(e, n, {
                                    value: r,
                                    enumerable: !0,
                                    configurable: !1
                                }), H[n] = E[n];
                            }), Object.freeze(e), e;
                        },
                        enumerable: !1,
                        configurable: !1
                    }), e.needsDisplay = function() {
                        W = null, N.length || x();
                    }, e.addAnimation = function(n, r) {
                        var o = (0, y.animationFromDescription)(n);
                        if (!(o instanceof y.HyperAnimation || o instanceof y.HyperGroup || o instanceof y.HyperChain)) throw new Error("Animations must be an Animation, Group, or Chain subclass:" + JSON.stringify(o));
                        if (c([ "from", "to" ], o, t.input, t), i(o, t), N.length || x(), N.push(o), null !== r && "undefined" != typeof r) {
                            var a = S[r];
                            a && j(a), S[r] = o;
                        }
                        "undefined" == typeof r || null === r || r === !1 ? P.push(null) : P.push(r), _ = !0;
                        var u = w.currentTransaction();
                        o.runAnimation(e, r, u);
                    }, e.removeAnimation = function(e) {
                        var t = S[e];
                        t && j(t);
                    }, e.removeAllAnimations = function() {
                        N.length = 0, P.length = 0, S = {}, N.forEach(function(e) {
                            r(e.onend) && e.onend.call(e, !1);
                        }), m || w.deregisterTarget(e);
                    }, e.animationNamed = function(e) {
                        var n = S[e];
                        if (n) {
                            var r = n.copy.call(n);
                            return c([ "from", "to", "delta" ], r, t.output, t), r;
                        }
                        return null;
                    }, Object.keys(n).forEach(function(t) {
                        e.registerAnimatableProperty(t);
                    }), e;
                }
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.disableAnimation = t.flushTransaction = t.currentTransaction = t.commitTransaction = t.beginTransaction = void 0, 
                t.decorate = f, t.activate = h;
                var d = n(16), y = n(15), g = !0, m = !0, v = [ "display", "animationForKey", "input", "output" ], b = [ "addAnimation", "animationNamed", "needsDisplay", "registerAnimatableProperty", "removeAllAnimations", "removeAnimation" ], T = [ "layer", "presentation", "model", "previous", "animations", "animationNames", "animationCount" ], w = new d.HyperContext();
                t.beginTransaction = w.beginTransaction.bind(w), t.commitTransaction = w.commitTransaction.bind(w), 
                t.currentTransaction = w.currentTransaction.bind(w), t.flushTransaction = w.flushTransaction.bind(w), 
                t.disableAnimation = w.disableAnimation.bind(w);
            }, function(e, t, n) {
                "use strict";
                function r(e) {
                    return y[e] || u.nonNumericType;
                }
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.typeForStyle = r;
                var i = n(0), o = n(10), a = n(3), u = n(2), s = n(4), c = n(1), l = n(7), p = n(8), f = n(9), h = n(5), d = n(11), y = {
                    backgroundColor: a.colorType,
                    backgroundPosition: l.positionListType,
                    borderBottomColor: a.colorType,
                    borderBottomLeftRadius: c.lengthType,
                    borderBottomRightRadius: c.lengthType,
                    borderBottomWidth: c.lengthType,
                    borderLeftColor: a.colorType,
                    borderLeftWidth: c.lengthType,
                    borderRightColor: a.colorType,
                    borderRightWidth: c.lengthType,
                    borderSpacing: c.lengthType,
                    borderTopColor: a.colorType,
                    borderTopLeftRadius: c.lengthType,
                    borderTopRightRadius: c.lengthType,
                    borderTopWidth: c.lengthType,
                    bottom: c.lengthAutoType,
                    boxShadow: f.shadowType,
                    clip: (0, i.typeWithKeywords)([ "auto" ], p.rectangleType),
                    color: a.colorType,
                    cx: c.lengthType,
                    fontSize: (0, i.typeWithKeywords)([ "smaller", "larger" ], c.lengthType),
                    fontWeight: (0, i.typeWithKeywords)([ "lighter", "bolder" ], h.fontWeightType),
                    height: c.lengthAutoType,
                    left: c.lengthAutoType,
                    letterSpacing: (0, i.typeWithKeywords)([ "normal" ], c.lengthType),
                    lineHeight: c.lengthType,
                    marginBottom: c.lengthAutoType,
                    marginLeft: c.lengthAutoType,
                    marginRight: c.lengthAutoType,
                    marginTop: c.lengthAutoType,
                    maxHeight: (0, i.typeWithKeywords)([ "none", "max-content", "min-content", "fill-available", "fit-content" ], c.lengthType),
                    maxWidth: (0, i.typeWithKeywords)([ "none", "max-content", "min-content", "fill-available", "fit-content" ], c.lengthType),
                    minHeight: (0, i.typeWithKeywords)([ "max-content", "min-content", "fill-available", "fit-content" ], c.lengthType),
                    minWidth: (0, i.typeWithKeywords)([ "max-content", "min-content", "fill-available", "fit-content" ], c.lengthType),
                    opacity: s.opacityType,
                    outlineColor: (0, i.typeWithKeywords)([ "invert" ], a.colorType),
                    outlineOffset: c.lengthType,
                    outlineWidth: c.lengthType,
                    paddingBottom: c.lengthType,
                    paddingLeft: c.lengthType,
                    paddingRight: c.lengthType,
                    paddingTop: c.lengthType,
                    right: c.lengthAutoType,
                    textIndent: (0, i.typeWithKeywords)([ "each-line", "hanging" ], c.lengthType),
                    textShadow: f.shadowType,
                    top: c.lengthAutoType,
                    transform: o.transformType,
                    WebkitTransform: o.transformType,
                    webkitTransform: o.transformType,
                    msTransform: o.transformType,
                    verticalAlign: (0, i.typeWithKeywords)([ "baseline", "sub", "super", "text-top", "text-bottom", "middle", "top", "bottom" ], c.lengthType),
                    visibility: d.visibilityType,
                    width: (0, i.typeWithKeywords)([ "border-box", "content-box", "auto", "max-content", "min-content", "available", "fit-content" ], c.lengthType),
                    wordSpacing: (0, i.typeWithKeywords)([ "normal" ], c.lengthType),
                    x: c.lengthType,
                    y: c.lengthType,
                    zIndex: (0, i.typeWithKeywords)([ "auto" ], s.integerType)
                };
            }, function(e, t, n) {
                "use strict";
                function r(e) {
                    return e && "[object Function]" === {}.toString.call(e);
                }
                function i(e) {}
                function o(e) {}
                function a(e, t, n) {
                    this.type = e, r(e) && (this.type = new e(n)), this.length = t;
                }
                function u(e) {
                    r(e) ? this.sort = e : e && r(e.sort) && (this.sort = e.sort);
                }
                function s(e) {}
                function c(e) {}
                function l(e) {}
                function p(e) {
                    throw new Error("HyperRange not supported");
                }
                function f(e, t, n, r) {
                    return {
                        origin: y(e, t),
                        size: v(n, r)
                    };
                }
                function h() {
                    return f(0, 0, 0, 0);
                }
                function d(e, t) {
                    return m(e.origin, t.origin) && T(e.size, t.size);
                }
                function y(e, t) {
                    return {
                        x: e,
                        y: t
                    };
                }
                function g() {
                    return y(0, 0);
                }
                function m(e, t) {
                    return e.x === t.x && e.y === t.y;
                }
                function v(e, t) {
                    return {
                        width: e,
                        height: t
                    };
                }
                function b() {
                    return v(0, 0);
                }
                function T(e, t) {
                    return e.width === t.width && e.height && t.height;
                }
                function w(e, t) {
                    return {
                        location: e,
                        length: t
                    };
                }
                function x() {
                    return w(0, 0);
                }
                function k() {
                    return w(z, 0);
                }
                function O(e, t) {
                    return e > t.location && e < t.location + t.length;
                }
                function A(e, t) {
                    return e.location === t.location && e.length === t.length;
                }
                function j(e, t) {
                    if (e.location + e.length <= t.location || t.location + t.length <= e.location) return k();
                    var n = Math.max(e.location, t.location), r = Math.min(e.location + e.length, t.location + t.length);
                    return {
                        location: n,
                        length: r - n
                    };
                }
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.HyperNumber = i, t.HyperScale = o, t.HyperArray = a, t.HyperSet = u, t.HyperPoint = s, 
                t.HyperSize = c, t.HyperRect = l, t.HyperRange = p, t.hyperMakeRect = f, t.hyperZeroRect = h, 
                t.hyperEqualRects = d, t.hyperMakePoint = y, t.hyperZeroPoint = g, t.hyperEqualPoints = m, 
                t.hyperMakeSize = v, t.hyperZeroSize = b, t.hyperEqualSizes = T, t.hyperMakeRange = w, 
                t.hyperZeroRange = x, t.hyperNullRange = k, t.hyperIndexInRange = O, t.hyperEqualRanges = A, 
                t.hyperIntersectionRange = j, i.prototype = {
                    constructor: i,
                    zero: function zero() {
                        return 0;
                    },
                    add: function add(e, t) {
                        return e + t;
                    },
                    subtract: function subtract(e, t) {
                        return e - t;
                    },
                    interpolate: function interpolate(e, t, n) {
                        return e + (t - e) * n;
                    }
                }, o.prototype = {
                    constructor: o,
                    zero: function zero() {
                        return 1;
                    },
                    add: function add(e, t) {
                        return e * t;
                    },
                    subtract: function subtract(e, t) {
                        return 0 === t ? 0 : e / t;
                    },
                    interpolate: function interpolate(e, t, n) {
                        return e + (t - e) * n;
                    }
                }, a.prototype = {
                    constructor: a,
                    zero: function zero() {
                        for (var e = [], t = this.length; t--; ) {
                            e.push(this.type.zero());
                        }
                        return e;
                    },
                    add: function add(e, t) {
                        for (var n = [], r = 0; r < this.length; r++) {
                            n.push(this.type.add(e[r], t[r]));
                        }
                        return n;
                    },
                    subtract: function subtract(e, t) {
                        for (var n = [], r = 0; r < this.length; r++) {
                            n.push(this.type.subtract(e[r], t[r]));
                        }
                        return n;
                    },
                    interpolate: function interpolate(e, t, n) {
                        for (var r = [], i = 0; i < this.length; i++) {
                            r.push(this.type.interpolate(e[i], t[i], n));
                        }
                        return r;
                    }
                }, u.prototype = {
                    constructor: u,
                    zero: function zero() {
                        return [];
                    },
                    add: function add(e, t) {
                        if (!Array.isArray(e) && !Array.isArray(t)) return [];
                        if (!Array.isArray(e)) return t;
                        if (!Array.isArray(t)) return e;
                        var n = [], i = e.length, o = t.length, a = 0, u = 0;
                        if (r(this.sort)) for (;a < i || u < o; ) {
                            if (a === i) n.push(t[u]), u++; else if (u === o) n.push(e[a]), a++; else {
                                var s = e[a], c = t[u], l = this.sort(s, c);
                                0 === l ? (n.push(s), a++, u++) : l < 0 ? (n.push(s), a++) : l > 0 && (n.push(c), 
                                u++);
                            }
                        } else for (n = e.slice(0), a = t.length; a--; ) {
                            e.indexOf(t[a]) < 0 && n.push(t[a]);
                        }
                        return n;
                    },
                    subtract: function subtract(e, t) {
                        if (!Array.isArray(e) && !Array.isArray(t)) return [];
                        if (!Array.isArray(e)) return t;
                        if (!Array.isArray(t)) return e;
                        var n = [], i = e.length, o = t.length, a = 0, u = 0;
                        if (r(this.sort)) for (;(a < i || u < o) && a !== i; ) {
                            if (u === o) n.push(e[a]), a++; else {
                                var s = e[a], c = t[u], l = this.sort(s, c);
                                0 === l ? (a++, u++) : l < 0 ? (n.push(s), a++) : l > 0 && u++;
                            }
                        } else for (n = e.slice(0), a = t.length; a--; ) {
                            var p = n.indexOf(t[a]);
                            p > -1 && n.splice(p, 1);
                        }
                        return n;
                    },
                    interpolate: function interpolate(e, t, n) {
                        return n >= 1 ? t : e;
                    }
                }, s.prototype = {
                    constructor: s,
                    zero: function zero() {
                        return g();
                    },
                    add: function add(e, t) {
                        return y(e.x + t.x, e.y + t.y);
                    },
                    subtract: function subtract(e, t) {
                        return y(e.x - t.x, e.y - t.y);
                    },
                    interpolate: function interpolate(e, t, n) {
                        return y(e.x + (t.x - e.x) * n, e.y + (t.y - e.y) * n);
                    }
                }, c.prototype = {
                    constructor: c,
                    zero: function zero() {
                        return b();
                    },
                    add: function add(e, t) {
                        return v(e.width + t.width, e.height + t.height);
                    },
                    subtract: function subtract(e, t) {
                        return v(e.width - t.width, e.height - t.height);
                    },
                    interpolate: function interpolate(e, t, n) {
                        return v(e.width + (t.width - e.width) * n, e.height + (t.height - e.height) * n);
                    }
                }, l.prototype = {
                    constructor: l,
                    zero: function zero() {
                        return h();
                    },
                    add: function add(e, t) {
                        return {
                            origin: s.prototype.add(e.origin, t.origin),
                            size: c.prototype.add(e.size, t.size)
                        };
                    },
                    subtract: function subtract(e, t) {
                        return {
                            origin: s.prototype.subtract(e.origin, t.origin),
                            size: c.prototype.subtract(e.size, t.size)
                        };
                    },
                    interpolate: function interpolate(e, t, n) {
                        return {
                            origin: s.prototype.interpolate(e.origin, t.origin, n),
                            size: c.prototype.interpolate(e.size, t.size, n)
                        };
                    }
                }, p.prototype = {
                    constructor: p,
                    zero: function zero() {
                        return k();
                    },
                    add: function add(e, t) {
                        if (e.location === z && t.location === z) return k();
                        if (0 === e.length && 0 === t.length) return k();
                        if (e.location === z || 0 === e.length) return t;
                        if (t.location === z || 0 === t.length) return e;
                        var n = Math.min(e.location, t.location), r = Math.max(e.location + e.length, t.location + t.length), i = w(n, r - n);
                        return i;
                    },
                    subtract: function subtract(e, t) {
                        var n = e;
                        return e.location === z && t.location === z ? n = k() : 0 === e.length && 0 === t.length ? n = k() : e.location === z || 0 === e.length ? n = k() : t.location === z || 0 === t.length ? n = e : t.location <= e.location && t.location + t.length >= e.location + e.length ? n = k() : t.location <= e.location && t.location + t.length > e.location && t.location + t.length < e.location + e.length ? n = w(t.location + t.length, e.location + e.length - (t.location + t.length)) : t.location > e.location && t.location < e.location + e.length && t.location + t.length >= e.location + e.length && (n = w(e.location, t.location + t.length - e.location)), 
                        n;
                    },
                    interpolate: function interpolate(e, t, n) {
                        return n >= 1 ? t : e;
                    },
                    intersection: function intersection(e, t) {
                        if (e.location === z || t.location === z || 0 === e.length || 0 === t.length) return k();
                        if (e.location + e.length <= t.location || t.location + t.length <= e.location) return k();
                        var n = Math.max(e.location, t.location), r = Math.min(e.location + e.length, t.location + t.length);
                        return w(n, r - n);
                    }
                };
                var z = t.hyperNotFound = Number.MAX_VALUE;
            }, function(e, t, n) {
                "use strict";
                function r(e) {
                    return e && "[object Function]" === {}.toString.call(e);
                }
                function i(e) {
                    return !isNaN(parseFloat(e)) && isFinite(e);
                }
                function o(e) {
                    return e && "object" === ("undefined" == typeof e ? "undefined" : p(e));
                }
                function a(e) {
                    var t = void 0;
                    if (!e) return e;
                    if (e instanceof c || e instanceof l) t = e.copy.call(e); else if (Array.isArray(e)) t = new c(e); else if (o(e)) t = new l(e); else if (i(e)) t = new l({
                        duration: e
                    }); else {
                        if (e !== !0) throw new Error("is this an animation:" + JSON.stringify(e));
                        t = new l({});
                    }
                    return t;
                }
                function u() {}
                function s(e) {
                    u.call(this);
                    var t = [];
                    Array.isArray(e) ? t = e : e && e.chain && (t = e.chain), this.chain = t.map(function(e) {
                        return a(e);
                    }), Object.defineProperty(this, "finished", {
                        get: function get() {
                            return !this.chain.length || this.chain[this.chain.length - 1].finished;
                        },
                        enumerable: !1,
                        configurable: !1
                    }), e && !Array.isArray(e) && Object.keys(e).forEach(function(t) {
                        "chain" !== t && "finished" !== t && (this[t] = e[t]);
                    }.bind(this));
                }
                function c(e) {
                    u.call(this);
                    var t = [];
                    Array.isArray(e) ? t = e : e && e.group && (t = e.group), this.group = t.map(function(e) {
                        return a(e);
                    }), Object.defineProperty(this, "finished", {
                        get: function get() {
                            var e = !0;
                            return this.group.forEach(function(t) {
                                t.finished || (e = !1);
                            }), e;
                        },
                        enumerable: !1,
                        configurable: !1
                    }), e && !Array.isArray(e) && Object.keys(e).forEach(function(t) {
                        "group" !== t && "finished" !== t && (this[t] = e[t]);
                    }.bind(this));
                }
                function l(e) {
                    u.call(this), this.property, this.from, this.to, this.type = h, this.delta, this.duration, 
                    this.easing, this.speed, this.iterations, this.autoreverse, this.fillMode, this.index = 0, 
                    this.delay = 0, this.blend = "relative", this.additive = !0, this.sort, this.finished = !1, 
                    this.startTime, this.progress, this.onend, this.remove = !0, e && Object.keys(e).forEach(function(t) {
                        this[t] = e[t];
                    }.bind(this));
                }
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                var p = "function" == typeof Symbol && "symbol" == _typeof(Symbol.iterator) ? function(e) {
                    return typeof e === "undefined" ? "undefined" : _typeof(e);
                } : function(e) {
                    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e === "undefined" ? "undefined" : _typeof(e);
                };
                t.animationFromDescription = a, t.HyperChain = s, t.HyperGroup = c, t.HyperAnimation = l;
                var f = 0, h = {
                    zero: function zero() {
                        return 0;
                    },
                    add: function add(e, t) {
                        return e + t;
                    },
                    subtract: function subtract(e, t) {
                        return e - t;
                    },
                    interpolate: function interpolate(e, t, n) {
                        return e + (t - e) * n;
                    }
                };
                s.prototype = {
                    constructor: s,
                    copy: function copy() {
                        return new this.constructor(this);
                    },
                    runAnimation: function runAnimation(e, t, n) {
                        this.sortIndex = f++, null !== this.startTime && "undefined" != typeof this.startTime || (this.startTime = n.time);
                        for (var r = this.chain.length, i = Object.assign({}, n), o = n.time, a = 0; a < r; a++) {
                            var u = this.chain[0];
                            n.startTime = o, u.runAnimation.call(u, e, t, i), o = o === 1 / 0 || u.iterations === 1 / 0 ? 1 / 0 : u.delay + u.duration * u.iterations;
                        }
                    },
                    composite: function composite(e, t) {
                        for (var n = !1, r = this.chain.length, i = 0; i < r; i++) {
                            var o = this.chain[i];
                            n = o.composite.call(o, e, t) || n;
                        }
                        return n;
                    }
                }, c.prototype = {
                    constructor: c,
                    copy: function copy() {
                        return new this.constructor(this);
                    },
                    runAnimation: function runAnimation(e, t, n) {
                        this.sortIndex = f++, null !== this.startTime && "undefined" != typeof this.startTime || (this.startTime = n.time), 
                        this.group.forEach(function(r) {
                            r.runAnimation.call(r, e, t, n);
                        });
                    },
                    composite: function composite(e, t) {
                        var n = !1;
                        return this.group.forEach(function(r) {
                            n = r.composite.call(r, e, t) || n;
                        }), n;
                    }
                }, l.prototype = {
                    constructor: l,
                    copy: function e() {
                        for (var e = new this.constructor(this.settings), t = Object.getOwnPropertyNames(this), n = t.length, r = 0; r < n; r++) {
                            Object.defineProperty(e, t[r], Object.getOwnPropertyDescriptor(this, t[r]));
                        }
                        return e;
                    },
                    composite: function composite(e, t) {
                        if (null === this.startTime || void 0 === this.startTime) throw new Error("Cannot composite an animation that has not been started.");
                        if (this.startTime > t && "backwards" !== this.fillMode && "both" !== this.fillMode) return !1;
                        if (this.finished && "forwards" !== this.fillMode && "both" !== this.fillMode) return !1;
                        var n = Math.max(0, t - (this.startTime + this.delay)), i = this.speed, o = 1, a = 1, u = this.duration, s = u * this.iterations;
                        s && (o = n * i / u, a = n * i / s), a >= 1 && (o = 1, this.finished = !0);
                        var c = 0;
                        if (this.finished || (this.autoreverse === !0 && (c = Math.floor(o) % 2), o %= 1), 
                        c && (o = 1 - o), r(this.easing)) o = this.easing(o); else if ("step-start" === this.easing) o = Math.ceil(o); else if ("step-middle" === this.easing) o = Math.round(o); else if ("step-end" === this.easing) o = Math.floor(o); else {
                            var l = .5 - Math.cos(o * Math.PI) / 2;
                            if (this.easing) {
                                var p = /(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);
                                if (p) {
                                    var f = p[1], h = p[2];
                                    h > 0 ? "step-start" === f ? o = Math.ceil(o * h) / h : "step-middle" === f ? o = Math.round(o * h) / h : "step-end" !== f && "steps" !== f || (o = Math.floor(o * h) / h) : "linear" !== this.easing && (o = l);
                                } else "linear" !== this.easing && (o = l);
                            } else o = l;
                        }
                        var d = "absolute" === this.blend ? this.type.interpolate(this.from, this.to, o) : this.type.interpolate(this.delta, this.type.zero(this.to), o), y = this.property;
                        if ("undefined" != typeof y && null !== y) {
                            var g = d, m = e[y];
                            "undefined" != typeof m && null !== m || (m = this.type.zero(this.to)), this.additive && (g = this.type.add(m, d)), 
                            this.sort && Array.isArray(g) && g.sort(this.sort), e[y] = g;
                        }
                        var v = o !== this.progress || this.finished;
                        return this.progress = o, v;
                    },
                    runAnimation: function runAnimation(e, t, n) {
                        if (r(this.type) && (this.type = new this.type()), !(this.type && r(this.type.zero) && r(this.type.add) && r(this.type.subtract) && r(this.type.interpolate))) throw new Error("Hyper.Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");
                        this.from || (this.from = this.type.zero(this.to)), this.to || (this.to = this.type.zero(this.from)), 
                        "absolute" !== this.blend && (this.delta = this.type.subtract(this.from, this.to)), 
                        null !== this.duration && "undefined" != typeof this.duration || (this.duration = n.duration), 
                        null !== this.easing && "undefined" != typeof this.easing || (this.easing = n.easing), 
                        null !== this.speed && "undefined" != typeof this.speed || (this.speed = 1), null !== this.iterations && "undefined" != typeof this.iterations || (this.iterations = 1), 
                        "undefined" != typeof this.startTime && null !== this.startTime || (this.startTime = n.time), 
                        this.sortIndex = f++;
                    }
                };
            }, function(e, t, n) {
                "use strict";
                function r(e) {
                    return e && "[object Function]" === {}.toString.call(e);
                }
                function i(e) {
                    this.time, this.disableAnimation = !1, this.duration, this.easing, e && Object.keys(e).forEach(function(t) {
                        this[t] = e[t];
                    }.bind(this));
                }
                function o() {
                    this.targets = [], this.transactions = [], this.ticking = !1, this.animationFrame, 
                    this.displayLayers = [], this.displayFunctions = [], this.cleanupFunctions = [], 
                    this.invalidateFunctions = [];
                }
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.HyperTransaction = i, t.HyperContext = o;
                var a = "undefined" != typeof window && (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame) || function(e) {
                    setTimeout(e, 0);
                }, u = Date.getTime;
                Date.now && (u = Date.now), "undefined" != typeof window && "undefined" != typeof window.performance && "undefined" != typeof window.performance.now && (u = window.performance.now.bind(window.performance)), 
                o.prototype = {
                    createTransaction: function createTransaction(e, t) {
                        var n = new i(e), r = this.transactions.length, o = u() / 1e3;
                        return r && (o = this.transactions[r - 1].representedObject.time), Object.defineProperty(n, "time", {
                            get: function get() {
                                return o;
                            },
                            enumerable: !0,
                            configurable: !1
                        }), this.transactions.push({
                            representedObject: n,
                            automaticallyCommit: t
                        }), t && this.startTicking(), n;
                    },
                    currentTransaction: function currentTransaction() {
                        var e = this.transactions.length;
                        return e ? this.transactions[e - 1].representedObject : this.createTransaction({}, !0);
                    },
                    beginTransaction: function beginTransaction(e) {
                        return this.createTransaction(e, !1);
                    },
                    commitTransaction: function commitTransaction() {
                        this.transactions.pop();
                    },
                    flushTransaction: function flushTransaction() {
                        this.invalidateFunctions.forEach(function(e) {
                            e();
                        });
                    },
                    disableAnimation: function disableAnimation(e) {
                        e !== !1 && (e = !0);
                        var t = this.currentTransaction();
                        t.disableAnimation = e, this.startTicking();
                    },
                    registerTarget: function registerTarget(e, t, n, r) {
                        this.startTicking();
                        var i = this.targets.indexOf(e);
                        i < 0 && (this.targets.push(e), this.displayLayers.push(null), this.displayFunctions.push(t), 
                        this.cleanupFunctions.push(r), this.invalidateFunctions.push(n));
                    },
                    deregisterTarget: function deregisterTarget(e) {
                        var t = this.targets.indexOf(e);
                        t > -1 && (this.targets.splice(t, 1), this.displayLayers.splice(t, 1), this.displayFunctions.splice(t, 1), 
                        this.cleanupFunctions.splice(t, 1), this.invalidateFunctions.splice(t, 1));
                    },
                    startTicking: function startTicking() {
                        this.animationFrame || (this.animationFrame = a(this.ticker.bind(this)));
                    },
                    ticker: function ticker() {
                        this.animationFrame = void 0;
                        for (var e = this.targets, t = e.length; t--; ) {
                            var n = e[t], i = this.displayFunctions[t];
                            if (n.animationCount) {
                                var o = n.presentation;
                                this.displayLayers[t] !== o && (n.animationCount && (this.displayLayers[t] = o), 
                                i(), this.invalidateFunctions[t]()), this.cleanupFunctions[t]();
                            } else r(i) && (n.presentation, i()), this.invalidateFunctions[t](), this.deregisterTarget(n);
                        }
                        var a = this.transactions.length;
                        if (a) {
                            var u = this.transactions[a - 1];
                            u.automaticallyCommit && this.commitTransaction();
                        }
                        this.targets.length && this.startTicking();
                    }
                };
            }, function(e, t, n) {
                "use strict";
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                var r = n(12);
                Object.keys(r).forEach(function(e) {
                    "default" !== e && "__esModule" !== e && Object.defineProperty(t, e, {
                        enumerable: !0,
                        get: function get() {
                            return r[e];
                        }
                    });
                });
                var i = n(14);
                Object.keys(i).forEach(function(e) {
                    "default" !== e && "__esModule" !== e && Object.defineProperty(t, e, {
                        enumerable: !0,
                        get: function get() {
                            return i[e];
                        }
                    });
                });
                var o = n(13);
                Object.defineProperty(t, "typeForStyle", {
                    enumerable: !0,
                    get: function get() {
                        return o.typeForStyle;
                    }
                });
                var a = n(10);
                Object.defineProperty(t, "transformType", {
                    enumerable: !0,
                    get: function get() {
                        return a.transformType;
                    }
                });
                var u = n(3);
                Object.defineProperty(t, "colorType", {
                    enumerable: !0,
                    get: function get() {
                        return u.colorType;
                    }
                });
                var s = n(2);
                Object.defineProperty(t, "nonNumericType", {
                    enumerable: !0,
                    get: function get() {
                        return s.nonNumericType;
                    }
                });
                var c = n(4);
                Object.defineProperty(t, "numberType", {
                    enumerable: !0,
                    get: function get() {
                        return c.numberType;
                    }
                }), Object.defineProperty(t, "integerType", {
                    enumerable: !0,
                    get: function get() {
                        return c.integerType;
                    }
                }), Object.defineProperty(t, "opacityType", {
                    enumerable: !0,
                    get: function get() {
                        return c.opacityType;
                    }
                });
                var l = n(1);
                Object.defineProperty(t, "lengthType", {
                    enumerable: !0,
                    get: function get() {
                        return l.lengthType;
                    }
                }), Object.defineProperty(t, "lengthAutoType", {
                    enumerable: !0,
                    get: function get() {
                        return l.lengthAutoType;
                    }
                });
                var p = n(6);
                Object.defineProperty(t, "positionType", {
                    enumerable: !0,
                    get: function get() {
                        return p.positionType;
                    }
                });
                var f = n(7);
                Object.defineProperty(t, "positionListType", {
                    enumerable: !0,
                    get: function get() {
                        return f.positionListType;
                    }
                });
                var h = n(8);
                Object.defineProperty(t, "rectangleType", {
                    enumerable: !0,
                    get: function get() {
                        return h.rectangleType;
                    }
                });
                var d = n(9);
                Object.defineProperty(t, "shadowType", {
                    enumerable: !0,
                    get: function get() {
                        return d.shadowType;
                    }
                });
                var y = n(5);
                Object.defineProperty(t, "fontWeightType", {
                    enumerable: !0,
                    get: function get() {
                        return y.fontWeightType;
                    }
                });
                var g = n(11);
                Object.defineProperty(t, "visibilityType", {
                    enumerable: !0,
                    get: function get() {
                        return g.visibilityType;
                    }
                });
            } ]);
        });
    }).call(exports, __webpack_require__(1)(module));
}, /* 1 */
/***/
function(module, exports) {
    module.exports = function(module) {
        if (!module.webpackPolyfill) {
            module.deprecate = function() {};
            module.paths = [];
            // module.parent = undefined by default
            if (!module.children) module.children = [];
            Object.defineProperty(module, "loaded", {
                enumerable: true,
                configurable: false,
                get: function() {
                    return module.l;
                }
            });
            Object.defineProperty(module, "id", {
                enumerable: true,
                configurable: false,
                get: function() {
                    return module.i;
                }
            });
            module.webpackPolyfill = 1;
        }
        return module;
    };
}, /* 2 */
/***/
function(module, exports, __webpack_require__) {
    "use strict";
    "use strict";
    var _createClass = function() {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }
        return function(Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();
    var _hyperact = __webpack_require__(0);
    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }
    function elastic(progress, omega, zeta) {
        var beta = Math.sqrt(1 - zeta * zeta);
        var value = 1 / beta * Math.exp(-zeta * omega * progress) * Math.sin(beta * omega * progress + Math.atan(beta / zeta));
        return 1 - value;
    }
    function easing(progress) {
        progress = 1 - Math.cos(progress * Math.PI / 2);
        return elastic(progress, 15, .6);
    }
    var duration = 1;
    var View = function() {
        function View(element, value) {
            _classCallCheck(this, View);
            (0, _hyperact.activate)(this);
            this.element = element;
            this.iterations = 50;
            this.vertices = 500;
            this.radius = 100;
            this.value = value;
            this.positionArray = this.plot();
            this.registerAnimatableProperty("positionArray");
        }
        _createClass(View, [ {
            key: "animationForKey",
            value: function animationForKey(key, value, previous) {
                if (key === "positionArray") return {
                    type: new _hyperact.HyperArray(_hyperact.HyperNumber, this.vertices * 2),
                    duration: duration,
                    easing: easing
                };
            }
        }, {
            key: "plot",
            value: function plot() {
                var canvas = this.element;
                var width = canvas.width;
                var height = canvas.height;
                var centerX = width / 2;
                var centerY = height / 2;
                var phi = this.value * Math.PI;
                var array = [];
                var slice = Math.PI * 2 / this.vertices;
                var j = this.vertices + 1;
                var theta = 0;
                while (--j) {
                    theta -= slice;
                    var i = this.iterations;
                    var x = centerX;
                    var y = centerY;
                    do {
                        var value = i * theta + i * i * phi;
                        x += Math.sin(value) / i * this.radius;
                        y += Math.cos(value) / i * this.radius;
                    } while (--i);
                    array.push(x);
                    array.push(y);
                }
                return array;
            }
        }, {
            key: "layout",
            value: function layout(value) {
                this.value = value;
                this.positionArray = this.plot();
                this.needsDisplay();
            }
        }, {
            key: "display",
            value: function display() {
                var canvas = this.element;
                var context = canvas.getContext("2d");
                var width = canvas.width;
                var height = canvas.height;
                context.clearRect(0, 0, width, height);
                var array = this.positionArray;
                var length = array.length;
                if (length > 1) {
                    context.beginPath();
                    context.moveTo(array[0], array[1]);
                    for (var i = 2; i < length; i += 2) {
                        context.lineTo(array[i], array[i + 1]);
                    }
                    context.closePath();
                    context.stroke();
                }
            }
        } ]);
        return View;
    }();
    var Slider = function() {
        function Slider(element, value) {
            _classCallCheck(this, Slider);
            (0, _hyperact.activate)(this);
            this.element = element;
            this.value = value;
            this.registerAnimatableProperty("value");
        }
        _createClass(Slider, [ {
            key: "animationForKey",
            value: function animationForKey(key, value, previous, presentation) {
                return {
                    duration: duration,
                    easing: easing
                };
            }
        }, {
            key: "layout",
            value: function layout(value) {
                this.value = value;
            }
        }, {
            key: "display",
            value: function display() {
                this.element.value = this.value * 1e3;
            }
        } ]);
        return Slider;
    }();
    var rococo = Math.random();
    var input = document.createElement("input");
    input.type = "range";
    input.min = 0;
    input.max = 1e3;
    input.value = rococo * 1e3;
    document.body.appendChild(input);
    var slider = new Slider(input, rococo);
    var canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    var view = new View(canvas, rococo);
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        (0, _hyperact.disableAnimation)(true);
        view.layout(rococo);
        slider.layout(rococo);
    }
    resize();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousedown", function(e) {
        e.stopPropagation();
        e.preventDefault();
        rococo = Math.random();
        view.layout(rococo);
        slider.layout(rococo);
    });
    document.addEventListener("mouseup", function(e) {
        input.blur();
    });
    input.addEventListener("input", function(e) {
        rococo = input.value / 1e3;
        view.layout(rococo);
        slider.layout(rococo);
    });
    input.addEventListener("change", function(e) {
        rococo = input.value / 1e3;
        view.layout(rococo);
        slider.layout(rococo);
    });
    input.addEventListener("mousedown", function(e) {
        input.focus();
    });
} ]);