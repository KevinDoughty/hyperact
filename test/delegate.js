
import * as core from "../source/core.js";
const assert = require("assert");

const duration = 0.05; // mocha timeout is 2 seconds

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

describe("DELEGATE", function() {

	describe("display", function() {
		
		it("calculated values in display", function(done) {
			const controller = {};
			const layer = {
				a: 0,
				b: 0
			};
			const delegate = {
				display: function(presentation) {
					if (layer.a > 0 && layer.a < 1) {
						done();
						done = function() {};
					}
				},
				animationForKey: function(key,value,previous,presentation) {
					if (key === "a") return {
						duration:duration,
						onend: function() {
							const error = new Error("calculated values in display timeout");
							done(error);
						}
					};
				}
			};
			core.activate(controller,delegate,layer);
			layer.a = 1;
		});
		it("layer values inside of display", function(done) {
			const controller = {};
			const layer = {
				a: 0
			};
			const delegate = {
				animationForKey: function(key,value,previous,presentation) {
					return duration;
				},
				display() {
					if (layer.a > 0 && layer.a < 1) {
						done();
						done = function() {};
					}
				}
			};
			core.activate(controller,delegate,layer);
			layer.a = 1;
			controller.addAnimation({
				duration: duration/2,
				onend: function() {
					const error = new Error("layer values inside of display timeout");
					done(error);
				}
			});
		});
		it("'this' values inside of display", function(done) {
			const layer = {
				a: 0,
				animationForKey: function(key,value,previous,presentation) {
					return {
						duration: duration,
						onend: function() {
							const error = new Error("layer values inside of display timeout");
							done(error);
						}
					};
				},
				display() {
					if (this.a > 0 && this.a < 1) {
						done();
						done = function() {};
					}
				}
			};
			core.activate(layer);
			layer.a = 1;
		});
	});
	describe("outside", function() {
		it("single presentation values flushed", function() {
			const layer = {
				a: 0,
				animationForKey: function(key,value,previous,presentation) {
					return {
						duration: duration,
						from:2,
						to:2,
						blend:"absolute"
					};
				}
			};
			core.activate(layer);
			layer.a = 1;
			const result = 3;
			core.flushTransaction();
			assert.equal(layer.presentation.a,result);
		});
		it("single model values flushed", function() {
			const layer = {
				a: 0,
				animationForKey: function(key,value,previous,presentation) {
					return {
						duration: duration,
						from:2,
						to:2,
						blend:"absolute"
					};
				}
			};
			core.activate(layer);
			layer.a = 1;
			const result = 1;
			core.flushTransaction();
			assert.equal(layer.model.a,result);
		});

		it("model values in onend", function(done) {
			const controller = {};
			const layer = {
				a: 0,
				b: 0
			};
			const delegate = {
				animationForKey: function(key,value,previous,presentation) {
					const result = 1; // not in a display so should be seeing model values
					if (key === "a") return {
						duration:duration/2,
						onend: function(finished) {
							const error = (controller.model.b === result) ? null : new Error("model value is wrong:"+controller.model.b+"; should be:"+result+";");
							done(error);
						}
					};
					if (key === "b") return {
						duration:duration,
						blend:"absolute",
						additive:false,
						from: 2,
						to: 2
					};
				}
			};
			core.activate(controller,delegate,layer);
			layer.a = 1;
			layer.b = 1;
		});
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
	});



	describe("null controller", function() {
		it("display gets called", function(done) {
			const layer = {
				a: 0
			};
			const delegate = {
				display: function() {
					done();
					done = function() {};
				},
				animationForKey: function(key,value,previous,presentation) {
					return duration/2;
				}
			};
			core.activate(null,delegate,layer);
			layer.a = 1;
		});

		it("display has presentation layer argument (could check a little harder)", function(done) {
			const layer = {
				a: 0
			};
			const delegate = {
				display: function(presentation) {
					const error = presentation ? null : new Error("presentation layer is not passed as an argument to display. presentation:"+JSON.stringify(presentation));
					done(error);
					done = function() {};
				},
				animationForKey: function(key,value,previous,presentation) {
					return duration/2;
				}
			};
			core.activate(null,delegate,layer);
			layer.a = 1;
		});

		it("display function `this` is the delegate itself", function(done) {
			const layer = {
				a: 0
			};
			const delegate = {
				display: function() {
					const error = isFunction(this.animationForKey) ? null : new Error("display function `this` should be delegate");
					done(error);
					done = function() {};
				},
				animationForKey: function(key,value,previous,presentation) {
					return duration/2;
				}
			};
			core.activate(null,delegate,layer);
			layer.a = 1;
		});

		it("layer returns calculated values during display AKA live", function(done) {
			const layer = {
				a: 0,
				b: 0
			};
			const delegate = {
				display: function(presentation) {
					if (layer.a === 2 && layer.b === 1) {
						done();
						done = function() {};
					}
				},
				animationForKey: function(key,value,previous,presentation) {
					if (key === "a") return {
						duration: duration,
						blend:"absolute",
						additive:false,
						from: 2,
						to: 2,
						onend: function() {
							const error = new Error("AKA live test timed out. layer:"+JSON.stringify(layer));
							done(error);
						}
					};
					if (key === "b") return {
						duration:duration/2,
						blend:"absolute",
						additive:false,
						from: 2,
						to: 2
					};
				}
			};
			core.activate(null,delegate,layer);
			layer.a = 1;
			layer.b = 1;
		});
		it("calculated values AKA live, better version", function(done) {
			const layer = {
				a: 0,
				b: 0
			};
			const delegate = {
				display: function(presentation) {
					if (layer.a > 0 && layer.a < 1) {
						done();
						done = function() {};
					}
				},
				animationForKey: function(key,value,previous,presentation) {
					if (key === "a") return {
						duration:duration,
						onend: function() {
							const error = new Error("AKA live better version timeout");
							done(error);
						}
					};
				}
			};
			core.activate(null,delegate,layer);
			layer.a = 1;
		});

	});
});
