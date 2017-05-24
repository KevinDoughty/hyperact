!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.types=r():(t.Hyperact=t.Hyperact||{},t.Hyperact.types=r())}(this,function(){return webpackJsonpHyperact__name_([0],{5:function(t,r,n){"use strict";function e(t){return t&&"[object Function]"==={}.toString.call(t)}function i(){}function o(){}function u(t,r,n){this.type=t,e(t)&&(this.type=new t(n)),this.length=r}function c(t){e(t)?this.sort=t:t&&e(t.sort)&&(this.sort=t.sort),this.debug="HyperSet"}function a(t,r,n,e){return{origin:y(t,r),size:l(n,e)}}function f(){return a(0,0,0,0)}function h(t,r){return p(t.origin,r.origin)&&d(t.size,r.size)}function y(t,r){return{x:t,y:r}}function s(){return y(0,0)}function p(t,r){return t.x===r.x&&t.y===r.y}function l(t,r){return{width:t,height:r}}function g(){return l(0,0)}function d(t,r){return t.width===r.width&&t.height&&r.height}function v(t,r){return{location:t,length:r}}function S(){return v(0,0)}function b(){return v(N,0)}function z(t,r){return t>r.location&&t<r.location+r.length}function k(t,r){return t.location===r.location&&t.length===r.length}function A(t,r){if(t.location+t.length<=r.location||r.location+r.length<=t.location)return b();var n=Math.max(t.location,r.location);return{location:n,length:Math.min(t.location+t.length,r.location+r.length)-n}}Object.defineProperty(r,"__esModule",{value:!0});var H=function(){function t(t,r){for(var n=0;n<r.length;n++){var e=r[n];e.enumerable=e.enumerable||!1,e.configurable=!0,"value"in e&&(e.writable=!0),Object.defineProperty(t,e.key,e)}}return function(r,n,e){return n&&t(r.prototype,n),e&&t(r,e),r}}();r.HyperNumber=i,r.HyperScale=o,r.HyperArray=u,r.HyperSet=c,r.hyperMakeRect=a,r.hyperZeroRect=f,r.hyperEqualRects=h,r.hyperMakePoint=y,r.hyperZeroPoint=s,r.hyperEqualPoints=p,r.hyperMakeSize=l,r.hyperZeroSize=g,r.hyperEqualSizes=d,r.hyperMakeRange=v,r.hyperZeroRange=S,r.hyperNullRange=b,r.hyperIndexInRange=z,r.hyperEqualRanges=k,r.hyperIntersectionRange=A,i.prototype={constructor:i,zero:function(){return 0},add:function(t,r){return t+r},subtract:function(t,r){return t-r},interpolate:function(t,r,n){return t+(r-t)*n},toString:function(){return"HyperNumber"},toJSON:function(){return this.toString()}},o.prototype={constructor:o,zero:function(){return 1},add:function(t,r){return t*r},subtract:function(t,r){return 0===r?0:t/r},interpolate:function(t,r,n){return t+(r-t)*n},toString:function(){return"HyperScale"},toJSON:function(){return this.toString()}},u.prototype={constructor:u,zero:function(){for(var t=[],r=this.length;r--;)t.push(this.type.zero());return t},add:function(t,r){for(var n=[],e=0;e<this.length;e++)n.push(this.type.add(t[e],r[e]));return n},subtract:function(t,r){for(var n=[],e=0;e<this.length;e++)n.push(this.type.subtract(t[e],r[e]));return n},interpolate:function(t,r,n){for(var e=[],i=0;i<this.length;i++)e.push(this.type.interpolate(t[i],r[i],n));return e},toString:function(){return"HyperArray"},toJSON:function(){return this.toString()}},c.prototype={constructor:c,zero:function(){return[]},add:function(t,r){if(!Array.isArray(t)&&!Array.isArray(r))return[];if(!Array.isArray(t))return r;if(!Array.isArray(r))return t;var n=[],i=t.length,o=r.length,u=0,c=0;if(e(this.sort))for(;u<i||c<o;)if(u===i)n.push(r[c]),c++;else if(c===o)n.push(t[u]),u++;else{var a=t[u],f=r[c],h=this.sort(a,f);0===h?(n.push(a),u++,c++):h<0?(n.push(a),u++):h>0&&(n.push(f),c++)}else for(n=t.slice(0),u=r.length;u--;)t.indexOf(r[u])<0&&n.push(r[u]);return n},subtract:function(t,r){if(!Array.isArray(t)&&!Array.isArray(r))return[];if(!Array.isArray(t))return r;if(!Array.isArray(r))return t;var n=[],i=t.length,o=r.length,u=0,c=0;if(e(this.sort))for(;(u<i||c<o)&&u!==i;)if(c===o)n.push(t[u]),u++;else{var a=t[u],f=r[c],h=this.sort(a,f);0===h?(u++,c++):h<0?(n.push(a),u++):h>0&&c++}else for(n=t.slice(0),u=r.length;u--;){var y=n.indexOf(r[u]);y>-1&&n.splice(y,1)}return n},interpolate:function(t,r,n){return n>=1?r:t},toString:function(){return"HyperSet"},toJSON:function(){return this.toString()}};var x=r.HyperPoint=function(){function t(){}return H(t,[{key:"zero",value:function(){return s()}},{key:"add",value:function(t,r){return y(t.x+r.x,t.y+r.y)}},{key:"subtract",value:function(t,r){return y(t.x-r.x,t.y-r.y)}},{key:"interpolate",value:function(t,r,n){return y(t.x+(r.x-t.x)*n,t.y+(r.y-t.y)*n)}},{key:"toString",value:function(){return"HyperPoint"}},{key:"toJSON",value:function(){return this.toString()}}]),t}(),w=r.HyperSize=function(){function t(){}return H(t,[{key:"zero",value:function(){return g()}},{key:"add",value:function(t,r){return l(t.width+r.width,t.height+r.height)}},{key:"subtract",value:function(t,r){return l(t.width-r.width,t.height-r.height)}},{key:"interpolate",value:function(t,r,n){return l(t.width+(r.width-t.width)*n,t.height+(r.height-t.height)*n)}},{key:"toString",value:function(){return"HyperSize"}},{key:"toJSON",value:function(){return this.toString()}}]),t}(),N=(r.HyperRect=function(){function t(){}return H(t,[{key:"zero",value:function(){return f()}},{key:"add",value:function(t,r){return{origin:x.prototype.add(t.origin,r.origin),size:w.prototype.add(t.size,r.size)}}},{key:"subtract",value:function(t,r){return{origin:x.prototype.subtract(t.origin,r.origin),size:w.prototype.subtract(t.size,r.size)}}},{key:"interpolate",value:function(t,r,n){return{origin:x.prototype.interpolate(t.origin,r.origin,n),size:w.prototype.interpolate(t.size,r.size,n)}}},{key:"toString",value:function(){return"HyperRect"}},{key:"toJSON",value:function(){return this.toString()}}]),t}(),r.hyperNotFound=Number.MAX_VALUE)}},[5])});