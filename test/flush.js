import * as core from "../source/core.js";
const assert = require("assert");
import { HyperChain, HyperKeyframes } from "../source/actions.js";

const duration = 0.05; // mocha timeout is 2 seconds


describe("FLUSH", function() { // should be called "next" but tests are run in alphabetical order


	describe("unflushed view", function() {

		// // THIS TEST BREAKS TESTS THAT FOLLOW IT:
		// it("added animations not apparent in presentation until transaction flush, unflushed, explicit transaction", function() {
		// 	core.beginTransaction();
		// 	const view = {a:0};
		// 	core.activate(view);
		// 	view.addAnimation({
		// 		property:"a",
		// 		from:1,
		// 		to:1,
		// 		duration:duration,
		// 		blend:"absolute"
		// 	});
		// 	assert.equal(view.presentation.a, 0);
		// 	core.commitTransaction();
		// });


		it("added animations not apparent in presentation until transaction flush, unflushed, implicit transaction", function() {
			const view = {a:0};
			core.activate(view);
			view.addAnimation({
				property:"a",
				from:1,
				to:1,
				duration:duration,
				blend:"absolute"
			});
			assert.equal(view.presentation.a,0); // fail: 1

			// Invalidate at beginning of transaction.
			// What else do i need to do?
			// Must generate render or presentation layer before adding any animations.

			// What do the flushers do?


		});



		it("animationForKey when unflushed is not applied yet", function() {
			const view = { x:0, animationForKey: function(property,value,previous,presentation) {
				return {
					property:"x",
					from:2,
					to:2,
					blend:"absolute",
					additive:false,
					duration:duration
				};
			}};
			core.activate(view);
			view.x = 1;
			assert.equal(view.presentation.x,0);
		});
		it("animationForKey with input output when unflushed is not applied yet", function() {
			const view = {
				x:0,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				},
				animationForKey: function(property,value,previous,presentation) {
					return {
						property:"x",
						from:2,
						to:2,
						blend:"absolute",
						additive:false,
						duration:duration
					};
				}
			};
			core.activate(view);
			view.x = 1;
			assert.equal(view.presentation.x,0);
		});
		it("set layer with no animation, presentation, unflushed", function() {
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.activate(view);
			view.layer = {a:4, b:5, c:6};
			assert.deepEqual(view.presentation, { a:1, b:2, c:3 });
		});
		it("group presentation unflushed", function() {
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
			assert.deepEqual(view.presentation, {a:1, b:2, c:3});
		});

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

	});





	describe("unflushed one", function() {
		let one;
		beforeEach( function() {
			one = {};
			core.activate(one);
		});

		it("registered presentation unflushed, set on layer", function() { // should fail without flushing transaction
			one.registerAnimatableProperty("zxcv");
			one.layer.zxcv = 1;
			assert(one.presentation.zxcv !== 1);
		});
		it("registered presentation unflushed, set on self", function() { // should fail without flushing transaction
			one.registerAnimatableProperty("zxcv");
			one.zxcv = 1;
			assert(one.presentation.zxcv !== 1);
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
			assert.equal(one.presentation.uiop, undefined);
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
	});







});
