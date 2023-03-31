(()=>{"use strict";const t="undefined"!=typeof window&&(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame)||function(t){setTimeout(t,0)};let n=Date.getTime;function e(t){this.time,this.disableAnimation=!1,this.duration,this.easing,t&&Object.keys(t).forEach(function(n){this[n]=t[n]}.bind(this))}function i(){this.targets=[],this.getPresentations=[],this.getAnimationCounts=[],this.transactions=[],this.ticking=!1,this.animationFrame,this.displayLayers=[],this.displayFunctions=[],this.cleanupFunctions=[],this.invalidateFunctions=[],this.force=[],this.changers=[]}function s(t){return t&&"[object Function]"==={}.toString.call(t)}function r(){}function o(){}function a(t,n,e){this.subtype=t,s(t)&&(this.subtype=new t(e)),this.length=n}function c(t){s(t)?this.sort=t:t&&s(t.sort)&&(this.sort=t.sort),this.debug="HyperSet"}Date.now&&(n=Date.now),"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now&&(n=window.performance.now.bind(window.performance)),i.prototype={createTransaction:function(t,i){const s=new e(t),r=this.transactions.length;let o=n()/1e3;return r&&(o=this.transactions[r-1].representedObject.time),Object.defineProperty(s,"time",{get:function(){return o},enumerable:!0,configurable:!1}),this.transactions.push({representedObject:s,automaticallyCommit:i,flushers:[]}),i&&this.startTicking(),s},createTransactionWrapper:function(t,i){let s=this.targets.length;for(;s--;)this.invalidateFunctions[s]();const r=new e(t),o=this.transactions.length;let a=n()/1e3;o&&(a=this.transactions[o-1].representedObject.time),Object.defineProperty(r,"time",{get:function(){return a},enumerable:!0,configurable:!1});const c={representedObject:r,automaticallyCommit:i,flushers:[]};return this.transactions.push(c),i&&this.startTicking(),c},currentTransaction:function(){const t=this.transactions.length;return t?this.transactions[t-1].representedObject:this.createTransactionWrapper({},!0).representedObject},beginTransaction:function(t){return this.createTransactionWrapper(t,!1).representedObject},commitTransaction:function(){this.clearChangers(),this.clearFlushers(),this.transactions.pop()},clearFlushers:function(){const t=this.currentTransactionWrapper();t.flushers.forEach((t=>{t()})),t.flushers.length=0;let n=this.targets.length;for(;n--;)this.invalidateFunctions[n]()},flushTransaction:function(){this.clearChangers(),this.clearFlushers()},currentTransactionWrapper:function(){const t=this.transactions.length;return t?this.transactions[t-1]:this.createTransactionWrapper({},!0)},registerFlusher:function(t){this.currentTransactionWrapper().flushers.push(t)},registerChanger:function(t){this.changers.push(t),this.startTicking()},clearChangers:function(){const t=this.changers;let n=t.length;for(;n--;)t[n]();t.length=0},disableAnimation:function(t){!1!==t&&(t=!0),this.currentTransaction().disableAnimation=t,this.startTicking()},registerTarget:function(t,n,e,i,s,r,o,a=null){this.startTicking();const c=this.targets.indexOf(t);c<0?(this.targets.push(t),this.getPresentations.push(n),this.getAnimationCounts.push(e),this.displayLayers.push(a),this.displayFunctions.push(i),this.cleanupFunctions.push(r),this.invalidateFunctions.push(s),this.force.push(o)):this.force[c]=o},deregisterTarget:function(t){const n=this.targets.indexOf(t);n>-1&&(this.targets.splice(n,1),this.getPresentations.splice(n,1),this.getAnimationCounts.splice(n,1),this.displayLayers.splice(n,1),this.displayFunctions.splice(n,1),this.cleanupFunctions.splice(n,1),this.invalidateFunctions.splice(n,1),this.force.splice(n,1))},startTicking:function(){this.animationFrame||(this.animationFrame=t(this.ticker.bind(this)))},ticker:function(){this.clearChangers(),this.animationFrame=void 0;const t=this.targets;let n=t.length;for(;n--;){const e=t[n],i=this.displayFunctions[n],s=this.getAnimationCounts[n](),r=this.getPresentations[n];if(s){const t=r();(this.force[n]||this.displayLayers[n]!==t)&&(this.displayLayers[n]=t,i(t)),this.cleanupFunctions[n]()}else this.invalidateFunctions[n](),i(r()),this.deregisterTarget(e);this.force[n]=!1}const e=this.transactions.length;e&&this.transactions[e-1].automaticallyCommit&&this.commitTransaction(),this.targets.length&&this.startTicking()}},r.prototype={constructor:r,zero:function(){return 0},add:function(t,n){return t+n},subtract:function(t,n){return t-n},interpolate:function(t,n,e){return t+(n-t)*e},input:function(t,n){return n},output:function(t,n){return n},toString:function(){return"HyperNumber"},toJSON:function(){return this.toString()}},o.prototype={constructor:o,zero:function(){return 1},add:function(t,n){return t*n},subtract:function(t,n){return 0===n?0:t/n},interpolate:function(t,n,e){return t+(n-t)*e},toString:function(){return"HyperScale"},toJSON:function(){return this.toString()}},a.prototype={constructor:a,zero:function(){const t=[];let n=this.length;for(;n--;)t.push(this.subtype.zero());return t},add:function(t,n){const e=[];for(let i=0;i<this.length;i++)e.push(this.subtype.add(t[i],n[i]));return e},subtract:function(t,n){const e=[];for(let i=0;i<this.length;i++)e.push(this.subtype.subtract(t[i],n[i]));return e},interpolate:function(t,n,e){const i=[];for(let s=0;s<this.length;s++)i.push(this.subtype.interpolate(t[s],n[s],e));return i},toString:function(){return"HyperArray"},toJSON:function(){return this.toString()}},c.prototype={constructor:c,zero:function(){return[]},add:function(t,n){if(!Array.isArray(t)&&!Array.isArray(n))return[];if(!Array.isArray(t))return n;if(!Array.isArray(n))return t;let e=[];const i=t.length,r=n.length;let o=0,a=0;if(s(this.sort))for(;o<i||a<r;)if(o===i)e.push(n[a]),a++;else if(a===r)e.push(t[o]),o++;else{const i=t[o],s=n[a],r=this.sort(i,s);if(0===r)e.push(i),o++,a++;else if(r<0)e.push(i),o++;else{if(!(r>0))throw new Error("HyperSet invalid sort function, add a:"+i+"; b:"+s+"; result:"+r+";");e.push(s),a++}}else for(e=t.slice(0),o=n.length;o--;)t.indexOf(n[o])<0&&e.push(n[o]);return e},subtract:function(t,n){if(!Array.isArray(t)&&!Array.isArray(n))return[];if(!Array.isArray(t))return n;if(!Array.isArray(n))return t;let e=[];const i=t.length,r=n.length;let o=0,a=0;if(s(this.sort))for(;(o<i||a<r)&&o!==i;)if(a===r)e.push(t[o]),o++;else{const i=t[o],s=n[a],r=this.sort(i,s);if(0===r)o++,a++;else if(r<0)e.push(i),o++;else{if(!(r>0))throw new Error("HyperSet invalid sort function, subtract a:"+i+"; b:"+s+"; result:"+r+";");a++}}else for(e=t.slice(0),o=n.length;o--;){const t=e.indexOf(n[o]);t>-1&&e.splice(t,1)}return e},interpolate:function(t,n,e){return e>=1?n:t},toString:function(){return"HyperSet"},toJSON:function(){return this.toString()}},Number.MAX_VALUE;let u=0;const h=new r;function l(t){return t&&"[object Function]"==={}.toString.call(t)}function f(t){let n=[];Array.isArray(t)?n=t:t&&Array.isArray(t.chain)&&(n=t.chain),this.chain=n.map((function(t){return b(t)})),Object.defineProperty(this,"finished",{get:function(){return!this.chain.length||this.chain[this.chain.length-1].finished},enumerable:!1,configurable:!1}),t&&!Array.isArray(t)&&Object.keys(t).forEach(function(n){"chain"!==n&&"finished"!==n&&(this[n]=t[n])}.bind(this))}function p(t){let n=[];Array.isArray(t)?n=t:t&&t.group&&(n=t.group),this.group=n.map((function(t){return b(t)})),Object.defineProperty(this,"finished",{get:function(){let t=!0;return this.group.forEach((function(n){n.finished||(t=!1)})),t},enumerable:!1,configurable:!1}),t&&!Array.isArray(t)&&Object.keys(t).forEach(function(n){"group"!==n&&"finished"!==n&&(this[n]=t[n])}.bind(this))}function d(){this.property,this.type,this.duration,this.easing,this.speed,this.iterations,this.autoreverse,this.fillMode,this.index=0,this.delay=0,this.blend="relative",this.additive=!0,this.sort,this.finished=!1,this.startTime,this.progress,this.onend,this.remove=!0}function y(t){d.call(this);let n=[];t&&Array.isArray(t.keyframes)&&(n=t.keyframes),this.keyframes=n;const e=this.keyframes.length;t&&Object.keys(t).forEach(function(n){"keyframes"!==n&&(this[n]=t[n])}.bind(this)),Array.isArray(this.offsets)&&this.offsets.length===e?this.offsets.sort(((t,n)=>t-n)):this.offsets=e<2?[]:this.keyframes.map((function(t,n){return n/(e-1)})),this.progress=null}function m(t){d.call(this),this.from,this.to,this.delta,t&&Object.keys(t).forEach(function(n){this[n]=t[n]}.bind(this)),this.progress=null}function g(t){return t&&l(t.add)&&l(t.subtract)&&l(t.zero)&&l(t.interpolate)}function b(t){let n;if(!t&&0!==t)return t;if(t instanceof d||t instanceof y||t instanceof p||t instanceof f)n=t.copy.call(t);else if(Array.isArray(t))n=new p(t);else if((e=t)&&"object"==typeof e)n=g(t)?new m({type:t}):Array.isArray(t.keyframes)?new y(t):Array.isArray(t.group)?new p(t):Array.isArray(t.chain)?new f(t):new m(t);else if(function(t){return!isNaN(parseFloat(t))&&isFinite(t)}(t))n=new m({duration:t});else{if(!0!==t)throw new Error("is this an animation:"+JSON.stringify(t));n=new m({})}var e;return n}function w(t){return t&&"[object Function]"==={}.toString.call(t)}function A(t,n,e,i,s){if(t instanceof m||t instanceof y){const o=t.property;if(n&&o&&w(n.typeOfProperty)){const e=n.typeOfProperty.call(n,o);e&&(t.type=e)}const a=v(o,n.keyInput,n),u=e[a],h=i[a]||((r=u)?r.type?w(r.type)?new r.type:r.type:w(r)?new r:r:null);t.property&&t.type&&s(t.property,t.type,!0),t instanceof m?((Array.isArray(t.from)||Array.isArray(t.to))&&!t.type&&w(t.sort)&&(t.type=new c(t.sort)),t.type||(t.type=h),(t.from||0===t.from)&&(t.from=O(t.from,a,n,i,t.type)),(t.to||0===t.to)&&(t.to=O(t.to,a,n,i,t.type)),(t.delta||0===t.delta)&&(t.delta=O(t.delta,a,n,i,t.type))):(t.type||(t.type=h),t.keyframes&&(t.keyframes=t.keyframes.map((e=>O(e,a,n,i,t.type)))),t.delta&&(t.delta=t.delta.map((e=>O(e,a,n,i,t.type)))))}else if(t instanceof p)t.group.forEach((function(t){A(t,n,e,i,s)}));else{if(!(t instanceof f))throw new Error("not an animation");t.chain.forEach((function(t){A(t,n,e,i,s)}))}var r}function v(t,n,e){return w(n)?n.call(e,t):t}function O(t,n,e,i,s){if(e&&w(e.input))return e.input.call(e,n,t);let r=t;const o=i[n];return s&&w(s.input)?r=s.input.call(s,n,t):o&&w(o.input)&&(r=o.input.call(o,n,t)),r}function k(t){if(t&&(t instanceof m||t instanceof y||t instanceof p||t instanceof f))return!0}f.prototype={constructor:f,copy:function(){return new this.constructor(this)},runAnimation:function(t,n,e){this.sortIndex=u++,null!==this.startTime&&void 0!==this.startTime||(this.startTime=e.time);let i=this.chain.length;const s=Object.assign({},e);let r=this.startTime;for(let e=0;e<i;e++){const i=this.chain[e];s.time=r,i.runAnimation.call(i,t,n,s),r=r===1/0||i.iterations===1/0?1/0:r+i.delay+i.duration*i.iterations}},composite:function(t,n){let e=!1,i=this.chain.length;for(let s=0;s<i;s++){const i=this.chain[s];e=i.composite.call(i,t,n)||e}return e},convert:function(t,n){l(t)&&this.chain.forEach((function(e){e.convert.call(e,t,n)}))}},f.prototype.description=function(t){const n=Object.assign({},this);return n.chain=this.chain.map((n=>n.description(t))),n},p.prototype={constructor:p,copy:function(){return new this.constructor(this)},runAnimation:function(t,n,e){this.sortIndex=u++,null!==this.startTime&&void 0!==this.startTime||(this.startTime=e.time),this.group.forEach((function(i){i.runAnimation.call(i,t,n,e)}))},composite:function(t,n){let e=!1;return this.group.forEach((function(i){e=i.composite.call(i,t,n)||e})),e},convert:function(t,n){l(t)&&this.group.forEach((function(e){e.convert.call(e,t,n)}))}},p.prototype.description=function(t){const n=Object.assign({},this);return n.group=this.group.map((n=>n.description(t))),n},d.prototype={copy:function(){return new this.constructor(this)},composite:function(t,n){if(null===this.startTime||void 0===this.startTime)throw new Error("Cannot composite an animation that has not been started.");if(this.startTime+this.delay>n&&"backwards"!==this.fillMode&&"both"!==this.fillMode)return!1;if(this.finished&&"forwards"!==this.fillMode&&"both"!==this.fillMode)return!1;const e=Math.max(0,n-(this.startTime+this.delay)),i=this.speed;let s=1,r=1;const o=this.duration,a=o*this.iterations;a&&(s=e*i/o,r=e*i/a),r>=1&&(s=1,this.finished=!0);let c,u=0;if(this.finished||(!0===this.autoreverse&&(u=Math.floor(s)%2),s%=1),u&&(s=1-s),l(this.easing))s=this.easing(s);else if("step-start"===this.easing)s=Math.ceil(s);else if("step-middle"===this.easing)s=Math.round(s);else if("step-end"===this.easing)s=Math.floor(s);else{const t=.5-Math.cos(s*Math.PI)/2;if(this.easing){const n=/(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);if(n){const e=n[1],i=n[2];i>0?"step-start"===e?s=Math.ceil(s*i)/i:"step-middle"===e?s=Math.round(s*i)/i:"step-end"!==e&&"steps"!==e||(s=Math.floor(s*i)/i):"linear"!==this.easing&&(s=t)}else"linear"!==this.easing&&(s=t)}else s=t}if(this instanceof y){const t=this.keyframes.length;if(!t)throw new Error("HyperAction composite need to be able to handle zero keyframes");if(1===t)throw new Error("HyperAction composite need to be able to handle one keyframe");let n=t-1;for(;n--&&!(s>=this.offsets[n]););const e=n;let i=e+1;const r=this.offsets[i]-this.offsets[e];if(0===r)throw new Error("can't divide by zero. check your keyframe offsets.");const o=(s-this.offsets[e])/r;c="absolute"===this.blend?this.type.interpolate(this.keyframes[e],this.keyframes[i],o):this.type.interpolate(this.delta[e],this.delta[i],o)}else c="absolute"===this.blend?this.type.interpolate(this.from,this.to,s):this.type.interpolate(this.delta,this.type.zero(this.to),s);const h=this.property;if(null!=h){let n=c,e=t[h];null==e&&(e=this.type.zero(this.to)),this.additive&&(n=this.type.add(e,c)),this.sort&&Array.isArray(n)&&n.sort(this.sort),t[h]=n}if(t[h]&&t[h].px&&t[h].px.length&&t[h].px.substring&&"NaN"===t[h].px.substring(t[h].px.length-3))throw new Error("hyperact NaN composite onto:"+JSON.stringify(t)+"; now:"+n+";");const f=s!==this.progress||this.finished;return this.progress=s,f}},y.prototype=Object.create(d.prototype),y.prototype.constructor=y,y.prototype.copy=function(){return new this.constructor(this)},y.prototype.runAnimation=function(t,n,e){if(this.type?l(this.type)&&(this.type=new this.type):this.type=h,!(l(this.type.zero)&&l(this.type.add)&&l(this.type.subtract)&&l(this.type.interpolate)))throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");if("absolute"!==this.blend&&this.keyframes.length){const t=this.keyframes.length-1,n=[];for(let e=0;e<t;e++)n[e]=this.type.subtract(this.keyframes[e],this.keyframes[t]);n[t]=this.type.zero(this.keyframes[t]),this.delta=n}null!==this.duration&&void 0!==this.duration||(this.duration=e.duration),null!==this.easing&&void 0!==this.easing||(this.easing=e.easing),null!==this.speed&&void 0!==this.speed||(this.speed=1),null!==this.iterations&&void 0!==this.iterations||(this.iterations=1),void 0!==this.startTime&&null!==this.startTime||(this.startTime=e.time),this.sortIndex=u++},y.prototype.convert=function(t,n){l(t)&&this.property&&["keyframes","delta"].forEach(function(e){if(this[e]){const i=this[e].slice(0);this[e]=i.map((e=>t.call(n,this.property,e)))}}.bind(this))},y.prototype.description=function(t){const n=Object.assign({},this);return this.convert.call(n,t.output,t),n},m.prototype=Object.create(d.prototype),m.prototype.constructor=m,m.prototype.runAnimation=function(t,n,e){if(this.type?l(this.type)&&(this.type=new this.type):this.type=h,!(l(this.type.zero)&&l(this.type.add)&&l(this.type.subtract)&&l(this.type.interpolate)))throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");this.from||(this.from=this.type.zero(this.to)),this.to||(this.to=this.type.zero(this.from)),"absolute"!==this.blend&&(this.delta=this.type.subtract(this.from,this.to)),null!==this.duration&&void 0!==this.duration||(this.duration=e.duration),null!==this.easing&&void 0!==this.easing||(this.easing=e.easing),null!==this.speed&&void 0!==this.speed||(this.speed=1),null!==this.iterations&&void 0!==this.iterations||(this.iterations=1),void 0!==this.startTime&&null!==this.startTime||(this.startTime=e.time),this.sortIndex=u++},m.prototype.convert=function(t,n){l(t)&&this.property&&["from","to","delta"].forEach(function(e){const i=this[e];null!=i&&(this[e]=t.call(n,this.property,i))}.bind(this))},m.prototype.description=function(t){const n=Object.assign({},this);return this.convert.call(n,t.output,t),n};const T=["display","animationForKey","input","output"],j=["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations","removeAnimation"],E=["layer","presentation","model","previous","animations","animationNames","animationCount"],F=new i,x=(F.beginTransaction.bind(F),F.commitTransaction.bind(F),F.currentTransaction.bind(F),F.flushTransaction.bind(F),F.disableAnimation.bind(F));function P(t,n,e,i){if(t){if(t.registerAnimatableProperty||t.addAnimation)throw new Error("Already hyperactive");n?w(n)&&(n={display:n}):n=t,e||(e=t)}else n?w(n)&&(n={display:n}):n={},e||(e=n);const s=[],o=[];let a={};const c={},u={};let h=!1;const l={},d={};let x=null,P=null,M=null,N=null;const S=[];let z={},C=null;function I(t){F.registerFlusher(U);const e=F.currentTransaction();_();const i=Object.keys(t);C||(Z(),C={},F.registerChanger(B),N=G()),e.disableAnimation||Object.assign(C,t),M=null,i.forEach((function(e){const i=t[e],s=v(e,n.keyInput,n),r=O(i,s,n,c);l[s]=r,d[s]=i}))}function L(t,n,e){if(t instanceof p)t.group.forEach((function(t){L(t,-1,e)}));else if(t instanceof f)t.chain.forEach((function(t){L(t,-1,e)}));else if(!(t instanceof m||t instanceof y))throw new Error("not an animation");var i;t.finished&&((!(i=t).finished||"forwards"!==i.fillMode&&"both"!==i.fillMode)&&function(t,n){if(n>-1){s.splice(n,1);const t=o[n];o.splice(n,1),delete a[t]}}(0,n),w(t.onend)&&e.push(t))}function H(){let t=s.length;const n=[];for(;t--;)L(s[t],t,n);n.forEach((function(t){t.onend.call(t,!0),t.onend=null}))}function W(t){const n=s.indexOf(t);if(n>-1){s.splice(n,1);const e=o[n];o.splice(n,1),delete a[e],w(t.onend)&&t.onend.call(t,!1)}}function D(i){return(e!==t||j.indexOf(i)<0&&E.indexOf(i)<0)&&(e!==n||T.indexOf(i)<0)}function J(t,n){q(t,n)}function q(t,i,s){const r=v(t,n.keyInput,n);if(!D(t))return;let o=!1;const a=S.indexOf(r);-1===a&&(o=!0);const h=e[t];o&&S.push(r);const f=Object.getOwnPropertyDescriptor(e,t);if(null===i?(delete c[r],delete u[r],S.splice(a,1)):s||g(i)?(c[r]=i,o&&(u[r]={type:i})):(u[r]=i,i&&(c[r]=i.type)),null!=h){const t=O(h,r,n,c);l[r]=t,d[r]=h}f&&!0!==f.configurable||Object.defineProperty(e,t,{get:function(){return function(t){const e=v(t,n.keyOutput,n);return null===z?(console.log("activeBacking === null doesn't happen"),G()[e]):z[e]}(t)},set:function(n){!function(t,n){const e={};e[n]=t,I(e)}(n,t)},enumerable:!0,configurable:!0})}function K(){return s.length}function R(){return Object.keys(e).filter(D).reduce((function(t,n){return t[n]=e[n],t}),{})}function B(){(function(t){const e=Object.keys(t),i=F.currentTransaction(),s=_();e.forEach((function(t){const e=v(t,n.keyInput,n),r=G()[t],o=Q()[t];if(r!==o){const a=function(t,n,e,i,s,r,o,a){let c,u;if(w(s.animationForKey)&&(u=s.animationForKey.call(s,t,n,e,i)),null===u)return null;r||(r={type:o}),r&&!k(r)&&(c=Object.assign({},r)),c&&!k(u)?c=Object.assign(c,u):(u||0===u)&&(c=u);let h=b(u);return h||(h=b(r),!h||(h.duration||0===h.duration||a.duration&&(h.duration=a.duration),h.duration))?(h&&(h instanceof m||h instanceof y)&&(null!==h.property&&void 0!==h.property||(h.property=t),h instanceof m&&(null!==h.from&&void 0!==h.from||("absolute"===h.blend?h.from=i:h.from=e),null!==h.to&&void 0!==h.to||(h.to=n)),null!==h.easing&&void 0!==h.easing||(h.easing=a.easing),null!==h.duration&&void 0!==h.duration||(h.duration=a.duration),h.duration||(h.duration=0)),h):null}(t,r,o,s[t],n,u[e],c[e],i);a?Y(a):Z()}}))})(C),C=null}function U(){P=null,x=null}function V(){P=null}function X(){const t=F.currentTransaction().time,e=Object.assign({},l);let i=!0;return s.length&&(i=function(t,n,e,i){if(!n||!n.length)return!1;i&&n.sort((function(t,n){let e=(t.index||0)-(n.index||0);return e||(e=t.startTime-n.startTime),e||(e=t.sortIndex-n.sortIndex),e}));let s=!1;return n.forEach((function(n){s=n.composite(t,e)||s;const i=n.property;if(i&&t[i]&&t[i].px&&t[i].px.length&&t[i].px.substring&&"NaN"===t[i].px.substring(t[i].px.length-3))throw new Error("hyperact NaN composite sourceLayer:"+JSON.stringify(t)+";")})),s}(e,s,t,h)),h=!1,!i&&x||(S.forEach((function(t){const i=v(t,n.keyOutput,n),s=e[t];s&&s.length&&s.substring&&s.substring(s.length-3),e[t]=function(t,n,e,i,s){if(e&&w(e.output))return e.output.call(e,n,t);let r=t;const o=i[n];return o&&w(o.output)&&(r=o.output.call(o,n,t)),r}(s,i,n,c),e[t]&&e[t].length&&e[t].substring&&e[t].substring(e[t].length-3)})),Object.freeze(e),x=e),P=null,x}function _(){if(null!==P&&null!==x)return P;const t=X(),e=R();return S.forEach((function(i){const s=t[i],r=v(i,n.keyInput,n);Object.defineProperty(e,r,{value:s,enumerable:!0,configurable:!1})})),Object.freeze(e),P=e,P}function G(){if(null!==M)return M;const t=R();return S.forEach((function(e){const i=d[e],s=v(e,n.keyInput,n);Object.defineProperty(t,s,{value:i,enumerable:!0,configurable:!1})})),Object.freeze(t),M=t,M}function Q(){return null!==N?N:G()}function Y(t,i){const r=F.currentTransaction();_();const l=b(t);if(!(l instanceof m||l instanceof y||l instanceof p||l instanceof f))throw new Error("Not a valid animation:"+JSON.stringify(l));if(A(l,n,u,c,q),s.length||Z(),s.push(l),null!=i){const t=a[i];t&&W(t),a[i]=l}null==i||!1===i?o.push(null):o.push(i),h=!0,l.runAnimation(e,i,r)}function Z(){if(C)return;const t=w(n.display)?function(t){z=X(),n.display.call(n,t),z=d}:function(){};F.registerTarget(e,X,K,t,V,H,!0,l)}function $(t){const n=i?i[t]:void 0;return n&&g(n)?{type:n}:n}return Object.keys(e).filter(D).forEach((function(t){const i=e[t],s=v(t,n.keyInput,n);J(s,$(t)||{type:new r}),d[s]=i})),i&&Object.keys(i).filter(D).forEach((function(t){J(v(t,n.keyInput,n),$(t))})),z=G(),z=d,t&&(t.registerAnimatableProperty=J,t.needsDisplay=function(){V(),Z()},t.addAnimation=Y,t.removeAnimation=function(t){const n=a[t];n&&W(n)},t.removeAllAnimations=function(){s.length=0,o.length=0,a={},s.forEach((function(t){w(t.onend)&&t.onend.call(t,!1)}))},t.animationNamed=function(t){const e=a[t];return e?e.description.call(e,n):null},Object.defineProperty(t,"layer",{get:function(){return e},set:function(t){t&&I(t)},enumerable:!0,configurable:!1}),Object.defineProperty(t,"animationCount",{get:K,enumerable:!0,configurable:!1}),Object.defineProperty(t,"animations",{get:function(){return s.map((t=>t.description.call(t,n)))},enumerable:!0,configurable:!1}),Object.defineProperty(t,"animationNames",{get:function(){return Object.keys(a)},enumerable:!0,configurable:!1}),Object.defineProperty(t,"presentation",{get:_,enumerable:!0,configurable:!1}),Object.defineProperty(t,"model",{get:G,enumerable:!0,configurable:!1}),Object.defineProperty(t,"previous",{get:Q,enumerable:!0,configurable:!1})),t}function M(t){return function(t,n,e){const i=Math.sqrt(.64);return 1-1/i*Math.exp(-9*t)*Math.sin(15*i*t+Math.atan(i/e))}(t=1-Math.cos(t*Math.PI/2),0,.6)}let N=Math.random();const S=document.createElement("input");S.type="range",S.min=0,S.max=1e3,S.value=1e3*N,document.body.appendChild(S);const z=new class{constructor(t,n){P(this),this.element=t,this.value=n,this.registerAnimatableProperty("value")}animationForKey(t,n,e,i){return{duration:1,easing:M}}layout(t){this.value=t}display(){this.element.value=1e3*this.value}}(S,N),C=document.createElement("canvas");C.width=window.innerWidth,C.height=window.innerHeight,document.body.appendChild(C);const I=new class{constructor(t,n){P(this),this.element=t,this.iterations=50,this.vertices=500,this.radius=100,this.value=n,this.positionArray=this.plot(),this.registerAnimatableProperty("positionArray")}animationForKey(t,n,e){if("positionArray"===t)return{type:new a(r,2*this.vertices),duration:1,easing:M}}plot(){const t=this.element,n=t.width/2,e=t.height/2,i=this.value*Math.PI,s=[],r=2*Math.PI/this.vertices;let o=this.vertices+1,a=0;for(;--o;){a-=r;let t=this.iterations,o=n,c=e;do{const n=t*a+t*t*i;o+=Math.sin(n)/t*this.radius,c+=Math.cos(n)/t*this.radius}while(--t);s.push(o),s.push(c)}return s}layout(t){this.value=t,this.positionArray=this.plot(),this.needsDisplay()}display(){const t=this.element,n=t.getContext("2d"),e=t.width,i=t.height;n.clearRect(0,0,e,i);const s=this.positionArray,r=s.length;if(r>1){n.beginPath(),n.moveTo(s[0],s[1]);for(let t=2;t<r;t+=2)n.lineTo(s[t],s[t+1]);n.closePath(),n.stroke()}}}(C,N);function L(){C.width=window.innerWidth,C.height=window.innerHeight,x(!0),I.layout(N),z.layout(N)}L(),window.addEventListener("resize",L),C.addEventListener("mousedown",(t=>{t.stopPropagation(),t.preventDefault(),N=Math.random(),I.layout(N),z.layout(N)})),document.addEventListener("mouseup",(t=>{S.blur()})),S.addEventListener("input",(t=>{N=S.value/1e3,I.layout(N),z.layout(N)})),S.addEventListener("change",(t=>{N=S.value/1e3,I.layout(N),z.layout(N)})),S.addEventListener("mousedown",(t=>{S.focus()}))})();