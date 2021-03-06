import * as hyperact from "../source/hyperact.js";

const assert = require("assert");

const duration = 0.05; // mocha timeout is 2 seconds


describe("IMPLICIT", function() {
	describe("initial", function() {
		it("initial animation, automatically registered", function() {
			const view = {
				a:0,
				animationForKey: function(key, value, previous) {
					return {
						duration: duration,
						from: value,
						to: value,
						blend:"absolute"
					};
				}
			};
			hyperact.activate(view);
			view.a = 1;
			hyperact.flushTransaction();
			assert.equal(view.presentation.a,2);
			view.removeAllAnimations();
		});

		it("initial animation, manually registered", function() {
			const view = {
				animationForKey: function(key, value, previous) {
					return {
						duration: duration,
						from: value,
						to: value,
						blend:"absolute"
					};
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("a");
			view.a = 1;
			hyperact.flushTransaction();
			assert.equal(view.presentation.a,2);
			view.removeAllAnimations();
		});

		it("initial animation, manually registered, counting display calls", function(done) {
			let count = 0;
			const view = {
				animationForKey: function(key, value, previous) {
					view.animationForKey = function() {};
					const error = count === 0 ? null : new Error("display should not have been called at the first invocation of animationForKey");
					done(error);
				},
				display: function() {
					count++;
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("a");
			view.a = 1;
			hyperact.flushTransaction();
			view.a = 2;
		});

		it("initial animation, manually registered, class, counting display calls", function(done) {
			let count = 0;
			class View {
				constructor() {
					hyperact.activate(this);
				}
				animationForKey(key, value, previous) {
					view.animationForKey = function() {};
					const error = count === 0 ? null : new Error("display should not have been called at the first invocation of animationForKey");
					done(error);
				}
				display() {
					count++;
				}
			}
			const view = new View();
			view.registerAnimatableProperty("a");
			view.a = 1;
			hyperact.flushTransaction();
			view.a = 2;
		});

		it("initial animation, array, automatically registered", function() {
			const view = {
				a:[0,0],
				animationForKey: function(key, value, previous) {
					return {
						type: new hyperact.HyperArray( new hyperact.HyperNumber(), 2),
						duration: duration,
						from: value,
						to: value,
						blend:"absolute"
					};
				}
			};
			hyperact.activate(view);
			view.a = [1,2];
			hyperact.flushTransaction();
			assert.equal(view.presentation.a[0],2);
			assert.equal(view.presentation.a[1],4);
			view.removeAllAnimations();
		});

		it("initial animation, array, manually registered", function() {
			const view = {
				a:[0,0],
				animationForKey: function(key, value, previous) {
					return {
						duration: duration,
						from: value,
						to: value,
						blend:"absolute"
					};
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("a", new hyperact.HyperArray( new hyperact.HyperNumber(), 2));
			view.a = [1,2];
			hyperact.flushTransaction();
			assert.equal(view.presentation.a[0],2);
			assert.equal(view.presentation.a[1],4);
			view.removeAllAnimations();
		});

	});


	describe("animationForKey", function() {
		it("animationForKey when flushed is applied", function() {
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
			hyperact.activate(view);
			view.x = 1;
			hyperact.flushTransaction();
			assert.equal(view.presentation.x,2);
			view.removeAllAnimations();
		});
		it("animationForKey property argument is correct", function(done) {
			const view = { x:0, animationForKey: function(property,value,previous,presentation) {
				const actual = property;
				const expected = "x";
				const error = actual === expected ? null : new Error("property is not correct:"+actual+"; should be:"+expected+";");
				done(error);
			}};
			hyperact.activate(view);
			view.x = 1;
			hyperact.flushTransaction();
		});
		it("animationForKey value argument is correct", function(done) {
			const view = { x:0, animationForKey: function(property,value,previous,presentation) {
				const actual = value;
				const expected = 1;
				const error = actual === expected ? null : new Error("value is not correct:"+actual+"; should be:"+expected+";");
				done(error);
			}};
			hyperact.activate(view);
			view.x = 1;
			hyperact.flushTransaction();
		});
		it("animationForKey previous argument is correct", function(done) {
			const view = { x:0, animationForKey: function(property,value,previous,presentation) {
				const actual = previous;
				const expected = 0;
				const error = actual === expected ? null : new Error("previous is not correct:"+actual+"; should be:"+expected+";");
				done(error);
			}};
			hyperact.activate(view);
			view.x = 1;
			hyperact.flushTransaction();
		});
		it("animationForKey presentation argument is correct", function(done) {
			const view = {
				x:0,
				animationForKey: function(property,value,previous,presentation) {
					const error = presentation > 0 && presentation < 1 ? null : new Error("presentation value should be between 0 and 1 but instead is:"+presentation+";");
					done(error);
				}
			};
			hyperact.activate(view);
			view.addAnimation({
				property:"x",
				from:0,
				to:1,
				blend:"absolute",
				additive:false,
				duration:duration
			});
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					view.x = 2;
				}
			});
		});
		it("sequential changes", function() {
			const view = {
				a:0,
				animationForKey: function(key) {
					return {
						duration: 1.0,
						from: 1.0,
						to: 1.0,
						blend: "absolute"
						// a naming or key property would allow this to match similar case in gcc test
					};
				}
			};
			hyperact.activate(view);
			view.a = 0.25;
			hyperact.flushTransaction();
			assert.equal(view.presentation.a,1.25);
			view.a = 0.5;
			hyperact.flushTransaction();
			assert.equal(view.presentation.a,2.5);
			view.a = 0.75;
			hyperact.flushTransaction();
			assert.equal(view.presentation.a,3.75);
			view.removeAllAnimations();
		});

	});

	describe("Twice", function() {
		it("animationForKey should not get called twice in one transaction", function() {
			const view = {
				a:0,
				animationForKey: function(key,value) {
					return {
						duration: 1.0,
						from: value,
						to: value,
						blend: "absolute"
						// a naming or key property would allow this to match similar case in gcc test
					};
				}
			};
			hyperact.activate(view);
			view.a = 1;
			view.a = 2;
			view.a = 3;
			hyperact.flushTransaction();
			assert.equal(view.presentation.a,6);
			view.removeAllAnimations();
		});
		it("animationForKey should not get called twice in one transaction part two", function() {
			let count = 0;
			const view = {
				a:0,
				animationForKey: function(key,value) {
					count++;
					return {
						duration: 1.0,
						from: value,
						to: value,
						blend: "absolute"
						// a naming or key property would allow this to match similar case in gcc test
					};
				}
			};
			hyperact.activate(view);
			view.a = 1;
			view.a = 2;
			view.a = 3;
			hyperact.flushTransaction();
			assert.equal(count,1);
			view.removeAllAnimations();
		});
		it("disableAnimation does not disable anything before it is called, different properties, flushed once", function() {
			let count = 0;
			const view = {
				a:0,
				b:0,
				animationForKey: function(key,value) {
					count++;
					return {
						duration: duration,
						from: value,
						to: value,
						blend: "absolute"
					};
				}
			};
			hyperact.activate(view);
			view.a = 1;
			hyperact.disableAnimation();
			view.b = 2;
			hyperact.flushTransaction();
			assert.equal(view.presentation.a,2);
			assert.equal(view.presentation.b,2);
			assert.equal(count,1);
			view.removeAllAnimations();
		});
		it("disableAnimation does not disable anything before it is called, different properties, flushed twice", function() {
			let count = 0;
			const view = {
				a:0,
				b:0,
				animationForKey: function(key,value) {
					count++;
					return {
						duration: duration,
						from: value,
						to: value,
						blend: "absolute"
					};
				}
			};
			hyperact.activate(view);
			view.a = 1;
			hyperact.flushTransaction();
			hyperact.disableAnimation();
			view.b = 2;
			hyperact.flushTransaction();
			assert.equal(view.presentation.a,2);
			assert.equal(view.presentation.b,2);
			assert.equal(count,1);
			view.removeAllAnimations();
		});
		it("disableAnimation does not disable anything before it is called, same property, flushed once", function() { // this one is hard
			let count = 0;
			const view = {
				a:0,
				animationForKey: function(key,value) {
					count++;
					return {
						duration: duration,
						from: value,
						to: value,
						blend: "absolute"
					};
				}
			};
			hyperact.activate(view);
			view.a = 1;
			hyperact.disableAnimation();
			view.a = 2;
			hyperact.flushTransaction();
			assert.equal(view.presentation.a,3);
			assert.equal(count,1);
			view.removeAllAnimations();
		});
		it("disableAnimation does not disable anything before it is called, same property, flushed twice", function() { // this one is easy
			let count = 0;
			const view = {
				a:0,
				animationForKey: function(key,value) {
					count++;
					return {
						duration: duration,
						from: value,
						to: value,
						blend: "absolute"
					};
				}
			};
			hyperact.activate(view);
			view.a = 1;
			hyperact.flushTransaction();
			hyperact.disableAnimation();
			view.a = 2;
			hyperact.flushTransaction();
			assert.equal(view.presentation.a,3);
			assert.equal(count,1);
			view.removeAllAnimations();
		});
	});



	describe("not deprecated animationForKey with delegate input output", function() {
		it("not deprecated animationForKey with input output when flushed is applied", function() {
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
			hyperact.activate(view);
			view.x = 1;
			hyperact.flushTransaction();
			assert.equal(view.presentation.x,2);
			view.removeAllAnimations();
		});
		it("not deprecated animationForKey with input output property argument is correct", function(done) {
			const view = {
				x:0,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				},
				animationForKey: function(property,value,previous,presentation) {
					const actual = property;
					const expected = "x";
					const error = actual === expected ? null : new Error("property is not correct:"+actual+"; should be:"+expected+";");
					done(error);
				}
			};
			hyperact.activate(view);
			view.x = 1;
		});
		it("not deprecated animationForKey with input output value argument is correct", function(done) {
			const view = {
				x:0,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				},
				animationForKey: function(property,value,previous,presentation) {
					const actual = value;
					const expected = 1;
					const error = actual === expected ? null : new Error("property is not correct:"+actual+"; should be:"+expected+";");
					done(error);
				}
			};
			hyperact.activate(view);
			view.x = 1;
		});
		it("not deprecated animationForKey with input output previous argument is correct", function(done) {
			const view = {
				x:0,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				},
				animationForKey: function(property,value,previous,presentation) {
					const actual = previous;
					const expected = 0;
					const error = actual === expected ? null : new Error("property is not correct:"+actual+"; should be:"+expected+";");
					done(error);
				}
			};
			hyperact.activate(view);
			view.x = 1;
		});
		it("not deprecated animationForKey with input output presentation argument is correct", function(done) {
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
				x:0,
				input: function(property,value) {
					return [value];
				},
				output: function(property,value) {
					return value[0];
				},
				animationForKey: function(property,value,previous,presentation) {
					const error = presentation > 0 && presentation < 1 ? null : new Error("presentation value should be between 0 and 1 but instead is:"+presentation+";");
					view.removeAllAnimations();
					done(error);
				}
			};
			hyperact.activate(view);
			view.addAnimation({
				property:"x",
				type: type,
				from:0,
				to:1,
				blend:"absolute",
				additive:false,
				duration:duration
			});
			view.addAnimation({
				duration: duration/2,
				onend: function() {
					view.x = 2;
				}
			});
		});

	});

	describe("initial state", function(done) {
		let numberType, customType, fancyType;
		beforeEach( function() {
			numberType = new hyperact.HyperNumber();
			customType = {
				add: function(a,b) {
					return numberType.add(a,b);
				},
				subtract: function(a,b) {
					return numberType.subtract(a,b);
				},
				zero: function(a) {
					return -1;
				},
				interpolate: function(a,b,progress) {
					return numberType.interpolate(a,b,progress);
				}
			};
			fancyType = { // The fancy type is similar to hyperstyle transform (translate, rotate, etc)
				add: function(a,b) {
					let prefix;
					if (a.substring(a.length-4) !== b.substring(b.length-4)) prefix = " ###";
					else prefix = a.substring(a.length-4);
					const A = a.substring(0,a.length-4) * 1;
					const B = b.substring(0,b.length-4) * 1;
					return numberType.add(A,B) + prefix;
				},
				subtract: function(a,b) {
					let prefix;
					if (a.substring(a.length-4) !== b.substring(b.length-4)) prefix = " ###";
					else prefix = a.substring(a.length-4);
					const A = a.substring(0,a.length-4) * 1;
					const B = b.substring(0,b.length-4) * 1;
					return numberType.subtract(A,B) + prefix;
				},
				zero: function(a) {
					if (!a) return "0 ...";
					const length = a.length;
					if (a.substring(length-3) === "!!!") return "0 !!!";
					return "0 ???";
				},
				interpolate: function(a,b,progress) {
					let prefix;
					if (a.substring(a.length-4) !== b.substring(b.length-4)) prefix = " ###";
					else prefix = a.substring(a.length-4);
					const A = a.substring(0,a.length-4) * 1;
					const B = b.substring(0,b.length-4) * 1;
					return numberType.interpolate(A,B,progress) + prefix;
				}
			};
		});
		it("if animation from value is undefined, default type zero is used", function() { // implications for transformType, can it be something other than matrix?
			const view = {
				animationForKey:function(property,value,previous,presentation) {
					return duration/2;
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("value");
			view.value = 1;
			hyperact.flushTransaction();
			assert.equal(view.animationCount,1);
			assert.equal(view.presentation.value,0);
			view.removeAllAnimations();
		});
		it("if animation from value is undefined, default type zero is used, midway", function(done) {
			const view = {
				animationForKey:function(property,value,previous,presentation) {
					return duration;
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("value");
			view.value = 1;
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const value = view.presentation.value;
					const error = value > 0 && value < 1 ? null : new Error("value is not greater than zero and less than one:"+value+";");
					view.removeAllAnimations();
					done(error);
				}
			});
		});


		it("if animation from value is undefined, custom type zero is used", function() { // implications for transformType, can it be something other than matrix?
			const view = {
				animationForKey:function(property,value,previous,presentation) {
					return duration/2;
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("value",customType);
			view.value = 1;
			hyperact.flushTransaction();
			assert.equal(view.animationCount,1);
			assert.equal(view.presentation.value,-1);
			view.removeAllAnimations();
		});
		it("if animation from value is undefined, custom type zero is used, midway", function(done) {
			const view = {
				animationForKey:function(property,value,previous,presentation) {
					return duration;
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("value",customType);
			view.value = 1;
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const animations = view.animations;
					const animation = animations[1] && animations[1].property === "value" ? animations[1] : animations[0];
					const value = view.presentation.value; // custom type zero is -1, so animation old minus new to zero should be -1 - 1 = -2 to 0, added to underlying value becomes -1 to 1, halfway should be close to 0
					const error = value > -0.25 && value < 0.25 ? null : new Error("value is not greater than -0.25 and less than 0.25:"+value+"; animation:"+JSON.stringify(animation)+";");
					view.removeAllAnimations();
					done(error); // value is about -0.5, underlying is 1, animation might be -1 to 0
				}
			});
		});
		it("if animation from value is undefined, custom type zero is used, midway, alternate", function(done) {
			const view = {
				animationForKey:function(property,value,previous,presentation) {
					return duration;
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("value",customType);
			view.value = 3;
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const animations = view.animations;
					const animation = animations[1] && animations[1].property === "value" ? animations[1] : animations[0];
					const value = view.presentation.value; // custom type zero is -1, so animation old minus new to zero should be -1 - 3 = -4 to 0, added to underlying value becomes -1 to 3, halfway should be close to 1
					const error = value > 0.75 && value < 1.25 ? null : new Error("value is not greater than 0.75 and less than 1.25:"+value+"; animation:"+JSON.stringify(animation)+";");
					view.removeAllAnimations();
					done(error); // value is about -0.5, underlying is 1, animation might be -1 to 0
				}
			});
		});


		it("if animation from value is undefined, fancy type zero is used", function() { // implications for transformType, can it be something other than matrix? // The fancy type is similar to hyperstyle transform (translate, rotate, etc)
			const view = {
				animationForKey:function(property,value,previous,presentation) {
					return duration/2;
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("value",fancyType);
			view.value = "1 !!!";
			hyperact.flushTransaction();
			assert.equal(view.animationCount,1);
			assert.equal(view.presentation.value,"0 !!!");
			view.removeAllAnimations();
		});
		it("if animation from value is undefined, fancy type zero is used, midway", function(done) { // The fancy type is similar to hyperstyle transform (translate, rotate, etc)
			const view = {
				animationForKey:function(property,value,previous,presentation) {
					return duration;
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("value",fancyType);
			view.value = "1 !!!";
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const value = view.presentation.value;
					const number = value.substring(0,value.length-4) * 1;
					const error = number > 0 && number < 1 ? null : new Error("number is not greater than 0 and less than 1:"+number+";");
					view.removeAllAnimations();
					done(error);
				}
			});
		});
		it("if animation from value is undefined, fancy type zero is used, midway, prefix correct", function(done) { // The fancy type is similar to hyperstyle transform (translate, rotate, etc)
			const view = {
				animationForKey:function(property,value,previous,presentation) {
					return duration;
				}
			};
			hyperact.activate(view);
			view.registerAnimatableProperty("value",fancyType);
			view.value = "1 !!!";
			view.addAnimation({
				duration:duration/2,
				onend: function() {
					const value = view.presentation.value;
					const prefix = value.substring(value.length-3);
					const error = prefix === "!!!" ? null : new Error("prefix is not correct:"+prefix+";");
					view.removeAllAnimations();
					done(error);
				}
			});
		});


	});

});
