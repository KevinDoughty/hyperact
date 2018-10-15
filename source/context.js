import { FAKE_SET_BUG_FIX } from "./core.js";

const rAF = typeof window !== "undefined" && (
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	window.oRequestAnimationFrame
) || function(callback) { setTimeout(callback, 0); };

// function isFunction(w) { // WET
// 	return w && {}.toString.call(w) === "[object Function]";
// }

let now = Date.getTime;
if (Date.now) now = Date.now;
if (typeof window !== "undefined" && typeof window.performance !== "undefined" && typeof window.performance.now !== "undefined") now = window.performance.now.bind(window.performance);

export function HyperTransaction(settings) {
	this.time;// set in createTransaction so value is same as parent transaction and can be frozen
	this.disableAnimation = false; // value should probably be inherited from parent transaction
	this.duration;
	this.easing;
	//this.completionHandler; // would be nice
	if (settings) Object.keys(settings).forEach( function(key) {
		this[key] = settings[key];
	}.bind(this));
}

export function HyperContext() {
	this.targets = [];
	this.getPresentations = [];
	this.getAnimationCounts = [];
	this.transactions = [];
	this.ticking = false;
	this.animationFrame;
	this.displayLayers = []; // renderLayer
	this.displayFunctions = []; // strange new implementation // I don"t want to expose delegate accessor on the controller, so I pass a bound function, easier to make changes to public interface.
	this.cleanupFunctions = [];
	this.invalidateFunctions = [];
	this.force = [];
	this.changers = [];
}

