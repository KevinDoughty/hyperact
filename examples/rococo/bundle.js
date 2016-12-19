!function(t){function n(i){if(e[i])return e[i].exports;var r=e[i]={exports:{},id:i,loaded:!1};return t[i].call(r.exports,r,r.exports,n),r.loaded=!0,r.exports}var e={};return n.m=t,n.c=e,n.p="",n(0)}([function(t,n,e){"use strict";function i(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}function r(t,n,e){var i=Math.sqrt(1-e*e),r=1/i*Math.exp(-e*n*t)*Math.sin(i*n*t+Math.atan(i/e));return 1-r}function o(t){return t=1-Math.cos(t*Math.PI/2),r(t,15,.6)}function a(){y.width=window.innerWidth,y.height=window.innerHeight,(0,u.disableAnimation)(!0),m.layout(h),d.layout(h)}var s=function(){function t(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}return function(n,e,i){return e&&t(n.prototype,e),i&&t(n,i),n}}(),u=e(1),c=1,l=function(){function t(n){i(this,t),this.element=n,this.iterations=50,this.vertices=1e3,this.radius=75,this.value=0,this.positionArray=this.plot(),(0,u.decorate)(this),this.registerAnimatableProperty("positionArray")}return s(t,[{key:"animationForKey",value:function(t,n,e){if("positionArray"===t)return{type:new u.HyperArray(u.HyperNumber,2*this.vertices),duration:c,easing:o}}},{key:"plot",value:function(){for(var t=this.element,n=t.width,e=t.height,i=n/2,r=e/2,o=this.value*Math.PI,a=[],s=2*Math.PI/this.vertices,u=this.vertices,c=0;--u;){c-=s;var l=this.iterations,f=i,h=r;do{var p=l*c+l*l*o;f+=Math.sin(p)/l*this.radius,h+=Math.cos(p)/l*this.radius}while(--l);a.push(f),a.push(h)}return a}},{key:"layout",value:function(t){this.value=t,this.positionArray=this.plot()}},{key:"display",value:function(){var t=this.element,n=t.getContext("2d"),e=t.width,i=t.height;n.clearRect(0,0,e,i);var r=this.positionArray,o=r.length;if(o>1){n.beginPath(),n.moveTo(r[0],r[1]);for(var a=2;a<o;a+=2)n.lineTo(r[a],r[a+1]);n.closePath(),n.stroke()}}}]),t}(),f=function(){function t(n){i(this,t),(0,u.decorate)(this),this.element=n,this.value=0,this.registerAnimatableProperty("value")}return s(t,[{key:"animationForKey",value:function(t,n,e){return{duration:c,easing:o}}},{key:"layout",value:function(t){this.value=t}},{key:"display",value:function(){this.element.value=1e3*this.value}}]),t}(),h=Math.random(),p=document.createElement("input");p.type="range",p.min=0,p.max=1e3,p.value=1e3*h,document.body.appendChild(p);var d=new f(p),y=document.createElement("canvas");document.body.appendChild(y);var m=new l(y);a(),window.addEventListener("resize",a),y.addEventListener("mousedown",function(t){t.stopPropagation(),t.preventDefault(),h=Math.random(),m.layout(h),d.layout(h)}),document.addEventListener("mouseup",function(t){p.blur()}),p.addEventListener("input",function(t){h=p.value/1e3,m.layout(h),d.layout(h)}),p.addEventListener("change",function(t){h=p.value/1e3,m.layout(h),d.layout(h)}),p.addEventListener("mousedown",function(t){p.focus()})},function(t,n,e){var i,r,o;(function(t){"use strict";var e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};!function(a,s){"object"==e(n)&&"object"==e(t)?t.exports=s():(r=[],i=s,o="function"==typeof i?i.apply(n,r):i,!(void 0!==o&&(t.exports=o)))}(void 0,function(){return function(t){function n(i){if(e[i])return e[i].exports;var r=e[i]={i:i,l:!1,exports:{}};return t[i].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var e={};return n.m=t,n.c=e,n.i=function(t){return t},n.d=function(t,e,i){n.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},n.p="",n(n.s=4)}([function(t,n,e){function i(t){return t&&t.__esModule?t:{default:t}}function r(t){return t&&"[object Function]"==={}.toString.call(t)}function o(t,n){if(t instanceof f.HyperGroup){var e=t.group;if(e){if(!Array.isArray(e))throw new Error("childAnimations is not an array");e.forEach(function(t){o(t,n)})}}else{if(!(t instanceof f.HyperAnimation))throw new Error("not an animation");var i=n.typeOfProperty.call(n,t.property,t.to);i&&(t.type=i)}}function a(t,n,e,i,r){var o=Object.assign({},t);if(!n||!n.length)return o;i&&n.sort(function(t,n){var e=t.index||0,i=n.index||0,r=e-i;return r||(r=t.startTime-n.startTime),r||(r=t.sortIndex-n.sortIndex),r});var a=!1;return n.forEach(function(t){a=t.composite(o,e)||a}),!a&&n.length&&r?r:o}function s(t){y.disableAnimation(t)}function u(t,n,e){if(!t)throw new Error("Nothing to hyperactivate.");if(t.registerAnimatableProperty||t.addAnimation)throw new Error("Already hyperactive");n||(n=t),e||(e=t);var i=[],s=[],u={},c={},l=!1,m=0,g={},v={},b=null,w=[],A=g;t.registerAnimatableProperty=function(t,i){var r=!1;w.indexOf(t)===-1&&(r=!0),r&&w.push(t);var o=Object.getOwnPropertyDescriptor(e,t);if(i=(0,f.animationFromDescription)(i),h&&H(["from","to","delta"],i,n.input),i?c[t]=i:null===c[t]&&delete c[t],!o||o.configurable===!0){var a=e[t];h&&(a=M(a,t,n.input)),g[t]=a,r&&Object.defineProperty(e,t,{get:function(){return x(t)},set:function(n){E(n,t)},enumerable:!0,configurable:!0})}if("animations"===t)throw new Error("I don't think so")},Object.defineProperty(t,"layer",{get:function(){return e},set:function(n){n&&Object.keys(n).forEach(function(e){t.registerAnimatableProperty(e),E(n[e],e)})},enumerable:!1,configurable:!1});var O=function(e,i,o){var a;r(n.animationForKey)&&(a=n.animationForKey.call(n,e,i,o));var s=(0,f.animationFromDescription)(a);return s||(s=(0,f.animationFromDescription)(c[e])),s&&(null!==s.property&&"undefined"!=typeof s.property||(s.property=e),null!==s.from&&"undefined"!=typeof s.from||("absolute"===s.blend?s.from=t.presentation[e]:s.from=g[e]),null!==s.to&&"undefined"!=typeof s.to||(s.to=i)),s},x=function(t){p&&(t=j(t,n.keyOutput));var e=A[t];return h&&(e=M(e,t,n.output)),e},E=function(e,i){if(p&&(i=j(i,n.keyInput)),h&&(e=M(e,i,n.input)),e!==g[i]){var r=g[i];v[i]=r;var o,a=y.currentTransaction();a.disableAnimation||(o=O(i,e,r),o&&t.addAnimation(o)),g[i]=e,b=null,A=g,o||t.needsDisplay()}},j=function(t,n){return r(n)?n(t):t},M=function(t,n,e){return r(e)?e(n,t):t},P=function(t,n,e){if(n&&r(e)){var i=n[t];if(null!==i&&"undefined"!=typeof i&&(n[t]=e(t,i)),null===t||"undefined"==typeof t)throw new Error("convert property undefined")}},T=function(t,n,e){t.forEach(function(t){if(null===t||"undefined"==typeof t)throw new Error("convert properties undefined");P(t,n,e)})},H=function(t,n,e){if(n&&r(e)){var i=n.property;t.forEach(function(t){var r=n[t];null!==r&&"undefined"!=typeof r&&(n[t]=e(i,r))})}};Object.defineProperty(t,"animationCount",{get:function(){return i.length},enumerable:!1,configurable:!1}),Object.defineProperty(t,"animations",{get:function(){var t=i.map(function(t){var e=t.copy.call(t);return h&&H(["from","to","delta"],e,n.output),e});return t},enumerable:!1,configurable:!1}),Object.defineProperty(t,"animationNames",{get:function(){return Object.keys(u)},enumerable:!1,configurable:!1}),Object.defineProperty(t,"model",{get:function(){var t={};return w.forEach(function(e){var i=g[e];h&&(i=M(i,e,n.output)),Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!1})}),Object.freeze(t),t},enumerable:!1,configurable:!1}),Object.defineProperty(t,"previous",{get:function(){var t=Object.assign({},g);return Object.keys(v).forEach(function(e){var i=v[e];h&&(i=M(i,e,n.output)),Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!1}),v[e]=g[e]}),Object.freeze(t),t},enumerable:!1,configurable:!1});var z=function(){for(var n=i.length;n--;){var e=i[n];if(e.finished){i.splice(n,1);var o=s[n];s.splice(n,1),delete u[o],r(e.onend)&&e.onend.call(e,!0)}}d||i.length||y.deregisterTarget(t),i.length||(b=g)};Object.defineProperty(t,"presentation",{get:function(){var r=0;if(i.length){var o=y.currentTransaction();r=o.time}var s={};t!==e&&n!==e&&(s=Object.assign({},e));var u=Object.assign(s,g),c=a(u,i,r,l,b);return h&&c!==b&&T(Object.keys(c),c,n.output),b=c,A=c,l=!1,c},enumerable:!1,configurable:!1}),t.needsDisplay=function(){var e=function(){};r(n.display)&&(e=n.display.bind(n)),y.registerTarget(t,e,z)},t.addAnimation=function(e,a){var c=(0,f.animationFromDescription)(e);if(!(c instanceof f.HyperAnimation||c instanceof f.HyperGroup))throw new Error("Animations must be a Hyper.Animation or Group subclass.",JSON.stringify(c));h&&(H(["from","to","delta"],c,n.input),r(n.typeOfProperty)&&o(c,n));var p=function(){};r(n.display)&&(p=n.display.bind(n)),i.length||y.registerTarget(t,p,z);var d=c.copy.call(c);if(i.push(d),null!==a&&"undefined"!=typeof a){var g=u[a];g&&k(g),u[a]=d}"undefined"==typeof a||null===a||a===!1?s.push(null):s.push(a),l=!0,d instanceof f.HyperGroup?(d.sortIndex=m++,d.startTime=y.currentTransaction().time,d.group.forEach(function(t){t.sortIndex=m++,t.startTime=y.currentTransaction().time})):d instanceof f.HyperAnimation&&(d.sortIndex=m++,d.startTime=y.currentTransaction().time),d.runAnimation(t,a)};var k=function(n){var e=i.indexOf(n);if(e>-1){i.splice(e,1);var r=s[e];s.splice(e,1),delete u[r]}d||i.length||y.deregisterTarget(t)};t.removeAnimation=function(t){var n=u[t];n&&k(n)},t.removeAllAnimations=function(){i.length=0,s.length=0,u={},i.forEach(function(t){r(t.onend)&&t.onend.call(t,!1)}),d||y.deregisterTarget(t)},t.animationNamed=function(t){var e=u[t];if(e){var i=e.copy.call(e);return h&&H(["from","to","delta"],i,n.output),i}return null}}Object.defineProperty(n,"__esModule",{value:!0}),n.disableAnimation=s,n.decorate=u;var c=e(3),l=i(c),f=e(2),h=!0,p=!0,d=!0,y=new l.default},function(t,n){function e(t){return t&&"[object Function]"==={}.toString.call(t)}function i(t){}function r(t){}function o(t,n,i){this.type=t,e(t)&&(this.type=new t(i)),this.length=n}function a(t){e(t)?this.sort=t:t&&e(t.sort)&&(this.sort=t.sort)}function s(t){}function u(t){}function c(t){}function l(t){throw new Error("HyperRange not supported")}function f(t,n,e,i){return{origin:d(t,n),size:g(e,i)}}function h(){return f(0,0,0,0)}function p(t,n){return m(t.origin,n.origin)&&b(t.size,n.size)}function d(t,n){return{x:t,y:n}}function y(){return d(0,0)}function m(t,n){return t.x===n.x&&t.y===n.y}function g(t,n){return{width:t,height:n}}function v(){return g(0,0)}function b(t,n){return t.width===n.width&&t.height&&n.height}function w(t,n){return{location:t,length:n}}function A(){return w(0,0)}function O(){return w(M,0)}function x(t,n){return t>n.location&&t<n.location+n.length}function E(t,n){return t.location===n.location&&t.length===n.length}function j(t,n){if(t.location+t.length<=n.location||n.location+n.length<=t.location)return O();var e=Math.max(t.location,n.location),i=Math.min(t.location+t.length,n.location+n.length);return{location:e,length:i-e}}Object.defineProperty(n,"__esModule",{value:!0}),n.HyperNumber=i,n.HyperScale=r,n.HyperArray=o,n.HyperSet=a,n.HyperPoint=s,n.HyperSize=u,n.HyperRect=c,n.HyperRange=l,n.HyperMakeRect=f,n.HyperZeroRect=h,n.HyperEqualRects=p,n.HyperMakePoint=d,n.HyperZeroPoint=y,n.HyperEqualPoints=m,n.HyperMakeSize=g,n.HyperZeroSize=v,n.HyperEqualSizes=b,n.HyperMakeRange=w,n.HyperZeroRange=A,n.HyperNullRange=O,n.HyperIndexInRange=x,n.HyperEqualRanges=E,n.HyperIntersectionRange=j,i.prototype={constructor:i,zero:function(){return 0},add:function(t,n){return t+n},subtract:function(t,n){return t-n},interpolate:function(t,n,e){return t+(n-t)*e}},r.prototype={constructor:r,zero:function(){return 1},add:function(t,n){return t*n},subtract:function(t,n){return 0===n?0:t/n},interpolate:function(t,n,e){return t+(n-t)*e}},o.prototype={constructor:o,zero:function(){for(var t=[],n=this.length;n--;)t.push(this.type.zero());return t},add:function(t,n){for(var e=[],i=0;i<this.length;i++)e.push(this.type.add(t[i],n[i]));return e},subtract:function(t,n){for(var e=[],i=0;i<this.length;i++)e.push(this.type.subtract(t[i],n[i]));return e},interpolate:function(t,n,e){for(var i=[],r=0;r<this.length;r++)i.push(this.type.interpolate(t[r],n[r],e));return i}},a.prototype={constructor:a,zero:function(){return[]},add:function(t,n){if(!Array.isArray(t)&&!Array.isArray(n))return[];if(!Array.isArray(t))return n;if(!Array.isArray(n))return t;var i=[],r=t.length,o=n.length,a=0,s=0;if(e(this.sort))for(;a<r||s<o;)if(a===r)i.push(n[s]),s++;else if(s===o)i.push(t[a]),a++;else{var u=t[a],c=n[s],l=this.sort(u,c);0===l?(i.push(u),a++,s++):l<0?(i.push(u),a++):l>0&&(i.push(c),s++)}else for(i=t.slice(0),a=n.length;a--;)t.indexOf(n[a])<0&&i.push(n[a]);return i},subtract:function(t,n){if(!Array.isArray(t)&&!Array.isArray(n))return[];if(!Array.isArray(t))return n;if(!Array.isArray(n))return t;var i=[],r=t.length,o=n.length,a=0,s=0;if(e(this.sort))for(;(a<r||s<o)&&a!==r;)if(s===o)i.push(t[a]),a++;else{var u=t[a],c=n[s],l=this.sort(u,c);0===l?(a++,s++):l<0?(i.push(u),a++):l>0&&s++}else for(i=t.slice(0),a=n.length;a--;){var f=i.indexOf(n[a]);f>-1&&i.splice(f,1)}return i},interpolate:function(t,n,e){return e>=1?n:t}},s.prototype={constructor:s,zero:function(){return y()},add:function(t,n){return d(t.x+n.x,t.y+n.y)},subtract:function(t,n){return d(t.x-n.x,t.y-n.y)},interpolate:function(t,n,e){return d(t.x+(n.x-t.x)*e,t.y+(n.y-t.y)*e)}},u.prototype={constructor:u,zero:function(){return v()},add:function(t,n){return g(t.width+n.width,t.height+n.height)},subtract:function(t,n){return g(t.width-n.width,t.height-n.height)},interpolate:function(t,n,e){return g(t.width+(n.width-t.width)*e,t.height+(n.height-t.height)*e)}},c.prototype={constructor:c,zero:function(){return h()},add:function(t,n){return{origin:s.prototype.add(t.origin,n.origin),size:u.prototype.add(t.size,n.size)}},subtract:function(t,n){return{origin:s.prototype.subtract(t.origin,n.origin),size:u.prototype.subtract(t.size,n.size)}},interpolate:function(t,n,e){return{origin:s.prototype.interpolate(t.origin,n.origin,e),size:u.prototype.interpolate(t.size,n.size,e)}}},l.prototype={constructor:l,zero:function(){return O()},add:function(t,n){if(t.location===M&&n.location===M)return O();if(0===t.length&&0===n.length)return O();if(t.location===M||0===t.length)return n;if(n.location===M||0===n.length)return t;var e=Math.min(t.location,n.location),i=Math.max(t.location+t.length,n.location+n.length),r=w(e,i-e);return r},subtract:function(t,n){var e=t;return t.location===M&&n.location===M?e=O():0===t.length&&0===n.length?e=O():t.location===M||0===t.length?e=O():n.location===M||0===n.length?e=t:n.location<=t.location&&n.location+n.length>=t.location+t.length?e=O():n.location<=t.location&&n.location+n.length>t.location&&n.location+n.length<t.location+t.length?e=w(n.location+n.length,t.location+t.length-(n.location+n.length)):n.location>t.location&&n.location<t.location+t.length&&n.location+n.length>=t.location+t.length&&(e=w(t.location,n.location+n.length-t.location)),e},interpolate:function(t,n,e){return e>=1?n:t},intersection:function(t,n){if(t.location===M||n.location===M||0===t.length||0===n.length)return O();if(t.location+t.length<=n.location||n.location+n.length<=t.location)return O();var e=Math.max(t.location,n.location),i=Math.min(t.location+t.length,n.location+n.length);return w(e,i-e)}};var M=n.HyperNotFound=Number.MAX_VALUE},function(t,n){function i(t){return t&&"[object Function]"==={}.toString.call(t)}function r(t){return!isNaN(parseFloat(t))&&isFinite(t)}function o(t){return t&&"object"===("undefined"==typeof t?"undefined":f(t))}function a(t){if(t instanceof c){var n=t.group;if(null!==n&&"undefined"!=typeof n){if(!Array.isArray(n))throw new Error("childAnimations is not an array");n.forEach(function(t){a(t)})}}else{if(!(t instanceof l))throw new Error("not an animation object");i(t.type)&&(t.type=new t.type),t.duration||(t.duration=0),null!==t.speed&&"undefined"!=typeof t.speed||(t.speed=1),null!==t.iterations&&"undefined"!=typeof t.iterations||(t.iterations=1)}}function s(t){var n;if(!t)return t;if(t instanceof c||t instanceof l)n=t.copy.call(t);else if(Array.isArray(t))n=new c(t);else if(o(t))n=new l(t);else{if(!r(t))throw new Error("is this an animation:"+JSON.stringify(t));n=new l({duration:t})}return a(n),n}function u(){}function c(t){u.call(this),this.finished=0;var n=0;this.group=t.map(function(t){var e=s(t),i=e.delay+e.duration*e.iterations/e.speed;return n=Math.max(i,n),e}),Object.defineProperty(this,"finished",{get:function(){return this.group.forEach(function(t){if(!t.finished)return 0}),1},enumerable:!1,configurable:!1})}function l(t){u.call(this),this.property,this.from,this.to,this.type=h,this.delta,this.duration=0,this.easing,this.speed=1,this.iterations=1,this.autoreverse,this.fillMode,this.index=0,this.delay=0,this.blend="relative",this.additive=!0,this.sort,this.finished=0,this.startTime,this.progress=0,this.onend,this.remove=!0,t&&Object.keys(t).forEach(function(n){this[n]=t[n]}.bind(this))}Object.defineProperty(n,"__esModule",{value:!0});var f="function"==typeof Symbol&&"symbol"==e(Symbol.iterator)?function(t){return"undefined"==typeof t?"undefined":e(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":"undefined"==typeof t?"undefined":e(t)};n.animationFromDescription=s,n.HyperGroup=c,n.HyperAnimation=l;var h={zero:function(){return 0},add:function(t,n){return t+n},subtract:function(t,n){return t-n},interpolate:function(t,n,e){return t+(n-t)*e}};c.prototype={constructor:c,copy:function t(){var n=this.constructor,t=new n(this.group);return t},runAnimation:function(t,n){this.group.forEach(function(e){e.runAnimation.call(e,t,n)}.bind(this))},composite:function(t,n){this.group.forEach(function(e){e.composite.call(e,t,n)})}},l.prototype={constructor:l,copy:function t(){for(var n=this.constructor,t=new n(this.settings),e=Object.getOwnPropertyNames(this),i=e.length,r=0;r<i;r++)Object.defineProperty(t,e[r],Object.getOwnPropertyDescriptor(this,e[r]));return t},composite:function(t,n){if(null===this.startTime||void 0===this.startTime)throw new Error("Cannot composite an animation that has not been started.");var e=Math.max(0,n-(this.startTime+this.delay)),r=this.speed,o=1,a=1,s=this.duration,u=s*this.iterations;if(u&&(o=e*r/s,a=e*r/u),a>=1){if(o=1,this.finished>1)throw new Error("animation not removed");this.finished++}var c=0;if(this.finished||(this.autoreverse===!0&&(c=Math.floor(o)%2),o%=1),c&&(o=1-o),i(this.easing))o=this.easing(o);else if("step-start"===this.easing)o=Math.ceil(o);else if("step-middle"===this.easing)o=Math.round(o);else if("step-end"===this.easing)o=Math.floor(o);else{var l=.5-Math.cos(o*Math.PI)/2;if(this.easing){var f=/(step-start|step-middle|step-end|steps)\((\d+)\)/.exec(this.easing);if(f){var h=f[1],p=f[2];p>0?"step-start"===h?o=Math.ceil(o*p)/p:"step-middle"===h?o=Math.round(o*p)/p:"step-end"!==h&&"steps"!==h||(o=Math.floor(o*p)/p):"linear"!==this.easing&&(o=l)}else"linear"!==this.easing&&(o=l)}else o=l}var d="absolute"===this.blend?this.type.interpolate(this.from,this.to,o):this.type.interpolate(this.delta,this.type.zero(this.to),o),y=this.property;if("undefined"!=typeof y&&null!==y){var m=d,g=t[y];"undefined"!=typeof g&&null!==g||(g=this.type.zero(this.to)),this.additive&&(m=this.type.add(g,d)),this.sort&&Array.isArray(m)&&m.sort(this.sort),t[y]=m}var v=o!==this.progress;return this.progress=o,v},runAnimation:function(t,n){if(!(this.type&&i(this.type.zero)&&i(this.type.add)&&i(this.type.subtract)&&i(this.type.interpolate)))throw new Error("Hyper.Animation runAnimation invalid type. Must implement zero, add, subtract, and interpolate.");if(this.from||(this.from=this.type.zero(this.to)),this.to||(this.to=this.type.zero(this.from)),"absolute"!==this.blend&&(this.delta=this.type.subtract(this.from,this.to)),null===this.startTime||void 0===this.startTime)throw new Error("no start time")}}},function(t,n){function e(t){return t&&"[object Function]"==={}.toString.call(t)}function i(t,n){this.time=a()/1e3,this.disableAnimation=!1,this._automaticallyCommit=n,this.settings=t}function r(){this.targets=[],this.transactions=[],this.ticking=!1,this.animationFrame,this.displayLayers=[],this.displayFunctions=[],this.cleanupFunctions=[]}Object.defineProperty(n,"__esModule",{value:!0}),n.default=r;var o="undefined"!=typeof window&&(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame)||function(t){setTimeout(t,0)},a=Date.getTime;Date.now&&(a=Date.now),"undefined"!=typeof window&&"undefined"!=typeof window.performance&&"undefined"!=typeof window.performance.now&&(a=window.performance.now.bind(window.performance)),r.prototype={createTransaction:function(t,n){var e=new i(t,n),r=this.transactions.length;return r&&(e.time=this.transactions[r-1].time),this.transactions.push(e),n&&this.startTicking(),e},currentTransaction:function(){var t=this.transactions.length;return t?this.transactions[t-1]:this.createTransaction({},!0)},beginTransaction:function(t){this.createTransaction(t,!1)},commitTransaction:function(){this.transactions.pop()},flushTransaction:function(){this.ticker()},disableAnimation:function(t){t!==!1&&(t=!0);var n=this.currentTransaction();n.disableAnimation=t,this.startTicking()},registerTarget:function(t,n,e){this.startTicking();var i=this.targets.indexOf(t);i<0&&(this.targets.push(t),this.displayLayers.push(null),this.displayFunctions.push(n),this.cleanupFunctions.push(e))},deregisterTarget:function(t){var n=this.targets.indexOf(t);n>-1&&(this.targets.splice(n,1),this.displayLayers.splice(n,1),this.displayFunctions.splice(n,1),this.cleanupFunctions.splice(n,1))},startTicking:function(){this.animationFrame||(this.animationFrame=o(this.ticker.bind(this)))},ticker:function(){this.animationFrame=void 0;for(var t=this.targets,n=t.length;n--;){var i=t[n],r=this.displayFunctions[n];if(i.animationCount){if(e(r)){var o=i.presentation;this.displayLayers[n]!==o&&(i.animationCount&&(this.displayLayers[n]=o),r())}this.cleanupFunctions[n]()}else e(r)&&r(),this.deregisterTarget(i)}var a=this.transactions.length;if(a){var s=this.transactions[a-1];s._automaticallyCommit&&this.commitTransaction()}this.targets.length&&this.startTicking()}}},function(t,n,e){function i(){}Object.defineProperty(n,"__esModule",{value:!0});var r=e(0);Object.keys(r).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(n,t,{enumerable:!0,get:function(){return r[t]}})});var o=e(1);Object.keys(o).forEach(function(t){"default"!==t&&"__esModule"!==t&&Object.defineProperty(n,t,{enumerable:!0,get:function(){return o[t]}})}),n.whyDoTheOtherExportsHaveGettersButThisDoesNot=i}])})}).call(n,e(2)(t))},function(t,n){t.exports=function(t){return t.webpackPolyfill||(t.deprecate=function(){},t.paths=[],t.children=[],t.webpackPolyfill=1),t}}]);