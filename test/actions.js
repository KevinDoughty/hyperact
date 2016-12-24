import { HyperGroup, HyperAnimation } from "../source/actions.js";
var assert = require("assert");

function isFunction(w) {
	return w && {}.toString.call(w) === "[object Function]";
}

describe("actions", function() {
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
	});

	describe("one", function() {
		beforeEach( function() {
		});
		it("group length", function() {
			const children = [1,2,3,4];
			const group = new HyperGroup(children);
			assert(group.group && group.group.length === children.length);
		});
	});
});