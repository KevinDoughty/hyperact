!function(t,i){"object"==typeof exports&&"object"==typeof module?module.exports=i():"function"==typeof define&&define.amd?define([],i):"object"==typeof exports?exports.core=i():(t.Hyperact=t.Hyperact||{},t.Hyperact.core=i())}(this,function(){return function(t){function i(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}var n=window.webpackJsonpHyperact__name_;window.webpackJsonpHyperact__name_=function(e,o,a){for(var s,c,u,h=0,f=[];h<e.length;h++)c=e[h],r[c]&&f.push(r[c][0]),r[c]=0;for(s in o)Object.prototype.hasOwnProperty.call(o,s)&&(t[s]=o[s]);for(n&&n(e,o,a);f.length;)f.shift()();if(a)for(h=0;h<a.length;h++)u=i(i.s=a[h]);return u};var e={},r={2:0},o=new Promise(function(t){t()});return i.e=function(t){function n(){s.onerror=s.onload=null,clearTimeout(c);var i=r[t];0!==i&&(i&&i[1](new Error("Loading chunk "+t+" failed.")),r[t]=void 0)}if(0===r[t])return o;if(r[t])return r[t][2];var e=new Promise(function(i,n){r[t]=[i,n]});r[t][2]=e;var a=document.getElementsByTagName("head")[0],s=document.createElement("script");s.type="text/javascript",s.charset="utf-8",s.async=!0,s.timeout=12e4,i.nc&&s.setAttribute("nonce",i.nc),s.src=i.p+""+t+".js";var c=setTimeout(n,12e4);return s.onerror=s.onload=n,a.appendChild(s),e},i.m=t,i.c=e,i.i=function(t){return t},i.d=function(t,n,e){i.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:e})},i.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(n,"a",n),n},i.o=function(t,i){return Object.prototype.hasOwnProperty.call(t,i)},i.p="",i.oe=function(t){throw console.error(t),t},i(i.s=2)}([function(t,i,n){"use strict";function e(t){return t&&"[object Function]"==={}.toString.call(t)}function r(t){return!isNaN(parseFloat(t))&&isFinite(t)}function o(t){return t&&"object"===(void 0===t?"undefined":l(t))}function a(t){var i=[];Array.isArray(t)?i=t:t&&Array.isArray(t.chain)&&(i=t.chain),this.chain=i.map(function(t){return f(t)}),Object.defineProperty(this,"finished",{get:function(){return!this.chain.length||this.chain[this.chain.length-1].finished},enumerable:!1,configurable:!1}),t&&!Array.isArray(t)&&Object.keys(t).forEach(function(i){"chain"!==i&&"finished"!==i&&(this[i]=t[i])}.bind(this))}function s(t){var i=[];Array.isArray(t)?i=t:t&&t.group&&(i=t.group),this.group=i.map(function(t){return f(t)}),Object.defineProperty(this,"finished",{get:function(){var t=!0;return this.group.forEach(function(i){i.finished||(t=!1)}),t},enumerable:!1,configurable:!1}),t&&!Array.isArray(t)&&Object.keys(t).forEach(function(i){"group"!==i&&"finished"!==i&&(this[i]=t[i])}.bind(this))}function c(){this.property,this.type=y,this.duration,this.easing,this.speed,this.iterations,this.autoreverse,this.fillMode,this.index=0,this.delay=0,this.blend="relative",this.additive=!0,this.sort,this.finished=!1,this.startTime,this.progress,this.onend,this.remove=!0}function u(t){c.call(this);var i=[];t&&Array.isArray(t.keyframes)&&(i=t.keyframes),this.keyframes=i;var n=this.keyframes.length;t&&Object.keys(t).forEach(function(i){"keyframes"!==i&&(this[i]=t[i])}.bind(this)),Array.isArray(this.offsets)&&this.offsets.length===n?this.offsets.sort(function(t,i){return t-i}):this.offsets=n<2?[]:this.keyframes.map(function(t,i){return i/(n-1)}),this.progress=null}function h(t){c.call(this),this.from,this.to,this.delta,t&&Object.keys(t).forEach(function(i){this[i]=t[i]}.bind(this)),this.progress=null}function f(t){var i=void 0;if(!t&&(p||0!==t))return t;if(t instanceof c||t instanceof u||t instanceof s||t instanceof a)i=t.copy.call(t);else if(Array.isArray(t))i=new s(t);else if(o(t))i=p&&e(t.add)&&e(t.subtract)&&e(t.zero)&&e(t.interpolate)?new h({type:t}):Array.isArray(t.keyframes)?new u(t):Array.isArray(t.group)?new s(t):Array.isArray(t.chain)?new a(t):new h(t);else if(r(t))i=new h({duration:t});else{if(!0!==t)throw new Error("is this an animation:"+JSON.stringify(t));i=new h({})}return i}Object.defineProperty(i,"__esModule",{value:!0});var l="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};i.HyperChain=a,i.HyperGroup=s,i.HyperKeyframes=u,i.HyperAnimation=h,i.animationFromDescription=f;var p=!0,d=0,y={zero:function(){return 0},add:function(t,i){return t+i},subtract:function(t,i){return t-i},interpolate:function(t,i,n){return t+(i-t)*n}};a.prototype={constructor:a,copy:function(){return new this.constructor(this)},runAnimation:function(t,i,n){this.sortIndex=d++,null!==this.startTime&&void 0!==this.startTime||(this.startTime=n.time);for(var e=this.chain.length,r=Object.assign({},n),o=this.startTime,a=0;a<e;a++){var s=this.chain[a];r.time=o,s.runAnimation.call(s,t,i,r),o=o===1/0||s.iterations===1/0?1/0:o+s.delay+s.duration*s.iterations}},composite:function(t,i){for(var n=!1,e=this.chain.length,r=0;r<e;r++){var o=this.chain[r];n=o.composite.call(o,t,i)||n}return n},convert:function(t,i){e(t)&&this.chain.forEach(function(n){n.convert.call(n,t,i)})}},s.prototype={constructor:s,copy:function(){return new this.constructor(this)},runAnimation:function(t,i,n){this.sortIndex=d++,null!==this.startTime&&void 0!==this.startTime||(this.startTime=n.time),this.group.forEach(function(e){e.runAnimation.call(e,t,i,n)})},composite:function(t,i){var n=!1;return this.group.forEach(function(e){n=e.composite.call(e,t,i)||n}),n},convert:function(t,i){e(t)&&this.group.forEach(function(n){n.convert.call(n,t,i)})}},c.prototype={copy:function(){return new this.constructor(this)},composite:function(t,i){if(null===this.startTime||void 0===this.startTime)throw new Error("Cannot composite an animation that has not been started.");if(this.startTime>i&&"backwards"!==this.fillMode&&"both"!==this.fillMode)return!1;if(this.finished&&"forwards"!==this.fillMode&&"both"!==this.fillMode)return!1;var n=Math.max(0,i-(this.startTime+this.delay)),r=this.speed,o=1,a=1,s=this.duration,c=s*this.iterations;c&&(o=n*r/s,a=n*r/c),a>=1&&(o=1,this.finished=!0);var h=0;if(this.finished||(!0===this.autoreverse&&(h=Math.floor(o)%2),o%=1),h&&(o=1-o),e(this.easing))o=this.easing(o);else if("step-start"===this.easing)o=Math.ceil(o);else if("step-middle"===this.easing)o=Math.round(o);else if("step-end"===this.easing)o=Math.floor(o);else{var f=.5-Math.cos(o*Math.PI)/2;if(this.easing){var l=/(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);if(l){var p=l[1],d=l[2];d>0?"step-start"===p?o=Math.ceil(o*d)/d:"step-middle"===p?o=Math.round(o*d)/d:"step-end"!==p&&"steps"!==p||(o=Math.floor(o*d)/d):"linear"!==this.easing&&(o=f)}else"linear"!==this.easing&&(o=f)}else o=f}var y=void 0;if(this instanceof u){var m=this.keyframes.length;if(!m)throw new Error("HyperAction composite need to be able to handle zero keyframes");if(1===m)throw new Error("HyperAction composite need to be able to handle one keyframe");for(var v=m-1;v--&&!(o>=this.offsets[v]););var b=v,g=b+1,w=this.offsets[g]-this.offsets[b];if(0===w)throw new Error("can't divide by zero. check your keyframe offsets.");var A=o-this.offsets[b],T=A/w;y="absolute"===this.blend?this.type.interpolate(this.keyframes[b],this.keyframes[g],T):this.type.interpolate(this.delta[b],this.delta[g],T)}else y="absolute"===this.blend?this.type.interpolate(this.from,this.to,o):this.type.interpolate(this.delta,this.type.zero(this.to),o);var O=this.property;if(void 0!==O&&null!==O){var j=y,k=t[O];void 0!==k&&null!==k||(k=this.type.zero(this.to)),this.additive&&(j=this.type.add(k,y)),this.sort&&Array.isArray(j)&&j.sort(this.sort),t[O]=j}var E=o!==this.progress||this.finished;return this.progress=o,E}},u.prototype=Object.create(c.prototype),u.prototype.constructor=u,u.prototype.copy=function(){return new this.constructor(this)},u.prototype.runAnimation=function(t,i,n){if(e(this.type)&&(this.type=new this.type),!(this.type&&e(this.type.zero)&&e(this.type.add)&&e(this.type.subtract)&&e(this.type.interpolate)))throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");if("absolute"!==this.blend&&this.keyframes.length){for(var r=this.keyframes.length-1,o=[],a=0;a<r;a++)o[a]=this.type.subtract(this.keyframes[a],this.keyframes[r]);o[r]=this.type.zero(this.keyframes[r]),this.delta=o}null!==this.duration&&void 0!==this.duration||(this.duration=n.duration),null!==this.easing&&void 0!==this.easing||(this.easing=n.easing),null!==this.speed&&void 0!==this.speed||(this.speed=1),null!==this.iterations&&void 0!==this.iterations||(this.iterations=1),void 0!==this.startTime&&null!==this.startTime||(this.startTime=n.time),this.sortIndex=d++},u.prototype.convert=function(t,i){if(e(t)&&this.property){["keyframes","delta"].forEach(function(n){var e=this;if(this[n]){var r=this[n].slice(0);this[n]=r.map(function(n){return t.call(i,e.property,n)})}}.bind(this))}},h.prototype=Object.create(c.prototype),h.prototype.constructor=h,h.prototype.runAnimation=function(t,i,n){if(this.type||(this.type=y),e(this.type)&&(this.type=new this.type),!(this.type&&e(this.type.zero)&&e(this.type.add)&&e(this.type.subtract)&&e(this.type.interpolate)))throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");this.from||(this.from=this.type.zero(this.to)),this.to||(this.to=this.type.zero(this.from)),"absolute"!==this.blend&&(this.delta=this.type.subtract(this.from,this.to)),null!==this.duration&&void 0!==this.duration||(this.duration=n.duration),null!==this.easing&&void 0!==this.easing||(this.easing=n.easing),null!==this.speed&&void 0!==this.speed||(this.speed=1),null!==this.iterations&&void 0!==this.iterations||(this.iterations=1),void 0!==this.startTime&&null!==this.startTime||(this.startTime=n.time),this.sortIndex=d++},h.prototype.convert=function(t,i){if(e(t)&&this.property){["from","to","delta"].forEach(function(n){var e=this[n];null!==e&&void 0!==e&&(this[n]=t.call(i,this.property,e))}.bind(this))}}},function(t,i,n){"use strict";function e(t){return t&&"[object Function]"==={}.toString.call(t)}function r(t){this.time,this.disableAnimation=!1,this.duration,this.easing,t&&Object.keys(t).forEach(function(i){this[i]=t[i]}.bind(this))}function o(){this.targets=[],this.transactions=[],this.ticking=!1,this.animationFrame,this.displayLayers=[],this.displayFunctions=[],this.cleanupFunctions=[],this.invalidateFunctions=[]}Object.defineProperty(i,"__esModule",{value:!0}),i.HyperTransaction=r,i.HyperContext=o;var a="undefined"!=typeof window&&(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame)||function(t){setTimeout(t,0)},s=Date.getTime;Date.now&&(s=Date.now),"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now&&(s=window.performance.now.bind(window.performance)),o.prototype={createTransaction:function(t,i){var n=new r(t),e=this.transactions.length,o=s()/1e3;return e&&(o=this.transactions[e-1].representedObject.time),Object.defineProperty(n,"time",{get:function(){return o},enumerable:!0,configurable:!1}),this.transactions.push({representedObject:n,automaticallyCommit:i}),i&&this.startTicking(),n},currentTransaction:function(){var t=this.transactions.length;return t?this.transactions[t-1].representedObject:this.createTransaction({},!0)},beginTransaction:function(t){return this.createTransaction(t,!1)},commitTransaction:function(){this.transactions.pop()},flushTransaction:function(){this.invalidateFunctions.forEach(function(t){t()})},disableAnimation:function(t){!1!==t&&(t=!0),this.currentTransaction().disableAnimation=t,this.startTicking()},registerTarget:function(t,i,n,e){this.startTicking(),this.targets.indexOf(t)<0&&(this.targets.push(t),this.displayLayers.push(null),this.displayFunctions.push(i),this.cleanupFunctions.push(e),this.invalidateFunctions.push(n))},deregisterTarget:function(t){var i=this.targets.indexOf(t);i>-1&&(this.targets.splice(i,1),this.displayLayers.splice(i,1),this.displayFunctions.splice(i,1),this.cleanupFunctions.splice(i,1),this.invalidateFunctions.splice(i,1))},startTicking:function(){this.animationFrame||(this.animationFrame=a(this.ticker.bind(this)))},ticker:function(){this.animationFrame=void 0;for(var t=this.targets,i=t.length;i--;){var n=t[i],r=this.displayFunctions[i];if(n.animationCount){var o=n.presentation;this.displayLayers[i]!==o&&(n.animationCount&&(this.displayLayers[i]=o),r(),this.invalidateFunctions[i]()),this.cleanupFunctions[i]()}else e(r)&&(n.presentation,r()),this.invalidateFunctions[i](),this.deregisterTarget(n)}var a=this.transactions.length;if(a){this.transactions[a-1].automaticallyCommit&&this.commitTransaction()}this.targets.length&&this.startTicking()}}},function(t,i,n){"use strict";function e(t){return t&&"[object Function]"==={}.toString.call(t)}function r(t,i){if(t instanceof d.HyperAnimation||t instanceof d.HyperKeyframes){if(i.typeForProperty&&t.property){var n=i.typeForProperty.call(i,t.property,t.to);n&&(t.type=n)}}else if(t instanceof d.HyperGroup)t.group.forEach(function(t){r(t,i)});else{if(!(t instanceof d.HyperChain))throw new Error("not an animation");t.chain.forEach(function(t){r(t,i)})}}function o(t,i,n){return e(i)?i.call(n,t):t}function a(t,i,n,r){return e(n)?n.call(r,i,t):t}function s(t,i,n,r){if(i&&e(n)){if(null===t||void 0===t)throw new Error("convert property undefined");var o=i[t];null!==o&&void 0!==o&&(i[t]=n.call(r,t,o))}}function c(t,i,n,e){t.forEach(function(t){if(null===t||void 0===t)throw new Error("convert properties undefined");s(t,i,n,e)})}function u(t,i,n,e){if(!i||!i.length)return!1;e&&i.sort(function(t,i){var n=t.index||0,e=i.index||0,r=n-e;return r||(r=t.startTime-i.startTime),r||(r=t.sortIndex-i.sortIndex),r});var r=!1;return i.forEach(function(i){r=i.composite(t,n)||r}),r}function h(t,i,n,r,o,a,s){var c=void 0;if(e(o.animationForKey)&&(c=o.animationForKey.call(o,t,i,n,r)),y&&null===c)return null;var u=(0,d.animationFromDescription)(c);return!u&&(u=(0,d.animationFromDescription)(a),y&&u&&!u.duration&&0!==u.duration&&s.duration&&(u.duration=s.duration),y&&u&&!u.duration)?null:(u&&(u instanceof d.HyperAnimation||u instanceof d.HyperKeyframes)&&(null!==u.property&&void 0!==u.property||(u.property=t),u instanceof d.HyperAnimation&&(null!==u.from&&void 0!==u.from||("absolute"===u.blend?u.from=r:u.from=n),null!==u.to&&void 0!==u.to||(u.to=i)),null!==u.easing&&void 0!==u.easing||(u.easing=s.easing),null!==u.duration&&void 0!==u.duration||(u.duration=s.duration),u.duration||(u.duration=0)),u)}function f(t,i,n){return l(t,i,n)}function l(t,i,n){function s(t){return m&&(t=o(t,i.keyOutput,i)),a(I[t],t,i.output,i)}function f(t,i){var n={};n[i]=t,l(n)}function l(n){var e=A.currentTransaction(),r=t.presentation,s={};Object.keys(n).forEach(function(e){var r=e,c=n[e];m&&(r=o(e,i.keyInput,i)),t.registerAnimatableProperty(r);var u=a(c,e,i.input,i),h=_[r];D[r]=h,_[r]=u,s[e]=c}),e.disableAnimation||Object.keys(s).forEach(function(n){var c=n;m&&(c=o(n,i.keyInput,i));var u=s[n],f=r[n],l=a(D[c],n,i.output,i),p=h(n,u,l,f,i,z[n],e);p?t.addAnimation(p):t.needsDisplay()})}function p(){K=-1}function T(){var n=function(){};e(i.display)&&(n=function(){I=t.presentation,i.display.call(i),I=_}),A.registerTarget(t,n,p,k)}function O(t,i){if(i>-1){x.splice(i,1);var n=H[i];H.splice(i,1),delete M[n]}}function j(t,i,n){if(t instanceof d.HyperGroup)t.group.forEach(function(t){j(t,-1,n)});else if(t instanceof d.HyperChain)t.chain.forEach(function(t){j(t,-1,n)});else if(!(t instanceof d.HyperAnimation||t instanceof d.HyperKeyframes))throw new Error("not an animation");t.finished&&(O(t,i),e(t.onend)&&n.push(t))}function k(){for(var i=x.length,n=[];i--;){j(x[i],i,n)}v||x.length||A.deregisterTarget(t),n.forEach(function(t){t.onend.call(t,!0),t.onend=null})}function E(i){var n=x.indexOf(i);if(n>-1){x.splice(n,1);var r=H[n];H.splice(n,1),delete M[r],e(i.onend)&&i.onend.call(i,!1)}v||x.length||A.deregisterTarget(t)}function F(e){return(n!==t||g.indexOf(e)<0&&w.indexOf(e)<0)&&(n!==i||b.indexOf(e)<0)}function P(){return Object.keys(n).filter(F).reduce(function(t,i){return t[i]=n[i],t},{})}if(!t)throw new Error("Nothing to hyperactivate.");if(t.registerAnimatableProperty||t.addAnimation)throw new Error("Already hyperactive");i||(i=t),n||(n=t);var x=[],H=[],M={},z={},C=!1,_={},D={},N=null,S=[],I=_,K=-1;return t.registerAnimatableProperty=function(t,e){if(F(t)){var r=!1;-1===S.indexOf(t)&&(r=!0),r&&S.push(t);var o=Object.getOwnPropertyDescriptor(n,t);if(e?z[t]=e:null===z[t]&&delete z[t],!o||!0===o.configurable){var c=a(n[t],t,i.input,i);_[t]=c,void 0===c&&(_[t]=null),r&&Object.defineProperty(n,t,{get:function(){return s(t)},set:function(i){f(i,t)},enumerable:!0,configurable:!0})}}},Object.defineProperty(t,"layer",{get:function(){return n},set:function(t){t&&l(t)},enumerable:!1,configurable:!1}),Object.defineProperty(t,"animationCount",{get:function(){return x.length},enumerable:!1,configurable:!1}),Object.defineProperty(t,"animations",{get:function(){return x.map(function(t){var n=t.copy.call(t);return n.convert.call(n,i.output,i),n})},enumerable:!1,configurable:!1}),Object.defineProperty(t,"animationNames",{get:function(){return Object.keys(M)},enumerable:!1,configurable:!1}),Object.defineProperty(t,"presentation",{get:function(){var t=A.currentTransaction().time;if(t===K&&null!==N)return N;var n=Object.assign(P(),_),e=!0;return x.length&&(e=u(n,x,t,C)),(e||null===N)&&(c(Object.keys(n),n,i.output,i),N=n,Object.freeze(N)),K=t,C=!1,N},enumerable:!1,configurable:!1}),Object.defineProperty(t,"model",{get:function(){var t=P();return S.forEach(function(n){var e=a(_[n],n,i.output,i);Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!1})}),Object.freeze(t),t},enumerable:!1,configurable:!1}),Object.defineProperty(t,"previous",{get:function(){var t=P();return S.forEach(function(n){var e=a(D[n],n,i.output,i);Object.defineProperty(t,n,{value:e,enumerable:!0,configurable:!1}),D[n]=_[n]}),Object.freeze(t),t},enumerable:!1,configurable:!1}),t.needsDisplay=function(){N=null,x.length||T()},t.addAnimation=function(n,o){i&&e(i.animationFromDescription)&&(n=i.animationFromDescription(n));var a=(0,d.animationFromDescription)(n);if(!(a instanceof d.HyperAnimation||a instanceof d.HyperKeyframes||a instanceof d.HyperGroup||a instanceof d.HyperChain))throw new Error("Not a valid animation:"+JSON.stringify(a));if(a.convert.call(a,i.input,i),r(a,i),x.length||T(),x.push(a),null!==o&&void 0!==o){var s=M[o];s&&E(s),M[o]=a}void 0===o||null===o||!1===o?H.push(null):H.push(o),C=!0;var c=A.currentTransaction();a.runAnimation(t,o,c)},t.removeAnimation=function(t){var i=M[t];i&&E(i)},t.removeAllAnimations=function(){x.length=0,H.length=0,M={},x.forEach(function(t){e(t.onend)&&t.onend.call(t,!1)}),v||A.deregisterTarget(t)},t.animationNamed=function(t){var n=M[t];if(n){var e=n.copy.call(n);return e.convert.call(e,i.output,i),e}return null},Object.keys(n).forEach(function(i){y?t.registerAnimatableProperty(i,!0):t.registerAnimatableProperty(i)}),t}Object.defineProperty(i,"__esModule",{value:!0}),i.disableAnimation=i.flushTransaction=i.currentTransaction=i.commitTransaction=i.beginTransaction=void 0,i.decorate=f,i.activate=l;var p=n(1),d=n(0),y=!0,m=!0,v=!0,b=["display","animationForKey","input","output"],g=["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations","removeAnimation"],w=["layer","presentation","model","previous","animations","animationNames","animationCount"],A=new p.HyperContext;i.beginTransaction=A.beginTransaction.bind(A),i.commitTransaction=A.commitTransaction.bind(A),i.currentTransaction=A.currentTransaction.bind(A),i.flushTransaction=A.flushTransaction.bind(A),i.disableAnimation=A.disableAnimation.bind(A)}])});