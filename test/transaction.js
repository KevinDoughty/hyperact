import * as core from "../source/core.js";
const assert = require("assert");

const duration = 0.05;

describe("TRANSACTION", function() {

	describe("transactions", function() {

		it("multiple properties", function(done) { // The problem that prompted this test was failing to have a document.body.offsetHeight, preventing y value
			const one = {
				x:0,
				y:0,
				z:0
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
					const presentation = one.presentation;
					const error = (presentation.x > 0.25 && presentation.x < 0.75 && presentation.y > 0.25 && presentation.y < 0.75) ? null : new Error("multiple properties failing");
					done(error);
				}
			});
		});

		it("multiple properties class", function(done) { // The problem that prompted this test was failing to have a document.body.offsetHeight, preventing y value

			const One = class {
				constructor() {
					this.x = 0;
					this.y = 0;
					this.z = 0;
					core.activate(this);
				}
			};
			const one = new One();
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
					const presentation = one.presentation;
					const error = (presentation.x > 0.25 && presentation.x < 0.75 && presentation.y > 0.25 && presentation.y < 0.75) ? null : new Error("multiple properties failing");
					done(error);
				}
			});
		});

		// Implement these tests before refactoring core.js function implicitAnimation for TRANSACTION_DURATION_ALONE_IS_ENOUGH

		it("zero duration animations allowed from animationForKey", function(done) { // TODO: implement me, TRANSACTION_DURATION_ALONE_IS_ENOUGH
			const view = {
				x:0,
				animationForKey: function(key) {
					return {
						property:key,
						duration:0,
						from:2,
						to:2,
						blend:"absolute",
						onend: function() {
							const error = null;
							done(error);
						}
					};
				}
			};
			core.activate(view);
			view.x = 1;
		});
		it("transaction duration alone is sufficient", function(done) {
			const view = {
				x:0
			};
			core.activate(view);
			const transaction = core.currentTransaction();
			transaction.duration = duration / 2;
			view.addAnimation({
				duration: duration / 4,
				onend: function() {
					const pres = view.presentation;
					const error = (pres.x > 0 && pres.x < 1) ? null : new Error("transaction duration alone should be sufficient but is not because value is not between 0 and 1:"+pres.x+";");
					done(error);
				}
			});
			view.x = 1;
		});
		it("zero duration animations not triggered after setting values inside zero duration transaction with no animationForKey implementation", function() { // TODO: implement me, TRANSACTION_DURATION_ALONE_IS_ENOUGH
			const view = {
				x:0
			};
			core.activate(view);
			const transaction = core.currentTransaction();
			transaction.duration = 0;
			view.x = 1;
			core.flushTransaction();
			assert.equal(view.animationCount,0);
		});

		it("implicit animation duration is transaction duration when not specified", function(done) { // TODO: implement me, TRANSACTION_DURATION_ALONE_IS_ENOUGH
			const view = {
				x:0,
				y:0,
				animationForKey: function(key) {
					return {
						property:key,
						from:2,
						to:2,
						blend:"absolute",
						additive:true
					};
				}
			};
			core.activate(view);
			const transaction = core.currentTransaction();
			const transactionDuration = duration*2;
			transaction.duration = transactionDuration;
			view.x = 1;
			view.addAnimation({
				property:"y",
				duration:duration,
				from: 1,
				to: 1,
				onend: function(finished) {
					const presentation = view.presentation;
					const value = presentation.x;
					const animations = view.animations;
					const length = animations.length;
					const error = (value === 3 && length === 1 && animations[0].duration === transactionDuration) ? null : new Error("implicit animation duration is supposed to be transaction duration when not specified, but failed. value:"+value+"; length:"+length+"; duration should be:"+transactionDuration+"; actual:"+( length ? animations[0].duration : "fuct")+";");
					done(error);
				}
			});

		});


		it("transaction duration with animationForKey implemented but returning nothing", function(done) {
			const view = {
				x:0,
				animationForKey: function(property,value,previous,presentation) {
				}
			};
			core.activate(view);
			core.currentTransaction().duration = duration;
			view.x = 1;
			view.addAnimation({
				duration: duration / 2,
				onend: function() {
					const presentation = view.presentation.x;
					const error = presentation > 0 && presentation < 1 ? null : new Error("presentation value should be between 0 and 1 but instead is:"+presentation+";");
					done(error);
				}
			});
			core.flushTransaction();
		});
	});

	describe("transaction flushing", function() { // not 100% sure on these
		let view;
		beforeEach( function() {
			view = {
				a:0,
				b:1
			};
			core.activate(view);
		});

		it("presentation 0", function() {
			view.a = 2;
			assert.equal(view.presentation.a,0); // fail: 2 == 0
			core.flushTransaction();
			view.b = 3;
			core.flushTransaction();
		});
		it("presentation 1", function() {
			view.a = 2;
			assert.equal(view.presentation.b,1);
			core.flushTransaction();
			view.b = 3;
			core.flushTransaction();
		});
		it("presentation 2", function() {
			view.a = 2;
			core.flushTransaction();
			assert.equal(view.presentation.a,2);
			view.b = 3;
			core.flushTransaction();
		});
		it("presentation 3", function() {
			view.a = 2;
			core.flushTransaction();
			assert.equal(view.presentation.b,1);
			view.b = 3;
			core.flushTransaction();
		});
		it("presentation 4", function() {
			view.a = 2;
			core.flushTransaction();
			view.b = 3;
			assert.equal(view.presentation.a,2);
			core.flushTransaction();
		});
		it("presentation 5", function() {
			view.a = 2;
			core.flushTransaction();
			view.b = 3;
			assert.equal(view.presentation.b,1); // fail: 3 == 1
			core.flushTransaction();
		});
		it("presentation 6", function() {
			view.a = 2;
			core.flushTransaction();
			view.b = 3;
			core.flushTransaction();
			assert.equal(view.presentation.a,2);
		});
		it("presentation 7", function() {
			view.a = 2;
			core.flushTransaction();
			view.b = 3;
			core.flushTransaction();
			assert.equal(view.presentation.b,3);
		});
	});

	describe("nested transaction", function() { // not 100% sure about these // cannot assert in a transaction because everything that follows will timeout
		let view;
		beforeEach( function() {
			view = {
				a:0,
				b:1
			};
			core.activate(view);
		});
		it("presentation 0", function() {
			core.beginTransaction();
			view.a = 2;
			const value = view.presentation.a;
			core.beginTransaction();
			view.b = 3;
			core.commitTransaction();
			core.commitTransaction();
			assert.equal(value,0); // fail: 2 == 0
		});
		it("presentation 1", function() {
			core.beginTransaction();
			view.a = 2;
			const value = view.presentation.b;
			core.beginTransaction();
			view.b = 3;
			core.commitTransaction();
			core.commitTransaction();
			assert.equal(value,1);

		});
		it("presentation 2", function() {
			core.beginTransaction();
			view.a = 2;
			core.beginTransaction();
			const value = view.presentation.a;
			view.b = 3;
			core.commitTransaction();
			core.commitTransaction();
			assert.equal(value,0); // fail: 2 == 0
		});
		it("presentation 3", function() {
			core.beginTransaction();
			view.a = 2;
			core.beginTransaction();
			const value = view.presentation.b;
			view.b = 3;
			core.commitTransaction();
			core.commitTransaction();
			assert.equal(value,1);

		});
		it("presentation 4", function() {
			core.beginTransaction();
			view.a = 2;
			core.beginTransaction();
			view.b = 3;
			const value = view.presentation.a;
			core.commitTransaction();
			core.commitTransaction();
			assert.equal(value,0); // fail: 2 == 0

		});
		it("presentation 5", function() {
			core.beginTransaction();
			view.a = 2;
			core.beginTransaction();
			view.b = 3;
			const value = view.presentation.b;
			core.commitTransaction();
			core.commitTransaction();
			assert.equal(value,1); // fail: 3 == 1

		});
		it("presentation 6", function() {
			core.beginTransaction();
			view.a = 2;
			core.beginTransaction();
			view.b = 3;
			core.commitTransaction();
			const value = view.presentation.a;
			core.commitTransaction();
			assert.equal(value,0); // fail: 2 == 0

		});
		it("presentation 7", function() {
			core.beginTransaction();
			view.a = 2;
			core.beginTransaction();
			view.b = 3;
			core.commitTransaction();
			const value = view.presentation.b;
			core.commitTransaction();
			assert.equal(value,3);

		});
		it("presentation 8", function() {
			core.beginTransaction();
			view.a = 2;
			core.beginTransaction();
			view.b = 3;
			core.commitTransaction();
			core.commitTransaction();
			assert.equal(view.presentation.a,2);
		});
		it("presentation 9", function() {
			core.beginTransaction();
			view.a = 2;
			core.beginTransaction();
			view.b = 3;
			core.commitTransaction();
			core.commitTransaction();
			assert.equal(view.presentation.b,3);
		});
	});

});
