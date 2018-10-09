import * as core from "../source/core.js";
const assert = require("assert");



describe("ZZZ", function() { // should be called "next" but tests are run in alphabetical order




	describe("TODO", function() {
		it("tests for explicit transactions, begin & commit. Currently only one in flush.js breaks tests that follow and so is disabled", function() {
			assert(false);
		});
		it("uses current or currentLayer not model or modelLayer", function() {
			const view = {};
			core.activate(view);
			assert(typeof view.model === "undefined" && typeof view.modelLayer === "undefined");
			assert(typeof view.current !== "undefined" || typeof view.currentLayer !== "undefined");
		});
		it("uses presentationLayer, modelLayer/currentLayer, previousLayer syntax not presentation, model/current, previous (or maybe not)", function() {
			const view = {};
			core.activate(view);
			assert(typeof view.presentation === "undefined");
			assert(typeof view.previous === "undefined");
			assert(typeof view.model === "undefined" && typeof view.current === "undefined");
			assert(typeof view.presentationLayer !== "undefined");
			assert(typeof view.previousLayer !== "undefined");
			assert(typeof view.modelLayer !== "undefined" || typeof view.currentLayer !== "undefined");
		});
		it("animation has either naming or key property (needed to replace animations from animationForKey)", function() {
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

		it("optional isEqual method on types, or maybe delegate, to determine if value has changed", function() {
			assert(false);
		});
		it("rename iterations to repeatCount?", function() {
			assert(false);
		});

		it("registerAnimatableType! registerPropertyType! registerPropertyAnimation! animationsDictionary!", function() {
			assert(false);
		});

		it("remove vague type spaghetti and registerAnimatableProperty complications involving types and converting input/output. getPresentation needs type, for instance, but doesn't have animations",function() {
			assert(false);
		});
		it("presentationTransform tests", function() {
			assert(false);
		});
		it("new activate fourth argument descriptions tests", function() {
			assert(false);
		});
		it("null layer mode for deferred instantiation, rename this.layer to this.merge or this.merge(), this.layer assigns instance but also defines properties on that object", function() {
			assert(false);
		});
		it("animation length property, type becomes subtype of HyperArray, no specified type becomes HyperArray of HyperNumber",function() {
			assert(false);
		});

		it("add registerAnimatableProperty tests where type with input output is declared in group and chain animations. And implement it.", function() {
			assert(false);
		});
		it("Ticking should not generate presentation layers. Rather, presentationBacking only, to minimize instantiation and copying methods", function() {
			assert(false);
		});
		it("Steps property will be required, derived from easing function, so animations can be converted to keyframes and run on another thread", function() {
			assert(false);
		});
		it("Infinite duration really shouldn't be allowed", function() {
			assert(false);
		});
		it("explicit animation with unspecified duration probably shouldn't animate if there is a transaction duration, only implicit", function() {
			assert(false);
		});
		it("hyperstyle problem but if a css type is not registered, it should not animate with the default HyperNumber, instead should use NonNumeric", function() {
			assert(false);
			// Won't be converted to ugly value, it will be a string like "20px", but then HyperNumber add will append the string "NaN" making "20pxNaN"
		});
		it("check Core Animation animationDidStop:finished: animation count. Is the animation in question still in the layer's animations? (recalled by key)", function() {
			assert(false); // I think no.
		});
		it("check Core Animation animationDidStop:finished: presentation value. Is the animation in question still applied to the presentation layer?", function() {
			assert(false); // I think no.
		});

		// it("animation classes are not exposed", function(done) { // invalid typeof comparison
		// 	const view = {
		// 		x:0,
		// 		y:0
		// 	};
		// 	core.activate(view);
		// 	view.addAnimation({
		// 		duration:duration,
		// 		property:"y",
		// 		from: 1,
		// 		to: 1,
		// 		blend:"absolute"
		// 	});
		// 	view.addAnimation({
		// 		duration:duration/2,
		// 		property:"x",
		// 		from: 1,
		// 		to: 1,
		// 		blend:"absolute",
		// 		onend: function(finished) {
		// 			const animations = view.animations;
		// 			const length = animations.length;
		// 			//const error = (length && !(animations[0] instanceof HyperAnimation)) ? null : new Error("animation instanceof HyperAnimation should be false, result: " + (animations[0] instanceof HyperAnimation));
		// 			const error = (length && (typeof animations[0] !== "HyperAnimation")) ? null : new Error("typeof animation should not be HyperAnimation, result: " + typeof animations[0]);
		// 			done(error);
		// 		}
		// 	});
		// 	core.flushTransaction();
		// });

	});


});
