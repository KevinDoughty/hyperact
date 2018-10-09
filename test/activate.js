import * as core from "../source/core.js";
var assert = require("assert");

const duration = 0.05; // mocha timeout is 2 seconds

describe("ACTIVATE", function() {
	describe("readiness", function() {
		it("activate() does not trigger call to display. display not called before constructor finished", function(done) {
			// activate can be called mid-constructor,
			// and since auto registering does not happen for properties declared after,
			// you cannot trigger a call to display from activate
			function ReadinessDisplay() {
				this.a = 0;
				core.activate(this);
				this.b = 1;
			}
			ReadinessDisplay.prototype = {
				display: function() {
					const error = (this.b === 1) ? null : new Error("display called before constructor finished");
					done(error);
				},
				animationForKey: function(key) {

				}
			};
			var readinessDisplay = new ReadinessDisplay();
			readinessDisplay.a = 1;
		});
		it("activate() does not trigger call to animationForKey. animationForKey not called before constructor finished", function(done) {
			// activate can be called mid-constructor,
			// and since auto registering does not happen for properties declared after,
			// you cannot trigger a call to display (or animationForKey) from activate
			function ReadinessAnimationForKey() {
				this.a = 0;
				core.activate(this);
				this.b = 1;
			}
			ReadinessAnimationForKey.prototype = {
				animationForKey: function(key) {
					const error = (this.b === 1) ? null : new Error("animationForKey called before constructor finished");
					done(error);
				}
			};
			var readinessAnimationForKey = new ReadinessAnimationForKey();
			readinessAnimationForKey.a = 1;
		});


	});
	describe("activate new fourth parameter descriptions with exclamation type", function() {

		const type = {
			add: function(a,b) {
				return a + b;
			},
			subtract: function(a,b) {
				return a - b;
			},
			zero: function(a) {
				return 0;
			},
			interpolate: function(a, b, progress) {
				return a + (b - a) * progress;
			},
			input:function(key,value) {
				return Number(value.substring(0, value.length-4));
			},
			output:function(key,value) {
				return Math.round(value) + " !!!";
			}
		};



		it("registered type before", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			const descriptions = {
				a: type
			};
			core.activate(controller,delegate,layer,descriptions);
			layer.a = "1 !!!";
			controller.addAnimation({
				property:"a",
				from:"2 !!!",
				to:"2 !!!",
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("registered description before", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			const descriptions = {
				a: { type:type }
			};
			core.activate(controller,delegate,layer,descriptions);
			layer.a = "1 !!!";
			controller.addAnimation({
				property:"a",
				from:"2 !!!",
				to:"2 !!!",
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});

		it("registered type after", function() {
			const controller = {};
			const delegate = {
				animationForKey: function() {
					return {
						from: "6 !!!",
						to: "6 !!!",
						duration:duration/2,
						blend: "absolute"
					};
				}
			};
			const layer = {
				a: "3 !!!"
			};
			const descriptions = {
				a: type
			};
			core.activate(controller,delegate,layer,descriptions);
			controller.addAnimation({
				property:"a",
				from:"4 !!!",
				to:"4 !!!",
				duration:duration/2,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a, "7 !!!");
			//layer.a = "5 !!!";
			//core.flushTransaction();
			//assert.equal(controller.presentation.a, "15 !!!");
		});
		it("registered description after", function() {
			const controller = {};
			const delegate = {
				animationForKey: function() {
					return {
						from: "6 !!!",
						to: "6 !!!",
						duration:duration/2,
						blend: "absolute"
					};
				}
			};
			const layer = {
				a: "3 !!!"
			};
			const descriptions = {
				a: { type: type }
			};
			core.activate(controller,delegate,layer,descriptions);
			controller.addAnimation({
				property:"a",
				from:"4 !!!",
				to:"4 !!!",
				duration:duration/2,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a, "7 !!!");
			//layer.a = "5 !!!";
			//core.flushTransaction();
			//assert.equal(controller.presentation.a, "15 !!!");
		});
	});


});
