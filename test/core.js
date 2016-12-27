import * as core from "../source/core.js";
var assert = require("assert");

var duration = 0.1; // mocha timeout is 2 seconds

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

describe("core", function() {

	describe("zero", function() {
		it("function", function() {
			assert(isFunction(function() {}));
			assert(!isFunction({}));
			assert(!isFunction("[object Function]"));
		});
		it("decorate", function() {
			assert(isFunction(core.decorate));
		});
		it("disableAnimation", function() {
			assert(isFunction(core.disableAnimation));
		});
	});

	describe("one", function() {

		var one;

		beforeEach( function() {
	// 		var One = function() {
	// 			core.decorate(this); // controller, delegate, and layer are the same
	// 		}
	// 		one = new One();
			one = {};
			core.decorate(one);
		});

		it("controller and layer are the same object", function() {
			assert.equal(one,one.layer);
		});

	// 	it("unregistered presentation", function() { // expected. Can't do this if layer and controller are the same
	// 		one.layer.asdf = 1;
	// 		assert(one.presentation.asdf === 1);
	// 	});

	// 	it("registered presentation", function() { // should fail without flushing transaction
	// 		one.registerAnimatableProperty("zxcv");
	// 		one.layer.zxcv = 1;
	// 		assert(one.presentation.zxcv === 1);
	// 	});


		it("registered presentation, flushed", function() {
			one.registerAnimatableProperty("zxcv");
			one.layer.zxcv = 1;
			core.flushTransaction();
			assert.equal(one.presentation.zxcv,1);
		});

		it("callback", function(done) {
			one.addAnimation({
				duration:duration,
				onend: function(finished) {
					done();
				}
			});
		});

		it("unregistered callback", function(done) {
			one.uiop = 2;
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				onend: function(finished) {
					var error = (one.uiop === 2) ? null : new Error("should have reverted to non animated value");
					done(error);
				}
			});
		});

	// 	it('unregistered animation", function() { // expected. should be model value
	// 		one.uiop = 2;
	// 		one.addAnimation({
	// 			property:"uiop",
	// 			duration:duration,
	// 			from: 1,
	// 			to: 1,
	// 			blend:"absolute",
	// 			additive:false
	// 		});
	// 		assert(one.uiop === 1);
	// 	});

		it("unregistered animation layer", function() {
			one.uiop = 2;
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				blend:"absolute",
				additive:false
			});
			assert.equal(one.uiop,2);
		});

		it("unregistered animation presentation, flushed", function() {
			one.uiop = 2;
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				blend:"absolute",
				additive:false
			});
			core.flushTransaction();
			assert.equal(one.presentation.uiop,1);
		});

		it("registered before animation presentation, flushed", function() {
			one.registerAnimatableProperty("uiop");
			one.uiop = 2;
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				blend:"absolute",
				additive:false
			});
			core.flushTransaction();
			assert.equal(one.presentation.uiop,1); // still generates presentation before addAnimation
		});

		it("registered after animation presentation, flushed", function() {
			one.uiop = 2;
			one.registerAnimatableProperty("uiop");
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				blend:"absolute",
				additive:false
			});
			core.flushTransaction();
			assert.equal(one.presentation.uiop,1);
		});

		it("registered property with existing value", function() {
			one.uiop = 2;
			one.registerAnimatableProperty("uiop");
			assert.equal(one.uiop, 2);
		});

		it("register property then assign value", function() {
			one.registerAnimatableProperty("uiop");
			one.uiop = 2;
			assert.equal(one.uiop, 2);
		});

		it("registered animation effect, flushed", function() {
			one.uiop = 2;
			one.registerAnimatableProperty("uiop");
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(one.presentation.uiop,3);
		});

		it("registered implicit presentation", function() {
			one.animationForKey = function(key,value,previous) {
				return duration;
			};
			one.layer.zxcv = 1;
			one.registerAnimatableProperty("zxcv");
			one.layer.zxcv = 2;
			assert.equal(one.presentation.zxcv,1);
		});
	});

	describe("two", function() {

		var two;

		beforeEach( function() {
	// 		var Two = function() {
	// 			core.decorate(this,this,{}); // controller and delegate same, with separate layer
	// 		}
	// 		two = new Two();
			two = {};
			core.decorate(two,two,{}); // controller and delegate same, with separate layer
		});

		it("controller and layer are not the same instance", function() {
			assert(two !== two.layer);
		});

		it("unregistered presentation", function() {
			two.layer.qwer = 1;
			core.flushTransaction();
			assert.equal(two.presentation.qwer,1);
		});

		it("registered presentation", function() {
			two.registerAnimatableProperty("zxcv");
			two.layer.zxcv = 1;
			core.flushTransaction();
			assert.equal(two.presentation.zxcv,1);
		});

		it("callback", function(done) {
			two.addAnimation({
				duration:duration,
				onend: function(finished) {
					done();
				}
			});
		});
	});

	describe("three", function() {
		it("presentation does include functions, decorate(view)", function() {
			const animationForKey = function(key,value,previous) {
				return duration;
			};
			var view = {
				a:1,
				b:2,
				c:3,
				animationForKey: animationForKey
			};
			core.decorate(view);
			assert.deepEqual(view.presentation, { a:1, b:2, c:3, animationForKey:animationForKey });
		});
		it("presentation does include functions, decorate(view,view,layer)", function() {
			const animationForKey = function(key,value,previous) {
				return duration;
			};
			const test = function() {
				console.log("this is a function");
			};
			var layer = {
				a:1,
				b:2,
				c:3,
				test: test
			};
			var view = {
				animationForKey: animationForKey
			};
			core.decorate(view,view,layer);
			assert.deepEqual(view.presentation, { a:1, b:2, c:3, test:test });
		});
		it("implicit duration only, presentation", function() {
			const animationForKey = function(key,value,previous) {
				return duration;
			};
			var view = {
				a:1,
				b:2,
				c:3,
				animationForKey: animationForKey
			};
			core.decorate(view);
			view.layer = {a:4, b:5, c:6};
			assert.deepEqual(view.presentation, { a:1, b:2, c:3, animationForKey:animationForKey });
		});
		it("implicit constant, presentation", function() {
			const animationForKey = function(key,value,previous) {
				// console.log("animationForKey:%s; value:%s; previous:%s;",key,value,previous);
				// animationForKey:a; value:4; previous:1;
				// animationForKey:b; value:5; previous:2;
				// animationForKey:c; value:6; previous:3;
				return {
					duration:duration,
					from:1,
					to:1,
					blend:"absolute"
				};
			};
			var layer = {
				a:1,
				b:2,
				c:3
			};
			var view = {
				animationForKey: animationForKey
			};
			core.decorate(view,view,layer);
			view.layer = {a:4, b:5, c:6};
			core.flushTransaction();
			assert.deepEqual(view.presentation, { a:5, b:6, c:7 });
		});
		it("implicit duration only, model", function() {
			const animationForKey = function(key,value,previous) {
				return duration;
			};
			var view = {
				a:1,
				b:2,
				c:3,
				animationForKey: animationForKey
			};
			core.decorate(view);
			view.layer = {a:4, b:5, c:6};
			assert.deepEqual(view.model, { a:4, b:5, c:6 });
		});
		it("implicit constant, model", function() {
			const animationForKey = function(key,value,previous) {
				return {
					duration:duration,
					from:1,
					to:1,
					blend:"absolute"
				};
			};
			var layer = {
				a:1,
				b:2,
				c:3
			};
			var view = {
				animationForKey: animationForKey
			};
			core.decorate(view,view,layer);
			view.layer = {a:4, b:5, c:6};
			assert.deepEqual(view.model, { a:4, b:5, c:6 });
		});

		it("presentation in onend", function(done) {
			var view = {
				a:1,
				b:2,
				c:3
			};
			core.decorate(view);
			view.registerAnimatableProperty("a");
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute",
				onend: function(finished) {
					var error = (view.presentation.a === view.a) ? null : new Error("should have reverted to non animated value");
					done(error);
				}
			});
		});

		it("presentation in onend two", function(done) {
			var view = {
				a:1,
				b:2,
				c:3
			};
			core.decorate(view);
			view.registerAnimatableProperty("a");
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute",
				onend: function(finished) {
					var error = (view.presentation.a === view.a) ? null : new Error("should have reverted to non animated value");
					done(error);
				}
			});
		});

		it("single presentation flushed", function() {
			var view = {a:1, b:2, c:3};
			core.decorate(view);
			//view.layer = {a:1, b:2, c:3};
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			view.addAnimation({
				property:"b",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			view.addAnimation({
				property:"c",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute",
				additive:false
			});
			core.flushTransaction();
			assert.deepEqual(view.presentation, { a:2, b:3, c:1 });
		});
	});

	describe("four", function() {
		it("ensure one more tick", function(done) {
			var completed = false;
			var view = {
				a:1,
				b:2,
				c:3,
				display: function() {
					if (completed) done();
				}
			};
			core.decorate(view);
			view.registerAnimatableProperty("a"); // no longer needed
			view.addAnimation({
				property:"a",
				duration:duration,
				from:2,
				to:2,
				blend:"absolute",
				onend: function(finished) {
					completed = true;
				}
			});
		});
	});

	describe("five", function() {
		it("should not reflect presentation outside of display, decorate(view,view,layer)", function() {
			const view = {
			};
			const layer = {
				a: 1
			};
			core.decorate(view,view,layer);
			view.addAnimation({
				property:"a",
				from:2,
				to:2,
				blend:"absolute",
				duration:duration
			});
			core.flushTransaction();
			const presentation = view.presentation;
			const model = view.model;
			
			assert.equal(layer.a,1);
			assert.equal(model.a,1);
			assert.equal(presentation.a,3);
		
		});
		it("should not reflect presentation outside of display, decorate(view)", function() {
			const view = {
				a:1
			};
			core.decorate(view);
			view.addAnimation({
				property:"a",
				from:2,
				to:2,
				blend:"absolute",
				duration:duration
			});
			core.flushTransaction();
			const presentation = view.presentation;
			const model = view.model;
			
			assert.equal(view.a,1);
			assert.equal(model.a,1);
			assert.equal(presentation.a,3);
		});
		it("decorate automatically sets underlying value of existing properties, decorate(view)", function() {
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.decorate(view);
			view.addAnimation([
				{
					property:"a",
					from:1,
					to:1,
					blend:"absolute",
					duration:duration
				},
				{
					property:"b",
					from:1,
					to:1,
					blend:"absolute",
					duration:duration
				},
				{
					property:"c",
					from:1,
					to:1,
					blend:"absolute",
					duration:duration
				}
			]);
			core.flushTransaction();
			const presentation = view.presentation;
			assert.equal(view.a,1);
			assert.equal(view.b,2);
			assert.equal(view.c,3);
			assert.equal(presentation.a,2);
			assert.equal(presentation.b,3);
			assert.equal(presentation.c,4);
		});
		it("decorate automatically registers existing properties, decorate(view)", function(done) {
			const view = {
				animationForKey:(key,nu,old,now) => {
					if (key === "a") done();
				},
				a:1
			};
			core.decorate(view);
			view.a = 2;
		});
		it("animations get removed, object literal, before", function(done) {
			const view = {
				a:1
			};
			core.decorate(view);
			view.addAnimation({
				duration:duration
			});
			view.addAnimation({
				duration: duration,
				onend: function() {
					var error = null;
					if (view.animations.length) error = new Error("animation did not get removed:"+view.animations.length+";");
					done(error);
				}
			});
		});
		it("animations get removed, constructor, before", function(done) {
			function One() {
				core.decorate(this);
			}
			One.prototype = {
				animationForKey: function(key,value,previous,presentation) {
					return duration;
				}
			};
			const view = new One();
			view.layer = {
				a: 3
			};
			view.addAnimation({
				duration: duration,
				onend: function() {
					var error = null;
					if (view.animations.length) error = new Error("animation did not get removed:"+view.animations.length+";");
					done(error);
				}
			});
		});
		it("animations get removed, object literal, after", function(done) {
			const view = {
				a:1
			};
			core.decorate(view);
			view.addAnimation({
				duration: duration,
				onend: function() {
					var error = null;
					if (view.animations.length) error = new Error("animation did not get removed:"+view.animations.length+";");
					done(error);
				}
			});
			view.addAnimation({
				duration:duration
			});
		});
		it("animations get removed, constructor, after", function(done) {
			function One() {
				core.decorate(this);
			}
			One.prototype = {
				animationForKey: function(key,value,previous,presentation) {
					return duration;
				}
			};
			const view = new One();
			view.addAnimation({
				duration: duration,
				onend: function() {
					var error = null;
					if (view.animations.length) error = new Error("animation did not get removed:"+view.animations.length+";");
					done(error);
				}
			});
			view.layer = {
				a: 3
			};
		});
		it("can't animate functions that you depend on", function() { // otherwise reentrant at valueForKey
			function View() {
				this.animationForKey = (key,nu,old,now) => duration;
				this.input = (key,value) => value;
				this.output = (key,value) => value;
				core.decorate(this);
			}
			const view = new View();
			view.addAnimation({ // this would be unterminated
				duration: duration,
				onend: function() {
					done();
				}
			});
		});
		it("can't explicitly animate delegate output", function() { // otherwise reentrant at valueForKey
			function View() {
				this.animationForKey = (key,nu,old,now) => duration;
				this.input = (key,value) => value;
				this.output = (key,value) => value;
				core.decorate(this);
			}
			const view = new View();
			view.addAnimation({ // this would be unterminated
				property:"output",
				from:this.input,
				to:this.input,
				duration:duration
			});
		});

	});


	describe("six", function() {
		it("group presentation flushed", function() {
			var view = {a:1, b:2, c:3};
			core.decorate(view);
			view.addAnimation([
				{
					property:"a",
					duration:duration,
					from:1,
					to:1,
					blend:"absolute"
				},
				{
					property:"b",
					duration:duration,
					from:1,
					to:1,
					blend:"absolute"
				},
				{
					property:"c",
					duration:duration,
					from:1,
					to:1,
					blend:"absolute",
					additive:false
				}
			]);
			core.flushTransaction();
			assert.deepEqual(view.presentation, { a:2, b:3, c:1 });
		});

// 		it("group children onend", function(done) { // Expected. For now. Group child animation onend is not called. Also group child animations are not removed
// 			let count = 0;
// 			const view = { a:0, b:0, c:0, display: function() {
// 				if (count > 2) done();
// 			}};
// 			core.decorate(view);
// 			const animation = [
// 				{
// 					duration:duration / 2,
// 					property:"a",
// 					from:0,
// 					to:1,
// 					onend: function() {
// 						console.log("first");
// 						count++;
// 					}
// 				},
// 				{
// 					duration:duration,
// 					onend: function() {
// 						console.log("second");
// 						count++;
// 					}
// 				},
// 				{
// 					duration:duration * 2,
// 					onend: function() {
// 						console.log("third");
// 						count++;
// 					}
// 				}
// 			];
// 			view.addAnimation(animation);
// 		});

	});


	describe("seven", function() {

		it("added animations not apparent in presentation until transaction flush, not flushed, explicit transaction", function() {
			core.beginTransaction();
			const view = core.decorate({a:0});
			view.addAnimation({
				property:"a",
				from:1,
				to:1,
				duration:duration
			});
			assert.equal(view.presentation.a, 0);
			core.commitTransaction();
		});

		it("added animations not apparent in presentation until transaction flush, flushed, explicit transaction", function() {
			core.beginTransaction();
			const view = core.decorate({a:0});
			view.addAnimation({
				property:"a",
				from:1,
				to:1,
				duration:duration
			});
			core.flushTransaction();
			assert.equal(view.presentation.a,1);
			core.commitTransaction();
		});

		it("added animations not apparent in presentation until transaction flush, not flushed, implicit transaction", function() {
			const view = core.decorate({a:0});
			view.addAnimation({
				property:"a",
				from:1,
				to:1,
				duration:duration
			});
			assert.equal(view.presentation.a,0);
		});

		it("added animations not apparent in presentation until transaction flush, flushed, implicit transaction", function() {
			const view = core.decorate({a:0});
			view.addAnimation({
				property:"a",
				from:1,
				to:1,
				duration:duration
			});
			core.flushTransaction();
			assert.equal(view.presentation.a,1);
		});

	});


