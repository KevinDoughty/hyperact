import * as core from "../source/core.js";
const assert = require("assert");

const duration = 0.05; // mocha timeout is 2 seconds


describe("PROPERTY", function() {
	describe("number type", function() {
		let one;
		beforeEach( function() {
			one = {};
			core.activate(one);
		});
		it("unregistered animation presentation flushed", function() {
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
			assert.equal(one.presentation.uiop,1); // fail: 2 == 1 // fail fail: 2 == 1 // !!!
		});
		it("unregistered non existent property", function() {
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				blend:"absolute",
				additive:false
			});
			core.flushTransaction();
			assert.equal(one.presentation.uiop,1); // fail fail: undefined == 1
		});
		it("registered non existent property", function() {
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
		it("registered non existent property part two", function(done) {
			one.registerAnimatableProperty("uiop");
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				blend:"absolute",
				additive:false
			});
			const result = 1;
			one.addAnimation({
				duration:duration/2,
				onend: function() {
					const error = one.presentation.uiop === result ? null : new Error("presentation is wrong:"+one.presentation.uiop+"; should be:"+result+";");
					done(error);
				}
			});
		});
		it("registered non existent property part three layer value undefined", function(done) {
			one.registerAnimatableProperty("uiop");
			one.addAnimation({
				property:"uiop",
				duration:duration,
				from: 1,
				to: 1,
				blend:"absolute",
				additive:false
			});
			const result = undefined;
			one.addAnimation({
				duration:duration/2,
				onend: function() {
					const error = one.uiop === result ? null : new Error("value is wrong:"+one.uiop+"; should be:"+result+";");
					done(error);
				}
			});
		});
		it("registered non existent property part four presentation undefined", function(done) {
			one.registerAnimatableProperty("uiop");
			one.addAnimation({
				property:"uiop",
				duration:duration/2,
				from: 1,
				to: 1,
				blend:"absolute",
				additive:false
			});
			const result = undefined;
			one.addAnimation({
				duration:duration,
				onend: function() {
					const error = one.presentation.uiop === result ? null : new Error("presentation is wrong:"+one.presentation.uiop+"; should be:"+result+";");
					done(error);
				}
			});
		});
		it("non existent is undefined", function() {
			assert.equal(one.nonexistent,undefined);
		});
	});


	describe("one", function() {

		let one;
		beforeEach( function() {
			one = {};
			core.activate(one);
		});

		it("unregistered presentation unflushed, set on layer", function() {
			one.layer.asdf = 1;
			assert(one.presentation.asdf === 1);
		});
		it("unregistered presentation unflushed, set on self", function() {
			one.asdf = 1;
			assert(one.presentation.asdf === 1);
		});
		it("registered presentation flushed, set on layer", function() {
			one.registerAnimatableProperty("zxcv");
			one.layer.zxcv = 1;
			core.flushTransaction();
			assert(one.presentation.zxcv === 1);
		});
		it("registered presentation flushed, set on self", function() {
			one.registerAnimatableProperty("zxcv");
			one.zxcv = 1;
			core.flushTransaction();
			assert(one.presentation.zxcv === 1);
		});

		it("unregistered, unflushed", function() {
			one.zxcv = 1;
			assert.equal(one.zxcv,1);
		});
		it("unregistered, flushed", function() {
			one.zxcv = 1;
			core.flushTransaction();
			assert.equal(one.zxcv,1);
		});
		it("unregistered, unflushed, view", function() {
			const view = {};
			core.activate(view);
			view.zxcv = 1;
			assert.equal(view.zxcv,1);
		});
		it("unregistered, flushed, view", function() {
			const view = {};
			core.activate(view);
			view.zxcv = 1;
			core.flushTransaction();
			assert.equal(view.zxcv,1);
		});
		it("registered, flushed", function() {
			one.registerAnimatableProperty("zxcv");
			one.zxcv = 1;
			core.flushTransaction();
			assert.equal(one.zxcv,1); // fail: undefined == 1
		});
		it("registered, flushed, view", function() {
			const view = {};
			core.activate(view);
			view.registerAnimatableProperty("zxcv");
			view.zxcv = 1;
			core.flushTransaction();
			assert.equal(view.zxcv,1); // fail: undefined == 1
		});
		it("registered, unflushed (TWICE 14)", function() { // TT_BUG_FIX // direct // should not fail
			one.registerAnimatableProperty("zxcv");
			one.zxcv = 1;
			assert.equal(one.zxcv,1); // fail: undefined == 1
		});
		it("registered, unflushed, view (TWICE 15)", function() { // TT_BUG_FIX // direct // should not fail
			const view = {};
			core.activate(view);
			view.registerAnimatableProperty("zxcv");
			view.zxcv = 1;
			assert.equal(view.zxcv,1); // fail: undefined == 1
		});
		it("auto registered view", function() {
			const view = { zxcv:1 };
			core.activate(view);
			assert.equal(view.zxcv,1);
		});
		it("auto registered view set (TWICE 16)", function() { // TT_BUG_FIX // direct // should not fail
			const view = { zxcv:1 };
			core.activate(view);
			view.zxcv = 2;
			assert.equal(view.zxcv,2); // fail: 1 == 2
		});
		it("registered model, flushed", function() {
			one.registerAnimatableProperty("zxcv");
			one.zxcv = 1;
			core.flushTransaction();
			assert.equal(one.model.zxcv,1);
		});

		it("registered presentation, flushed", function() {
			one.registerAnimatableProperty("zxcv");
			one.zxcv = 1;
			core.flushTransaction();
			assert.equal(one.presentation.zxcv,1);
		});


		it("onend one no property or type", function(done) {
			one.addAnimation({
				duration:duration/2,
				onend: function(finished) {
					done();
				}
			});
		});

		it("unregistered onend values have reverted", function(done) {
			one.uiop = 2;
			one.addAnimation({
				property:"uiop",
				duration:duration/2,
				from: 1,
				to: 1,
				onend: function(finished) {
					const error = (one.uiop === 2) ? null : new Error("should have reverted to non animated value");
					done(error);
				}
			});
		});


		it("unregistered animation layer unflushed", function() {
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


		it("registered before animation presentation flushed", function() {
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

		it("registered after animation presentation flushed", function() {
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
			assert.equal(one.uiop, 2); // fail: undefined == 2
		});

		it("register property then assign value (TWICE 17)", function() { // TT_BUG_FIX // direct // should not fail
			one.registerAnimatableProperty("uiop");
			one.uiop = 2;
			assert.equal(one.uiop, 2); // fail: undefined == 2
		});

		it("registered animation effect flushed", function() {
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
	});



	describe("registered implicit presentation", function() {


		it("registered implicit presentation (unflushed)", function() { // This test is important, do not change it. presentationLayer must be generated at beginning of transaction before setting new values.
			const one = {};
			core.activate(one);
			one.animationForKey = function(key,value,previous) {
				return duration;
			};
			one.layer.zxcv = 1;
			one.registerAnimatableProperty("zxcv");
			one.layer.zxcv = 2;
			assert.equal(one.presentation.zxcv,1);
		});

		it("registered implicit presentation (unflushed) direct instead of layer", function() {
			const one = {};
			core.activate(one);
			one.animationForKey = function(key,value,previous) {
				return duration;
			};
			one.zxcv = 1;
			one.registerAnimatableProperty("zxcv");
			one.zxcv = 2;
			assert.equal(one.presentation.zxcv,1);
		});

		it("registered implicit presentation (unflushed) no animationForKey implementation", function() {
			const one = {};
			core.activate(one);
			one.zxcv = 1;
			one.registerAnimatableProperty("zxcv");
			one.zxcv = 2;
			assert.equal(one.presentation.zxcv,1);
		});

		it("view registered implicit presentation (unflushed)", function() {
			const view = {};
			view.animationForKey = function(key,value,previous) {
				return duration;
			};
			core.activate(view);
			view.layer.zxcv = 1;
			view.registerAnimatableProperty("zxcv");
			view.layer.zxcv = 2;
			assert.equal(view.presentation.zxcv,1);
		});



		it("view registered implicit presentation (unflushed) direct instead of layer", function() {
			const view = {};
			view.animationForKey = function(key,value,previous) {
				return duration;
			};
			core.activate(view);
			view.zxcv = 1;
			view.registerAnimatableProperty("zxcv");
			view.zxcv = 2;
			assert.equal(view.presentation.zxcv,1);
		});

		it("view registered implicit presentation (unflushed) no animationForKey implementation", function() {
			const view = {};
			core.activate(view);
			view.zxcv = 1;
			view.registerAnimatableProperty("zxcv");
			view.zxcv = 2;
			assert.equal(view.presentation.zxcv,1);
		});

		it("view auto-registered implicit presentation (unflushed)", function() {
			const view = {
				animationForKey: function(key,value,previous) {
					return duration;
				},
				zxcv: 1
			};
			core.activate(view);
			view.layer.zxcv = 2;
			assert.equal(view.presentation.zxcv,1);
		});

		it("view auto-registered implicit presentation (unflushed) no animationForKey implementation", function() {
			const view = {
				zxcv: 1
			};
			core.activate(view);
			view.layer.zxcv = 2;
			assert.equal(view.presentation.zxcv,1);
		});

		it("view auto-registered implicit presentation (unflushed) direct instead of layer", function() {
			const view = {
				animationForKey: function(key,value,previous) {
					return duration;
				},
				zxcv: 1
			};
			core.activate(view);
			view.layer.zxcv = 2;
			assert.equal(view.presentation.zxcv,1);
		});

	});


});
