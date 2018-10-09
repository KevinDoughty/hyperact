import * as core from "../source/core.js";
const assert = require("assert");

const duration = 0.05; // mocha timeout is 2 seconds

const delegateMethods = ["display","animationForKey","input","output"];
const controllerMethods = ["addAnimation","animationNamed","needsDisplay","registerAnimatableProperty","removeAllAnimations", "removeAnimation"];
const controllerProperties = ["layer","presentation","model","previous","animations","animationNames","animationCount"];


describe("PRESENTATION", function() {
	describe("methods", function() {
		it("presentation does not include delegate methods, activate(view,view,view)", function() {
			const test = function(property,value) {
				return value; // delegate.input and delegate.output are expected to return a value
			};
			const view = {
				a:1,
				b:2,
				c:3,
				test:test
			};
			delegateMethods.forEach( function(key) {
				view[key] = test;
			});
			core.activate(view,view,view);
			core.flushTransaction();
			assert.deepEqual(view.presentation, { a:1, b:2, c:3, test:test });
		});
		it("presentation does not include delegate methods, activate(view,layer,layer)", function() {
			const test = function(property,value) {
				return value;
			};
			const view = {};
			const layer = { a:1, b:2, c:3, test:test };
			delegateMethods.forEach( function(key) {
				layer[key] = test;
			});
			controllerMethods.forEach( function(key) {
				layer[key] = test;
			});
			controllerProperties.forEach( function(key) {
				layer[key] = test;
			});
			core.activate(view,layer,layer);
			const expected = { a:1, b:2, c:3, test:test };
			controllerMethods.forEach( function(key) {
				expected[key] = test;
			});
			controllerProperties.forEach( function(key) {
				expected[key] = test;
			});
			core.flushTransaction();
			assert.deepEqual(view.presentation, expected);
		});
		it("presentation does include delegate and controller methods, activate(view,view,layer)", function() {
			const test = function() {

			};
			const view = {};
			const layer = { a:1, b:2, c:3, test:test };
			delegateMethods.forEach( function(key) {
				layer[key] = test;
			});
			controllerMethods.forEach( function(key) {
				layer[key] = test;
			});
			controllerProperties.forEach( function(key) {
				layer[key] = test;
			});
			core.activate(view,view,layer);
			const expected = { a:1, b:2, c:3, test:test };
			delegateMethods.forEach( function(key) {
				expected[key] = test;
			});
			controllerMethods.forEach( function(key) {
				expected[key] = test;
			});
			controllerProperties.forEach( function(key) {
				expected[key] = test;
			});
			core.flushTransaction();
			assert.deepEqual(view.presentation, expected);
		});
	});
	describe("set layer", function() {
		it("set layer with no animation, presentation, flushed", function() {
			const view = {
				a:1,
				b:2,
				c:3
			};
			core.activate(view);
			view.layer = {a:4, b:5, c:6};
			core.flushTransaction();
			assert.deepEqual(view.presentation, { a:4, b:5, c:6 });
		});
		it("implicit constant, presentation, flushed", function() {
			const layer = {
				a:1,
				b:2,
				c:3
			};
			const view = {
				animationForKey: function(key,value,previous) {
					return {
						duration:duration,
						from:1,
						to:1,
						blend:"absolute"
					};
				}
			};
			core.activate(view,view,layer);
			view.layer = {a:4, b:5, c:6};
			core.flushTransaction();
			assert.deepEqual(view.presentation, { a:5, b:6, c:7 });
		});
	});


});
