import * as core from "../source/core.js";
const assert = require("assert");

const duration = 0.05; // mocha timeout is 2 seconds


describe("CONTROLLER", function() {
	describe("activate", function() {
		it("controller and layer are the same object (depending on activation)", function() {
			const one = {};
			core.activate(one);
			assert.equal(one,one.layer);
		});
	});
	describe("null controller", function() {

		it("is possible", function() {
			const layer = {};
			const delegate = {};
			core.activate(null,delegate,layer); // currently throws error if there is no controller passed as first argument
			assert(true);
		});

		it("dispays", function(done) {
			const layer = {
				a: 0,
				b: 0
			};
			const delegate = {
				display: function() {
					done();
				}
			};
			core.activate(null,delegate,layer);
			layer.a = 1;
			layer.b = 1;
		});

		it("basic function", function(done) {
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
							const error = (layer.b === result) ? null : new Error("layer value is wrong:"+layer.b+"; should be:"+result+";");
							done(error); // fail: 0 == 1
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
			core.activate(null,delegate,layer);
			layer.a = 1;
			layer.b = 1;
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

		it("controller and layer are not the same object (depending on activation)", function() {
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
});
