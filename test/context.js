import { HyperContext, HyperTransaction } from "../source/context.js";
var assert = require("assert");

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

class Target {
	presentation() {
		return {
			presentation:true
		};
	}
}




describe("context", function() {
	describe("zero", function() {
		it("function", function() {
			assert(isFunction(function() {}));
			assert(!isFunction({}));
			assert(!isFunction("[object Function]"));
		});
		it("HyperContext", function() {
			assert(isFunction(HyperContext));
		});
		it("HyperTransaction", function() {
			assert(isFunction(HyperTransaction));
		});
	});

	describe("one", function() { // public interface

		var context;

		beforeEach( function() {
			context = new HyperContext();
		});
		it("implicit outer transaction", function() {
			const transaction = context.currentTransaction();
			assert(transaction);
		});
		it("_automaticallyCommit is not exposed", function() {
			const transaction = context.currentTransaction();
			assert(transaction && !transaction._automaticallyCommit);
		});
		it("transaction time", function() {
			const transaction = context.currentTransaction();
			assert(transaction && (transaction.time || transaction.time === 0));
		});
		it("transactions can be nested", function() {
			const one = context.currentTransaction();
			const two = context.beginTransaction();
			const three = context.beginTransaction();
			assert(one && two && three && one.time === two.time && one.time === three.time);
			context.commitTransaction();
			context.commitTransaction();
		});
	});
	describe("two", function() { // private implementation details
		let context;
		let target;
		beforeEach( function() {
			context = new HyperContext();
			target = new Target();
		});
		it("registers and ticks", function(done) {
			target.animationCount = 0;
			const display = () => {
				done();
			};
			const invalidate = function() {};
			const cleanup = function() {};
			context.registerTarget(target, display, invalidate, cleanup);
		});
		it("cleanup to remove animations", function(done) {
			target.animationCount = 10;
			const display = () => {};
			const invalidate = function() {};
			const cleanup = () => {
				target.animationCount--;
				if (!target.animationCount) done();
			};
			context.registerTarget(target, display, invalidate, cleanup);
		});
		it("two targets registered", function() {
			target.animationCount = 0;
			const display = () => {};
			const invalidate = function() {};
			const cleanup = () => {};
			context.registerTarget(target, display, invalidate,cleanup);
			
			const secondTarget = new Target();
			secondTarget.animationCount = 0;
			context.registerTarget(secondTarget, display, invalidate, cleanup);
			assert(context.targets && context.targets.length === 2);
		});
		it("targets are deregistered", function(done) {
			target.animationCount = 10;
			const display = () => {};
			const invalidate = function() {};
			const cleanup = () => {
				target.animationCount--;
			};
			context.registerTarget(target, display, invalidate, cleanup);
			const secondTarget = new Target();
			secondTarget.animationCount = target.animationCount + 1;
			const secondDisplay = () => {
				if (context.targets.length === 1 && context.targets[0] === secondTarget) done();
			};
			const secondCleanup = () => {
				secondTarget.animationCount--;
			};
			context.registerTarget(secondTarget, secondDisplay, invalidate, secondCleanup);
		});

	});
});