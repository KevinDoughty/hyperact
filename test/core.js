import * as core from "../source/core.js";
const assert = require("assert");

const duration = 0.05; // mocha timeout is 2 seconds

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

describe("CORE", function() {

	describe("basics", function() {

		it("function", function() {
			assert(isFunction(function() {}));
			assert(!isFunction({}));
			assert(!isFunction("[object Function]"));
		});
		it("activate", function() {
			assert(isFunction(core.activate));
		});
		it("beginTransaction", function() {
			assert(isFunction(core.beginTransaction));
		});
		it("commitTransaction", function() {
			assert(isFunction(core.commitTransaction));
		});
		it("currentTransaction", function() {
			assert(isFunction(core.currentTransaction));
		});
		it("flushTransaction", function() {
			assert(isFunction(core.flushTransaction));
		});
		it("disableAnimation", function() {
			assert(isFunction(core.disableAnimation));
		});
		it("presentationTransfom", function() {
			assert(isFunction(core.presentationTransform));
		});

	});








	describe("three", function() {

		it("unflushed model value is correct (TWICE 5)", function() { // TT_BUG_FIX // Model
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.activate(view);
			view.layer = {a:4, b:5, c:6};
			assert.deepEqual(view.model, { a:4, b:5, c:6 });
		});
		it("flushed model value is correct", function() {
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.activate(view);
			view.layer = {a:4, b:5, c:6};
			core.flushTransaction();
			assert.deepEqual(view.model, { a:4, b:5, c:6 });
		});
		it("implicit duration only, model, unflushed (TWICE 6)", function() { // TT_BUG_FIX // Model
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
		it("implicit constant, model (TWICE 7)", function() { // TT_BUG_FIX // Model
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

		it("animation removed from animations before call to onend", function(done) {
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute",
				onend: function(finished) {
					const error = (view.animations.length === 0) ? null : new Error("animation was not removed before call to onend");
					done(error);
				}
			});
		});

		it("animation removed from animations before call to onend, two", function(done) {
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.activate(view);
			view.addAnimation({
				property:"b",
				duration:duration*2,
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
				onend: function(finished) {
					const error = (view.animations.length === 1) ? null : new Error("animation was not removed before call to onend");
					done(error);
				}
			});
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







	describe("five", function() {

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
		it("USELESS TEST can't animate functions that you depend on", function(done) { // otherwise reentrant at valueForKey
			function View() {
				this.animationForKey = (key,nu,old,now) => duration;
				//this.input = (key,value) => value;
				//this.output = (key,value) => value;
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
		it("USELESS TEST can't explicitly animate delegate output", function() { // otherwise reentrant at valueForKey
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




	describe("added animations", function() {

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

		it("added animations apparent in presentation after transaction flush, flushed, implicit transaction", function() {
			const view = {a:0};
			core.activate(view);
			view.addAnimation({
				property:"a",
				from:1,
				to:1,
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(view.presentation.a,1);
		});
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




	describe("layers", function() {
		it("model layer is cached", function(done) {
			let modelLayer = null;
			const view = {a:0};
			core.activate(view);
			view.a = 1;
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					modelLayer = view.model;
				}
			});
			view.addAnimation({
				duration:duration,
				onend: function() {
					const error = (modelLayer === view.model) ? null : new Error("model layer was not cached");
					done(error);
				}
			});
		});
		it("previous layer is cached", function(done) {
			let previousLayer = null;
			const view = {a:0};
			core.activate(view);
			view.a = 1;
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					previousLayer = view.previous;
				}
			});
			view.addAnimation({
				duration:duration,
				onend: function() {
					const error = (previousLayer === view.previous) ? null : new Error("previous layer was not cached");
					done(error);
				}
			});
		});
		it("model layer values are correct", function(done) {
			const view = {a:0};
			core.activate(view);
			view.a = 1;
			view.addAnimation({
				duration:duration,
				onend: function() {
					const error = (view.model.a === 1) ? null : new Error("model layer value is not correct");
					done(error);
				}
			});
		});
		it("previous layer values are correct", function(done) {
			const view = {a:0};
			core.activate(view);
			view.a = 1;
			view.addAnimation({
				duration:duration,
				onend: function() {
					const error = (view.previous.a === 0) ? null : new Error("previous layer value is not correct");
					done(error);
				}
			});
		});
	});

});
