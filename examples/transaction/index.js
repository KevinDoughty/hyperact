import { activate, activateElement, HyperScale, transformType, currentTransaction, registerAnimatableStyles } from "../../hyperact.mjs";

registerAnimatableStyles({ // an inconvenience that will eventually allow tree shaking unused css animation types
	transform: transformType
});

function elastic(progress,omega,zeta) {
	const beta = Math.sqrt(1.0 - zeta * zeta);
	const value = 1.0 / beta * Math.exp(-zeta * omega * progress) * Math.sin(beta * omega * progress + Math.atan(beta / zeta));
	return 1-value;
};

function easing(progress) {
	progress = 1 - Math.cos( progress * Math.PI / 2 );
	return elastic(progress, 15, 0.6);
}


const zero = {
	element: document.getElementById("zero"),
	x: 0,
	y: 0,
	display: function() {
		this.element.style.transform = "translate3d("+this.x+"px,"+this.y+"px,0px)";
	}
}
zero.element.innerHTML = "zero";
activate(zero);


class One {
	constructor(name) {
		this.element = document.getElementById(name);
		this.element.innerHTML = name;
		this.x = 0;
		this.y = 0;
		activate(this);
	}
	display() {
		this.element.style.left = this.x + "px";
		this.element.style.top = this.y + "px";
	}
}


class Two {
	constructor(name) {
		this.element = document.getElementById(name);
		this.element.innerHTML = name;
		this.x = 0;
		this.y = 0;
		activate(this);
	}
	display() {
		this.element.style.transform = "translate3d("+this.x+"px,"+this.y+"px,0px)";
	}
}


class Three {
	constructor(name) {
		this.x = 0;
		this.y = 0;
		this.transform = "translate3d(0px,0px,0px)";
		activate(this);
		this.element = document.getElementById(name); // setting this after activate is a bug fix for presentation layer that does not happen with two...
		this.element.innerHTML = name;
	}
	input(key,value) { // Sad workaround
		if (key === "transform") return transformType.input(value);
		return value;
	}
	output(key,value) { // Sad workaround
		if (key === "transform") return transformType.output(value);
		return Math.round(value);
	}
	animationForKey(key,value,previous) {
		if (key === "x") return {
			property:"transform",
			type:transformType,
			from:"translate3d("+previous+"px,0px,0px)",
			to:"translate3d("+value+"px,0px,0px)"
		}
		if (key === "y") return {
			property:"transform",
			type:transformType,
			from:"translate3d(0px,"+previous+"px,0px)",
			to:"translate3d(0px,"+value+"px,0px)"
		}
	}
	display() {
		this.element.style.left = this.x + "px";
		this.element.style.top = this.y + "px";
		this.element.style.transform = this.transform; // animating a different key in response to a change in another is not going to allow sub-pixel antialiasing if I have to implement display like this
	}
}


class Four {
	constructor(name) {
		this.transform = "translate3d(0px,0px,0px)";
		activate(this);
		this.registerAnimatableProperty("transform",transformType); // default is number
		this.element = document.getElementById(name); // setting this after activate is a bug fix for presentation layer that does not happen with two...
		this.element.innerHTML = name;
	}
	input(key,value) { // Sad workaround
		if (key === "transform") return transformType.input(value);
		return value;
	}
	output(key,value) { // Sad workaround
		if (key === "transform") return transformType.output(value);
		return Math.round(value);
	}
	display() {
		this.element.style.transform = this.transform;
	}
}


class Five {
	constructor(name) {
		this.transform = "translate3d(0px,0px,0px)";
		activate(this);
		this.registerAnimatableProperty("transform",transformType); // default is number
		this.element = document.getElementById(name); // setting this after activate is a bug fix for presentation layer that does not happen with two...
		this.element.innerHTML = name;
	}
	input(key,value) { // Sad workaround
		if (key === "transform") return transformType.input(value);
		return value;
	}
	output(key,value) { // Sad workaround
		if (key === "transform") return transformType.output(value);
		return Math.round(value);
	}
	animationForKey(key) {
		return null;
	}
	display() {
		this.element.style.transform = this.transform;
	}
}


const one = new One("one");
const two = new Two("two");
const three = new Three("three");
const four = new Four("four");
const five = new Five("five");
const six = document.getElementById("six");
six.innerHTML = "six";
activateElement(six);


document.addEventListener("keydown", e => {
	const keyCode = e.keyCode;
	if (keyCode > 47 && keyCode < 58) {
		const width = document.body.offsetWidth;
		const height = document.body.offsetHeight;
		const duration = keyCode - 48;

		const transaction = currentTransaction();
		transaction.duration = duration;
		transaction.easing = easing;

		zero.x = Math.random() * width;
		zero.y = Math.random() * height;
		one.x = Math.random() * width;
		one.y = Math.random() * height;
		two.x = Math.random() * width;
		two.y = Math.random() * height;
		three.x = Math.random() * width;
		three.y = Math.random() * height;
		four.transform = "translate3d("+ (Math.random()*width) +"px,"+ (Math.random()*height) + "px,0px)";
		const previous = five.transform;
		const next = "translate3d("+ (Math.random()*width) +"px,"+ (Math.random()*height) + "px,0px)";
		five.addAnimation({
			property:"transform",
			type:transformType,
			from:previous,
			to:next
		});
		five.transform = next;
		six.style.transform = "translate3d("+ (Math.random()*width) +"px,"+ (Math.random()*height) + "px,0px)";

	}
});