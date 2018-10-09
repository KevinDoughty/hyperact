import * as core from "../source/core.js";
const assert = require("assert");

const duration = 0.05; // mocha timeout is 2 seconds


describe("VALUES", function() {

	describe("change", function() {
		it("no change in value produces no animation", function(done) {
			const one = {
				x:1.0,
				y:0.0,
				z:0.0
			};
			core.activate(one);
			const transaction = core.currentTransaction();
			transaction.duration = duration*2;
			one.x = 1.0;
			one.y = 1.0;
			one.addAnimation({
				property:"z",
				duration:duration,
				from: 1,
				to: 1,
				onend: function(finished) {
					const error = (one.animations.length === 1) ? null : new Error("adding animations in a transaction when value does not change");
					done(error);
				}
			});
		});

		it("no change in value produces no animation, using setLayer", function(done) {
			const one = {
				x:1.0,
				y:0.0,
				z:0.0
			};
			core.activate(one);
			const transaction = core.currentTransaction();
			transaction.duration = duration*2;
			one.layer = {
				x:1.0,
				y:1.0
			};
			one.addAnimation({
				property:"z",
				duration:duration,
				from: 1,
				to: 1,
				onend: function(finished) {
					const error = (one.animations.length === 1) ? null : new Error("adding animations in a transaction when value does not change, using setLayer ");
					done(error);
				}
			});
		});

		it("no change in array identity produces no animation (maybe change to check equality?)", function(done) { // this produces an eslint warning no-self-assign is suppressed in package.json passed rules
			const array = [1];
			const one = {
				x:array,
				z:0
			};
			core.activate(one);
			one.registerAnimatableProperty("x",core.ArrayType);
			const transaction = core.currentTransaction();
			transaction.duration = duration*2;
			one.x = array; // this produces an eslint warning no-self-assign is suppressed in package.json passed rules
			one.addAnimation({
				property:"z",
				duration:duration,
				from: 1,
				to: 1,
				onend: function(finished) {
					const error = (one.animations.length === 0) ? null : new Error("adding animations in a transaction when value does not change");
					done(error);
				}
			});
		});

		it("change in array identity produces animation (maybe change to check equality?)", function(done) {
			const one = {
				x:[1],
				z:0
			};
			core.activate(one);
			one.registerAnimatableProperty("x",core.ArrayType);
			const transaction = core.currentTransaction();
			transaction.duration = duration*2;
			one.x = [1];
			one.addAnimation({
				property:"z",
				duration:duration,
				from: 1,
				to: 1,
				onend: function(finished) {
					const error = (one.animations.length === 1) ? null : new Error("adding animations in a transaction when value does not change");
					done(error);
				}
			});
		});

		it("no change in fake set identity produces no animation (maybe change to check equality?)", function(done) {
			const one = {
				x:[1],
				z:0
			};
			core.activate(one);
			one.registerAnimatableProperty("x",core.SetType);
			const transaction = core.currentTransaction();
			transaction.duration = duration*2;
			one.x = one.x;
			one.addAnimation({
				property:"z",
				duration:duration,
				from: 1,
				to: 1,
				onend: function(finished) {
					const error = (one.animations.length === 0) ? null : new Error("adding animations in a transaction when value does not change");
					done(error);
				}
			});
		});

		it("change in fake set identity produces animation (maybe change to check equality?)", function(done) {
			const one = {
				x:[1],
				z:0
			};
			core.activate(one);
			one.registerAnimatableProperty("x",core.SetType);
			const transaction = core.currentTransaction();
			transaction.duration = duration*2;
			one.x = [1];
			one.addAnimation({
				property:"z",
				duration:duration,
				from: 1,
				to: 1,
				onend: function(finished) {
					const error = (one.animations.length === 1) ? null : new Error("adding animations in a transaction when value does not change");
					done(error);
				}
			});
		});
	});

	describe("layer", function() {
		it("layer values outside of display", function(done) {
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
			core.activate(controller,delegate,layer);
			layer.a = 1;
			layer.b = 1;
		});
		it("layer values outside of display, better version", function(done) {
			const controller = {};
			const layer = {
				a: 0
			};
			const delegate = {
				animationForKey: function(key,value,previous,presentation) {
					return duration;
				}
			};
			core.activate(controller,delegate,layer);
			layer.a = 1;
			const result = 1;
			controller.addAnimation({
				duration: duration/2,
				onend: function() {
					const error = layer.a === result ? null : new Error("layer value wrong:"+layer.a+"; should be:"+result+";");
					done(error); // fail: 0 == 1
				}
			});
		});
		it("single layer values outside of display", function(done) {
			const layer = {
				a: 0,
				animationForKey: function(key,value,previous,presentation) {
					return duration;
				}
			};
			core.activate(layer);
			layer.a = 1;
			const result = 1;
			layer.addAnimation({
				duration: duration/2,
				onend: function() {
					const error = layer.a === result ? null : new Error("layer value wrong:"+layer.a+"; should be:"+result+";");
					done(error); // fail: 0 == 1
				}
			});
		});
		it("single layer values flushed", function() {
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
			assert.equal(layer.a,result);
		});
	});

	describe("Not deprecated input output delegate value transforms", function() {
		it("Not deprecated calls delegate input on value change", function(done) {
			const controller = {};
			const delegate = {
				input: function(property,value) {
					if (value === 1) {
						done();
						done = function() {};
					}
					return value;
				},
				output: function(property,value) {
					return value;
				}
			};
			const layer = {a:0}; // properties must exist prior
			core.activate(controller,delegate,layer);
			layer.a = 1;
		});
		it("Not deprecated input output parity", function() {
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				}
			};
			const controller = {};
			const delegate = {
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				},
				animationForKey: function() {
					return {
						type:type,
						duration:duration/2,
						from:2,
						to:2,
						blend:"absolute"
					};
				}
			};
			const layer = {a:0};
			core.activate(controller,delegate,layer);
			layer.a = 1;
			core.flushTransaction();
			assert.equal(controller.presentation.a,3);
		});

		it("Not deprecated input output model layer value is correct", function(done) {
			const view = {
				x:3,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				}
			};
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				}
			};
			core.activate(view);
			view.addAnimation({
				property:"x",
				type: type,
				from:4,
				to:4,
				blend:"absolute",
				additive:false,
				duration:duration
			});
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.model.x;
					const error = (value === 3) ? null : new Error("model value is not correct:"+value+";");
					done(error);
				}
			});
		});

		it("Not deprecated input output previous layer value is correct", function(done) {
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				}
			};
			const view = {
				x:3,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				},
				animationForKey: function() {
					return {
						type: type,
						blend:"absolute",
						additive:false,
						duration:duration
					};
				}
			};
			core.activate(view);
			view.x = 4;
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.previous.x;
					const error = (value === 3) ? null : new Error("previous value is not correct:"+value+";");
					done(error);
				}
			});
		});


		it("Not deprecated input output presentation layer value is correct", function(done) {
			const view = {
				x:3,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				}
			};
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				}
			};
			core.activate(view);
			view.addAnimation({
				property:"x",
				type: type,
				from:4,
				to:4,
				blend:"absolute",
				//additive:false,
				duration:duration
			});
			const result = 7;
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.presentation.x;
					const error = (value === result) ? null : new Error("presentation value is not correct:"+value+"; should be:"+result+";");
					done(error);
				}
			});
		});

		it("Not deprecated input output presentation layer value is correct part two", function(done) {
			const view = {
				x:2,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				}
			};
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				}
			};
			core.activate(view);
			view.addAnimation({
				property:"x",
				type: type,
				from:3,
				to:4,
				blend:"absolute",
				duration:duration
			});
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.presentation.x;
					const error = (value > 5 && value < 6) ? null : new Error("presentation value is not correct:"+value+"; should be between 5 and 6");
					done(error);
				}
			});
		});

		it("Not deprecated delegate input output registered animation count", function(done) {
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				}
			};
			const view = {
				x:3,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("x",{
				type: type,
				blend:"absolute",
				duration: duration,
				from: 5,
				to: 5
			});
			view.x = 4;
			const result = 1;
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.animationCount;
					const error = (value === result) ? null : new Error("animation count is not correct:"+value+"; should be:"+result+";");
					done(error);
				}
			});
		});

		it("Not deprecated delegate input output registered value", function(done) {
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				}
			};
			const view = {
				x:3,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("x",{
				type: type,
				blend:"absolute",
				duration: duration,
				from: 5,
				to: 5
			});
			view.x = 4;
			const result = 9;
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.presentation.x;
					const error = (value === result) ? null : new Error("registered presentation value is not correct:"+value+"; should be:"+result+";");
					done(error);
				}
			});
		});

		it("Not deprecated delegate input output registered part two", function(done) {
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				}
			};
			const view = {
				x:2,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("x",{
				type: type,
				duration: duration
			});
			view.x = 3;
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.presentation.x;
					const error = (value > 2 && value < 3) ? null : new Error("registered presentation value is not correct:"+value+"; should be between 2 and 3");
					done(error);
				}
			});
		});



		it("registered type calls input on value change", function(done) {
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				},
				input: function(property,value) {
					if (value === 1) {
						done();
						done = function() {};
					}
					return [value];
				},
				output: function(property,value) {
					return value[0];
				}
			};
			const view = {a:0};
			core.activate(view);
			view.registerAnimatableProperty("a", type);
			view.a = 1;
		});


		it("Specific bug fix, registered type calls output to generate presentation part one, should not be 0", function(done) {
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				},
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					//console.log("1 property:%s; value:%s;",property,JSON.stringify(value))
					assert(value !== 0);
					return value[0];
				}
			};
			const view = {a:0};
			core.activate(view);
			view.registerAnimatableProperty("a", { type: type });
			view.a = 1;
			core.flushTransaction();
			view.addAnimation({
				duration:duration,
				onend: function() {
					done();
				}
			});
		});

		it("Specific bug fix, registered type calls output to generate presentation part four, should always be an array of length 1", function(done) {// Specific bug fix // Maybe caused by second manual registration //" How is it possible type.output is given different arguments than delegate.output? The uglyKey of getOutputDelegateOutput is wrong, somewhere.",
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				},
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					//console.log("4 property:%s; value:%s;",property,JSON.stringify(value))
					assert(value.length === 1); // value is a number, not an array
					return value[0];
				}
			};
			const view = {a:0};
			core.activate(view);
			view.registerAnimatableProperty("a", { type: type });
			view.a = 1;
			core.flushTransaction();
			view.addAnimation({
				duration:duration,
				onend: function() {
					done();
				}
			});
		});

		it("Not deprecated calls delegate output to generate presentation", function() {
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				}
			};
			let called = false;
			const delegate = {
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					called = true;
					assert(value.length === 1); // values are [0] and [1]
					return value[0];
				}
			};
			const view = {a:0};
			core.activate(view,delegate,view);
			view.registerAnimatableProperty("a", { type: type });
			view.a = 1;
			core.flushTransaction();
			assert(called);
		});


		it("input output from registered type not delegate", function(done) {
			const type = {
				add: function(a,b) {
					return [a[0] + b[0]];
				},
				subtract: function(a,b) {
					return [a[0] - b[0]];
				},
				zero: function(a) {
					return [0];
				},
				interpolate: function(a, b, progress) {
					return [a[0] + (b[0] - a[0]) * progress];
				},
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				}
			};
			const view = {
				animationForKey: function() {
					return {
						property:"x",
						type: type,
						from:5,
						to:5,
						blend:"absolute",
						duration:duration
					};
				}
			};
			core.activate(view);
			view.x = 3;
			view.registerAnimatableProperty("x", type);
			view.x = 4;
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.presentation.x;
					const error = (value === 9) ? null : new Error("presentation value is not correct:"+value+";");
					done(error);
				}
			});
		});

		it("Not deprecated output exclamation marks on delegate is a number and not a string", function(done) {
			const view = {
				testo:"1 !!!",
				input:function(key,value) {
					//if (!({}.toString.call(value) !== {}.toString.call("string"))) console.log("! ! ! ! ! value:%s;",value);
					return Number(value.substring(0, value.length-4));
				},
				output:function(key,value) {
					//assert(!isNaN(value));
					//assert({}.toString.call(value) !== {}.toString.call("string"));
					return Math.round(value) + " !!!";
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("testo");
			view.addAnimation({
				property:"testo",
				duration:duration,
				from:"2 !!!",
				to:"2 !!!",
				blend:"absolute"
			});
			const result = "3 !!!";
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const error = view.presentation.testo === result ? null : new Error("presentation value is wrong:"+view.presentation.testo+"; should be:"+result+";");
					done(error);
				}
			});
		});

		it("Not deprecated input exclamation marks on delegate has string suffix", function(done) {
			const view = {
				testo:"3 !!!",
				input:function(key,value) {
					//if (!(value && value.length > 4 && value.substring(value.length-4) === " !!!")) console.log("!! !! !! !! !! value:%s;",value); // 3
					//assert(value && value.length > 4 && value.substring(value.length-4) === " !!!");
					return Number(parseFloat(value.substring(0, value.length-4)));
				},
				output:function(key,value) {
					return Math.round(value) + " !!!";
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("testo");
			view.addAnimation({
				property:"testo",
				duration:duration,
				from:"4 !!!",
				to:"4 !!!",
				blend:"absolute"
			});
			const result = "7 !!!";
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const error = view.presentation.testo === result ? null : new Error("presentation value is wrong:"+view.presentation.testo+"; should be:"+result+";");
					done(error);
				}
			});
		});

		it("input exclamation marks on registered type has string suffix", function(done) {
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
					assert(value && value.length > 4 && value.substring(value.length-4) === " !!!");
					return Number(value.substring(0, value.length-4));
				},
				output:function(key,value) {
					return Math.round(value) + " !!!";
				}
			};
			const view = {
				a:"1 !!!"
			};
			core.activate(view);
			view.registerAnimatableProperty("a", type);
			view.addAnimation({
				property:"a",
				duration:duration/2,
				from:"2 !!!",
				to:"2 !!!",
				blend:"absolute",
				onend: function() {
					done();
				}
			});
		});

		it("input exclamation marks on registered type description has string suffix", function(done) {
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
					assert(value && value.length > 4 && value.substring(value.length-4) === " !!!");
					return Number(value.substring(0, value.length-4));
				},
				output:function(key,value) {
					return Math.round(value) + " !!!";
				}
			};
			const view = {
				a:"1 !!!"
			};
			core.activate(view);
			view.registerAnimatableProperty("a", { type: type });
			view.addAnimation({
				property:"a",
				duration:duration/2,
				from:"2 !!!",
				to:"2 !!!",
				blend:"absolute",
				onend: function() {
					done();
				}
			});
		});


		it("output exclamation marks on registered type is a number and not a string", function(done) {
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
					assert(!isNaN(value));
					assert({}.toString.call(value) !== {}.toString.call("string"));
					return Math.round(value) + " !!!";
				}
			};
			const view = { a:"1 !!!" };
			core.activate(view);
			view.registerAnimatableProperty("a", type);
			view.addAnimation({
				property:"a",
				duration:duration/2,
				from:"2 !!!",
				to:"2 !!!",
				blend:"absolute",
				onend: function() {
					done();
				}
			});
		});

		it("output exclamation marks on registered description type is a number and not a string", function(done) {
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
					assert(!isNaN(value));
					assert({}.toString.call(value) !== {}.toString.call("string"));
					return Math.round(value) + " !!!";
				}
			};
			const view = { a:"1 !!!" };
			core.activate(view);
			view.registerAnimatableProperty("a", { type: type });
			view.addAnimation({
				property:"a",
				duration:duration/2,
				from:"2 !!!",
				to:"2 !!!",
				blend:"absolute",
				onend: function() {
					done();
				}
			});
		});

	});

});
