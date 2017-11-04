const rAF = typeof window !== "undefined" && (
		window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		window.oRequestAnimationFrame
	) || function(callback) { setTimeout(callback, 0); };

function isFunction(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

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
	this.transactions = [];
	this.ticking = false;
	this.animationFrame;
	this.displayLayers = []; // renderLayer
	this.displayFunctions = []; // strange new implementation // I don"t want to expose delegate accessor on the controller, so I pass a bound function, easier to make changes to public interface.
	this.cleanupFunctions = [];
	this.invalidateFunctions = [];
}

HyperContext.prototype = {
	createTransaction: function(settings,automaticallyCommit) {
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
		this.transactions.push({ representedObject:transaction, automaticallyCommit:automaticallyCommit });
		if (automaticallyCommit) this.startTicking(); // Automatic transactions will otherwise not be closed if there is no animation or value set.
		return transaction;
	},
	currentTransaction: function() {
		const length = this.transactions.length;
		if (length) return this.transactions[length-1].representedObject;
		return this.createTransaction({},true);
	},
	beginTransaction: function(settings) { // TODO: throw on unclosed (user created) transaction
		return this.createTransaction(settings,false);
	},
	commitTransaction: function() {
		this.transactions.pop();
	},
	flushTransaction: function() { // TODO: prevent unterminated when called within display
		this.invalidateFunctions.forEach( function(invalidate) { // this won"t work if there are no animations thus not registered
			invalidate();
		});
	},
	disableAnimation: function(disable) { // If this is false, it enables animation
		if (disable !== false) disable = true; // because the function name is misleading
		const transaction = this.currentTransaction();
		transaction.disableAnimation = disable;
		this.startTicking();
	},

	registerTarget: function(target,display,invalidate,cleanup,layer = null) {
		this.startTicking();
		const index = this.targets.indexOf(target);
		if (index < 0) {
			this.targets.push(target);
			this.displayLayers.push(layer); // cachedPresentationLayer
			this.displayFunctions.push(display);
			this.cleanupFunctions.push(cleanup);
			this.invalidateFunctions.push(invalidate);
		}
	},

	deregisterTarget: function(target) {
		const index = this.targets.indexOf(target);
		if (index > -1) {
			this.targets.splice(index, 1);
			this.displayLayers.splice(index, 1); // cachedPresentationLayer
			this.displayFunctions.splice(index, 1);
			this.cleanupFunctions.splice(index, 1);
			this.invalidateFunctions.splice(index,1);
		}
	},

	startTicking: function() { // TODO: consider cancelling previous animation frame.
		if (!this.animationFrame) this.animationFrame = rAF(this.ticker.bind(this));
	},
	ticker: function() { // Need to manually cancel animation frame if calling directly.
		this.animationFrame = undefined;
		const targets = this.targets; // experimental optimization, traverse backwards so you can remove. This has caused problems for me before, but I don"t think I was traversing backwards.
		let i = targets.length;
		while (i--) {
			const target = targets[i];
			const display = this.displayFunctions[i]; // strange new implementation
			if (!target.animationCount) { // Deregister from inside ticker is redundant (removalCallback & removeAnimationInstance), but is still needed when needsDisplay()
				if (isFunction(display)) {
					const presentationLayer = target.presentation;
					display(presentationLayer);
				}
				this.invalidateFunctions[i](); // even stranger implementation
				this.deregisterTarget(target); // Deregister here to ensure one more tick after last animation has been removed. Different behavior than removalCallback & removeAnimationInstance, for example needsDisplay()
			} else {
				const presentationLayer = target.presentation;
				if (this.displayLayers[i] !== presentationLayer) { // suppress unnecessary displays
					if (target.animationCount) this.displayLayers[i] = presentationLayer; // cachedPresentationLayer
					//display.call(target.delegate);
					display(presentationLayer);
					this.invalidateFunctions[i](); // even stranger implementation
				}
				this.cleanupFunctions[i](); // New style cleanup in ticker.
			}
		}
		const length = this.transactions.length;
		if (length) {
			const transactionWrapper = this.transactions[length-1];
			if (transactionWrapper.automaticallyCommit) this.commitTransaction();
		}
		if (this.targets.length) this.startTicking();
	}
};