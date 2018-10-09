import * as core from "../source/core.js";
const assert = require("assert");
import { HyperChain, HyperKeyframes } from "../source/actions.js";
import { HyperSet } from "../source/types.js";

const duration = 0.05; // mocha timeout is 2 seconds


describe("ANIMATIONS", function() {

	describe("copying", function() {
		it("works", function(done) {
			const view = {
				a:0
			};
			core.activate(view);
			view.addAnimation({
				duration:duration*2,
				property:"a",
				from:1,
				to:1,
				blend:"absolute"
			},"test");
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const animation = view.animationNamed("test");
					animation.from = 2;
					animation.to = 2;
					view.addAnimation(animation);
					view.addAnimation({
						duration:duration/2,
						onend: function() {
							const expected = 3;
							const actual = view.presentation.a;
							const error = expected === actual ? null : new Error("copying fail, expected:"+expected+"; actual:"+actual+";");
							done(error);
						}
					});
				}
			});
		});
		it("preserves timing", function(done) {
			const one = {
				a:0
			};
			const two = {
				a:0
			};
			core.activate(one);
			core.activate(two);
			one.addAnimation({
				duration:duration*2,
				property:"a",
				from:0,
				to:1,
				blend:"absolute"
			},"test");
			one.addAnimation({
				duration:duration/2,
				onend: function() {
					const animation = one.animationNamed("test");
					two.addAnimation(animation);
					two.addAnimation({
						duration:duration/2,
						onend: function() {
							const first = one.presentation.a;
							const second = two.presentation.a;
							//console.log("ROCKETSHIP ONE:"+first+"; TWO:"+second+";"); // ROCKETSHIP ONE:0.5000029960562263; TWO:0.5000029960562263;
							const error = first === second ? null : new Error("timing fail, these are not the same, first:"+first+"; second:"+second+";");
							done(error);
						}
					});
				}
			});
		});
	});

	describe("availability", function() {
		it("remove all animations", function() {
			const view = {
				x:0,
				y:0
			};
			core.activate(view);
			view.addAnimation({
				duration:duration,
				property:"y",
				from: 1,
				to: 1,
				blend:"absolute"
			});
			view.addAnimation({
				duration:duration/2,
				property:"x",
				from: 1,
				to: 1,
				blend:"absolute"
			});
			assert(view.animations.length === 2);
			core.flushTransaction();
			assert(view.animations.length === 2);
			view.removeAllAnimations();
			assert(view.animations.length === 0);

		});
		it("animation classes are not exposed", function(done) {
			const view = {
				x:0,
				y:0
			};
			core.activate(view);
			view.addAnimation({
				duration:duration,
				property:"y",
				from: 1,
				to: 1,
				blend:"absolute"
			});
			view.addAnimation({
				duration:duration/2,
				property:"x",
				from: 1,
				to: 1,
				blend:"absolute",
				onend: function(finished) {
					const animations = view.animations;
					const length = animations.length;
					//const error = (length && !(animations[0] instanceof HyperAnimation)) ? null : new Error("animation instanceof HyperAnimation should be false, result: " + (animations[0] instanceof HyperAnimation));
					const error = (length && (typeof animations[0] !== "HyperAnimation")) ? null : new Error("typeof animation should not be HyperAnimation, result: " + typeof animations[0]);
					done(error);
				}
			});
			core.flushTransaction();
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

		it("keyframe presentation step three", function(done) { // This has failed when the animation was janky
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


	describe("animation properties", function() {
		it("delay before", function(done) {
			const view = {
				a:0
			};
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				delay:duration,
				blend:"absolute"
			});
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const expected = 0;
					const actual = view.presentation.a;
					const error = expected === actual ? null : new Error("value is not right:"+actual+"; should be:"+expected+";");
					done(error); // Error: value is not right:1; should be:0;
				}
			});
		});
		it("delay after", function(done) {
			const view = {
				a:0
			};
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				delay:duration,
				blend:"absolute"
			});
			view.addAnimation({
				duration:duration * 1.5,
				onend: function() {
					const expected = 1;
					const actual = view.presentation.a;
					const error = expected === actual ? null : new Error("value is not right:"+actual+"; should be:"+expected+";");
					done(error);
				}
			});
		});
		it("startTime before", function(done) {
			const view = {
				a:0
			};
			core.activate(view);
			const transaction = core.currentTransaction();
			const time = transaction.time;
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				startTime:time+duration,
				blend:"absolute"
			});
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const expected = 0;
					const actual = view.presentation.a;
					const error = expected === actual ? null : new Error("value is not right:"+actual+"; should be:"+expected+";");
					done(error);
				}
			});
		});
		it("startTime after", function(done) {
			const view = {
				a:0
			};
			core.activate(view);
			const transaction = core.currentTransaction();
			const time = transaction.time;
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				startTime:time+duration,
				blend:"absolute"
			});
			view.addAnimation({
				duration:duration * 1.5,
				onend: function() {
					const expected = 1;
					const actual = view.presentation.a;
					const error = expected === actual ? null : new Error("value is not right:"+actual+"; should be:"+expected+";");
					done(error);
				}
			});
		});

		it("fillMode backwards with delay", function(done) {
			const view = {
				a:0
			};
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				delay:duration,
				fillMode: "backwards",
				blend:"absolute"
			});
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const expected = 1;
					const actual = view.presentation.a;
					const error = expected === actual ? null : new Error("value is not right:"+actual+"; should be:"+expected+";");
					done(error);
				}
			});
		});
		it("fillMode backwards with startTime", function(done) {
			const view = {
				a:0
			};
			core.activate(view);
			const transaction = core.currentTransaction();
			const time = transaction.time;
			view.addAnimation({
				property:"a",
				duration:duration,
				from:1,
				to:1,
				startTime: time + duration,
				fillMode: "backwards",
				blend:"absolute"
			});
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const expected = 1;
					const actual = view.presentation.a;
					const error = expected === actual ? null : new Error("value is not right:"+actual+"; should be:"+expected+";");
					done(error); // Error: value is not right:0; should:1;
				}
			});
		});


		it("fillMode forwards and zero duration", function(done) {
			const view = {
				a:0,
				b:0
			};
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:0 ,
				from:1,
				to:1,
				fillMode:"forwards",
				blend:"absolute"
			},"filler");
			view.addAnimation({
				property:"b",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute",
				onend: function() {
					const animationCount = view.animations.length;
					const error = (animationCount === 1 && view.presentation.a === 1) ? null : new Error("animations:"+animationCount+"; presentation:"+JSON.stringify(view.presentation));
					view.removeAnimation("filler");
					done(error);
				}
			});
		});
		it("fillMode forwards and duration", function(done) {
			const view = {
				a:0,
				b:0
			};
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration:duration/2,
				from:1,
				to:1,
				fillMode:"forwards",
				blend:"absolute"
			},"filler");
			view.addAnimation({
				property:"b",
				duration:duration,
				from:1,
				to:1,
				blend:"absolute",
				onend: function() {
					const animationCount = view.animations.length;
					const error = (animationCount === 1 && view.presentation.a === 1) ? null : new Error("animations:"+animationCount+"; presentation:"+JSON.stringify(view.presentation));
					view.removeAnimation("filler");
					done(error);
				}
			});
		});

		it("duration infinity", function() {
			const view = { a:0 };
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration: Infinity,
				from:5,
				to:5,
				blend:"absolute"
			});
			core.flushTransaction();
			assert(view.presentation.a === 5);
			view.removeAllAnimations();
		});

		it("iterations infinity", function(done) {
			const view = { a:0 };
			core.activate(view);
			view.addAnimation({
				property:"a",
				duration: duration/4,
				iterations: Infinity,
				from:5,
				to:5,
				blend:"absolute"
			});
			view.addAnimation({
				duration: duration*2,
				onend: function() {
					const error = (view.presentation.a === 5) ? null : new Error("value is not correct");
					view.removeAllAnimations();
					done(error);
				}
			});
		});

	});



	describe("fake set animation", function() {
		it("flushing should invalidate presentation layer (unregistered)", function() {
			const view = {};
			core.activate(view);
			view.discrete = ["a"];
			view.addAnimation([
				{
					property:"discrete",
					duration:duration,
					from:["b"],
					to:["b"],
					blend:"absolute",
					type: new HyperSet( function(a,b) {
						return a.charCodeAt(0)-b.charCodeAt(0);
					})
				}
			]);
			view.discrete = ["c"];
			core.flushTransaction();
			assert.deepEqual(view.presentation, { discrete:["b","c"] });
			// FAIL: AssertionError [ERR_ASSERTION]: { discrete: [ 'c' ] } deepEqual { discrete: [ 'b', 'c' ] }
		});
		it("flushing should invalidate presentation layer (unregistered) with sort specified on description", function() {
			const view = {};
			core.activate(view);
			view.discrete = ["a"];
			view.addAnimation([
				{
					property:"discrete",
					duration:duration,
					from:["b"],
					to:["b"],
					blend:"absolute",
					sort: function(a,b) {
						return a.charCodeAt(0)-b.charCodeAt(0);
					},
					type: new HyperSet()
				}
			]);
			view.discrete = ["c"];
			core.flushTransaction();
			assert.deepEqual(view.presentation, { discrete:["b","c"] });
			// fail: AssertionError [ERR_ASSERTION]: { discrete: [ 'c' ] } deepEqual { discrete: [ 'b', 'c' ] }
		});
		it("array type has a default, optional sort declared on the animation (the point is you don't register)", function() {
			const view = {};
			core.activate(view);
			view.discrete = ["a"];
			view.addAnimation([
				{
					property:"discrete",
					duration:duration,
					from:["b"],
					to:["b"],
					blend:"absolute",
					sort: function(a,b) {
						return a.charCodeAt(0)-b.charCodeAt(0);
					}
				}
			]);
			view.discrete = ["c"];
			core.flushTransaction();
			assert.deepEqual(view.presentation, { discrete:["b","c"] });
			// fail: AssertionError [ERR_ASSERTION]: { discrete: [ 'c' ] } deepEqual { discrete: [ 'b', 'c' ] }
		});

		it("flushing should invalidate presentation layer (registered)", function() {
			const view = {};
			core.activate(view);
			view.registerAnimatableProperty("discrete", new HyperSet( function(a,b) {
				return a.charCodeAt(0)-b.charCodeAt(0);
			}));
			view.discrete = ["a"];
			view.addAnimation([
				{
					property:"discrete",
					duration:duration,
					from:["b"],
					to:["b"],
					blend:"absolute"
				}
			]);
			view.discrete = ["c"];
			core.flushTransaction();
			assert.deepEqual(view.presentation, { discrete:["b","c"] });
			// fail: AssertionError [ERR_ASSERTION]: { discrete: [ 'a', 'b' ] } deepEqual { discrete: [ 'b', 'c' ] }
		});

		it("flushing twice (unregistered)", function() {
			const view = {};
			core.activate(view);
			view.discrete = ["a"];
			view.addAnimation([
				{
					property:"discrete",
					duration:duration,
					from:["b"],
					to:["b"],
					blend:"absolute",
					type: new HyperSet( function(a,b) {
						return a.charCodeAt(0)-b.charCodeAt(0);
					})
				}
			]);
			view.discrete = ["c"];
			core.flushTransaction();
			view.discrete = ["d"];
			core.flushTransaction();
			assert.deepEqual(view.presentation, { discrete:["b","d"] });
			// FAIL: AssertionError [ERR_ASSERTION]: { discrete: [ 'd' ] } deepEqual { discrete: [ 'b', 'd' ] }
		});
		it("flushing twice (registered)", function() {
			const view = {};
			core.activate(view);
			view.registerAnimatableProperty("discrete", new HyperSet( function(a,b) {
				return a.charCodeAt(0)-b.charCodeAt(0);
			}));
			view.discrete = ["a"];
			view.addAnimation([
				{
					property:"discrete",
					duration:duration,
					from:["b"],
					to:["b"],
					blend:"absolute"
				}
			]);
			view.discrete = ["c"];
			core.flushTransaction();
			view.discrete = ["d"];
			core.flushTransaction();
			assert.deepEqual(view.presentation, { discrete:["b","d"] });
			// fail; AssertionError [ERR_ASSERTION]: { discrete: [ 'a', 'b' ] } deepEqual { discrete: [ 'b', 'd' ] }
		});
		it("new presentation instance is generated, unregistered", function() {
			const view = {};
			core.activate(view);
			view.discrete = ["a"];
			core.flushTransaction();
			const presentationOne = view.presentation;
			view.discrete = ["b"];
			core.flushTransaction();
			const presentationTwo = view.presentation;
			assert.notEqual(presentationOne, presentationTwo);
			// fail: AssertionError [ERR_ASSERTION]: { discrete: [ 'a' ] } != { discrete: [ 'a' ] }
		});
		it("new presentation instance is generated, registered", function() {
			const view = {};
			core.activate(view);
			view.registerAnimatableProperty("discrete", new HyperSet( function(a,b) {
				return a.charCodeAt(0)-b.charCodeAt(0);
			}));
			view.discrete = ["a"];
			core.flushTransaction();
			const presentationOne = view.presentation;
			view.discrete = ["b"];
			core.flushTransaction();
			const presentationTwo = view.presentation;
			assert.notEqual(presentationOne, presentationTwo);
			// fail: AssertionError [ERR_ASSERTION]: { discrete: [ 'a' ] } != { discrete: [ 'a' ] }
		});
		it("new presentation instance is generated, registered, with animationForKey implementation that returns null", function() {
			const view = {
				animationForKey: function() {
					return null;
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("discrete", new HyperSet( function(a,b) {
				return a.charCodeAt(0)-b.charCodeAt(0);
			}));
			view.discrete = ["a"];
			core.flushTransaction();
			const presentationOne = view.presentation;
			view.discrete = ["b"];
			core.flushTransaction();
			const presentationTwo = view.presentation;
			assert.notEqual(presentationOne, presentationTwo);
			// fail: AssertionError [ERR_ASSERTION]: { discrete: [ 'a' ] } != { discrete: [ 'a' ] }
		});
		it("new presentation instance is generated, registered, with animationForKey implementation that returns zero", function() {
			const view = {
				animationForKey: function() {
					return 0;
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("discrete", new HyperSet( function(a,b) {
				return a.charCodeAt(0)-b.charCodeAt(0);
			}));
			view.discrete = ["a"];
			core.flushTransaction();
			const presentationOne = view.presentation;
			view.discrete = ["b"];
			core.flushTransaction();
			const presentationTwo = view.presentation;
			assert.notEqual(presentationOne, presentationTwo);
			// fail: AssertionError [ERR_ASSERTION]: { discrete: [ 'a' ] } != { discrete: [ 'a' ] }
		});
		it("discrete with no animation, unregistered", function() {
			const view = {};
			core.activate(view);
			view.discrete = ["a"];
			core.flushTransaction();
			view.discrete = ["b"];
			core.flushTransaction();
			view.discrete = ["c"];
			core.flushTransaction();
			const presentationThree = view.presentation;
			assert.deepEqual(presentationThree, { discrete:["c"] });

		});
		it("discrete with no animation, registered", function() {
			const view = {};
			core.activate(view);
			view.registerAnimatableProperty("discrete", new HyperSet( function(a,b) {
				return a.charCodeAt(0)-b.charCodeAt(0);
			}));
			view.discrete = ["a"];
			core.flushTransaction();
			view.discrete = ["b"];
			core.flushTransaction();
			view.discrete = ["c"];
			core.flushTransaction();
			const presentationThree = view.presentation;
			assert.deepEqual(presentationThree, { discrete:["c"] });

		});
		it("discrete with no animation, registered, with animationForKey implementation that returns null", function() {
			const view = {
				animationForKey: function() {
					return null;
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("discrete", new HyperSet( function(a,b) {
				return a.charCodeAt(0)-b.charCodeAt(0);
			}));
			view.discrete = ["a"];
			core.flushTransaction();
			view.discrete = ["b"];
			core.flushTransaction();
			view.discrete = ["c"];
			core.flushTransaction();
			const presentationThree = view.presentation;
			assert.deepEqual(presentationThree, { discrete:["c"] });

		});
		it("discrete with no animation, registered, with animationForKey implementation that returns zero", function() {
			const view = {
				animationForKey: function() {
					return 0;
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("discrete", new HyperSet( function(a,b) {
				return a.charCodeAt(0)-b.charCodeAt(0);
			}));
			view.discrete = ["a"];
			core.flushTransaction();
			view.discrete = ["b"];
			core.flushTransaction();
			view.discrete = ["c"];
			core.flushTransaction();
			const presentationThree = view.presentation;
			assert.deepEqual(presentationThree, { discrete:["c"] });

		});
	});
	describe("step-end easing", function() {
		it("fake set animation does not display at every tick", function(done) {
			let count = 0;
			const view = {
				display: function() {
					count++;
				},
				discrete: ["a"]
			};
			core.activate(view);
			view.addAnimation([
				{
					property:"discrete",
					duration:duration,
					from:["b"],
					to:["b"],
					blend:"absolute",
					easing: "step-end",
					type: new HyperSet( function(a,b) {
						return a.charCodeAt(0)-b.charCodeAt(0);
					}),
					onend: function() {
						const error = count > 2 ? new Error("display called "+count+" times") : null;
						done(error); // fail
					}
				}
			]);
		});
		it("fake set animation does not generate a new presentation layer every tick (this might be wrong)", function(done) { // Wrong? See: "new presentation instance is generated"
			let presentation = null;
			const view = {
				discrete: ["a"]
			};
			core.activate(view);
			view.addAnimation([
				{
					property:"discrete",
					duration:duration*2,
					from:["b"],
					to:["b"],
					blend:"absolute",
					easing: "step-end",
					type: new HyperSet( function(a,b) {
						return a.charCodeAt(0)-b.charCodeAt(0);
					})
				}
			]);
			view.addAnimation([
				{
					duration:duration/2,
					onend: function() {
						presentation = view.presentation;
					}
				}
			]);
			view.addAnimation([
				{
					duration:duration,
					onend: function() {
						const error = presentation !== view.presentation ? new Error("presentation layer was not cached") : null;
						done(error); // fail
					}
				}
			]);
		});

		it("number animation does not display at every tick", function(done) {
			let count = 0;
			const view = {
				display: function() {
					count++;
				},
				value: 0
			};
			core.activate(view);
			view.addAnimation([
				{
					property:"value",
					duration:duration,
					from:1,
					to:1,
					blend:"absolute",
					easing: "step-end",
					onend: function() {
						const error = count > 2 ? new Error("display called "+count+" times") : null;
						done(error); // fail
					}
				}
			]);
		});
		it("number animation does not generate a new presentation layer every tick (this might be wrong)", function(done) { // Wrong? See: "new presentation instance is generated"
			let presentationOne = null;
			let presentationTwo = null;
			const view = {
				value: 0
			};
			core.activate(view);
			view.addAnimation([
				{
					property:"value",
					duration:duration*2,
					from:1,
					to:2,
					blend:"absolute",
					easing: "step-end",
					onend: function() {
						const error = (presentationOne === presentationTwo) ? null : new Error("presentation layer was not cached");
						done(error); // fail
					}
				}
			]);
			view.addAnimation([
				{
					duration:duration/2,
					onend: function() {
						presentationOne = view.presentation;
					}
				}
			]);
			view.addAnimation([
				{
					duration:duration,
					onend: function() {
						presentationTwo = view.presentation;
					}
				}
			]);
		});
		it("number animation values are correct", function(done) {
			let presentationOne = null;
			let presentationTwo = null;
			const view = {
				value: 0
			};
			core.activate(view);
			view.addAnimation([
				{
					property:"value",
					duration:duration*2,
					from:1,
					to:2,
					blend:"absolute",
					easing: "step-end",
					onend: function() {
						const checkOne = presentationOne.value;
						const checkTwo = presentationTwo.value;
						const error = (checkOne === checkTwo && checkOne === 1) ? null : new Error("values were wrong");
						done(error);
					}
				}
			]);
			view.addAnimation([
				{
					duration:duration/2,
					onend: function() {
						presentationOne = view.presentation;
					}
				}
			]);
			view.addAnimation([
				{
					duration:duration,
					onend: function() {
						presentationTwo = view.presentation;
					}
				}
			]);
		});
	});
});
