import * as core from "../source/core.js";
var assert = require("assert");

var duration = 0.1; // mocha timeout is 2 seconds

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

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
		assert(one === one.layer);
	});

// 	it("unregistered presentation", function() { // expected. Can't do this if layer and controller are the same
// 		one.layer.asdf = 1;
// 		assert(one.presentation.asdf === 1);
// 	});

	it("registered presentation", function() {
		one.registerAnimatableProperty("zxcv");
		one.layer.zxcv = 1;
		assert(one.presentation.zxcv === 1);
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
		assert(one.uiop === 2);
	});

	it("unregistered animation presentation", function() {
		one.uiop = 2;
		one.addAnimation({
			property:"uiop",
			duration:duration,
			from: 1,
			to: 1,
			blend:"absolute",
			additive:false
		});
		assert(one.presentation.uiop === 1);
	});

	it("registered before animation presentation", function() {
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
		assert(one.presentation.uiop === 1);
	});

	it("registered after animation presentation", function() {
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
		assert(one.presentation.uiop === 1);
	});

	it("registered property with existing value", function() {
		one.uiop = 2;
		one.registerAnimatableProperty("uiop");
		assert(one.uiop === 2);
	});

	it("register property then assign value", function() {
		one.registerAnimatableProperty("uiop");
		one.uiop = 2;
		assert(one.uiop === 2);
	});

	it("registered animation effect", function() {
		one.uiop = 2;
		one.registerAnimatableProperty("uiop");
		one.addAnimation({
			property:"uiop",
			duration:duration,
			from: 1,
			to: 1,
			blend:"absolute"
		});
		assert(one.presentation.uiop === 3);
	});

	it("registered implicit presentation", function() {
		one.animationForKey = function(key,value,previous) {
			return duration;
		};
		one.layer.zxcv = 1;
		one.registerAnimatableProperty("zxcv");
		one.layer.zxcv = 2;
		assert(one.presentation.zxcv === 1);
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
		assert(two.presentation.qwer === 1);
	});

	it("registered presentation", function() {
		two.registerAnimatableProperty("zxcv");
		two.layer.zxcv = 1;
		assert(two.presentation.zxcv === 1);
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
	it("implicit duration only presentation", function() {
		var view = {
			a:1,
			b:2,
			c:3,
			animationForKey: function(key,value,previous) {
				return duration;
			}
		};
		core.decorate(view);
		view.layer = {a:4, b:5, c:6};
		assert.deepEqual(view.presentation, { a:1, b:2, c:3 });
	});

	it("implicit constant presentation", function() {
		var layer = {
			a:1,
			b:2,
			c:3
		};
		var view = {
			animationForKey: function(key,value,previous) {
				return {
					duration:duration,
					from:1,
					to:1,
					blend:"absolute"
				};
			}
		};
		core.decorate(view,view,layer);
		view.layer = {a:4, b:5, c:6};
		assert.deepEqual(view.presentation, { a:5, b:6, c:7 });
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
				var presentation = view.presentation;
				var error = (presentation.a === view.a) ? null : new Error("should have reverted to non animated value");
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
				var presentation = view.presentation;
				var error = (presentation.a === view.a) ? null : new Error("should have reverted to non animated value");
				done(error);
			}
		});
	});

	it("group presentation", function() {
		var view = {};
		core.decorate(view);
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
		view.registerAnimatableProperty("a");
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
	it("input output px", function() {
		var view = {
			a:1,
			b:2,
			c:3,
			input:function(key,value) {
				if (value && value.length > 2 && value.substring(value.length-2) === "px") value = Number(value.substring(0, value.length-2));
				return value;
			},
			output:function(key,value) {
				if (value && value.length > 2 && value.substring(value.length-2) === "px") throw new Error("px");
				if (value) return Math.round(value) + "px";
				return value;
			}
		};
		core.decorate(view);
		view.registerAnimatableProperty("a");
		view.addAnimation({
			property:"a",
			duration:duration,
			from:2,
			to:2,
			blend:"absolute"
		});
		assert(true);
	});
// 	it("input output array", function(done) {
// 		var completed = false;
// 		var view = {
// 			a:1,
// 			b:2,
// 			c:3,
// 			display: function() {
// 				if (completed) done();
// 			},
// 			input: function(key,value) {
// 				if (Array.isArray(value) && value.length) return value[0];
// 				return value;
// 			},
// 			output: function(key,value) {
// 			}
// 		};
// 		core.decorate(view);
// 		view.registerAnimatableProperty("a");
// 		view.addAnimation({
// 			property:"a",
// 			duration:duration,
// 			from:2,
// 			to:2,
// 			blend:"absolute",
// 			onend: function(finished) {
// 				var presentation = view.presentation;
// 				completed = true;
// 			}
// 		});
// 	});
});