// 	describe("eight", function() {
// 		it("uses presentationLayer, modelLayer, previousLayer syntax not presentation, model, previous ", function() {
// 			const view = {};
// 			core.decorate(view);
// 			assert(typeof view.presentation === "undefined");
// 			assert(typeof view.previous === "undefined");
// 			assert(typeof view.model === "undefined");
// 			assert(typeof view.presentationLayer !== "undefined");
// 			assert(typeof view.previousLayer !== "undefined");
// 			assert(typeof view.modelLayer !== "undefined");
// 		});
// 		it("input output !!!", function() {
// 			var view = {
// 				a:1,
// 				b:2,
// 				c:3,
// 				input:function(key,value) {
// 					if (value && value.length > 4 && value.substring(value.length-4) === " !!!") value = Number(value.substring(0, value.length-4));
// 					return value;
// 				},
// 				output:function(key,value) {
// 					if (value && value.length > 4 && value.substring(value.length-4) === " !!!") throw new Error(" !!!");
// 					if (value) return Math.round(value) + " !!!";
// 					return value;
// 				}
// 			};
// 			core.decorate(view);
// 			view.registerAnimatableProperty("a");
// 			view.addAnimation({
// 				property:"a",
// 				duration:duration,
// 				from:2,
// 				to:2,
// 				blend:"absolute"
// 			});
// 			assert(false);
// 		});
// 		it("animationForKey presentation argument", function() {
// 			assert(false);
// 		});
// 		it("previousLayer values are correct", function() {
// 			assert(false);
// 		});
// 		it("speed and pause", function() {
// 			assert(false);
// 		});
// 		it("delegate animationDidStop like CAAnimationDelegate", function() {
// 			assert(false);
// 		});
// 	});
//
//
//
// 	describe("nine", function() {
// 		var one;
// 		var view;
// 		beforeEach( function() {
// 			one = {};
// 			core.decorate(one);
// 			view = {};
// 			core.decorate(view);
// 		});
// 		it("registered presentation, unflushed", function() {
// 			one.layer.zxcv = 0;
// 			one.registerAnimatableProperty("zxcv");
// 			one.layer.zxcv = 1;
// 			assert(one.presentation.zxcv === 0);
// 		});
// 		it("unregistered animation presentation, unflushed", function() {
// 			one.uiop = 2;
// 			one.addAnimation({
// 				property:"uiop",
// 				duration:duration,
// 				from: 1,
// 				to: 1,
// 				blend:"absolute",
// 				additive:false
// 			});
// 			assert(one.presentation.uiop === 2);
// 		});
// 		it("registered before animation presentation, unflushed", function() {
// 			one.registerAnimatableProperty("uiop");
// 			one.uiop = 2;
// 			one.addAnimation({
// 				property:"uiop",
// 				duration:duration,
// 				from: 1,
// 				to: 1,
// 				blend:"absolute",
// 				additive:false
// 			});
// 			assert(one.presentation.uiop === 2);
// 		});
// 		it("registered after animation presentation, unflushed", function() {
// 			one.uiop = 2;
// 			one.registerAnimatableProperty("uiop");
// 			one.addAnimation({
// 				property:"uiop",
// 				duration:duration,
// 				from: 1,
// 				to: 1,
// 				blend:"absolute",
// 				additive:false
// 			});
// 			assert(one.presentation.uiop === 2);
// 		});
// 		it("registered animation effect, unflushed", function() {
// 			one.uiop = 2;
// 			one.registerAnimatableProperty("uiop");
// 			one.addAnimation({
// 				property:"uiop",
// 				duration:duration,
// 				from: 1,
// 				to: 1,
// 				blend:"absolute"
// 			});
// 			assert(one.presentation.uiop === 2);
// 		});
// 		it("group presentation unflushed", function() {
// 			var view = {};
// 			core.decorate(view);
// 			view.layer = {a:1, b:2, c:3};
// 			view.addAnimation([
// 				{
// 					property:"a",
// 					duration:duration,
// 					from:1,
// 					to:1,
// 					blend:"absolute"
// 				},
// 				{
// 					property:"b",
// 					duration:duration,
// 					from:1,
// 					to:1,
// 					blend:"absolute"
// 				},
// 				{
// 					property:"c",
// 					duration:duration,
// 					from:1,
// 					to:1,
// 					blend:"absolute",
// 					additive:false
// 				}
// 			]);
// 			assert.deepEqual(view.presentation, { a:1, b:2, c:3 });
// 		});
// 	});
});