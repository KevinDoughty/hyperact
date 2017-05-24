import * as core from "../source/core.js";
const assert = require("assert");
import { HyperChain, HyperKeyframes } from "../source/actions.js";

const duration = 0.05; // mocha timeout is 2 seconds

const delegateMethods = ["display","animationForKey","input","output"];
const controllerMethods = ["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations", "removeAnimation"];
const controllerProperties = ["layer","presentation","model","previous","animations","animationNames","animationCount"];


function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

const done = function() {
	// This is a bug fix, the first completion handler produces both an error for being undefined, and a pass for the exact same test ?!
};

describe("core", function() {

	describe("zero", function() {
		it("function", function() {
			assert(isFunction(function() {}));
			assert(!isFunction({}));
			assert(!isFunction("[object Function]"));
		});
		it("activate", function() {
			assert(isFunction(core.activate));
		});
		it("disableAnimation", function() {
			assert(isFunction(core.disableAnimation));
		});

	});

	describe("transactions", function() {
	
		it("multiple properties", function() { // The problem that prompted this test was failing to have a document.body.offsetHeight
			const one = {
				x:0,
				y:0,
				z:0
			};
			core.activate(one);
			const transaction = core.currentTransaction();
			transaction.duration = duration*2;
			one.x = 1.0;
			one.y = 1.0;
			one.addAnimation({
				property:"z",
				duration:duration,
				from: 1,
				to: 1,
				onend: function(finished) {
					const presentation = one.presentation;
					const error = (presentation.x > 0.25 && presentation.x < 0.75 && presentation.y > 0.25 && presentation.y < 0.75) ? null : new Error("multiple properties failing");
					done(error);
				}
			});
		});

		it("multiple properties class", function() { // The problem that prompted this test was failing to have a document.body.offsetHeight
			
			const One = class {
				constructor() {
					this.x = 0;
					this.y = 0;
					this.z = 0;
					core.activate(this);
				}
			};
			const one = new One();
			const transaction = core.currentTransaction();
			transaction.duration = duration*2;
			one.x = 1.0;
			one.y = 1.0;
			one.addAnimation({
				property:"z",
				duration:duration,
				from: 1,
				to: 1,
				onend: function(finished) {
					const presentation = one.presentation;
					const error = (presentation.x > 0.25 && presentation.x < 0.75 && presentation.y > 0.25 && presentation.y < 0.75) ? null : new Error("multiple properties failing");
					done(error);
				}
			});
		});

		// Implement these tests before refactoring core.js function implicitAnimation for TRANSACTION_DURATION_ALONE_IS_ENOUGH

		it("IMPLEMENT TEST: zero duration animations allowed from animationForKey", function() { // TODO: implement me, TRANSACTION_DURATION_ALONE_IS_ENOUGH
			assert.equal(1,0);
		});

		it("IMPLEMENT TEST: zero duration animations not allowed from setting values inside zero duration transaction", function() { // TODO: implement me, TRANSACTION_DURATION_ALONE_IS_ENOUGH
			assert.equal(1,0);
		});

		it("IMPLEMENT TEST: implicit animation duration is transaction duration when not specified", function() { // TODO: implement me, TRANSACTION_DURATION_ALONE_IS_ENOUGH
			assert.equal(1,0);
		});

	});

	describe("one", function() {

		let one;

		beforeEach( function() {
	// 		const One = function() {
	// 			core.activate(this); // controller, delegate, and layer are the same
	// 		}
	// 		one = new One();
			one = {};
			core.activate(one);
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

		it("callback one", function(done) {
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
					const error = (one.uiop === 2) ? null : new Error("should have reverted to non animated value");
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

		it("unregistered animation layer, unflushed", function() {
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

		let two;

		beforeEach( function() {
	// 		const Two = function() {
	// 			core.activate(this,this,{}); // controller and delegate same, with separate layer
	// 		}
	// 		two = new Two();
			two = {};
			core.activate(two,two,{}); // controller and delegate same, with separate layer
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

		it("callback two", function(done) {
			two.addAnimation({
				duration:duration,
				onend: function(finished) {
					done();
				}
			});
		});
	});

	describe("three", function() {
		it("presentation does not include delegate methods, activate(view,view,view)", function() {
			const test = function(property,value) {
				return value; // delegate.input and delegate.output are expected to return a value
			};
			const view = {
				a:1,
				b:2,
				c:3,
				test:test
			};
			delegateMethods.forEach( function(key) {
				view[key] = test;
			});
			core.activate(view,view,view);
			core.flushTransaction();
			assert.deepEqual(view.presentation, { a:1, b:2, c:3, test:test });
		});
		it("presentation does not include delegate methods, activate(view,layer,layer)", function() {
			const test = function(property,value) {
				return value;
			};
			const view = {};
			const layer = { a:1, b:2, c:3, test:test };
			delegateMethods.forEach( function(key) {
				layer[key] = test;
			});
			controllerMethods.forEach( function(key) {
				layer[key] = test;
			});
			controllerProperties.forEach( function(key) {
				layer[key] = test;
			});
			core.activate(view,layer,layer);
			const expected = { a:1, b:2, c:3, test:test };
			controllerMethods.forEach( function(key) {
				expected[key] = test;
			});
			controllerProperties.forEach( function(key) {
				expected[key] = test;
			});
			core.flushTransaction();
			assert.deepEqual(view.presentation, expected);
		});
		it("presentation does include delegate and controller methods, activate(view,view,layer)", function() {
			const test = function() {
			
			};
			const view = {};
			const layer = { a:1, b:2, c:3, test:test };
			delegateMethods.forEach( function(key) {
				layer[key] = test;
			});
			controllerMethods.forEach( function(key) {
				layer[key] = test;
			});
			controllerProperties.forEach( function(key) {
				layer[key] = test;
			});
			core.activate(view,view,layer);
			const expected = { a:1, b:2, c:3, test:test };
			delegateMethods.forEach( function(key) {
				expected[key] = test;
			});
			controllerMethods.forEach( function(key) {
				expected[key] = test;
			});
			controllerProperties.forEach( function(key) {
				expected[key] = test;
			});
			core.flushTransaction();
			assert.deepEqual(view.presentation, expected);
		});
		it("set layer with no animation, presentation, unflushed", function() {
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.activate(view);
			view.layer = {a:4, b:5, c:6};
			//console.log("pres:%s;",JSON.stringify(view.presentation));
			assert.deepEqual(view.presentation, { a:1, b:2, c:3 });
		});
		it("implicit constant, presentation, flushed", function() {
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
			const layer = {
				a:1,
				b:2,
				c:3
			};
			const view = {
				animationForKey: animationForKey
			};
			core.activate(view,view,layer);
			view.layer = {a:4, b:5, c:6};
			core.flushTransaction();
			assert.deepEqual(view.presentation, { a:5, b:6, c:7 });
		});
		it("implicit duration only, model, unflushed", function() {
			const animationForKey = function(key,value,previous) {
				return duration;
			};
			const view = {
				a:1,
				b:2,
				c:3,
				animationForKey: animationForKey
			};
			core.activate(view);
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
			const layer = {
				a:1,
				b:2,
				c:3
			};
			const view = {
				animationForKey: animationForKey
			};
			core.activate(view,view,layer);
			view.layer = {a:4, b:5, c:6};
			assert.deepEqual(view.model, { a:4, b:5, c:6 });
		});

		it("presentation in onend", function(done) {
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.activate(view);
			view.registerAnimatableProperty("a");
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute",
				onend: function(finished) {
					const error = (view.presentation.a === view.a) ? null : new Error("should have reverted to non animated value");
					done(error);
				}
			});
		});

		it("presentation in onend two", function(done) {
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.activate(view);
			view.registerAnimatableProperty("a");
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute",
				onend: function(finished) {
					const error = (view.presentation.a === view.a) ? null : new Error("should have reverted to non animated value");
					done(error);
				}
			});
		});

		it("single presentation flushed", function() {
			const view = {a:1, b:2, c:3};
			core.activate(view);
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
			let completed = false;
			const view = {
				a:1,
				b:2,
				c:3,
				display: function() {
					if (completed) done();
				}
			};
			core.activate(view);
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
		it("should not reflect presentation outside of display, activate(view,view,layer)", function() {
			const view = {
			};
			const layer = {
				a: 1
			};
			core.activate(view,view,layer);
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
		it("should not reflect presentation outside of display, activate(view)", function() {
			const view = {
				a:1
			};
			core.activate(view);
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
		it("activate automatically sets underlying value of existing properties, activate(view)", function() {
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.activate(view);
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
		it("activate automatically registers existing properties, activate(view)", function(done) {
			const view = {
				animationForKey:(key,nu,old,now) => {
					if (key === "a") done();
				},
				a:1
			};
			core.activate(view);
			view.a = 2;
		});
		it("animations get removed, object literal, before", function(done) {
			const view = {
				a:1
			};
			core.activate(view);
			view.addAnimation({
				duration:duration
			});
			view.addAnimation({
				duration: duration,
				onend: function() {
					let error = null;
					if (view.animations.length) error = new Error("animation did not get removed:"+view.animations.length+";");
					done(error);
				}
			});
		});
		it("animations get removed, constructor, before", function(done) {
			function One() {
				core.activate(this);
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
					let error = null;
					if (view.animations.length) error = new Error("animation did not get removed:"+view.animations.length+";");
					done(error);
				}
			});
		});
		it("animations get removed, object literal, after", function(done) {
			const view = {
				a:1
			};
			core.activate(view);
			view.addAnimation({
				duration: duration,
				onend: function() {
					let error = null;
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
				core.activate(this);
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
					let error = null;
					if (view.animations.length) error = new Error("animation did not get removed:"+view.animations.length+";");
					done(error);
				}
			});
			view.layer = {
				a: 3
			};
		});
		it("can't animate functions that you depend on", function(done) { // otherwise reentrant at valueForKey
			function View() {
				this.animationForKey = (key,nu,old,now) => duration;
				this.input = (key,value) => value;
				this.output = (key,value) => value;
				core.activate(this);
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
				core.activate(this);
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


	describe("group animations", function() {
		it("group presentation flushed", function() {
			const view = {a:1, b:2, c:3};
			core.activate(view);
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

		it("group onend", function(done) {
			let count = 0;
			const view = { a:0, b:0, c:0, display: function() {
				if (count === 3) done();
			}};
			core.activate(view);
			const animation = [
				{
					duration:duration / 2,
					property:"a",
					from:0,
					to:1,
					onend: function() {
						count++;
					}
				},
				{
					duration:duration,
					onend: function() {
						count++;
					}
				},
				{
					duration:duration * 2,
					onend: function() {
						count++;
					}
				}
			];
			view.addAnimation(animation);
		});

	});



	describe("chain animations", function() {
		it("chain presentation unflushed", function() {
			const view = {a:0};
			core.activate(view);
			view.addAnimation( new HyperChain([
				{
					property:"a",
					duration:duration,
					from:1,
					to:1,
					blend:"absolute"
				},
				{
					property:"a",
					duration:duration,
					from:2,
					to:2,
					blend:"absolute"
				},
				{
					property:"a",
					duration:duration,
					from:3,
					to:3,
					blend:"absolute",
					additive:false
				}
			]));
			assert.deepEqual(view.presentation, { a:0 });
		});
		it("chain presentation flushed", function() {
			const view = {a:0};
			core.activate(view);
			view.addAnimation( new HyperChain([
				{
					property:"a",
					duration:duration,
					from:1,
					to:1,
					blend:"absolute"
				},
				{
					property:"a",
					duration:duration,
					from:2,
					to:2,
					blend:"absolute"
				},
				{
					property:"a",
					duration:duration,
					from:3,
					to:3,
					blend:"absolute",
					additive:false
				}
			]));
			core.flushTransaction();
			assert.deepEqual(view.presentation, { a:1 });
		});

		it("chain presentation step one", function(done) {
			const view = {a:0};
			core.activate(view);
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const error = (view.presentation.a === 1) ? null : new Error("chain presentation value incorrect");
					done(error);
				}
			});
			view.addAnimation(new HyperChain([
				{
					property:"a",
					duration:duration,
					from:1,
					to:1,
					blend:"absolute"
				},
				{
					property:"a",
					duration:duration,
					from:2,
					to:2,
					blend:"absolute"
				},
				{
					property:"a",
					duration:duration,
					from:3,
					to:3,
					blend:"absolute",
					additive:false
				}
			]));
		});

		it("chain presentation step two", function(done) {
			const view = {a:0};
			core.activate(view);
			view.addAnimation({
				duration: duration + duration/2,
				onend: function() {
					const error = (view.presentation.a === 2) ? null : new Error("chain presentation value incorrect");
					done(error);
				}
			});
			view.addAnimation(new HyperChain([
				{
					property:"a",
					duration:duration,
					from:1,
					to:1,
					blend:"absolute"
				},
				{
					property:"a",
					duration:duration,
					from:2,
					to:2,
					blend:"absolute"
				},
				{
					property:"a",
					duration:duration,
					from:3,
					to:3,
					blend:"absolute",
					additive:false
				}
			]));
		});

		it("chain presentation step three", function(done) {
			const view = {a:0};
			core.activate(view);
			view.addAnimation({
				duration: duration*2 + duration/2,
				onend: function() {
					const error = (view.presentation.a === 3) ? null : new Error("chain presentation value incorrect");
					done(error);
				}
			});
			view.addAnimation(new HyperChain([
				{
					property:"a",
					duration:duration,
					from:1,
					to:1,
					blend:"absolute"
				},
				{
					property:"a",
					duration:duration,
					from:2,
					to:2,
					blend:"absolute"
				},
				{
					property:"a",
					duration:duration,
					from:3,
					to:3,
					blend:"absolute",
					additive:false
				}
			]));
		});

		it("chain onend", function(done) {
			let count = 0;
			const view = { a:0, display: function() {
				if (count === 4) done();
			}};
			core.activate(view);
			const animation = new HyperChain({
				chain:[
					{
						duration:duration / 2,
						property:"a",
						from:0,
						to:1,
						onend: function() {
							count++;
						}
					},
					{
						duration:duration,
						onend: function() {
							count++;
						}
					},
					{
						duration:duration * 2,
						onend: function() {
							count++;
						}
					}
				],
				onend: function() {
					count++;
				}
			});
			view.addAnimation(animation);
		});

	});



	describe("keyframe animations", function() {

		it("keyframe presentation unflushed", function() {
			const view = {a:0};
			core.activate(view);
			view.addAnimation( new HyperKeyframes({
				property:"a",
				keyframes:[1,1],
				duration:duration,
				blend:"absolute"
			}));
			assert.deepEqual(view.presentation, { a:0 });
		});
		it("keyframe presentation flushed", function() {
			const view = {a:0};
			core.activate(view);
			view.addAnimation( new HyperKeyframes({
				property:"a",
				keyframes:[1,1],
				duration:duration,
				blend:"absolute"
			}));
			core.flushTransaction();
			assert.deepEqual(view.presentation, { a:1 });
		});

		it("keyframe presentation step one", function(done) {
			const view = {one:0};
			core.activate(view);
			view.addAnimation({
				duration: duration/4,
				onend: function() {
					const error = (view.presentation.one === 1) ? null : new Error("keyframe presentation value incorrect:"+view.presentation.one);
					done(error);
				}
			});
			view.addAnimation( new HyperKeyframes(
				{
					property:"one",
					duration:duration * 1.5,
					keyframes:[1,1,2,2],
					blend:"absolute"
				}
			));
		});

		it("keyframe presentation step two", function(done) {
			const view = {two:0};
			core.activate(view);
			view.addAnimation({
				duration: duration/2 + duration/4,
				onend: function() {
					const error = (view.presentation.two > 1 && view.presentation.two < 2) ? null : new Error("keyframe presentation value incorrect:"+view.presentation.two);
					done(error);
				}
			});
			view.addAnimation( new HyperKeyframes(
				{
					property:"two",
					duration:duration * 1.5,
					keyframes:[1,1,2,2],
					blend:"absolute"
				}
			));
		});

		it("keyframe presentation step three", function(done) {
			const view = {three:0};
			core.activate(view);
			view.addAnimation({
				duration: duration + duration/4,
				onend: function() {
					const error = (view.presentation.three === 2) ? null : new Error("keyframe presentation value incorrect:"+view.presentation.three);
					done(error);
				}
			});
			view.addAnimation( new HyperKeyframes(
				{
					property:"three",
					duration:duration * 1.5,
					keyframes:[1,1,2,2],
					blend:"absolute"
				}
			));
		});

		it("keyframes onend", function(done) {
			const view = { a:0 };
			core.activate(view);
			const animation = new HyperKeyframes({
				duration:duration,
				property:"a",
				keyframes:[1,2,3],
				onend: function() {
					done();
				}
			});
			view.addAnimation(animation);
		});

	});

	describe("other", function() {
		it("sequential changes", function() {
			const view = {
				a:0,
				animationForKey: function(key) {
					return {
						duration: 1.0,
						from: 1.0,
						to: 1.0,
						blend: "absolute"
						// a naming or key property would allow this to match similar case in gcc test
					};
				}
			};
			core.activate(view);
			view.a = 0.25;
			core.flushTransaction();
			assert.equal(view.presentation.a,1.25);
			view.a = 0.5;
			core.flushTransaction();
			assert.equal(view.presentation.a,2.5);
			view.a = 0.75;
			core.flushTransaction();
			assert.equal(view.presentation.a,3.75);
		});
		
		it("animation has either naming or key property (needed to replace animations from animationForKey)", function() {
			assert(false);
		});
	});

	describe("added animations", function() {

		it("added animations not apparent in presentation until transaction flush, not flushed, explicit transaction", function() {
			core.beginTransaction();
			const view = core.activate({a:0});
			view.addAnimation({
				property:"a",
				from:1,
				to:1,
				duration:duration
			});
			assert.equal(view.presentation.a, 0);
			core.commitTransaction();
		});

// 		it("added animations not apparent in presentation until transaction flush, flushed, explicit transaction", function() { // This is unfortunately expected behavior in Core Animation.
// 			core.beginTransaction();
// 			const view = core.activate({a:0});
// 			view.addAnimation({
// 				property:"a",
// 				from:1,
// 				to:1,
// 				duration:duration
// 			});
// 			core.flushTransaction();
// 			assert.equal(view.presentation.a,1);
// 			core.commitTransaction();
// 		});

		it("added animations not apparent in presentation until transaction flush, not flushed, implicit transaction", function() {
			const view = core.activate({a:0});
			view.addAnimation({
				property:"a",
				from:1,
				to:1,
				duration:duration
			});
			assert.equal(view.presentation.a,0);
		});

		it("added animations not apparent in presentation until transaction flush, flushed, implicit transaction", function() {
			const view = core.activate({a:0});
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

	describe("input output value transforms", function() {
		it("calls delegate input on value change", function(done) {
			const controller = {};
			const delegate = {
				input: function(property,value) {
					if (value === 1) done();
					return value;
				},
				output: function(property,value) {
					return value;
				}
			};
			const layer = {a:0}; // properties must exist prior
			core.activate(controller,delegate,layer);
			layer.a = 1;
		});
		it("input output parity", function() {
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				}
			};
			const controller = {};
			const delegate = {
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				},
				animationForKey: function() {
					return {
						type:type,
						duration:duration/2,
						from:2,
						to:2,
						blend:"absolute"
					};
				}
			};
			const layer = {a:0};
			core.activate(controller,delegate,layer);
			layer.a = 1;
			core.flushTransaction();
			assert.equal(controller.presentation.a,3);
		});
	});

	describe("ten", function() {
		let one;
		let view;
		beforeEach( function() {
			one = {};
			core.activate(one);
			view = {};
			core.activate(view);
		});
		it("registered presentation, unflushed", function() {
			one.layer.zxcv = 0;
			one.registerAnimatableProperty("zxcv");
			one.layer.zxcv = 1;
			assert.equal(one.presentation.zxcv,0);
		});
		it("unregistered animation presentation, unflushed", function() {
			one.uiop = 2;
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				blend:"absolute",
				additive:false
			});
			assert.equal(one.presentation.uiop,2);
		});
		it("registered before animation presentation, unflushed", function() {
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
			assert.equal(one.presentation.uiop,2);
		});
		it("registered after animation presentation, unflushed", function() {
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
			assert.equal(one.presentation.uiop,2);
		});
		it("registered animation effect, unflushed", function() {
			one.uiop = 2;
			one.registerAnimatableProperty("uiop");
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				blend:"absolute"
			});
			assert.equal(one.presentation.uiop,2);
		});
		it("group presentation unflushed", function() {
			const view = {};
			core.activate(view);
			view.layer = {a:1, b:2, c:3};
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
			assert.deepEqual(view.presentation, { a:1, b:2, c:3 });
		});
	});



	describe("eleven", function() {
		it("uses presentationLayer, modelLayer, previousLayer syntax not presentation, model, previous ", function() {
			const view = {};
			core.activate(view);
			assert(typeof view.presentation === "undefined");
			assert(typeof view.previous === "undefined");
			assert(typeof view.model === "undefined");
			assert(typeof view.presentationLayer !== "undefined");
			assert(typeof view.previousLayer !== "undefined");
			assert(typeof view.modelLayer !== "undefined");
		});
		it("input output !!!", function() {
			const view = {
				a:1,
				b:2,
				c:3,
				input:function(key,value) {
					if (value && value.length > 4 && value.substring(value.length-4) === " !!!") value = Number(value.substring(0, value.length-4));
					return value;
				},
				output:function(key,value) {
					if (value && value.length > 4 && value.substring(value.length-4) === " !!!") throw new Error(" !!!");
					if (value) return Math.round(value) + " !!!";
					return value;
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("a");
			view.addAnimation({
				property:"a",
				duration:duration,
				from:2,
				to:2,
				blend:"absolute"
			});
			assert(false);
		});
		it("animationForKey presentation argument", function() {
			assert(false);
		});
		it("previousLayer values are correct", function() {
			assert(false);
		});
		it("speed and pause", function() {
			assert(false);
		});
		it("delegate animationDidStop like CAAnimationDelegate", function() {
			assert(false);
		});
		it("maybe activate multiple layers, allow an array argument, and register key paths", function() {
			assert(false);
		});
		it("maybe be able to activate again, one controller with many targets.", function() {
			assert(false);
		});
		it("no controller mode", function() {
			assert(false);
		});
		it("display function only instead of delegate", function() {
			assert(false);
		});
		it("style transform 3d matrix and slerpalerp", function() {
			assert(false);
		});
	});


});