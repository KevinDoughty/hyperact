var rAF = typeof window !== "undefined" && (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame
	) || function(callback) { setTimeout(callback, 0); }; // node has setTimeout

function isFunction(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

var now = Date.getTime;
if (Date.now) now = Date.now;
if (typeof window !== "undefined" && typeof window.performance !== "undefined" && typeof window.performance.now !== "undefined") now = window.performance.now.bind(window.performance);

function HyperTransaction(settings,automaticallyCommit) {
	this.time = now() / 1000; // value should probably be inherited from parent transaction
	this.disableAnimation = false; // value should probably be inherited from parent transaction
	this._automaticallyCommit = automaticallyCommit;
	this.settings = settings;
}

export default function HyperContext() {
	this.targets = [];
	this.transactions = [];
	this.ticking = false;
	this.animationFrame;
	this.displayLayers = []; // renderLayer
	this.displayFunctions = []; // strange new implementation // I don't want to expose delegate accessor on the controller, so I pass a bound function, easier to make changes to public interface.
	this.cleanupFunctions = [];
}

HyperContext.prototype = {
	createTransaction: function(settings,automaticallyCommit) {
		var transaction = new HyperTransaction(settings,automaticallyCommit);
		var length = this.transactions.length;
		if (length) { // Time freezes in transactions. A time getter should return transaction time if within one.
			transaction.time = this.transactions[length-1].time;
		}
		this.transactions.push(transaction);
		if (automaticallyCommit) this.startTicking(); // Automatic transactions will otherwise not be closed if there is no animation or value set.
		return transaction;
	},
	currentTransaction: function() {
		var length = this.transactions.length;
		if (length) return this.transactions[length-1];
		return this.createTransaction({},true);
	},
	beginTransaction: function(settings) { // TODO: throw on unclosed (user created) transaction
		this.createTransaction(settings,false);
	},
	commitTransaction: function() {
		this.transactions.pop();
	},
	flushTransaction: function() { // TODO: prevent unterminated when called within display
		//if (this.animationFrame) cAF(this.animationFrame); // Unsure if cancelling animation frame is needed.
		this.ticker(); // Probably should not commit existing transaction
	},
	disableAnimation: function(disable) { // If this is false, it enables animation
		if (disable !== false) disable = true; // because the function name is misleading
		var transaction = this.currentTransaction();
		transaction.disableAnimation = disable;
		this.startTicking();
	},

	registerTarget: function(target,display,cleanup) {
		this.startTicking();
		var index = this.targets.indexOf(target);
		if (index < 0) {
			this.targets.push(target);
			this.displayLayers.push(null); // cachedPresentationLayer !!! carefully rendering
			this.displayFunctions.push(display);
			this.cleanupFunctions.push(cleanup);
		}
	},

	deregisterTarget: function(target) {
		var index = this.targets.indexOf(target);
		if (index > -1) {
			this.targets.splice(index, 1);
			this.displayLayers.splice(index, 1); // cachedPresentationLayer
			this.displayFunctions.splice(index, 1);
			this.cleanupFunctions.splice(index, 1);
		}
	},
	startTicking: function() { // TODO: consider cancelling previous animation frame.
		if (!this.animationFrame) this.animationFrame = rAF(this.ticker.bind(this));
	},
	ticker: function() { // Need to manually cancel animation frame if calling directly.
		this.animationFrame = undefined;
		var targets = this.targets; // experimental optimization, traverse backwards so you can remove. This has caused problems for me before, but I don't think I was traversing backwards.
		var i = targets.length;
		while (i--) {
			var target = targets[i];
			var display = this.displayFunctions[i]; // strange new implementation
			if (!target.animationCount) { // Deregister from inside ticker is redundant (removalCallback & removeAnimationInstance), but is still needed when needsDisplay()
				if (isFunction(display)) {
					//var presentationLayer = target.presentation;
					display(); // new ensure one last time
				}
				this.deregisterTarget(target); // Deregister here to ensure one more tick after last animation has been removed. Different behavior than removalCallback & removeAnimationInstance, for example needsDisplay()
			} else {
				if (isFunction(display)) {
					var presentationLayer = target.presentation;
					if (this.displayLayers[i] !== presentationLayer) { // suppress unnecessary displays
						if (target.animationCount) this.displayLayers[i] = presentationLayer; // cachedPresentationLayer
						//display.call(target.delegate);
						display();
					}
				}
				this.cleanupFunctions[i](); // New style cleanup in ticker.
			}
		}

		var length = this.transactions.length;
		if (length) {
			var transaction = this.transactions[length-1];
			if (transaction._automaticallyCommit) this.commitTransaction();
		}
		if (this.targets.length) this.startTicking();
	}
};