HyperContext.prototype = {
	createTransaction: function(settings,automaticallyCommit) { // private
		const transaction = new HyperTransaction(settings);
		const length = this.transactions.length;
		let time = now() / 1000;
		if (length) time = this.transactions[length-1].representedObject.time; // Clock stops in the outermost transaction.
		Object.defineProperty(transaction, "time", { // Manually set time of transaction here to be not configurable
			get: function() {
				return time;
			},
			enumerable: true,
			configurable: false
		});
		this.transactions.push({ representedObject:transaction, automaticallyCommit:automaticallyCommit, flushers:[] });
		if (automaticallyCommit) this.startTicking(); // Automatic transactions will otherwise not be closed if there is no animation or value set.
		return transaction;
	},
	createTransactionWrapper: function(settings,automaticallyCommit) { // private

		const targets = this.targets;
		let i = targets.length;
		while (i--) {
			this.invalidateFunctions[i]();
		}

		const transaction = new HyperTransaction(settings);
		const length = this.transactions.length;
		let time = now() / 1000;
		if (length) time = this.transactions[length-1].representedObject.time; // Clock stops in the outermost transaction.
		Object.defineProperty(transaction, "time", { // Manually set time of transaction here to be not configurable
			get: function() {
				return time;
			},
			enumerable: true,
			configurable: false
		});
		const wrapper = { representedObject:transaction, automaticallyCommit:automaticallyCommit, flushers:[] };
		this.transactions.push(wrapper);
		if (automaticallyCommit) this.startTicking(); // Automatic transactions will otherwise not be closed if there is no animation or value set.
		return wrapper;
	},

	currentTransaction: function() {
		const length = this.transactions.length;
		if (length) return this.transactions[length-1].representedObject;
		if (FAKE_SET_BUG_FIX) return this.createTransactionWrapper({},true).representedObject;
		return this.createTransaction({},true);
	},
	beginTransaction: function(settings) { // TODO: throw on unclosed (user created) transaction
		if (FAKE_SET_BUG_FIX) return this.createTransactionWrapper(settings,false).representedObject;
		return this.createTransaction(settings,false);
	},
	commitTransaction: function() {
		this.clearChangers();
		if (FAKE_SET_BUG_FIX) this.clearFlushers();
		this.transactions.pop();
	},
	clearFlushers: function() {
		const wrapper = this.currentTransactionWrapper();
		wrapper.flushers.forEach( flusher => {
			flusher();
		});
		wrapper.flushers.length = 0;

		const targets = this.targets;
		let i = targets.length;
		while (i--) {
			this.invalidateFunctions[i]();
		}
	},
	flushTransaction: function() { // TODO: prevent unterminated when called within display // TODO: better yet, completely remove
		this.clearChangers();
		if (FAKE_SET_BUG_FIX) this.clearFlushers();
		else this.invalidateFunctions.forEach( function(invalidate) { // this won"t work if there are no animations thus not registered
			invalidate();
		});
	},
	currentTransactionWrapper: function() { // private // for FAKE_SET_BUG_FIX and unregistered controllers.
		const length = this.transactions.length;
		if (!length) return this.createTransactionWrapper({},true);
		return this.transactions[length-1]; // Hope the transaction was created sucessfully, I guess, for now.
	},
	registerFlusher: function(flusher) {
		this.currentTransactionWrapper().flushers.push(flusher);
	},
	registerChanger: function(changer) {
		this.changers.push(changer);
		this.startTicking();
	},
	clearChangers: function() {
		const changers = this.changers;
		let j = changers.length;
		while (j--) {
			changers[j]();
		}
		changers.length = 0;
	},
	disableAnimation: function(disable) { // If this is false, it enables animation
		if (disable !== false) disable = true; // because the function name is misleading
		const transaction = this.currentTransaction();
		transaction.disableAnimation = disable;
		this.startTicking();
	},
	registerTarget: function(target,getPresentation,getAnimationCount,display,invalidate,cleanup,force,layer = null) {
		this.startTicking();
		const index = this.targets.indexOf(target); // optimize me, have controller track.
		if (index < 0) {
			this.targets.push(target);
			this.getPresentations.push(getPresentation);
			this.getAnimationCounts.push(getAnimationCount);
			this.displayLayers.push(layer);
			this.displayFunctions.push(display);
			this.cleanupFunctions.push(cleanup);
			this.invalidateFunctions.push(invalidate);
			this.force.push(force);
		} else {
			this.force[index] = force;
		}
	},

	deregisterTarget: function(target) {
		const index = this.targets.indexOf(target);
		if (index > -1) {
			this.targets.splice(index, 1);
			this.getPresentations.splice(index, 1);
			this.getAnimationCounts.splice(index, 1);
			this.displayLayers.splice(index, 1);
			this.displayFunctions.splice(index, 1);
			this.cleanupFunctions.splice(index, 1);
			this.invalidateFunctions.splice(index,1);
			this.force.splice(index,1);
		}
	},

	startTicking: function() { // TODO: consider cancelling previous animation frame.
		if (!this.animationFrame) this.animationFrame = rAF(this.ticker.bind(this));
	},
	ticker: function() { // Need to manually cancel animation frame if calling directly.
		this.clearChangers();
		this.animationFrame = undefined;
		const targets = this.targets; // traverse backwards so you can remove.
		let i = targets.length;
		while (i--) {
			const target = targets[i];
			const display = this.displayFunctions[i]; // this DOES exist
			const animationCount = this.getAnimationCounts[i](); // should exist
			const getPresentation = this.getPresentations[i]; // should exist
			if (!animationCount) { // Deregister from inside ticker is redundant (removalCallback & removeAnimationInstance), but is still needed when needsDisplay()
				this.invalidateFunctions[i]();
				//if (isFunction(display)) { // does exist
				const presentationLayer = getPresentation();
				display(presentationLayer);
				//}
				this.deregisterTarget(target); // Deregister here to ensure one more tick after last animation has been removed. Different behavior than removalCallback & removeAnimationInstance, for example needsDisplay()
			} else {
				//this.invalidateFunctions[i](); // this will rerender every time
				const presentationLayer = getPresentation();
				if (this.force[i] || this.displayLayers[i] !== presentationLayer) { // suppress unnecessary displays
					this.displayLayers[i] = presentationLayer;
					display(presentationLayer); // does exist
					//this.invalidateFunctions[i]();
				}
				this.cleanupFunctions[i](); // New style cleanup in ticker.
			}
			this.force[i] = false;
		}
		const length = this.transactions.length;
		if (length) {
			const transactionWrapper = this.transactions[length-1];
			if (transactionWrapper.automaticallyCommit) this.commitTransaction();
		}
		if (this.targets.length) this.startTicking();
	}
};
