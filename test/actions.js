import { HyperGroup, HyperChain, HyperAnimation, HyperKeyframes } from "../source/actions.js";
var assert = require("assert");

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

describe("ACTIONS", function() {
	describe("zero", function() {
		it("function", function() {
			assert(isFunction(function() {}));
			assert(!isFunction({}));
			assert(!isFunction("[object Function]"));
		});
		it("HyperAnimation", function() {
			assert(isFunction(HyperAnimation));
		});
		it("HyperGroup", function() {
			assert(isFunction(HyperGroup));
		});
		it("HyperChain", function() {
			assert(isFunction(HyperChain));
		});
		it("HyperKeyframes", function() {
			assert(isFunction(HyperKeyframes));
		});
	});

	describe("one", function() {
		it("group length", function() {
			const children = [1,2,3,4];
			const group = new HyperGroup(children);
			assert(group.group && group.group.length === children.length);
		});
	});

	describe("two", function() {
		it("chain length", function() {
			const children = [1,2,3,4];
			const chain = new HyperChain(children);
			assert(chain.chain && chain.chain.length === children.length);
		});
	});

	describe("three", function() {
		it("keyframes length", function() {
			const children = [1,2,3,4];
			const keyframes = new HyperKeyframes({keyframes:children});
			assert(keyframes.keyframes && keyframes.keyframes.length === children.length);
		});
	});
});
