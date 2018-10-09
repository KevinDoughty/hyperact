import * as core from "../source/core.js";
const assert = require("assert");

const duration = 0.05; // mocha timeout is 2 seconds


describe("DISPLAY", function() {

	describe("change update", function() {
		it("changing a property value results in a call to display, original", function(done) {
			const controller = {};
			const delegate = {
				display:function() {
					done();
				}
			};
			const layer = { a:0 };
			core.activate(controller, delegate, layer);
			layer.a = 1;
			core.flushTransaction(); // flushing doesn't result in a render. How can I test for that?
		});
		it("changing a property value results in a call to display, unflushed", function(done) {
			const controller = {};
			const delegate = {
				display:function() {
					done();
				}
			};
			const layer = { a:0 };
			core.activate(controller, delegate, layer);
			layer.a = 1;
		});
		it("changing a property value results in a call to display. Animation disabled should not change that.", function(done) {
			const controller = {};
			const delegate = {
				display:function() {
					done();
				}
			};
			const layer = { a:0 };
			core.activate(controller, delegate, layer);
			core.disableAnimation();
			layer.a = 1;
		});
		it("allow passing display function only instead of delegate object", function(done) {
			const controller = {};
			const display = function() {
				done();
			};
			const layer = { a:0 };
			core.activate(controller, display, layer);
			layer.a = 1;
			core.flushTransaction();
		});
	});

	describe("flicker", function() {
		it("should not flicker when adding an animation first then setting underlying value, one", function() {
			const view = { a: 0 };
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			assert.equal(view.presentation.a,0); // fail: 1
		});
		it("should not flicker when adding an animation first then setting underlying value, two", function() {
			const view = { a: 0 };
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			view.a = -2;
			assert.equal(view.presentation.a,0); // fail: 1
		});
		it("should not flicker when adding an animation first then setting underlying value, three", function() {
			const view = { a: 0 };
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			view.a = -2;
			core.flushTransaction();
			assert.equal(view.presentation.a,-1);
		});
		it("should not flicker when adding an animation first then setting underlying value, four", function(done) {
			const view = {
				a: 0,
				display: function() {
					view.display = function() {};
					const presentation = view.presentation.a;
					const error = presentation === 1 ? null : new Error("presentation value is wrong and might have flickered:"+presentation+";");
					done(error);
				}
			};
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
		});

		it("should not flicker when adding an animation first then setting underlying value, five (this is the important one)", function(done) {
			const view = {
				a: 0,
				display: function() {
					view.display = function() {};
					const presentation = view.presentation.a;
					const error = presentation === -1 ? null : new Error("presentation value is wrong and might have flickered:"+presentation+"; The model value is:"+view.model.a+";");
					done(error); // fail: 1
				}
			};
			core.activate(view);
			view.addAnimation({ // transaction is created in addAnimation
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			view.a = -2; // trasaction would have been created in setValuesOfLayer if not in addAnimation
		});

		it("should not flicker when adding an animation first then setting underlying value, six", function(done) {
			const view = {
				a: 0,
				display: function() {
					view.display = function() {};
					const presentation = view.presentation.a;
					const error = presentation === -1 ? null : new Error("presentation value is wrong and might have flickered:"+presentation+";");
					done(error);
				}
			};
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			view.a = -2;
			core.flushTransaction();
		});
		it("should not call display until the transaction has ended, one", function(done) {
			let safe = false;
			const view = {
				a: 0,
				display: function() {
					view.display = function() {};
					const error = safe ? null : new Error("display was called before the transaction ended");
					done(error); // fail: 1
				}
			};
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			safe = true;
		});
		it("should not call display until the transaction has ended, two", function(done) {
			let safe = false;
			const view = {
				a: 0,
				display: function() {
					view.display = function() {};
					const error = safe ? null : new Error("display was called before the transaction ended");
					done(error); // fail: 1
				}
			};
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			view.a = -2;
			safe = true;
		});

		it("should not call display until the transaction has ended, three", function(done) {
			let nextDisplay = function() {
				delegate.display = function() {};
				done();
			};
			const layer = {
				a: 0
			};
			const delegate = {
				display: function() {
					delegate.display = function() {};
					nextDisplay = function() {};
					const error = new Error("display was called before the transaction ended");
					done(error); // fail: 1
				}
			};
			const controller = {};
			core.activate(controller,delegate,layer);
			controller.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			delegate.display = nextDisplay;
		});
		it("should not call display until the transaction has ended, four", function(done) {
			let nextDisplay = function() {
				delegate.display = function() {};
				done();
			};
			const layer = {
				a: 0
			};
			const delegate = {
				display: function() {
					delegate.display = function() {};
					nextDisplay = function() {};
					const error = new Error("display was called before the transaction ended");
					done(error); // fail: 1
				}
			};
			const controller = {};
			core.activate(controller,delegate,layer);
			controller.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute"
			});
			layer.a = -2;
			delegate.display = nextDisplay;
		});
		// I need to add animations to a queue and not really add them until the transaction is over.


	});
});
