!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.core=e():(t.Hyperact=t.Hyperact||{},t.Hyperact.core=e())}(this,function(){return function(t){function e(n){if(i[n])return i[n].exports;var r=i[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var n=window.webpackJsonpHyperact__name_;window.webpackJsonpHyperact__name_=function(i,o,a){for(var s,u,c,f=0,p=[];f<i.length;f++)u=i[f],r[u]&&p.push(r[u][0]),r[u]=0;for(s in o)Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);for(n&&n(i,o,a);p.length;)p.shift()();if(a)for(f=0;f<a.length;f++)c=e(e.s=a[f]);return c};var i={},r={2:0};return e.e=function(t){function n(){o.onerror=o.onload=null,clearTimeout(a);var e=r[t];0!==e&&(e&&e[1](new Error("Loading chunk "+t+" failed.")),r[t]=void 0)}if(0===r[t])return Promise.resolve();if(r[t])return r[t][2];var i=document.getElementsByTagName("head")[0],o=document.createElement("script");o.type="text/javascript",o.charset="utf-8",o.async=!0,o.timeout=12e4,e.nc&&o.setAttribute("nonce",e.nc),o.src=e.p+""+t+".js";var a=setTimeout(n,12e4);o.onerror=o.onload=n,i.appendChild(o);var s=new Promise(function(e,n){r[t]=[e,n]});return r[t][2]=s},e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:i})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e.oe=function(t){throw console.error(t),t},e(e.s=14)}({14:function(t,e,n){"use strict";function i(t){return t&&"[object Function]"==={}.toString.call(t)}function r(t,e){if(t instanceof h.HyperGroup)t.group.forEach(function(t){r(t,e)});else{if(!(t instanceof h.HyperAnimation))throw new Error("not an animation");if(e.typeOfProperty){var n=e.typeOfProperty.call(e,t.property,t.to);n&&(t.type=n)}}}function o(t,e){return i(e)?e(t):t}function a(t,e,n){return d&&i(n)?n(e,t):t}function s(t,e,n){if(e&&i(n)){var r=e[t];if(null!==r&&"undefined"!=typeof r&&(e[t]=n(t,r)),null===t||"undefined"==typeof t)throw new Error("convert property undefined")}}function u(t,e,n){d&&t.forEach(function(t){if(null===t||"undefined"==typeof t)throw new Error("convert properties undefined");s(t,e,n)})}function c(t,e,n){d&&e&&i(n)&&(e instanceof h.HyperGroup?e.group.forEach(function(e){c(t,e,n)}):t.forEach(function(t){var i=e[t];null!==i&&"undefined"!=typeof i&&(e[t]=n(e.property,i))}))}function f(t,e,n,i,r){var o=Object.assign({},t);if(!e||!e.length)return o;i&&e.sort(function(t,e){var n=t.index||0,i=e.index||0,r=n-i;return r||(r=t.startTime-e.startTime),r||(r=t.sortIndex-e.sortIndex),r});var a=!1;return e.forEach(function(t){a=t.composite(o,n)||a}),!a&&e.length&&r?r:o}function p(t,e,n){if(!t)throw new Error("Nothing to hyperactivate.");if(t.registerAnimatableProperty||t.addAnimation)throw new Error("Already hyperactive");e||(e=t),n||(n=t);var s=[],p=[],l={},d={},v=!1,w={},O={},T=null,j=[],A=w,P=Object.keys(n);t.registerAnimatableProperty=function(r,o){if(!(t===e&&i(n[r])&&g.indexOf(r)>-1)){var s=!1;j.indexOf(r)===-1&&(s=!0),s&&j.push(r);var u=Object.getOwnPropertyDescriptor(n,r);if(o?d[r]=o:null===d[r]&&delete d[r],!u||u.configurable===!0){var c=a(n[r],r,e.input);w[r]=c,s&&Object.defineProperty(n,r,{get:function(){return F(r)},set:function(t){x(t,r)},enumerable:!0,configurable:!0})}if("animations"===r)throw new Error("I don't think so")}},Object.defineProperty(t,"layer",{get:function(){return n},set:function(e){e&&Object.keys(e).forEach(function(n){t.registerAnimatableProperty(n),x(e[n],n)})},enumerable:!1,configurable:!1});var E=function(n,r,o,s,u,c){var f=void 0;i(e.animationForKey)&&(f=e.animationForKey.call(e,n,r,o,s));var p=(0,h.animationFromDescription)(f);return p||(p=(0,h.animationFromDescription)(d[n])),p&&(null!==p.property&&"undefined"!=typeof p.property||(p.property=n),null!==p.from&&"undefined"!=typeof p.from||("absolute"===p.blend?p.from=t.presentation[n]:p.from=a(w[n],n,e.output)),null!==p.to&&"undefined"!=typeof p.to||(p.to=r),null!==p.easing&&"undefined"!=typeof p.easing||(p.easing=c),null!==p.duration&&"undefined"!=typeof p.duration||(p.duration=u),p.duration||(p.duration=0)),p},F=function(t){m&&(t=o(t,e.keyOutput));var n=a(A[t],t,e.output);return n},x=function(n,i){m&&(i=o(i,e.keyInput));var r=a(n,i,e.input);if(r!==w[i]){var s=w[i],u=a(s,i,e.output);if(n!==u){O[i]=s;var c=b.currentTransaction();if(!c.disableAnimation){var f=c.duration,p=c.easing,l=t.presentation,h=E(i,n,u,l,f,p);h?t.addAnimation(h):t.needsDisplay()}w[i]=r,T=null,A=w}}};Object.defineProperty(t,"animationCount",{get:function(){return s.length},enumerable:!1,configurable:!1}),Object.defineProperty(t,"animations",{get:function(){var t=s.map(function(t){var n=t.copy.call(t);return c(["from","to","delta"],n,e.output),n});return t},enumerable:!1,configurable:!1}),Object.defineProperty(t,"animationNames",{get:function(){return Object.keys(l)},enumerable:!1,configurable:!1}),Object.defineProperty(t,"model",{get:function(){var t={};return j.forEach(function(n){var i=a(w[n],n,e.output);Object.defineProperty(t,n,{value:i,enumerable:!0,configurable:!1})}),Object.freeze(t),t},enumerable:!1,configurable:!1}),Object.defineProperty(t,"previous",{get:function(){var t=Object.assign({},w);return Object.keys(O).forEach(function(n){var i=a(O[n],n,e.output);Object.defineProperty(t,n,{value:i,enumerable:!0,configurable:!1}),O[n]=w[n]}),Object.freeze(t),t},enumerable:!1,configurable:!1});var k=function(){for(var e=s.length,n=[];e--;){var r=s[e];if(r.finished){s.splice(e,1);var o=p[e];p.splice(e,1),delete l[o],i(r.onend)&&n.push(r)}}y||s.length||b.deregisterTarget(t),s.length||(T=w),n.forEach(function(t){t.onend.call(t,!0)})};Object.defineProperty(t,"presentation",{get:function(){var i=0;s.length&&(i=b.currentTransaction().time);var r={};t!==n&&e!==n&&(r=Object.assign({},n));var o=Object.assign(r,w),a=f(o,s,i,v,T);return a!==T&&u(Object.keys(a),a,e.output),T=a,v=!1,a},enumerable:!1,configurable:!1});var H=function(){var n=function(){};i(e.display)&&(n=function(){A=t.presentation,e.display.call(e),A=w}),b.registerTarget(t,n,k)};t.needsDisplay=function(){H()},t.addAnimation=function(n,i){var o=(0,h.animationFromDescription)(n);if(!(o instanceof h.HyperAnimation||o instanceof h.HyperGroup))throw new Error("Animations must be a Hyper.Animation or Group subclass:"+JSON.stringify(o));if(c(["from","to"],o,e.input),r(o,e),s.length||H(),s.push(o),null!==i&&"undefined"!=typeof i){var a=l[i];a&&M(a),l[i]=o}"undefined"==typeof i||null===i||i===!1?p.push(null):p.push(i),v=!0;var u=b.currentTransaction();o.runAnimation(t,i,u)};var M=function(e){var n=s.indexOf(e);if(n>-1){s.splice(n,1);var i=p[n];p.splice(n,1),delete l[i]}y||s.length||b.deregisterTarget(t)};return t.removeAnimation=function(t){var e=l[t];e&&M(e)},t.removeAllAnimations=function(){s.length=0,p.length=0,l={},s.forEach(function(t){i(t.onend)&&t.onend.call(t,!1)}),y||b.deregisterTarget(t)},t.animationNamed=function(t){var n=l[t];if(n){var i=n.copy.call(n);return c(["from","to","delta"],i,e.output),i}return null},P.forEach(function(e){w[e]=n[e],t.registerAnimatableProperty(e)}),t}Object.defineProperty(e,"__esModule",{value:!0}),e.disableAnimation=e.flushTransaction=e.commitTransaction=e.beginTransaction=void 0,e.decorate=p;var l=n(7),h=n(6),d=!0,m=!0,y=!0,g=["display","animationForKey","input","output"],b=new l.HyperContext;e.beginTransaction=b.beginTransaction.bind(b),e.commitTransaction=b.commitTransaction.bind(b),e.flushTransaction=b.flushTransaction.bind(b),e.disableAnimation=b.disableAnimation.bind(b)},6:function(t,e){"use strict";function n(t){return t&&"[object Function]"==={}.toString.call(t)}function i(t){return!isNaN(parseFloat(t))&&isFinite(t)}function r(t){return t&&"object"===("undefined"==typeof t?"undefined":c(t))}function o(t){var e=void 0;if(!t)return t;if(t instanceof s||t instanceof u)e=t.copy.call(t);else if(Array.isArray(t))e=new s(t);else if(r(t))e=new u(t);else if(i(t))e=new u({duration:t});else{if(t!==!0)throw new Error("is this an animation:"+JSON.stringify(t));e=new u({})}return e}function a(){}function s(t){a.call(this),Array.isArray(t)||(t=[]),this.group=t.map(function(t){return o(t)}),this.sortIndex,this.startTime,Object.defineProperty(this,"finished",{get:function(){var t=!0;return this.group.forEach(function(e){e.finished||(t=!1)}),t},enumerable:!1,configurable:!1})}function u(t){a.call(this),this.property,this.from,this.to,this.type=p,this.delta,this.duration,this.easing,this.speed,this.iterations,this.autoreverse,this.fillMode,this.index=0,this.delay=0,this.blend="relative",this.additive=!0,this.sort,this.finished=!1,this.startTime,this.progress,this.onend,this.remove=!0,t&&Object.keys(t).forEach(function(e){this[e]=t[e]}.bind(this))}Object.defineProperty(e,"__esModule",{value:!0});var c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};e.animationFromDescription=o,e.HyperGroup=s,e.HyperAnimation=u;var f=0,p={zero:function(){return 0},add:function(t,e){return t+e},subtract:function(t,e){return t-e},interpolate:function(t,e,n){return t+(e-t)*n}};s.prototype={constructor:s,copy:function(){return new this.constructor(this.group)},runAnimation:function(t,e,n){this.sortIndex=f++,this.startTime=n.time,this.group.forEach(function(i){i.runAnimation.call(i,t,e,n)})},composite:function(t,e){this.group.forEach(function(n){n.composite.call(n,t,e)})}},u.prototype={constructor:u,copy:function t(){for(var t=new this.constructor(this.settings),e=Object.getOwnPropertyNames(this),n=e.length,i=0;i<n;i++)Object.defineProperty(t,e[i],Object.getOwnPropertyDescriptor(this,e[i]));return t},composite:function(t,e){if(null===this.startTime||void 0===this.startTime)throw new Error("Cannot composite an animation that has not been started.");var i=Math.max(0,e-(this.startTime+this.delay)),r=this.speed,o=1,a=1,s=this.duration,u=s*this.iterations;u&&(o=i*r/s,a=i*r/u),a>=1&&(o=1,this.finished=!0);var c=0;if(this.finished||(this.autoreverse===!0&&(c=Math.floor(o)%2),o%=1),c&&(o=1-o),n(this.easing))o=this.easing(o);else if("step-start"===this.easing)o=Math.ceil(o);else if("step-middle"===this.easing)o=Math.round(o);else if("step-end"===this.easing)o=Math.floor(o);else{var f=.5-Math.cos(o*Math.PI)/2;if(this.easing){var p=/(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);if(p){var l=p[1],h=p[2];h>0?"step-start"===l?o=Math.ceil(o*h)/h:"step-middle"===l?o=Math.round(o*h)/h:"step-end"!==l&&"steps"!==l||(o=Math.floor(o*h)/h):"linear"!==this.easing&&(o=f)}else"linear"!==this.easing&&(o=f)}else o=f}var d="absolute"===this.blend?this.type.interpolate(this.from,this.to,o):this.type.interpolate(this.delta,this.type.zero(this.to),o),m=this.property;if("undefined"!=typeof m&&null!==m){var y=d,g=t[m];"undefined"!=typeof g&&null!==g||(g=this.type.zero(this.to)),this.additive&&(y=this.type.add(g,d)),this.sort&&Array.isArray(y)&&y.sort(this.sort),t[m]=y}var b=o!==this.progress;return this.progress=o,b},runAnimation:function(t,e,i){if(n(this.type)&&(this.type=new this.type),!(this.type&&n(this.type.zero)&&n(this.type.add)&&n(this.type.subtract)&&n(this.type.interpolate)))throw new Error("Hyper.Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");this.from||(this.from=this.type.zero(this.to)),this.to||(this.to=this.type.zero(this.from)),"absolute"!==this.blend&&(this.delta=this.type.subtract(this.from,this.to)),null!==this.duration&&"undefined"!=typeof this.duration||(this.duration=i.duration),null!==this.easing&&"undefined"!=typeof this.easing||(this.easing=i.easing),null!==this.speed&&"undefined"!=typeof this.speed||(this.speed=1),null!==this.iterations&&"undefined"!=typeof this.iterations||(this.iterations=1),this.progress=0,this.startTime=i.time,this.sortIndex=f++}}},7:function(t,e){"use strict";function n(t){return t&&"[object Function]"==={}.toString.call(t)}function i(t){this.time=a()/1e3,this.disableAnimation=!1,this.duration,this.easing,t&&Object.keys(t).forEach(function(e){this[e]=t[e]}.bind(this))}function r(){this.targets=[],this.transactions=[],this.ticking=!1,this.animationFrame,this.displayLayers=[],this.displayFunctions=[],this.cleanupFunctions=[]}Object.defineProperty(e,"__esModule",{value:!0}),e.HyperTransaction=i,e.HyperContext=r;var o="undefined"!=typeof window&&(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame)||function(t){setTimeout(t,0)},a=Date.getTime;Date.now&&(a=Date.now),"undefined"!=typeof window&&"undefined"!=typeof window.performance&&"undefined"!=typeof window.performance.now&&(a=window.performance.now.bind(window.performance)),r.prototype={createTransaction:function(t,e){var n=new i(t),r=this.transactions.length;return r&&(n.time=this.transactions[r-1].representedObject.time),this.transactions.push({representedObject:n,automaticallyCommit:e}),e&&this.startTicking(),n},currentTransaction:function(){var t=this.transactions.length;return t?this.transactions[t-1].representedObject:this.createTransaction({},!0)},beginTransaction:function(t){return this.createTransaction(t,!1)},commitTransaction:function(){this.transactions.pop()},flushTransaction:function(){},disableAnimation:function(t){t!==!1&&(t=!0);var e=this.currentTransaction();e.disableAnimation=t,this.startTicking()},registerTarget:function(t,e,n){this.startTicking();var i=this.targets.indexOf(t);i<0&&(this.targets.push(t),this.displayLayers.push(null),this.displayFunctions.push(e),this.cleanupFunctions.push(n))},deregisterTarget:function(t){var e=this.targets.indexOf(t);e>-1&&(this.targets.splice(e,1),this.displayLayers.splice(e,1),this.displayFunctions.splice(e,1),this.cleanupFunctions.splice(e,1))},startTicking:function(){this.animationFrame||(this.animationFrame=o(this.ticker.bind(this)))},ticker:function(){this.animationFrame=void 0;for(var t=this.targets,e=t.length;e--;){var i=t[e],r=this.displayFunctions[e];if(i.animationCount){if(n(r)){var o=i.presentation;this.displayLayers[e]!==o&&(i.animationCount&&(this.displayLayers[e]=o),r())}this.cleanupFunctions[e]()}else n(r)&&r(),this.deregisterTarget(i)}var a=this.transactions.length;if(a){var s=this.transactions[a-1];s.automaticallyCommit&&this.commitTransaction()}this.targets.length&&this.startTicking()}}}})});