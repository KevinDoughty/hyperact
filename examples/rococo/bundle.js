!function(t){var n={};function e(i){if(n[i])return n[i].exports;var r=n[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,e),r.l=!0,r.exports}e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:i})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(e.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var r in t)e.d(i,r,function(n){return t[n]}.bind(null,r));return i},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=0)}([function(t,n,e){"use strict";e.r(n);var i="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r="undefined"!=typeof window&&(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame)||function(t){setTimeout(t,0)},o=Date.getTime;function s(t){this.time,this.disableAnimation=!1,this.duration,this.easing,t&&Object.keys(t).forEach(function(n){this[n]=t[n]}.bind(this))}function a(){this.targets=[],this.getPresentations=[],this.getAnimationCounts=[],this.transactions=[],this.ticking=!1,this.animationFrame,this.displayLayers=[],this.displayFunctions=[],this.cleanupFunctions=[],this.invalidateFunctions=[],this.force=[],this.changers=[]}Date.now&&(o=Date.now),"undefined"!=typeof window&&void 0!==window.performance&&void 0!==window.performance.now&&(o=window.performance.now.bind(window.performance)),a.prototype={createTransaction:function(t,n){var e=new s(t),i=this.transactions.length,r=o()/1e3;return i&&(r=this.transactions[i-1].representedObject.time),Object.defineProperty(e,"time",{get:function(){return r},enumerable:!0,configurable:!1}),this.transactions.push({representedObject:e,automaticallyCommit:n,flushers:[]}),n&&this.startTicking(),e},createTransactionWrapper:function(t,n){for(var e=this.targets.length;e--;)this.invalidateFunctions[e]();var i=new s(t),r=this.transactions.length,a=o()/1e3;r&&(a=this.transactions[r-1].representedObject.time),Object.defineProperty(i,"time",{get:function(){return a},enumerable:!0,configurable:!1});var u={representedObject:i,automaticallyCommit:n,flushers:[]};return this.transactions.push(u),n&&this.startTicking(),u},currentTransaction:function(){var t=this.transactions.length;return t?this.transactions[t-1].representedObject:this.createTransactionWrapper({},!0).representedObject},beginTransaction:function(t){return this.createTransactionWrapper(t,!1).representedObject},commitTransaction:function(){this.clearChangers(),this.clearFlushers(),this.transactions.pop()},clearFlushers:function(){var t=this.currentTransactionWrapper();t.flushers.forEach(function(t){t()}),t.flushers.length=0;for(var n=this.targets.length;n--;)this.invalidateFunctions[n]()},flushTransaction:function(){this.clearChangers(),this.clearFlushers()},currentTransactionWrapper:function(){var t=this.transactions.length;return t?this.transactions[t-1]:this.createTransactionWrapper({},!0)},registerFlusher:function(t){this.currentTransactionWrapper().flushers.push(t)},registerChanger:function(t){this.changers.push(t),this.startTicking()},clearChangers:function(){for(var t=this.changers,n=t.length;n--;)t[n]();t.length=0},disableAnimation:function(t){!1!==t&&(t=!0),this.currentTransaction().disableAnimation=t,this.startTicking()},registerTarget:function(t,n,e,i,r,o,s){var a=arguments.length>7&&void 0!==arguments[7]?arguments[7]:null;this.startTicking();var u=this.targets.indexOf(t);u<0?(this.targets.push(t),this.getPresentations.push(n),this.getAnimationCounts.push(e),this.displayLayers.push(a),this.displayFunctions.push(i),this.cleanupFunctions.push(o),this.invalidateFunctions.push(r),this.force.push(s)):this.force[u]=s},deregisterTarget:function(t){var n=this.targets.indexOf(t);n>-1&&(this.targets.splice(n,1),this.getPresentations.splice(n,1),this.getAnimationCounts.splice(n,1),this.displayLayers.splice(n,1),this.displayFunctions.splice(n,1),this.cleanupFunctions.splice(n,1),this.invalidateFunctions.splice(n,1),this.force.splice(n,1))},startTicking:function(){this.animationFrame||(this.animationFrame=r(this.ticker.bind(this)))},ticker:function(){this.clearChangers(),this.animationFrame=void 0;for(var t=this.targets,n=t.length;n--;){var e=t[n],i=this.displayFunctions[n],r=this.getAnimationCounts[n](),o=this.getPresentations[n];if(r){var s=o();(this.force[n]||this.displayLayers[n]!==s)&&(this.displayLayers[n]=s,i(s)),this.cleanupFunctions[n]()}else{this.invalidateFunctions[n](),i(o()),this.deregisterTarget(e)}this.force[n]=!1}var a=this.transactions.length;a&&(this.transactions[a-1].automaticallyCommit&&this.commitTransaction());this.targets.length&&this.startTicking()}};var u="function"==typeof Symbol&&"symbol"===i(Symbol.iterator)?function(t){return void 0===t?"undefined":i(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":void 0===t?"undefined":i(t)},c=function(){function t(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(n,e,i){return e&&t(n.prototype,e),i&&t(n,i),n}}();function h(t){return t&&"[object Function]"==={}.toString.call(t)}function l(){}function f(){}function p(t,n,e){this.subtype=t,h(t)&&(this.subtype=new t(e)),this.length=n}function d(t){h(t)?this.sort=t:t&&h(t.sort)&&(this.sort=t.sort),this.debug="HyperSet"}l.prototype={constructor:l,zero:function(){return 0},add:function(t,n){return t+n},subtract:function(t,n){return t-n},interpolate:function(t,n,e){return t+(n-t)*e},input:function(t,n){return n},output:function(t,n){return n},toString:function(){return"HyperNumber"},toJSON:function(){return this.toString()}},f.prototype={constructor:f,zero:function(){return 1},add:function(t,n){return t*n},subtract:function(t,n){return 0===n?0:t/n},interpolate:function(t,n,e){return t+(n-t)*e},toString:function(){return"HyperScale"},toJSON:function(){return this.toString()}},p.prototype={constructor:p,zero:function(){for(var t=[],n=this.length;n--;)t.push(this.subtype.zero());return t},add:function(t,n){for(var e=[],i=0;i<this.length;i++)e.push(this.subtype.add(t[i],n[i]));return e},subtract:function(t,n){for(var e=[],i=0;i<this.length;i++)e.push(this.subtype.subtract(t[i],n[i]));return e},interpolate:function(t,n,e){for(var i=[],r=0;r<this.length;r++)i.push(this.subtype.interpolate(t[r],n[r],e));return i},toString:function(){return"HyperArray"},toJSON:function(){return this.toString()}},d.prototype={constructor:d,zero:function(){return[]},add:function(t,n){if(!Array.isArray(t)&&!Array.isArray(n))return[];if(!Array.isArray(t))return n;if(!Array.isArray(n))return t;var e=[],i=t.length,r=n.length,o=0,s=0;if(h(this.sort))for(;o<i||s<r;)if(o===i)e.push(n[s]),s++;else if(s===r)e.push(t[o]),o++;else{var a=t[o],u=n[s],c=this.sort(a,u);if(0===c)e.push(a),o++,s++;else if(c<0)e.push(a),o++;else{if(!(c>0))throw new Error("HyperSet invalid sort function, add a:"+a+"; b:"+u+"; result:"+c+";");e.push(u),s++}}else for(e=t.slice(0),o=n.length;o--;)t.indexOf(n[o])<0&&e.push(n[o]);return e},subtract:function(t,n){if(!Array.isArray(t)&&!Array.isArray(n))return[];if(!Array.isArray(t))return n;if(!Array.isArray(n))return t;var e=[],i=t.length,r=n.length,o=0,s=0;if(h(this.sort))for(;(o<i||s<r)&&o!==i;)if(s===r)e.push(t[o]),o++;else{var a=t[o],u=n[s],c=this.sort(a,u);if(0===c)o++,s++;else if(c<0)e.push(a),o++;else{if(!(c>0))throw new Error("HyperSet invalid sort function, subtract a:"+a+"; b:"+u+"; result:"+c+";");s++}}else for(e=t.slice(0),o=n.length;o--;){var l=e.indexOf(n[o]);l>-1&&e.splice(l,1)}return e},interpolate:function(t,n,e){return e>=1?n:t},toString:function(){return"HyperSet"},toJSON:function(){return this.toString()}};var y=function(){function t(){}return c(t,[{key:"zero",value:function(){return g(0,0)}},{key:"add",value:function(t,n){return g(t.x+n.x,t.y+n.y)}},{key:"subtract",value:function(t,n){return g(t.x-n.x,t.y-n.y)}},{key:"interpolate",value:function(t,n,e){return g(t.x+(n.x-t.x)*e,t.y+(n.y-t.y)*e)}},{key:"toString",value:function(){return"HyperPoint"}},{key:"toJSON",value:function(){return this.toString()}}]),t}(),m=function(){function t(){}return c(t,[{key:"zero",value:function(){return v(0,0)}},{key:"add",value:function(t,n){return v(t.width+n.width,t.height+n.height)}},{key:"subtract",value:function(t,n){return v(t.width-n.width,t.height-n.height)}},{key:"interpolate",value:function(t,n,e){return v(t.width+(n.width-t.width)*e,t.height+(n.height-t.height)*e)}},{key:"toString",value:function(){return"HyperSize"}},{key:"toJSON",value:function(){return this.toString()}}]),t}();(function(){function t(){}c(t,[{key:"zero",value:function(){return function(t,n,e,i){return{origin:g(t,n),size:v(e,i)}}(0,0,0,0)}},{key:"add",value:function(t,n){return{origin:y.prototype.add(t.origin,n.origin),size:m.prototype.add(t.size,n.size)}}},{key:"subtract",value:function(t,n){return{origin:y.prototype.subtract(t.origin,n.origin),size:m.prototype.subtract(t.size,n.size)}}},{key:"interpolate",value:function(t,n,e){return{origin:y.prototype.interpolate(t.origin,n.origin,e),size:m.prototype.interpolate(t.size,n.size,e)}}},{key:"toString",value:function(){return"HyperRect"}},{key:"toJSON",value:function(){return this.toString()}}])})(),Number.MAX_VALUE;function g(t,n){return{x:t,y:n}}function v(t,n){return{width:t,height:n}}var b=0,w=new l;function A(t){return t&&"[object Function]"==={}.toString.call(t)}function k(t){var n=[];Array.isArray(t)?n=t:t&&Array.isArray(t.chain)&&(n=t.chain),this.chain=n.map(function(t){return x(t)}),Object.defineProperty(this,"finished",{get:function(){return!this.chain.length||this.chain[this.chain.length-1].finished},enumerable:!1,configurable:!1}),t&&!Array.isArray(t)&&Object.keys(t).forEach(function(n){"chain"!==n&&"finished"!==n&&(this[n]=t[n])}.bind(this))}function O(t){var n=[];Array.isArray(t)?n=t:t&&t.group&&(n=t.group),this.group=n.map(function(t){return x(t)}),Object.defineProperty(this,"finished",{get:function(){var t=!0;return this.group.forEach(function(n){n.finished||(t=!1)}),t},enumerable:!1,configurable:!1}),t&&!Array.isArray(t)&&Object.keys(t).forEach(function(n){"group"!==n&&"finished"!==n&&(this[n]=t[n])}.bind(this))}function j(){this.property,this.type,this.duration,this.easing,this.speed,this.iterations,this.autoreverse,this.fillMode,this.index=0,this.delay=0,this.blend="relative",this.additive=!0,this.sort,this.finished=!1,this.startTime,this.progress,this.onend,this.remove=!0}function T(t){j.call(this);var n=[];t&&Array.isArray(t.keyframes)&&(n=t.keyframes),this.keyframes=n;var e=this.keyframes.length;t&&Object.keys(t).forEach(function(n){"keyframes"!==n&&(this[n]=t[n])}.bind(this)),Array.isArray(this.offsets)&&this.offsets.length===e?this.offsets.sort(function(t,n){return t-n}):this.offsets=e<2?[]:this.keyframes.map(function(t,n){return n/(e-1)}),this.progress=null}function E(t){j.call(this),this.from,this.to,this.delta,t&&Object.keys(t).forEach(function(n){this[n]=t[n]}.bind(this)),this.progress=null}function S(t){return t&&A(t.add)&&A(t.subtract)&&A(t.zero)&&A(t.interpolate)}function x(t){var n=void 0;if(!t&&0!==t)return t;if(t instanceof j||t instanceof T||t instanceof O||t instanceof k)n=t.copy.call(t);else if(Array.isArray(t))n=new O(t);else if(function(t){return t&&"object"===(void 0===t?"undefined":u(t))}(t))n=S(t)?new E({type:t}):Array.isArray(t.keyframes)?new T(t):Array.isArray(t.group)?new O(t):Array.isArray(t.chain)?new k(t):new E(t);else if(function(t){return!isNaN(parseFloat(t))&&isFinite(t)}(t))n=new E({duration:t});else{if(!0!==t)throw new Error("is this an animation:"+JSON.stringify(t));n=new E({})}return n}function P(t){return t&&"[object Function]"==={}.toString.call(t)}function F(t,n,e,i,r){if(t instanceof E||t instanceof T){var o=t.property;if(n&&o&&P(n.typeOfProperty)){var s=n.typeOfProperty.call(n,o);s&&(t.type=s)}var a=z(o,n.keyInput,n),u=e[a],c=i[a]||function(t){if(!t)return null;return t.type?P(t.type)?new t.type:t.type:P(t)?new t:t}(u);t.property&&t.type&&r(t.property,t.type,!0),t instanceof E?((Array.isArray(t.from)||Array.isArray(t.to))&&!t.type&&P(t.sort)&&(t.type=new d(t.sort)),t.type||(t.type=c),(t.from||0===t.from)&&(t.from=M(t.from,a,n,i,t.type)),(t.to||0===t.to)&&(t.to=M(t.to,a,n,i,t.type)),(t.delta||0===t.delta)&&(t.delta=M(t.delta,a,n,i,t.type))):(t.type||(t.type=c),t.keyframes&&(t.keyframes=t.keyframes.map(function(e){return M(e,a,n,i,t.type)})),t.delta&&(t.delta=t.delta.map(function(e){return M(e,a,n,i,t.type)})))}else if(t instanceof O)t.group.forEach(function(t){F(t,n,e,i,r)});else{if(!(t instanceof k))throw new Error("not an animation");t.chain.forEach(function(t){F(t,n,e,i,r)})}}function z(t,n,e){return P(n)?n.call(e,t):t}function M(t,n,e,i,r){if(e&&P(e.input))return e.input.call(e,n,t);var o=t,s=i[n];return r&&P(r.input)?o=r.input.call(r,n,t):s&&P(s.input)&&(o=s.input.call(s,n,t)),o}function N(t,n,e,i,r){if(e&&P(e.output))return e.output.call(e,n,t);var o=t,s=i[n];return r&&P(r.output)?o=r.output.call(r,n,t):s&&P(s.output)&&(o=s.output.call(s,n,t)),o}function C(t){if(t&&(t instanceof E||t instanceof T||t instanceof O||t instanceof k))return!0}k.prototype={constructor:k,copy:function(){return new this.constructor(this)},runAnimation:function(t,n,e){this.sortIndex=b++,null!==this.startTime&&void 0!==this.startTime||(this.startTime=e.time);for(var i=this.chain.length,r=Object.assign({},e),o=this.startTime,s=0;s<i;s++){var a=this.chain[s];r.time=o,a.runAnimation.call(a,t,n,r),o=o===1/0||a.iterations===1/0?1/0:o+a.delay+a.duration*a.iterations}},composite:function(t,n){for(var e=!1,i=this.chain.length,r=0;r<i;r++){var o=this.chain[r];e=o.composite.call(o,t,n)||e}return e},convert:function(t,n){A(t)&&this.chain.forEach(function(e){e.convert.call(e,t,n)})}},k.prototype.description=function(t){var n=Object.assign({},this);return n.chain=this.chain.map(function(n){return n.description(t)}),n},O.prototype={constructor:O,copy:function(){return new this.constructor(this)},runAnimation:function(t,n,e){this.sortIndex=b++,null!==this.startTime&&void 0!==this.startTime||(this.startTime=e.time),this.group.forEach(function(i){i.runAnimation.call(i,t,n,e)})},composite:function(t,n){var e=!1;return this.group.forEach(function(i){e=i.composite.call(i,t,n)||e}),e},convert:function(t,n){A(t)&&this.group.forEach(function(e){e.convert.call(e,t,n)})}},O.prototype.description=function(t){var n=Object.assign({},this);return n.group=this.group.map(function(n){return n.description(t)}),n},j.prototype={copy:function(){return new this.constructor(this)},composite:function(t,n){if(null===this.startTime||void 0===this.startTime)throw new Error("Cannot composite an animation that has not been started.");if(this.startTime+this.delay>n&&"backwards"!==this.fillMode&&"both"!==this.fillMode)return!1;if(this.finished&&"forwards"!==this.fillMode&&"both"!==this.fillMode)return!1;var e=Math.max(0,n-(this.startTime+this.delay)),i=this.speed,r=1,o=1,s=this.duration,a=s*this.iterations;a&&(r=e*i/s,o=e*i/a),o>=1&&(r=1,this.finished=!0);var u=0;if(this.finished||(!0===this.autoreverse&&(u=Math.floor(r)%2),r%=1),u&&(r=1-r),A(this.easing))r=this.easing(r);else if("step-start"===this.easing)r=Math.ceil(r);else if("step-middle"===this.easing)r=Math.round(r);else if("step-end"===this.easing)r=Math.floor(r);else{var c=.5-Math.cos(r*Math.PI)/2;if(this.easing){var h=/(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);if(h){var l=h[1],f=h[2];f>0?"step-start"===l?r=Math.ceil(r*f)/f:"step-middle"===l?r=Math.round(r*f)/f:"step-end"!==l&&"steps"!==l||(r=Math.floor(r*f)/f):"linear"!==this.easing&&(r=c)}else"linear"!==this.easing&&(r=c)}else r=c}var p=void 0;if(this instanceof T){var d=this.keyframes.length;if(!d)throw new Error("HyperAction composite need to be able to handle zero keyframes");if(1===d)throw new Error("HyperAction composite need to be able to handle one keyframe");for(var y=d-1;y--&&!(r>=this.offsets[y]););var m=y,g=m+1,v=this.offsets[g]-this.offsets[m];if(0===v)throw new Error("can't divide by zero. check your keyframe offsets.");var b=(r-this.offsets[m])/v;p="absolute"===this.blend?this.type.interpolate(this.keyframes[m],this.keyframes[g],b):this.type.interpolate(this.delta[m],this.delta[g],b)}else p="absolute"===this.blend?this.type.interpolate(this.from,this.to,r):this.type.interpolate(this.delta,this.type.zero(this.to),r);var w=this.property;if(void 0!==w&&null!==w){var k=p,O=t[w];void 0!==O&&null!==O||(O=this.type.zero(this.to)),this.additive&&(k=this.type.add(O,p)),this.sort&&Array.isArray(k)&&k.sort(this.sort),t[w]=k}if(t[w]&&t[w].px&&t[w].px.length&&t[w].px.substring&&"NaN"===t[w].px.substring(t[w].px.length-3))throw new Error("hyperact NaN composite onto:"+JSON.stringify(t)+"; now:"+n+";");var j=r!==this.progress||this.finished;return this.progress=r,j}},T.prototype=Object.create(j.prototype),T.prototype.constructor=T,T.prototype.copy=function(){return new this.constructor(this)},T.prototype.runAnimation=function(t,n,e){if(this.type?A(this.type)&&(this.type=new this.type):this.type=w,!(A(this.type.zero)&&A(this.type.add)&&A(this.type.subtract)&&A(this.type.interpolate)))throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");if("absolute"!==this.blend&&this.keyframes.length){for(var i=this.keyframes.length-1,r=[],o=0;o<i;o++)r[o]=this.type.subtract(this.keyframes[o],this.keyframes[i]);r[i]=this.type.zero(this.keyframes[i]),this.delta=r}null!==this.duration&&void 0!==this.duration||(this.duration=e.duration),null!==this.easing&&void 0!==this.easing||(this.easing=e.easing),null!==this.speed&&void 0!==this.speed||(this.speed=1),null!==this.iterations&&void 0!==this.iterations||(this.iterations=1),void 0!==this.startTime&&null!==this.startTime||(this.startTime=e.time),this.sortIndex=b++},T.prototype.convert=function(t,n){if(A(t)&&this.property){["keyframes","delta"].forEach(function(e){var i=this;if(this[e]){var r=this[e].slice(0);this[e]=r.map(function(e){return t.call(n,i.property,e)})}}.bind(this))}},T.prototype.description=function(t){var n=Object.assign({},this);return this.convert.call(n,t.output,t),n},E.prototype=Object.create(j.prototype),E.prototype.constructor=E,E.prototype.runAnimation=function(t,n,e){if(this.type?A(this.type)&&(this.type=new this.type):this.type=w,!(A(this.type.zero)&&A(this.type.add)&&A(this.type.subtract)&&A(this.type.interpolate)))throw new Error("Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");this.from||(this.from=this.type.zero(this.to)),this.to||(this.to=this.type.zero(this.from)),"absolute"!==this.blend&&(this.delta=this.type.subtract(this.from,this.to)),null!==this.duration&&void 0!==this.duration||(this.duration=e.duration),null!==this.easing&&void 0!==this.easing||(this.easing=e.easing),null!==this.speed&&void 0!==this.speed||(this.speed=1),null!==this.iterations&&void 0!==this.iterations||(this.iterations=1),void 0!==this.startTime&&null!==this.startTime||(this.startTime=e.time),this.sortIndex=b++},E.prototype.convert=function(t,n){if(A(t)&&this.property){["from","to","delta"].forEach(function(e){var i=this[e];null!==i&&void 0!==i&&(this[e]=t.call(n,this.property,i))}.bind(this))}},E.prototype.description=function(t){var n=Object.assign({},this);return this.convert.call(n,t.output,t),n};var I=["display","animationForKey","input","output"],H=["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations","removeAnimation"],L=["layer","presentation","model","previous","animations","animationNames","animationCount"],J=new a,W=(J.beginTransaction.bind(J),J.commitTransaction.bind(J),J.currentTransaction.bind(J),J.flushTransaction.bind(J),J.disableAnimation.bind(J));function D(t,n,e,i){if(t){if(t.registerAnimatableProperty||t.addAnimation)throw new Error("Already hyperactive");n?P(n)&&(n={display:n}):n=t,e||(e=t)}else n?P(n)&&(n={display:n}):n={},e||(e=n);var r=[],o=[],s={},a={},u={},c=!1,h={},f={},p=null,d=null,y=null,m=null,g=[],v={},b=null;function w(t){J.registerFlusher(V);var e=J.currentTransaction();Q();var i=Object.keys(t);b||(tt(),b={},J.registerChanger(U),m=Y()),e.disableAnimation||Object.assign(b,t),y=null,i.forEach(function(e){var i=t[e],r=z(e,n.keyInput,n);q(r);var o=M(i,r,n,a);h[r]=o,f[r]=i})}function A(t){var e=Object.keys(t),i=J.currentTransaction(),r=Q();e.forEach(function(t){var e=z(t,n.keyInput,n),o=Y()[t],s=Z()[t];if(o!==s){var c=function(t,n,e,i,r,o,s,a){var u=void 0,c=void 0;if(P(r.animationForKey)&&(c=r.animationForKey.call(r,t,n,e,i)),null===c)return null;o||(o={type:s}),o&&!C(o)&&(u=Object.assign({},o)),u&&!C(c)?u=Object.assign(u,c):(c||0===c)&&(u=c);var h=x(c);return h||!(h=x(o))||(h.duration||0===h.duration||a.duration&&(h.duration=a.duration),h.duration)?(h&&(h instanceof E||h instanceof T)&&(null!==h.property&&void 0!==h.property||(h.property=t),h instanceof E&&(null!==h.from&&void 0!==h.from||("absolute"===h.blend?h.from=i:h.from=e),null!==h.to&&void 0!==h.to||(h.to=n)),null!==h.easing&&void 0!==h.easing||(h.easing=a.easing),null!==h.duration&&void 0!==h.duration||(h.duration=a.duration),h.duration||(h.duration=0)),h):null}(t,o,s,r[t],n,u[e],a[e],i);c?$(c):tt()}})}function j(t,n,e){if(t instanceof O)t.group.forEach(function(t){j(t,-1,e)});else if(t instanceof k)t.chain.forEach(function(t){j(t,-1,e)});else if(!(t instanceof E||t instanceof T))throw new Error("not an animation");t.finished&&(function(t){return t.finished&&("forwards"===t.fillMode||"both"===t.fillMode)}(t)||function(t,n){if(n>-1){r.splice(n,1);var e=o[n];o.splice(n,1),delete s[e]}}(0,n),P(t.onend)&&e.push(t))}function W(){for(var t=r.length,n=[];t--;){j(r[t],t,n)}n.forEach(function(t){t.onend.call(t,!0),t.onend=null})}function D(t){var n=r.indexOf(t);if(n>-1){r.splice(n,1);var e=o[n];o.splice(n,1),delete s[e],P(t.onend)&&t.onend.call(t,!1)}}function _(i){return(e!==t||H.indexOf(i)<0&&L.indexOf(i)<0)&&(e!==n||I.indexOf(i)<0)}function q(t,n){R(t,n)}function R(t,i,r){var o=z(t,n.keyInput,n);if(_(t)){var s=!1,c=g.indexOf(o);-1===c&&(s=!0);var l=e[t];s&&g.push(o);var p=Object.getOwnPropertyDescriptor(e,t);if(null===i?(delete a[o],delete u[o],g.splice(c,1)):r||S(i)?(a[o]=i,s&&(u[o]={type:i})):(u[o]=i,i&&(a[o]=i.type)),void 0!==l&&null!==l){var d=M(l,o,n,a);h[o]=d,f[o]=l}p&&!0!==p.configurable||Object.defineProperty(e,t,{get:function(){return function(t){var e=z(t,n.keyOutput,n);return null===v?(console.log("activeBacking === null doesn't happen"),Y()[e]):v[e]}(t)},set:function(n){!function(t,n){var e={};e[n]=t,w(e)}(n,t)},enumerable:!0,configurable:!0})}}function K(){return r.length}function B(){return Object.keys(e).filter(_).reduce(function(t,n){return t[n]=e[n],t},{})}function U(){A(b),b=null}function V(){d=null,p=null}function X(){d=null}function G(){var t=J.currentTransaction().time,e=Object.assign({},h),i=!0;return r.length&&(i=function(t,n,e,i){if(!n||!n.length)return!1;i&&n.sort(function(t,n){var e=(t.index||0)-(n.index||0);return e||(e=t.startTime-n.startTime),e||(e=t.sortIndex-n.sortIndex),e});var r=!1;return n.forEach(function(n){r=n.composite(t,e)||r;var i=n.property;if(i&&t[i]&&t[i].px&&t[i].px.length&&t[i].px.substring&&"NaN"===t[i].px.substring(t[i].px.length-3))throw new Error("hyperact NaN composite sourceLayer:"+JSON.stringify(t)+";")}),r}(e,r,t,c)),c=!1,!i&&p||(g.forEach(function(t){var i=z(t,n.keyOutput,n),r=e[t];r&&r.length&&r.substring&&r.substring(r.length-3),e[t]=N(r,i,n,a),e[t]&&e[t].length&&e[t].substring&&e[t].substring(e[t].length-3)}),Object.freeze(e),p=e),d=null,p}function Q(){if(null!==d&&null!==p)return d;var t=G(),e=B();return g.forEach(function(i){var r=t[i],o=z(i,n.keyInput,n);Object.defineProperty(e,o,{value:r,enumerable:!0,configurable:!1})}),Object.freeze(e),d=e}function Y(){if(null!==y)return y;var t=B();return g.forEach(function(e){var i=f[e],r=z(e,n.keyInput,n);Object.defineProperty(t,r,{value:i,enumerable:!0,configurable:!1})}),Object.freeze(t),y=t}function Z(){return null!==m?m:Y()}function $(t,i){var h=J.currentTransaction();Q();var l=x(t);if(!(l instanceof E||l instanceof T||l instanceof O||l instanceof k))throw new Error("Not a valid animation:"+JSON.stringify(l));if(F(l,n,u,a,R),r.length||tt(),r.push(l),null!==i&&void 0!==i){var f=s[i];f&&D(f),s[i]=l}void 0===i||null===i||!1===i?o.push(null):o.push(i),c=!0,l.runAnimation(e,i,h)}function tt(){if(!b){var t=P(n.display)?function(t){v=G(),n.display.call(n,t),v=f}:function(){};J.registerTarget(e,G,K,t,X,W,!0,h)}}function nt(t){var n=i?i[t]:void 0;return n&&S(n)?{type:n}:n}return Object.keys(e).filter(_).forEach(function(t){var i=e[t],r=z(t,n.keyInput,n);q(r,nt(t)||{type:new l});M(i,r,n,a);f[r]=i}),i&&Object.keys(i).filter(_).forEach(function(t){q(z(t,n.keyInput,n),nt(t))}),v=Y(),v=f,t&&(t.registerAnimatableProperty=q,t.needsDisplay=function(){X(),tt()},t.addAnimation=$,t.removeAnimation=function(t){var n=s[t];n&&D(n)},t.removeAllAnimations=function(){r.length=0,o.length=0,s={},r.forEach(function(t){P(t.onend)&&t.onend.call(t,!1)})},t.animationNamed=function(t){var e=s[t];return e?e.description.call(e,n):null},Object.defineProperty(t,"layer",{get:function(){return e},set:function(t){t&&w(t)},enumerable:!0,configurable:!1}),Object.defineProperty(t,"animationCount",{get:K,enumerable:!0,configurable:!1}),Object.defineProperty(t,"animations",{get:function(){return r.map(function(t){return t.description.call(t,n)})},enumerable:!0,configurable:!1}),Object.defineProperty(t,"animationNames",{get:function(){return Object.keys(s)},enumerable:!0,configurable:!1}),Object.defineProperty(t,"presentation",{get:Q,enumerable:!0,configurable:!1}),Object.defineProperty(t,"model",{get:Y,enumerable:!0,configurable:!1}),Object.defineProperty(t,"previous",{get:Z,enumerable:!0,configurable:!1})),t}var _=function(){function t(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(n,e,i){return e&&t(n.prototype,e),i&&t(n,i),n}}();function q(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function R(t){return function(t,n,e){var i=Math.sqrt(1-e*e);return 1-1/i*Math.exp(-e*n*t)*Math.sin(i*n*t+Math.atan(i/e))}(t=1-Math.cos(t*Math.PI/2),15,.6)}var K=function(){function t(n,e){q(this,t),D(this),this.element=n,this.iterations=50,this.vertices=500,this.radius=100,this.value=e,this.positionArray=this.plot(),this.registerAnimatableProperty("positionArray")}return _(t,[{key:"animationForKey",value:function(t,n,e){if("positionArray"===t)return{type:new p(l,2*this.vertices),duration:1,easing:R}}},{key:"plot",value:function(){for(var t=this.element,n=t.width/2,e=t.height/2,i=this.value*Math.PI,r=[],o=2*Math.PI/this.vertices,s=this.vertices+1,a=0;--s;){a-=o;var u=this.iterations,c=n,h=e;do{var l=u*a+u*u*i;c+=Math.sin(l)/u*this.radius,h+=Math.cos(l)/u*this.radius}while(--u);r.push(c),r.push(h)}return r}},{key:"layout",value:function(t){this.value=t,this.positionArray=this.plot(),this.needsDisplay()}},{key:"display",value:function(){var t=this.element,n=t.getContext("2d"),e=t.width,i=t.height;n.clearRect(0,0,e,i);var r=this.positionArray,o=r.length;if(o>1){n.beginPath(),n.moveTo(r[0],r[1]);for(var s=2;s<o;s+=2)n.lineTo(r[s],r[s+1]);n.closePath(),n.stroke()}}}]),t}(),B=function(){function t(n,e){q(this,t),D(this),this.element=n,this.value=e,this.registerAnimatableProperty("value")}return _(t,[{key:"animationForKey",value:function(t,n,e,i){return{duration:1,easing:R}}},{key:"layout",value:function(t){this.value=t}},{key:"display",value:function(){this.element.value=1e3*this.value}}]),t}(),U=Math.random(),V=document.createElement("input");V.type="range",V.min=0,V.max=1e3,V.value=1e3*U,document.body.appendChild(V);var X=new B(V,U),G=document.createElement("canvas");G.width=window.innerWidth,G.height=window.innerHeight,document.body.appendChild(G);var Q=new K(G,U);function Y(){G.width=window.innerWidth,G.height=window.innerHeight,W(!0),Q.layout(U),X.layout(U)}Y(),window.addEventListener("resize",Y),G.addEventListener("mousedown",function(t){t.stopPropagation(),t.preventDefault(),U=Math.random(),Q.layout(U),X.layout(U)}),document.addEventListener("mouseup",function(t){V.blur()}),V.addEventListener("input",function(t){U=V.value/1e3,Q.layout(U),X.layout(U)}),V.addEventListener("change",function(t){U=V.value/1e3,Q.layout(U),X.layout(U)}),V.addEventListener("mousedown",function(t){V.focus()})}]);