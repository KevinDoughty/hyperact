!function(t){function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var e={};n.m=t,n.c=e,n.i=function(t){return t},n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=1)}([function(t,n,e){"use strict";function i(t){this.time,this.disableAnimation=!1,this.duration,this.easing,t&&Object.keys(t).forEach(function(n){this[n]=t[n]}.bind(this))}function r(){this.targets=[],this.getPresentations=[],this.getAnimationCounts=[],this.transactions=[],this.ticking=!1,this.animationFrame,this.displayLayers=[],this.displayFunctions=[],this.cleanupFunctions=[],this.invalidateFunctions=[],this.force=[],this.changers=[]}function o(t){return t&&"[object Function]"==={}.toString.call(t)}function s(){}function a(){}function u(t,n,e){this.subtype=t,o(t)&&(this.subtype=new t(e)),this.length=n}function c(t){o(t)?this.sort=t:t&&o(t.sort)&&(this.sort=t.sort),this.debug="HyperSet"}function h(t,n,e,i){return{origin:l(t,n),size:d(e,i)}}function f(){return h(0,0,0,0)}function l(t,n){return{x:t,y:n}}function p(){return l(0,0)}function d(t,n){return{width:t,height:n}}function y(){return d(0,0)}function m(t){return t&&"[object Function]"==={}.toString.call(t)}function g(t){return!isNaN(parseFloat(t))&&isFinite(t)}function v(t){return t&&"object"===(void 0===t?"undefined":D(t))}function b(t){var n=[];Array.isArray(t)?n=t:t&&Array.isArray(t.chain)&&(n=t.chain),this.chain=n.map(function(t){return x(t)}),Object.defineProperty(this,"finished",{get:function(){return!this.chain.length||this.chain[this.chain.length-1].finished},enumerable:!1,configurable:!1}),t&&!Array.isArray(t)&&Object.keys(t).forEach(function(n){"chain"!==n&&"finished"!==n&&(this[n]=t[n])}.bind(this))}function w(t){var n=[];Array.isArray(t)?n=t:t&&t.group&&(n=t.group),this.group=n.map(function(t){return x(t)}),Object.defineProperty(this,"finished",{get:function(){var t=!0;return this.group.forEach(function(n){n.finished||(t=!1)}),t},enumerable:!1,configurable:!1}),t&&!Array.isArray(t)&&Object.keys(t).forEach(function(n){"group"!==n&&"finished"!==n&&(this[n]=t[n])}.bind(this))}function A(t){return t.finished&&("forwards"===t.fillMode||"both"===t.fillMode)}function O(){this.property,this.type,this.duration,this.easing,this.speed,this.iterations,this.autoreverse,this.fillMode,this.index=0,this.delay=0,this.blend="relative",this.additive=!0,this.sort,this.finished=!1,this.startTime,this.progress,this.onend,this.remove=!0}function k(t){O.call(this);var n=[];t&&Array.isArray(t.keyframes)&&(n=t.keyframes),this.keyframes=n;var e=this.keyframes.length;t&&Object.keys(t).forEach(function(n){"keyframes"!==n&&(this[n]=t[n])}.bind(this)),Array.isArray(this.offsets)&&this.offsets.length===e?this.offsets.sort(function(t,n){return t-n}):this.offsets=e<2?[]:this.keyframes.map(function(t,n){return n/(e-1)}),this.progress=null}function T(t){O.call(this),this.from,this.to,this.delta,t&&Object.keys(t).forEach(function(n){this[n]=t[n]}.bind(this)),this.progress=null}function j(t){return t&&m(t.add)&&m(t.subtract)&&m(t.zero)&&m(t.interpolate)}function x(t){var n=void 0;if(!t&&0!==t)return t;if(t instanceof O||t instanceof k||t instanceof w||t instanceof b)n=t.copy.call(t);else if(Array.isArray(t))n=new w(t);else if(v(t))n=j(t)?new T({type:t}):Array.isArray(t.keyframes)?new k(t):Array.isArray(t.group)?new w(t):Array.isArray(t.chain)?new b(t):new T(t);else if(g(t))n=new T({duration:t});else{if(!0!==t)throw new Error("is this an animation:"+JSON.stringify(t));n=new T({})}return n}function E(t){return t&&"[object Function]"==={}.toString.call(t)}function S(t,n,e,i,r){if(t instanceof T||t instanceof k){var o=t.property;if(n&&o&&E(n.typeOfProperty)){var s=n.typeOfProperty.call(n,o);s&&(t.type=s)}var a=z(o,n.keyInput,n),u=e[a],h=i[a]||N(u);t.property&&t.type&&r(t.property,t.type,!0),t instanceof T?((Array.isArray(t.from)||Array.isArray(t.to))&&!t.type&&E(t.sort)&&(t.type=new c(t.sort)),t.type||(t.type=h),(t.from||0===t.from)&&(t.from=F(t.from,a,n,i,t.type)),(t.to||0===t.to)&&(t.to=F(t.to,a,n,i,t.type)),(t.delta||0===t.delta)&&(t.delta=F(t.delta,a,n,i,t.type))):(t.type||(t.type=h),t.keyframes&&(t.keyframes=t.keyframes.map(function(e){return F(e,a,n,i,t.type)})),t.delta&&(t.delta=t.delta.map(function(e){return F(e,a,n,i,t.type)})))}else if(t instanceof w)t.group.forEach(function(t){S(t,n,e,i,r)});else{if(!(t instanceof b))throw new Error("not an animation");t.chain.forEach(function(t){S(t,n,e,i,r)})}}function z(t,n,e){return E(n)?n.call(e,t):t}function F(t,n,e,i,r){if(e&&E(e.input))return e.input.call(e,n,t);var o=t,s=i[n];return r&&E(r.input)?o=r.input.call(r,n,t):s&&E(s.input)&&(o=s.input.call(s,n,t)),o}function P(t,n,e,i,r){if(e&&E(e.output))return e.output.call(e,n,t);var o=t,s=i[n];return r&&E(r.output)?o=r.output.call(r,n,t):s&&E(s.output)&&(o=s.output.call(s,n,t)),o}function N(t){return t?t.type?E(t.type)?new t.type:t.type:E(t)?new t:t:null}function M(t){if(t&&(t instanceof T||t instanceof k||t instanceof w||t instanceof b))return!0}function C(t,n,e,i,r,o,s,a){var u=void 0,c=void 0;if(E(r.animationForKey)&&(c=r.animationForKey.call(r,t,n,e,i)),null===c)return null;o||(o={type:s}),o&&!M(o)&&(u=Object.assign({},o)),u&&!M(c)?u=Object.assign(u,c):(c||0===c)&&(u=c);var h=x(c);return h||!(h=x(o))||(h.duration||0===h.duration||a.duration&&(h.duration=a.duration),h.duration)?(h&&(h instanceof T||h instanceof k)&&(null!==h.property&&void 0!==h.property||(h.property=t),h instanceof T&&(null!==h.from&&void 0!==h.from||("absolute"===h.blend?h.from=i:h.from=e),null!==h.to&&void 0!==h.to||(h.to=n)),null!==h.easing&&void 0!==h.easing||(h.easing=a.easing),null!==h.duration&&void 0!==h.duration||(h.duration=a.duration),h.duration||(h.duration=0)),h):null}function I(t,n,e,i){if(!n||!n.length)return!1;i&&n.sort(function(t,n){var e=t.index||0,i=n.index||0,r=e-i;return r||(r=t.startTime-n.startTime),r||(r=t.sortIndex-n.sortIndex),r});var r=!1;return n.forEach(function(n){r=n.composite(t,e)||r;var i=n.property;if(i&&t[i]&&t[i].px&&t[i].px.length&&t[i].px.substring&&"NaN"===t[i].px.substring(t[i].px.length-3))throw new Error("hyperact NaN composite sourceLayer:"+JSON.stringify(t)+";")}),r}function H(t,n,e,i){function r(t){var e=z(t,n.keyOutput,n);return null===dt?(console.log("activeBacking === null doesn't happen"),q()[e]):dt[e]}function o(t,n){var e={};e[n]=t,a(e)}function a(t){Y.registerFlusher(J);var e=Y.currentTransaction();D(),Object.keys(t).forEach(function(e){var i=t[e],r=z(e,n.keyInput,n);d(r);var o=F(i,r,n,it);at[r]=o,ut[r]=i}),yt||(Z(),yt={},Y.registerChanger(H),lt=ft),ft=null,e.disableAnimation||Object.assign(yt,t)}function u(t){var e=Object.keys(t),i=Y.currentTransaction(),r=D();e.forEach(function(t){var e=z(t,n.keyInput,n),o=q()[t],s=R()[t];if(o!==s){var a=r[t],u=C(t,o,s,a,n,rt[e],it[e],i);u?K(u):Z()}})}function c(t,n){if(n>-1){tt.splice(n,1);var e=nt[n];nt.splice(n,1),delete et[e]}}function h(t,n,e){if(t instanceof w)t.group.forEach(function(t){h(t,-1,e)});else if(t instanceof b)t.chain.forEach(function(t){h(t,-1,e)});else if(!(t instanceof T||t instanceof k))throw new Error("not an animation");t.finished&&(A(t)||c(t,n),E(t.onend)&&e.push(t))}function f(){for(var t=tt.length,n=[];t--;)h(tt[t],t,n);n.forEach(function(t){t.onend.call(t,!0),t.onend=null})}function l(t){var n=tt.indexOf(t);if(n>-1){tt.splice(n,1);var e=nt[n];nt.splice(n,1),delete et[e],E(t.onend)&&t.onend.call(t,!1)}}function p(i){return(e!==t||U.indexOf(i)<0&&V.indexOf(i)<0)&&(e!==n||B.indexOf(i)<0)}function d(t,n){y(t,n)}function y(t,i,s){var a=z(t,n.keyInput,n);if(p(t)){var u=!1,c=pt.indexOf(a);-1===c&&(u=!0);var h=e[t];u&&pt.push(a);var f=Object.getOwnPropertyDescriptor(e,t);if(null===i?(delete it[a],delete rt[a],pt.splice(c,1)):s||j(i)?(it[a]=i,u&&(rt[a]={type:i})):(rt[a]=i,i&&(it[a]=i.type)),void 0!==h&&null!==h){var l=F(h,a,n,it);at[a]=l,ut[a]=h}f&&!0!==f.configurable||Object.defineProperty(e,t,{get:function(){return r(t)},set:function(n){o(n,t)},enumerable:!0,configurable:!0})}}function m(){return e}function g(t){t&&a(t)}function v(){return tt.length}function O(){return tt.map(function(t){return t.description.call(t,n)})}function N(){return Object.keys(et)}function M(){return Object.keys(e).filter(p).reduce(function(t,n){return t[n]=e[n],t},{})}function H(){u(yt),yt=null}function J(){ht=null,ct=null}function L(){ht=null}function W(){var t=Y.currentTransaction().time,e=Object.assign({},at),i=!0;return tt.length&&(i=I(e,tt,t,ot)),ot=!1,!i&&ct||(pt.forEach(function(t){var i=z(t,n.keyOutput,n),r=e[t];r&&r.length&&r.substring&&r.substring(r.length-3),e[t]=P(r,i,n,it),e[t]&&e[t].length&&e[t].substring&&e[t].substring(e[t].length-3)}),Object.freeze(e),ct=e),ht=null,ct}function D(){if(null!==ht&&null!==ct)return ht;var t=W(),e=M();return pt.forEach(function(i){var r=t[i],o=z(i,n.keyInput,n);Object.defineProperty(e,o,{value:r,enumerable:!0,configurable:!1})}),Object.freeze(e),ht=e}function q(){if(null!==ft)return ft;var t=M();return pt.forEach(function(e){var i=ut[e],r=z(e,n.keyInput,n);Object.defineProperty(t,r,{value:i,enumerable:!0,configurable:!1})}),Object.freeze(t),ft=t}function R(){return null!==lt?lt:q()}function _(){L(),Z()}function K(t,i){var r=Y.currentTransaction();D();var o=x(t);if(!(o instanceof T||o instanceof k||o instanceof w||o instanceof b))throw new Error("Not a valid animation:"+JSON.stringify(o));if(S(o,n,rt,it,y),tt.length||Z(),tt.push(o),null!==i&&void 0!==i){var s=et[i];s&&l(s),et[i]=o}void 0===i||null===i||!1===i?nt.push(null):nt.push(i),ot=!0,o.runAnimation(e,i,r)}function X(t){var n=et[t];n&&l(n)}function G(){tt.length=0,nt.length=0,et={},tt.forEach(function(t){E(t.onend)&&t.onend.call(t,!1)})}function Q(t){var e=et[t];return e?e.description.call(e,n):null}function Z(){if(!yt){var t=E(n.display)?function(t){dt=W(),n.display.call(n,t),dt=ut}:function(){};Y.registerTarget(e,W,v,t,L,f,!0,at)}}function $(t){var n=i?i[t]:void 0;return n&&j(n)?{type:n}:n}if(t){if(t.registerAnimatableProperty||t.addAnimation)throw new Error("Already hyperactive");n?E(n)&&(n={display:n}):n=t,e||(e=t)}else n?E(n)&&(n={display:n}):n={},e||(e=n);var tt=[],nt=[],et={},it={},rt={},ot=!1,st={},at={},ut={},ct=null,ht=null,ft=null,lt=null,pt=[],dt=st,yt=null;return Object.keys(e).filter(p).forEach(function(t){var i=e[t],r=z(t,n.keyInput,n);d(r,$(t)||{type:new s}),F(i,r,n,it),ut[r]=i}),i&&Object.keys(i).filter(p).forEach(function(t){d(z(t,n.keyInput,n),$(t))}),dt=q(),dt=ut,t&&(t.registerAnimatableProperty=d,t.needsDisplay=_,t.addAnimation=K,t.removeAnimation=X,t.removeAllAnimations=G,t.animationNamed=Q,Object.defineProperty(t,"layer",{get:m,set:g,enumerable:!0,configurable:!1}),Object.defineProperty(t,"animationCount",{get:v,enumerable:!0,configurable:!1}),Object.defineProperty(t,"animations",{get:O,enumerable:!0,configurable:!1}),Object.defineProperty(t,"animationNames",{get:N,enumerable:!0,configurable:!1}),Object.defineProperty(t,"presentation",{get:D,enumerable:!0,configurable:!1}),Object.defineProperty(t,"model",{get:q,enumerable:!0,configurable:!1}),Object.defineProperty(t,"previous",{get:R,enumerable:!0,configurable:!1})),t}e.d(n,"a",function(){return H});var J="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},L="undefined"!=typeof window&&(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame)||function(t){setTimeout(t,0)},W=Date.getTime;Date.now&&(W=Date.now),"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now&&(W=window.performance.now.bind(window.performance)),r.prototype={createTransaction:function(t,n){var e=new i(t),r=this.transactions.length,o=W()/1e3;return r&&(o=this.transactions[r-1].representedObject.time),Object.defineProperty(e,"time",{get:function(){return o},enumerable:!0,configurable:!1}),this.transactions.push({representedObject:e,automaticallyCommit:n,flushers:[]}),n&&this.startTicking(),e},createTransactionWrapper:function(t,n){for(var e=this.targets,r=e.length;r--;)this.invalidateFunctions[r]();var o=new i(t),s=this.transactions.length,a=W()/1e3;s&&(a=this.transactions[s-1].representedObject.time),Object.defineProperty(o,"time",{get:function(){return a},enumerable:!0,configurable:!1});var u={representedObject:o,automaticallyCommit:n,flushers:[]};return this.transactions.push(u),n&&this.startTicking(),u},currentTransaction:function(){var t=this.transactions.length;return t?this.transactions[t-1].representedObject:this.createTransactionWrapper({},!0).representedObject},beginTransaction:function(t){return this.createTransactionWrapper(t,!1).representedObject},commitTransaction:function(){this.clearChangers(),this.clearFlushers(),this.transactions.pop()},clearFlushers:function(){var t=this.currentTransactionWrapper();t.flushers.forEach(function(t){t()}),t.flushers.length=0;for(var n=this.targets,e=n.length;e--;)this.invalidateFunctions[e]()},flushTransaction:function(){this.clearChangers(),this.clearFlushers()},currentTransactionWrapper:function(){var t=this.transactions.length;return t?this.transactions[t-1]:this.createTransactionWrapper({},!0)},registerFlusher:function(t){this.currentTransactionWrapper().flushers.push(t)},registerChanger:function(t){this.changers.push(t),this.startTicking()},clearChangers:function(){for(var t=this.changers,n=t.length;n--;)t[n]();t.length=0},disableAnimation:function(t){!1!==t&&(t=!0),this.currentTransaction().disableAnimation=t,this.startTicking()},registerTarget:function(t,n,e,i,r,o,s){var a=arguments.length>7&&void 0!==arguments[7]?arguments[7]:null;this.startTicking();var u=this.targets.indexOf(t);u<0?(this.targets.push(t),this.getPresentations.push(n),this.getAnimationCounts.push(e),this.displayLayers.push(a),this.displayFunctions.push(i),this.cleanupFunctions.push(o),this.invalidateFunctions.push(r),this.force.push(s)):this.force[u]=s},deregisterTarget:function(t){var n=this.targets.indexOf(t);n>-1&&(this.targets.splice(n,1),this.getPresentations.splice(n,1),this.getAnimationCounts.splice(n,1),this.displayLayers.splice(n,1),this.displayFunctions.splice(n,1),this.cleanupFunctions.splice(n,1),this.invalidateFunctions.splice(n,1),this.force.splice(n,1))},startTicking:function(){this.animationFrame||(this.animationFrame=L(this.ticker.bind(this)))},ticker:function(){this.clearChangers(),this.animationFrame=void 0;for(var t=this.targets,n=t.length;n--;){var e=t[n],i=this.displayFunctions[n],r=this.getAnimationCounts[n](),o=this.getPresentations[n];if(r){var s=o();(this.force[n]||this.displayLayers[n]!==s)&&(this.displayLayers[n]=s,i(s)),this.cleanupFunctions[n]()}else this.invalidateFunctions[n](),i(o()),this.deregisterTarget(e);this.force[n]=!1}var a=this.transactions.length;a&&this.transactions[a-1].automaticallyCommit&&this.commitTransaction(),this.targets.length&&this.startTicking()}};var D="function"==typeof Symbol&&"symbol"===J(Symbol.iterator)?function(t){return void 0===t?"undefined":J(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":void 0===t?"undefined":J(t)},q=function(){function t(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(n,e,i){return e&&t(n.prototype,e),i&&t(n,i),n}}();s.prototype={constructor:s,zero:function(){return 0},add:function(t,n){return t+n},subtract:function(t,n){return t-n},interpolate:function(t,n,e){return t+(n-t)*e},input:function(t,n){return n},output:function(t,n){return n},toString:function(){return"HyperNumber"},toJSON:function(){return this.toString()}},a.prototype={constructor:a,zero:function(){return 1},add:function(t,n){return t*n},subtract:function(t,n){return 0===n?0:t/n},interpolate:function(t,n,e){return t+(n-t)*e},toString:function(){return"HyperScale"},toJSON:function(){return this.toString()}},u.prototype={constructor:u,zero:function(){for(var t=[],n=this.length;n--;)t.push(this.subtype.zero());return t},add:function(t,n){for(var e=[],i=0;i<this.length;i++)e.push(this.subtype.add(t[i],n[i]));return e},subtract:function(t,n){for(var e=[],i=0;i<this.length;i++)e.push(this.subtype.subtract(t[i],n[i]));return e},interpolate:function(t,n,e){for(var i=[],r=0;r<this.length;r++)i.push(this.subtype.interpolate(t[r],n[r],e));return i},toString:function(){return"HyperArray"},toJSON:function(){return this.toString()}},c.prototype={constructor:c,zero:function(){return[]},add:function(t,n){if(!Array.isArray(t)&&!Array.isArray(n))return[];if(!Array.isArray(t))return n;if(!Array.isArray(n))return t;var e=[],i=t.length,r=n.length,s=0,a=0;if(o(this.sort))for(;s<i||a<r;)if(s===i)e.push(n[a]),a++;else if(a===r)e.push(t[s]),s++;else{var u=t[s],c=n[a],h=this.sort(u,c);if(0===h)e.push(u),s++,a++;else if(h<0)e.push(u),s++;else{if(!(h>0))throw new Error("HyperSet invalid sort function, add a:"+u+"; b:"+c+"; result:"+h+";");e.push(c),a++}}else for(e=t.slice(0),s=n.length;s--;)t.indexOf(n[s])<0&&e.push(n[s]);return e},subtract:function(t,n){if(!Array.isArray(t)&&!Array.isArray(n))return[];if(!Array.isArray(t))return n;if(!Array.isArray(n))return t;var e=[],i=t.length,r=n.length,s=0,a=0;if(o(this.sort))for(;(s<i||a<r)&&s!==i;)if(a===r)e.push(t[s]),s++;else{var u=t[s],c=n[a],h=this.sort(u,c);if(0===h)s++,a++;else if(h<0)e.push(u),s++;else{if(!(h>0))throw new Error("HyperSet invalid sort function, subtract a:"+u+"; b:"+c+"; result:"+h+";");a++}}else for(e=t.slice(0),s=n.length;s--;){var f=e.indexOf(n[s]);f>-1&&e.splice(f,1)}return e},interpolate:function(t,n,e){return e>=1?n:t},toString:function(){return"HyperSet"},toJSON:function(){return this.toString()}};var R=function(){function t(){}return q(t,[{key:"zero",value:function(){return p()}},{key:"add",value:function(t,n){return l(t.x+n.x,t.y+n.y)}},{key:"subtract",value:function(t,n){return l(t.x-n.x,t.y-n.y)}},{key:"interpolate",value:function(t,n,e){return l(t.x+(n.x-t.x)*e,t.y+(n.y-t.y)*e)}},{key:"toString",value:function(){return"HyperPoint"}},{key:"toJSON",value:function(){return this.toString()}}]),t}(),_=function(){function t(){}return q(t,[{key:"zero",value:function(){return y()}},{key:"add",value:function(t,n){return d(t.width+n.width,t.height+n.height)}},{key:"subtract",value:function(t,n){return d(t.width-n.width,t.height-n.height)}},{key:"interpolate",value:function(t,n,e){return d(t.width+(n.width-t.width)*e,t.height+(n.height-t.height)*e)}},{key:"toString",value:function(){return"HyperSize"}},{key:"toJSON",value:function(){return this.toString()}}]),t}(),K=(function(){function t(){}q(t,[{key:"zero",value:function(){return f()}},{key:"add",value:function(t,n){return{origin:R.prototype.add(t.origin,n.origin),size:_.prototype.add(t.size,n.size)}}},{key:"subtract",value:function(t,n){return{origin:R.prototype.subtract(t.origin,n.origin),size:_.prototype.subtract(t.size,n.size)}}},{key:"interpolate",value:function(t,n,e){return{origin:R.prototype.interpolate(t.origin,n.origin,e),size:_.prototype.interpolate(t.size,n.size,e)}}},{key:"toString",value:function(){return"HyperRect"}},{key:"toJSON",value:function(){return this.toString()}}])}(),Number.MAX_VALUE,0),X=new s;b.prototype={constructor:b,copy:function(){return new this.constructor(this)},runAnimation:function(t,n,e){this.sortIndex=K++,null!==this.startTime&&void 0!==this.startTime||(this.startTime=e.time);for(var i=this.chain.length,r=Object.assign({},e),o=this.startTime,s=0;s<i;s++){var a=this.chain[s];r.time=o,a.runAnimation.call(a,t,n,r),o=o===1/0||a.iterations===1/0?1/0:o+a.delay+a.duration*a.iterations}},composite:function(t,n){for(var e=!1,i=this.chain.length,r=0;r<i;r++){var o=this.chain[r];e=o.composite.call(o,t,n)||e}return e},convert:function(t,n){m(t)&&this.chain.forEach(function(e){e.convert.call(e,t,n)})}},b.prototype.description=function(t){var n=Object.assign({},this);return n.chain=this.chain.map(function(n){return n.description(t)}),n},w.prototype={constructor:w,copy:function(){return new this.constructor(this)},runAnimation:function(t,n,e){this.sortIndex=K++,null!==this.startTime&&void 0!==this.startTime||(this.startTime=e.time),this.group.forEach(function(i){i.runAnimation.call(i,t,n,e)})},composite:function(t,n){var e=!1;return this.group.forEach(function(i){e=i.composite.call(i,t,n)||e}),e},convert:function(t,n){m(t)&&this.group.forEach(function(e){e.convert.call(e,t,n)})}},w.prototype.description=function(t){var n=Object.assign({},this);return n.group=this.group.map(function(n){return n.description(t)}),n},O.prototype={copy:function(){return new this.constructor(this)},composite:function(t,n){if(null===this.startTime||void 0===this.startTime)throw new Error("Cannot composite an animation that has not been started.");if(this.startTime+this.delay>n&&"backwards"!==this.fillMode&&"both"!==this.fillMode)return!1;if(this.finished&&"forwards"!==this.fillMode&&"both"!==this.fillMode)return!1;var e=Math.max(0,n-(this.startTime+this.delay)),i=this.speed,r=1,o=1,s=this.duration,a=s*this.iterations;a&&(r=e*i/s,o=e*i/a),o>=1&&(r=1,this.finished=!0);var u=0;if(this.finished||(!0===this.autoreverse&&(u=Math.floor(r)%2),r%=1),u&&(r=1-r),m(this.easing))r=this.easing(r);else if("step-start"===this.easing)r=Math.ceil(r);else if("step-middle"===this.easing)r=Math.round(r);else if("step-end"===this.easing)r=Math.floor(r);else{var c=.5-Math.cos(r*Math.PI)/2;if(this.easing){var h=/(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);if(h){var f=h[1],l=h[2];l>0?"step-start"===f?r=Math.ceil(r*l)/l:"step-middle"===f?r=Math.round(r*l)/l:"step-end"!==f&&"steps"!==f||(r=Math.floor(r*l)/l):"linear"!==this.easing&&(r=c)}else"linear"!==this.easing&&(r=c)}else r=c}var p=void 0;if(this instanceof k){var d=this.keyframes.length;if(!d)throw new Error("HyperAction composite need to be able to handle zero keyframes");if(1===d)throw new Error("HyperAction composite need to be able to handle one keyframe");for(var y=d-1;y--&&!(r>=this.offsets[y]););var g=y,v=g+1,b=this.offsets[v]-this.offsets[g];if(0===b)throw new Error("can't divide by zero. check your keyframe offsets.");var w=r-this.offsets[g],A=w/b;p="absolute"===this.blend?this.type.interpolate(this.keyframes[g],this.keyframes[v],A):this.type.interpolate(this.delta[g],this.delta[v],A)}else p="absolute"===this.blend?this.type.interpolate(this.from,this.to,r):this.type.interpolate(this.delta,this.type.zero(this.to),r);var O=this.property;if(void 0!==O&&null!==O){var T=p,j=t[O];void 0!==j&&null!==j||(j=this.type.zero(this.to)),this.additive&&(T=this.type.add(j,p)),this.sort&&Array.isArray(T)&&T.sort(this.sort),t[O]=T}if(t[O]&&t[O].px&&t[O].px.length&&t[O].px.substring&&"NaN"===t[O].px.substring(t[O].px.length-3))throw new Error("hyperact NaN composite onto:"+JSON.stringify(t)+"; now:"+n+";");var x=r!==this.progress||this.finished;return this.progress=r,x}},k.prototype=Object.create(O.prototype),k.prototype.constructor=k,k.prototype.copy=function(){return new this.constructor(this)},k.prototype.runAnimation=function(t,n,e){if(this.type?m(this.type)&&(this.type=new this.type):this.type=X,!(m(this.type.zero)&&m(this.type.add)&&m(this.type.subtract)&&m(this.type.interpolate)))throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");if("absolute"!==this.blend&&this.keyframes.length){for(var i=this.keyframes.length-1,r=[],o=0;o<i;o++)r[o]=this.type.subtract(this.keyframes[o],this.keyframes[i]);r[i]=this.type.zero(this.keyframes[i]),this.delta=r}null!==this.duration&&void 0!==this.duration||(this.duration=e.duration),null!==this.easing&&void 0!==this.easing||(this.easing=e.easing),null!==this.speed&&void 0!==this.speed||(this.speed=1),null!==this.iterations&&void 0!==this.iterations||(this.iterations=1),void 0!==this.startTime&&null!==this.startTime||(this.startTime=e.time),this.sortIndex=K++},k.prototype.convert=function(t,n){m(t)&&this.property&&["keyframes","delta"].forEach(function(e){var i=this;if(this[e]){var r=this[e].slice(0);this[e]=r.map(function(e){return t.call(n,i.property,e)})}}.bind(this))},k.prototype.description=function(t){var n=Object.assign({},this);return this.convert.call(n,t.output,t),n},T.prototype=Object.create(O.prototype),T.prototype.constructor=T,T.prototype.runAnimation=function(t,n,e){if(this.type?m(this.type)&&(this.type=new this.type):this.type=X,!(m(this.type.zero)&&m(this.type.add)&&m(this.type.subtract)&&m(this.type.interpolate)))throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");this.from||(this.from=this.type.zero(this.to)),this.to||(this.to=this.type.zero(this.from)),"absolute"!==this.blend&&(this.delta=this.type.subtract(this.from,this.to)),null!==this.duration&&void 0!==this.duration||(this.duration=e.duration),null!==this.easing&&void 0!==this.easing||(this.easing=e.easing),null!==this.speed&&void 0!==this.speed||(this.speed=1),null!==this.iterations&&void 0!==this.iterations||(this.iterations=1),void 0!==this.startTime&&null!==this.startTime||(this.startTime=e.time),this.sortIndex=K++},T.prototype.convert=function(t,n){m(t)&&this.property&&["from","to","delta"].forEach(function(e){var i=this[e];null!==i&&void 0!==i&&(this[e]=t.call(n,this.property,i))}.bind(this))},T.prototype.description=function(t){var n=Object.assign({},this);return this.convert.call(n,t.output,t),n};var B=["display","animationForKey","input","output"],U=["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations","removeAnimation"],V=["layer","presentation","model","previous","animations","animationNames","animationCount"],Y=new r;Y.beginTransaction.bind(Y),Y.commitTransaction.bind(Y),Y.currentTransaction.bind(Y),Y.flushTransaction.bind(Y),Y.disableAnimation.bind(Y)},function(t,n,e){"use strict";function i(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(n,"__esModule",{value:!0});var r=e(0),o=function t(n){i(this,t),e.i(r.a)(this),this.a=0,this.b=0,this.x=0,this.y=0,this.z=0,this.display=function(){document.getElementById(n).innerHTML="one:"+JSON.stringify(this.presentation)},this.animationForKey=function(){return 1}},s=new o("one"),a={property:"e",duration:5,from:5,to:0,onend:function(t){console.log("onend:",this)}};s.addAnimation(a),document.addEventListener("mousemove",function(t){s.x=t.clientX});var u={property:"a",duration:1,from:1,to:2,blend:"absolute",additive:!0,delay:1},c={property:"b",duration:1,from:1,to:2,blend:"absolute",additive:!0,delay:1,fillMode:"backwards"};s.registerAnimatableProperty("a"),s.registerAnimatableProperty("b"),s.registerAnimatableProperty("c"),s.registerAnimatableProperty("d"),s.registerAnimatableProperty("x"),s.registerAnimatableProperty("y"),s.registerAnimatableProperty("z"),document.addEventListener("mousedown",function(t){s.x=t.clientX,s.y=t.clientY,s.addAnimation(u),s.addAnimation(c)})}]);