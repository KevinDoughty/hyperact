!function(t,n){"object"==typeof exports&&"object"==typeof module?module.exports=n():"function"==typeof define&&define.amd?define([],n):"object"==typeof exports?exports.core=n():(t.Hyperact=t.Hyperact||{},t.Hyperact.core=n())}(this,function(){return function(t){function n(e){if(i[e])return i[e].exports;var r=i[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var e=window.webpackJsonpHyperact__name_;window.webpackJsonpHyperact__name_=function(i,o,a){for(var s,u,c,f=0,l=[];f<i.length;f++)u=i[f],r[u]&&l.push(r[u][0]),r[u]=0;for(s in o)Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);for(e&&e(i,o,a);l.length;)l.shift()();if(a)for(f=0;f<a.length;f++)c=n(n.s=a[f]);return c};var i={},r={2:0};return n.e=function(t){function e(){o.onerror=o.onload=null,clearTimeout(a);var n=r[t];0!==n&&(n&&n[1](new Error("Loading chunk "+t+" failed.")),r[t]=void 0)}if(0===r[t])return Promise.resolve();if(r[t])return r[t][2];var i=document.getElementsByTagName("head")[0],o=document.createElement("script");o.type="text/javascript",o.charset="utf-8",o.async=!0,o.timeout=12e4,n.nc&&o.setAttribute("nonce",n.nc),o.src=n.p+""+t+".js";var a=setTimeout(e,12e4);o.onerror=o.onload=e;var s=new Promise(function(n,e){r[t]=[n,e]});return r[t][2]=s,i.appendChild(o),s},n.m=t,n.c=i,n.i=function(t){return t},n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n.oe=function(t){throw console.error(t),t},n(n.s=14)}({14:function(t,n,e){"use strict";function i(t){return t&&"[object Function]"==={}.toString.call(t)}function r(t,n){if(t instanceof m.HyperGroup)t.group.forEach(function(t){r(t,n)});else{if(!(t instanceof m.HyperAnimation))throw new Error("not an animation");if(n.typeForProperty&&t.property){var e=n.typeForProperty.call(n,t.property,t.to);e&&(t.type=e)}}}function o(t,n,e){return i(n)?n.call(e,t):t}function a(t,n,e,r){return i(e)?e.call(r,n,t):t}function s(t,n,e,r){if(n&&i(e)){if(null===t||"undefined"==typeof t)throw new Error("convert property undefined");var o=n[t];null!==o&&"undefined"!=typeof o&&(n[t]=e.call(r,t,o))}}function u(t,n,e,i){t.forEach(function(t){if(null===t||"undefined"==typeof t)throw new Error("convert properties undefined");s(t,n,e,i)})}function c(t,n,e,r){n&&i(e)&&(n instanceof m.HyperGroup?n.group.forEach(function(n){c(t,n,e,r)}):t.forEach(function(t){var i=n[t];n.property&&null!==i&&"undefined"!=typeof i&&(n[t]=e.call(r,n.property,i))}))}function f(t,n,e,i){if(!n||!n.length)return!1;i&&n.sort(function(t,n){var e=t.index||0,i=n.index||0,r=e-i;return r||(r=t.startTime-n.startTime),r||(r=t.sortIndex-n.sortIndex),r});var r=!1;return n.forEach(function(n){r=n.composite(t,e)||r}),r}function l(t,n,e,r,o,a,s){var u=void 0;i(o.animationForKey)&&(u=o.animationForKey.call(o,t,n,e,r));var c=(0,m.animationFromDescription)(u);return c||(c=(0,m.animationFromDescription)(a)),c&&c instanceof m.HyperAnimation&&(null!==c.property&&"undefined"!=typeof c.property||(c.property=t),null!==c.from&&"undefined"!=typeof c.from||("absolute"===c.blend?c.from=r:c.from=e),null!==c.to&&"undefined"!=typeof c.to||(c.to=n),null!==c.easing&&"undefined"!=typeof c.easing||(c.easing=s.easing),null!==c.duration&&"undefined"!=typeof c.duration||(c.duration=s.duration),c.duration||(c.duration=0)),c}function p(t,n,e){return h(t,n,e)}function h(t,n,e){function s(t){y&&(t=o(t,n.keyOutput,n));var e=a(N[t],t,n.output,n);return e}function p(t,n){var e={};e[n]=t,h(e)}function h(e){var i=O.currentTransaction(),r=t.presentation,s={};Object.keys(e).forEach(function(i){var r=i,u=e[i];y&&(r=o(i,n.keyInput,n)),t.registerAnimatableProperty(r);var c=a(u,i,n.input,n),f=M[r];_[r]=f,M[r]=c,s[i]=u}),i.disableAnimation||Object.keys(s).forEach(function(e){var u=e;y&&(u=o(e,n.keyInput,n));var c=s[e],f=r[e],p=a(_[u],e,n.output,n),h=l(e,c,p,f,n,k[e],i);h?t.addAnimation(h):t.needsDisplay()})}function d(){C=-1}function T(){var e=function(){};i(n.display)&&(e=function(){N=t.presentation,n.display.call(n),N=M}),O.registerTarget(t,e,d,j)}function j(){for(var n=P.length,e=[];n--;){var r=P[n];if(r.finished){P.splice(n,1);var o=E[n];E.splice(n,1),delete x[o],i(r.onend)&&e.push(r)}}g||P.length||O.deregisterTarget(t),e.forEach(function(t){t.onend.call(t,!0)})}function A(n){var e=P.indexOf(n);if(e>-1){P.splice(e,1);var r=E[e];E.splice(e,1),delete x[r],i(n.onend)&&n.onend.call(n,!1)}g||P.length||O.deregisterTarget(t)}function F(i){return(e!==t||v.indexOf(i)<0&&w.indexOf(i)<0)&&(e!==n||b.indexOf(i)<0)}if(!t)throw new Error("Nothing to hyperactivate.");if(t.registerAnimatableProperty||t.addAnimation)throw new Error("Already hyperactive");n||(n=t),e||(e=t);var P=[],E=[],x={},k={},H=!1,M={},_={},D=null,z=[],N=M,C=-1;return t.registerAnimatableProperty=function(t,i){if(F(t)){var r=!1;z.indexOf(t)===-1&&(r=!0),r&&z.push(t);var o=Object.getOwnPropertyDescriptor(e,t);if(i?k[t]=i:null===k[t]&&delete k[t],!o||o.configurable===!0){var u=a(e[t],t,n.input,n);M[t]=u,"undefined"==typeof u&&(M[t]=null),r&&Object.defineProperty(e,t,{get:function(){return s(t)},set:function(n){p(n,t)},enumerable:!0,configurable:!0})}if("animations"===t)throw new Error("I don't think so")}},Object.defineProperty(t,"layer",{get:function(){return e},set:function(t){t&&h(t)},enumerable:!1,configurable:!1}),Object.defineProperty(t,"animationCount",{get:function(){return P.length},enumerable:!1,configurable:!1}),Object.defineProperty(t,"animations",{get:function(){var t=P.map(function(t){var e=t.copy.call(t);return c(["from","to","delta"],e,n.output,n),e});return t},enumerable:!1,configurable:!1}),Object.defineProperty(t,"animationNames",{get:function(){return Object.keys(x)},enumerable:!1,configurable:!1}),Object.defineProperty(t,"presentation",{get:function(){var t=O.currentTransaction().time;if(t===C&&null!==D)return D;var i=Object.assign(Object.keys(e).reduce(function(t,n){return F(n)&&(t[n]=e[n]),t},{}),M),r=!0;return P.length&&(r=f(i,P,t,H)),(r||null===D)&&(u(Object.keys(i),i,n.output,n),D=i,Object.freeze(D)),C=t,H=!1,D},enumerable:!1,configurable:!1}),Object.defineProperty(t,"model",{get:function(){var t=Object.assign({},e);return z.forEach(function(e){var i=a(M[e],e,n.output,n);Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!1})}),Object.freeze(t),t},enumerable:!1,configurable:!1}),Object.defineProperty(t,"previous",{get:function(){var t=Object.assign({},e);return z.forEach(function(e){var i=a(_[e],e,n.output,n);Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!1}),_[e]=M[e]}),Object.freeze(t),t},enumerable:!1,configurable:!1}),t.needsDisplay=function(){D=null,P.length||T()},t.addAnimation=function(e,i){var o=(0,m.animationFromDescription)(e);if(!(o instanceof m.HyperAnimation||o instanceof m.HyperGroup))throw new Error("Animations must be a Hyper.Animation or Group subclass:"+JSON.stringify(o));if(c(["from","to"],o,n.input,n),r(o,n),P.length||T(),P.push(o),null!==i&&"undefined"!=typeof i){var a=x[i];a&&A(a),x[i]=o}"undefined"==typeof i||null===i||i===!1?E.push(null):E.push(i),H=!0;var s=O.currentTransaction();o.runAnimation(t,i,s)},t.removeAnimation=function(t){var n=x[t];n&&A(n)},t.removeAllAnimations=function(){P.length=0,E.length=0,x={},P.forEach(function(t){i(t.onend)&&t.onend.call(t,!1)}),g||O.deregisterTarget(t)},t.animationNamed=function(t){var e=x[t];if(e){var i=e.copy.call(e);return c(["from","to","delta"],i,n.output,n),i}return null},Object.keys(e).forEach(function(n){t.registerAnimatableProperty(n)}),t}Object.defineProperty(n,"__esModule",{value:!0}),n.disableAnimation=n.flushTransaction=n.currentTransaction=n.commitTransaction=n.beginTransaction=void 0,n.decorate=p,n.activate=h;var d=e(6),m=e(5),y=!0,g=!0,b=["display","animationForKey","input","output"],v=["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations","removeAnimation"],w=["layer","presentation","model","previous","animations","animationNames","animationCount"],O=new d.HyperContext;n.beginTransaction=O.beginTransaction.bind(O),n.commitTransaction=O.commitTransaction.bind(O),n.currentTransaction=O.currentTransaction.bind(O),n.flushTransaction=O.flushTransaction.bind(O),n.disableAnimation=O.disableAnimation.bind(O)},5:function(t,n,e){"use strict";function i(t){return t&&"[object Function]"==={}.toString.call(t)}function r(t){return!isNaN(parseFloat(t))&&isFinite(t)}function o(t){return t&&"object"===("undefined"==typeof t?"undefined":f(t))}function a(t){var n=void 0;if(!t)return t;if(t instanceof u||t instanceof c)n=t.copy.call(t);else if(Array.isArray(t))n=new u(t);else if(o(t))n=new c(t);else if(r(t))n=new c({duration:t});else{if(t!==!0)throw new Error("is this an animation:"+JSON.stringify(t));n=new c({})}return n}function s(){}function u(t){s.call(this),Array.isArray(t)||(t=[]),this.group=t.map(function(t){return a(t)}),this.sortIndex,this.startTime,Object.defineProperty(this,"finished",{get:function(){var t=!0;return this.group.forEach(function(n){n.finished||(t=!1)}),t},enumerable:!1,configurable:!1})}function c(t){s.call(this),this.property,this.from,this.to,this.type=p,this.delta,this.duration,this.easing,this.speed,this.iterations,this.autoreverse,this.fillMode,this.index=0,this.delay=0,this.blend="relative",this.additive=!0,this.sort,this.finished=!1,this.startTime,this.progress,this.onend,this.remove=!0,t&&Object.keys(t).forEach(function(n){this[n]=t[n]}.bind(this))}Object.defineProperty(n,"__esModule",{value:!0});var f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};n.animationFromDescription=a,n.HyperGroup=u,n.HyperAnimation=c;var l=0,p={zero:function(){return 0},add:function(t,n){return t+n},subtract:function(t,n){return t-n},interpolate:function(t,n,e){return t+(n-t)*e}};u.prototype={constructor:u,copy:function(){return new this.constructor(this.group)},runAnimation:function(t,n,e){this.sortIndex=l++,null!==this.startTime&&"undefined"!=typeof this.startTime||(this.startTime=e.time),this.group.forEach(function(i){i.runAnimation.call(i,t,n,e)})},composite:function(t,n){var e=!1;return this.group.forEach(function(i){e=i.composite.call(i,t,n)||e}),e}},c.prototype={constructor:c,copy:function t(){for(var t=new this.constructor(this.settings),n=Object.getOwnPropertyNames(this),e=n.length,i=0;i<e;i++)Object.defineProperty(t,n[i],Object.getOwnPropertyDescriptor(this,n[i]));return t},composite:function(t,n){if(null===this.startTime||void 0===this.startTime)throw new Error("Cannot composite an animation that has not been started.");var e=Math.max(0,n-(this.startTime+this.delay)),r=this.speed,o=1,a=1,s=this.duration,u=s*this.iterations;u&&(o=e*r/s,a=e*r/u),a>=1&&(o=1,this.finished=!0);var c=0;if(this.finished||(this.autoreverse===!0&&(c=Math.floor(o)%2),o%=1),c&&(o=1-o),i(this.easing))o=this.easing(o);else if("step-start"===this.easing)o=Math.ceil(o);else if("step-middle"===this.easing)o=Math.round(o);else if("step-end"===this.easing)o=Math.floor(o);else{var f=.5-Math.cos(o*Math.PI)/2;if(this.easing){var l=/(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);if(l){var p=l[1],h=l[2];h>0?"step-start"===p?o=Math.ceil(o*h)/h:"step-middle"===p?o=Math.round(o*h)/h:"step-end"!==p&&"steps"!==p||(o=Math.floor(o*h)/h):"linear"!==this.easing&&(o=f)}else"linear"!==this.easing&&(o=f)}else o=f}var d="absolute"===this.blend?this.type.interpolate(this.from,this.to,o):this.type.interpolate(this.delta,this.type.zero(this.to),o),m=this.property;if("undefined"!=typeof m&&null!==m){var y=d,g=t[m];"undefined"!=typeof g&&null!==g||(g=this.type.zero(this.to)),this.additive&&(y=this.type.add(g,d)),this.sort&&Array.isArray(y)&&y.sort(this.sort),t[m]=y}var b=o!==this.progress;return this.progress=o,b},runAnimation:function(t,n,e){if(i(this.type)&&(this.type=new this.type),!(this.type&&i(this.type.zero)&&i(this.type.add)&&i(this.type.subtract)&&i(this.type.interpolate)))throw new Error("Hyper.Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");this.from||(this.from=this.type.zero(this.to)),this.to||(this.to=this.type.zero(this.from)),"absolute"!==this.blend&&(this.delta=this.type.subtract(this.from,this.to)),null!==this.duration&&"undefined"!=typeof this.duration||(this.duration=e.duration),null!==this.easing&&"undefined"!=typeof this.easing||(this.easing=e.easing),null!==this.speed&&"undefined"!=typeof this.speed||(this.speed=1),null!==this.iterations&&"undefined"!=typeof this.iterations||(this.iterations=1),this.startTime=e.time,this.sortIndex=l++}}},6:function(t,n,e){"use strict";function i(t){return t&&"[object Function]"==={}.toString.call(t)}function r(t){this.time,this.disableAnimation=!1,this.duration,this.easing,t&&Object.keys(t).forEach(function(n){this[n]=t[n]}.bind(this))}function o(){this.targets=[],this.transactions=[],this.ticking=!1,this.animationFrame,this.displayLayers=[],this.displayFunctions=[],this.cleanupFunctions=[],this.invalidateFunctions=[]}Object.defineProperty(n,"__esModule",{value:!0}),n.HyperTransaction=r,n.HyperContext=o;var a="undefined"!=typeof window&&(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame)||function(t){setTimeout(t,0)},s=Date.getTime;Date.now&&(s=Date.now),"undefined"!=typeof window&&"undefined"!=typeof window.performance&&"undefined"!=typeof window.performance.now&&(s=window.performance.now.bind(window.performance)),o.prototype={createTransaction:function(t,n){var e=new r(t),i=this.transactions.length,o=s()/1e3;return i&&(o=this.transactions[i-1].representedObject.time),Object.defineProperty(e,"time",{get:function(){return o},enumerable:!0,configurable:!1}),this.transactions.push({representedObject:e,automaticallyCommit:n}),n&&this.startTicking(),e},currentTransaction:function(){var t=this.transactions.length;return t?this.transactions[t-1].representedObject:this.createTransaction({},!0)},beginTransaction:function(t){return this.createTransaction(t,!1)},commitTransaction:function(){this.transactions.pop()},flushTransaction:function(){this.invalidateFunctions.forEach(function(t){t()})},disableAnimation:function(t){t!==!1&&(t=!0);var n=this.currentTransaction();n.disableAnimation=t,this.startTicking()},registerTarget:function(t,n,e,i){this.startTicking();var r=this.targets.indexOf(t);r<0&&(this.targets.push(t),this.displayLayers.push(null),this.displayFunctions.push(n),this.cleanupFunctions.push(i),this.invalidateFunctions.push(e))},deregisterTarget:function(t){var n=this.targets.indexOf(t);n>-1&&(this.targets.splice(n,1),this.displayLayers.splice(n,1),this.displayFunctions.splice(n,1),this.cleanupFunctions.splice(n,1),this.invalidateFunctions.splice(n,1))},startTicking:function(){this.animationFrame||(this.animationFrame=a(this.ticker.bind(this)))},ticker:function(){this.animationFrame=void 0;for(var t=this.targets,n=t.length;n--;){var e=t[n],r=this.displayFunctions[n];if(e.animationCount){var o=e.presentation;this.displayLayers[n]!==o&&(e.animationCount&&(this.displayLayers[n]=o),r(),this.invalidateFunctions[n]()),this.cleanupFunctions[n]()}else i(r)&&(e.presentation,r()),this.invalidateFunctions[n](),this.deregisterTarget(e)}var a=this.transactions.length;if(a){var s=this.transactions[a-1];s.automaticallyCommit&&this.commitTransaction()}this.targets.length&&this.startTicking()}}}})});