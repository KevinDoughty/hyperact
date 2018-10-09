import * as core from "../source/core.js";
const assert = require("assert");
import { HyperNumber } from "../source/types.js";


const duration = 0.05; // mocha timeout is 2 seconds


describe("REGISTER", function() {

	describe("registerAnimatableProperty number type", function() {
		it("explicit, no registered type or description", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			layer.a = 1;
			controller.addAnimation({
				property:"a",
				from:2,
				to:2,
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a,3);
		});
		it("explicit, no registered type or description rather type declared in animation", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			layer.a = 1;
			controller.addAnimation({
				property:"a",
				type: new HyperNumber(),
				from:2,
				to:2,
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a,3);
		});
		it("explicit, registered type", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", new HyperNumber());
			layer.a = 1;
			controller.addAnimation({
				property:"a",
				from:2,
				to:2,
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a,3);
		});
		it("explicit, registered description", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: new HyperNumber()});
			layer.a = 1;
			controller.addAnimation({
				property:"a",
				from:2,
				to:2,
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a,3);
		});


		it("implicit, no registered type or description", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:2,
						to:2,
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			layer.a = 1;
			core.flushTransaction();
			assert.equal(controller.presentation.a,3);
		});
		it("implicit, no registered type or description rather type declared in animation", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:2,
						to:2,
						type: new HyperNumber(),
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			layer.a = 1;
			core.flushTransaction();
			assert.equal(controller.presentation.a,3);
		});
		it("implicit, registered type", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:2,
						to:2,
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", new HyperNumber());
			layer.a = 1;
			core.flushTransaction();
			assert.equal(controller.presentation.a,3);
		});
		it("implicit, registered description", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:2,
						to:2,
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: new HyperNumber()});
			layer.a = 1;
			core.flushTransaction();
			assert.equal(controller.presentation.a,3);
		});
	});


	describe("registerAnimatableProperty exclamation type", function() {

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


		it("Not deprecated explicit, no registered type or description rather type declared in animation", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			layer.a = "1 !!!";
			controller.addAnimation({
				property:"a",
				type: type,
				from:"2 !!!",
				to:"2 !!!",
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("Not deprecated explicit, wrong auto registered type and different animation type", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:"1 !!!" };
			core.activate(controller,delegate,layer);
			controller.addAnimation({
				property:"a",
				type: type,
				from:"2 !!!",
				to:"2 !!!",
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});

		it("explicit, registered type before", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
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
		it("explicit, registered description before", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
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

		it("explicit, registered type after", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			layer.a = "1 !!!";
			controller.registerAnimatableProperty("a", type);
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
		it("explicit, registered description after", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			layer.a = "1 !!!";
			controller.registerAnimatableProperty("a", {type: type});
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
		it("explicit, registered type much after", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:"1 !!!" };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
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
		it("explicit, registered description much after", function() {
			const controller = {};
			const delegate = {};
			const layer = {a:"1 !!!"};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
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

		it("Not deprecated implicit, no registered type or description rather type declared in animation", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						type: type,
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			layer.a = "1 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});

		it("Not deprecated implicit, wrong auto registered type and different animation type", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"4 !!!",
						to:"4 !!!",
						type: type,
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:"2 !!!" };
			core.activate(controller,delegate,layer);
			layer.a = "3 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"7 !!!");
		});

		it("implicit, registered type before", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
			layer.a = "1 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("implicit, registered description before", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
			layer.a = "1 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("implicit, registered type after... then set again", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"3 !!!",
						to:"3 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			layer.a = "2 !!!";
			controller.registerAnimatableProperty("a", type);
			layer.a = "4 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"7 !!!");
		});
		it("implicit, registered description after... then set again", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"3 !!!",
						to:"3 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			layer.a = "2 !!!";
			controller.registerAnimatableProperty("a", {type: type});
			layer.a = "4 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"7 !!!");
		});
		it("implicit, registered type much after, initial zero", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:"0 !!!" };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
			layer.a = "1 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("implicit, registered description much after, initial zero", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:"0 !!!" };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
			layer.a = "1 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});
	});





	describe("registerAnimatableProperty exclamation type but activated with wrong type first", function() {
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

		it("Not deprecated explicit, no registered type or description rather type declared in animation", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:"1 !!!"};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			controller.addAnimation({
				property:"a",
				type: type,
				from:"2 !!!",
				to:"2 !!!",
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("explicit, registered type much after", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:"1 !!!"};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
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
		it("explicit, registered description much after", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:"1 !!!"};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
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


		it("Not deprecated implicit, no registered type or description rather type declared in animation, initial zero", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						type: type,
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:"0 !!!"};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			layer.a = "1 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("implicit, registered type much after, initial zero", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:"0 !!!"};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
			layer.a = "1 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("implicit, registered description much after, initial zero", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:"0 !!!"};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
			layer.a = "1 !!!";
			core.flushTransaction();
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("implicit, registered type much after, initial zero, set before with wrong type", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:"0 !!!"};
			core.activate(controller,delegate,layer);
			layer.a = "1 !!!";
			core.flushTransaction();
			controller.registerAnimatableProperty("a", type);
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("implicit, registered description much after, initial zero, set before with wrong type", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:"0 !!!"};
			core.activate(controller,delegate,layer);
			layer.a = "1 !!!";
			core.flushTransaction();
			controller.registerAnimatableProperty("a", {type: type});
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("implicit, registered type much after, initial zero, set before with wrong type but not flushed", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:"0 !!!"};
			core.activate(controller,delegate,layer);
			layer.a = "1 !!!";
			controller.registerAnimatableProperty("a", type);
			assert.equal(controller.presentation.a,"3 !!!");
		});
		it("implicit, registered description much after, initial zero, set before with wrong type but not flushed", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:"2 !!!",
						to:"2 !!!",
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:"0 !!!"};
			core.activate(controller,delegate,layer);
			layer.a = "1 !!!";
			controller.registerAnimatableProperty("a", {type: type});
			assert.equal(controller.presentation.a,"3 !!!");
		});

	});



	describe("registerAnimatableProperty contained-in-an-array type", function() {

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
			output: function(property,value) {
				return [value];
			},
			input: function(property,value) {
				return value[0];
			}
		};


		it("Not deprecated explicit, no registered type or description rather type declared in animation", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			layer.a = [1];
			controller.addAnimation({
				property:"a",
				type: type,
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("Not deprecated explicit, wrong auto registered type and different animation type", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:[1] };
			core.activate(controller,delegate,layer);
			controller.addAnimation({
				property:"a",
				type: type,
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("explicit, registered type before", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
			layer.a = [1];
			controller.addAnimation({
				property:"a",
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("explicit, registered description before", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
			layer.a = [1];
			controller.addAnimation({
				property:"a",
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("explicit, registered type after", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			layer.a = [1];
			controller.registerAnimatableProperty("a", type);
			controller.addAnimation({
				property:"a",
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("explicit, registered description after", function() {
			const controller = {};
			const delegate = {};
			const layer = {};
			core.activate(controller,delegate,layer);
			layer.a = [1];
			controller.registerAnimatableProperty("a", {type: type});
			controller.addAnimation({
				property:"a",
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("explicit, registered type much after", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:[1] };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
			controller.addAnimation({
				property:"a",
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("explicit, registered description much after", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:[1] };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
			controller.addAnimation({
				property:"a",
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});

		it("Not deprecated implicit, no registered type or description rather type declared in animation", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						type: type,
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			layer.a = [1];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});

		it("Not deprecated implicit, wrong auto registered type and different animation type", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[4],
						to:[4],
						type: type,
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:[2] };
			core.activate(controller,delegate,layer);
			layer.a = [3];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],7);
		});
		it("implicit, registered type before, no initial", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
			layer.a = [1];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("implicit, registered description before, no initial", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
			layer.a = [1];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("implicit, registered type after... then set again", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[3],
						to:[3],
						duration:duration,
						blend:"absolute",
						additive: true
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			layer.a = [2];
			controller.registerAnimatableProperty("a", type);
			layer.a = [4];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],7);
		});
		it("implicit, registered description after... then set again", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[3],
						to:[3],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = {};
			core.activate(controller,delegate,layer);
			layer.a = [2];
			controller.registerAnimatableProperty("a", {type: type});
			layer.a = [4];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],7);
		});
		it("implicit, registered type much after, initial zero", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:[0] };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
			layer.a = [1];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("implicit, registered description much after, initial zero", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:[0] };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
			layer.a = [1];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("implicit, registered type much after, initial zero, set before register with wrong type", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:[0] };
			core.activate(controller,delegate,layer);
			layer.a = [1];
			core.flushTransaction();
			controller.registerAnimatableProperty("a", type);
			assert.equal(controller.presentation.a[0],3);
		});
		it("implicit, registered description much after, initial zero, set before register with wrong type", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:[0] };
			core.activate(controller,delegate,layer);
			layer.a = [1];
			core.flushTransaction();
			controller.registerAnimatableProperty("a", {type: type});
			assert.equal(controller.presentation.a[0],3);
		});
		it("implicit, registered type much after, initial zero, set before register with wrong type but not flushed", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:[0] };
			core.activate(controller,delegate,layer);
			layer.a = [1];
			controller.registerAnimatableProperty("a", type);
			assert.equal(controller.presentation.a[0],3);
		});
		it("implicit, registered description much after, initial zero, set before register with wrong type but not flushed", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:[0] };
			core.activate(controller,delegate,layer);
			layer.a = [1];
			controller.registerAnimatableProperty("a", {type: type});
			assert.equal(controller.presentation.a[0],3);
		});

	});





	describe("registerAnimatableProperty contained-in-an-array type but activated with wrong type first", function() {
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
			output: function(property,value) {
				return [value];
			},
			input: function(property,value) {
				return value[0];
			}
		};

		it("Not deprecated explicit, no registered type or description rather type declared in animation", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:[1] };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			controller.addAnimation({
				property:"a",
				type: type,
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("explicit, registered type much after, initial zero", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:[1] };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
			controller.addAnimation({
				property:"a",
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("explicit, registered description much after, initial zero", function() {
			const controller = {};
			const delegate = {};
			const layer = { a:[1] };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
			controller.addAnimation({
				property:"a",
				from:[2],
				to:[2],
				duration:duration,
				blend:"absolute"
			});
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});


		it("Not deprecated implicit, no registered type or description rather type declared in animation", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						type: type,
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:[0] };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a");
			layer.a = [1];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("implicit, registered type much after, initial zero", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:[0] };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", type);
			layer.a = [1];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});
		it("implicit, registered description much after, initial zero", function() {
			const controller = {};
			const delegate = {
				animationForKey: function(key) {
					return {
						from:[2],
						to:[2],
						duration:duration,
						blend:"absolute"
					};
				}
			};
			const layer = { a:[0] };
			core.activate(controller,delegate,layer);
			controller.registerAnimatableProperty("a", {type: type});
			layer.a = [1];
			core.flushTransaction();
			assert.equal(controller.presentation.a[0],3);
		});


	});





	describe("combination register", function() {

		it("combination of registered type and animationForKey with input output", function(done) {
			// registerAnimatableType !!!
			// registerPropertyType
			// registerPropertyAnimation
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
				x:3,
				animationForKey: function() {
					return {
						blend:"absolute",
						additive:false,
						duration:duration
					};
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("x",{ type: type });
			view.x = 4;
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.presentation.x;
					const error = (value > 3 && value < 4) ? null : new Error("registered value is not correct:"+value+";");
					done(error);
				}
			});
		});
		it("combination of registered type and animationForKey with input output unusual", function(done) {
			// registerAnimatableType !!!
			// registerPropertyType
			// registerPropertyAnimation
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
						blend:"absolute",
						additive:false,
						duration:duration
					};
				}
			};
			core.activate(view);
			view.x = 3;
			view.registerAnimatableProperty("x",{ type: type });
			view.x = 4;
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.presentation.x;
					const error = (value > 3 && value < 4) ? null : new Error("registered value is not correct:"+value+";");
					done(error);
				}
			});
		});

		it("combination of registered type and animationForKey with input output less unusual register before", function(done) {
			// registerAnimatableType !!!
			// registerPropertyType
			// registerPropertyAnimation
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
						blend:"absolute",
						additive:false,
						duration:duration
					};
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("x",{ type: type });
			view.x = 4;
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.presentation.x;
					const error = (value > 3 && value < 4) ? null : new Error("registered value is not correct:"+value+"; should be between 3 and 4");
					done(error);
				}
			});
		});

		it("not deprecated combination of registered type and animationForKey with input output (or alternately create registerPropertyType)", function(done) {
			// registerAnimatableType !!!
			// registerPropertyType
			// registerPropertyAnimation
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
				x:3,
				animationForKey: function() {
					return {
						blend:"absolute",
						additive:false,
						duration:duration
					};
				}
			};
			core.activate(view);
			view.registerAnimatableProperty("x",{ type: type });
			view.x = 4;
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					const value = view.presentation.x;
					const error = (value > 3 && value < 4) ? null : new Error("registered value is not correct:"+value+";");
					done(error);
				}
			});
		});


	});
});
