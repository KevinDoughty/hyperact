import { decorate, disableAnimation, HyperArray, HyperNumber } from "../../hyperact.js";

function elastic(progress,omega,zeta) {
	const beta = Math.sqrt(1.0 - zeta * zeta);
	const value = 1.0 / beta * Math.exp(-zeta * omega * progress) * Math.sin(beta * omega * progress + Math.atan(beta / zeta));
	return 1-value;
};

function easing(progress) {
	progress = 1 - Math.cos( progress * Math.PI / 2 );
	return elastic(progress, 15, 0.6);
}

const duration = 1.0;

class View {
	constructor(element) {
		this.element = element;
		this.iterations = 50;
		this.vertices = 500;
		this.radius = 75;
		this.value = 0;
		this.positionArray = this.plot();
		
		decorate(this);
		this.registerAnimatableProperty("positionArray");
	}
	animationForKey(key,value,previous) {
		if (key === "positionArray") return {
			type: new HyperArray(HyperNumber, this.vertices * 2),
			duration: duration,
			easing: easing
		}
	}
	plot() {
		const canvas = this.element;
		const width = canvas.width;
		const height = canvas.height;
		const centerX = width/2;
		const centerY = height/2;
		const phi = this.value * Math.PI;
		const array = [];
		const slice = (Math.PI * 2) / this.vertices;
		let j = this.vertices;
		let theta = 0;
		while (--j) { // array length is not vertices * 2 !!!
			theta -= slice;
			let i = this.iterations;
			let x = centerX;
			let y = centerY;
			do {
				const value = (i * theta) + (i * i * phi);
				x += ( Math.sin(value) / i ) * this.radius;
				y += ( Math.cos(value) / i ) * this.radius;
			} while (--i);
			array.push(x);
			array.push(y);
		}
		return array;
	}
	layout(value) {
		this.value = value;
		this.positionArray = this.plot();
		this.needsDisplay(); // temporary bug fix
	}
	display() {
		const canvas = this.element;
		const context = canvas.getContext("2d");
		const width = canvas.width;
		const height = canvas.height;
		context.clearRect(0, 0, width, height);
		const array = this.positionArray;
		const length = array.length;
		if (length > 1) {
			context.beginPath();
			context.moveTo(array[0],array[1]);
			for (let i = 2; i<length; i+=2) {
				context.lineTo(array[i],array[i+1]);
			}
			context.closePath();
			context.stroke();
		}
	}
}

class Slider {
	constructor(element) {
		decorate(this);
		this.element = element;
		this.value = 0;
		this.registerAnimatableProperty("value");
	}
	animationForKey(key,value,previous) {
		return {
			duration: duration,
			easing: easing
		}
	}
	layout(value) {
		this.value = value;
	}
	display() {
		this.element.value = this.value * 1000;
	}
}

let rococo = Math.random();

const input = document.createElement("input");
input.type = "range";
input.min = 0;
input.max = 1000;
input.value = rococo * 1000;
document.body.appendChild(input);
const slider = new Slider(input);

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);
const view = new View(canvas);

function resize() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	disableAnimation(true);
	view.layout(rococo);
	slider.layout(rococo);
};
resize();

window.addEventListener("resize", resize);
canvas.addEventListener("mousedown", (e) => {
	e.stopPropagation();
	e.preventDefault();
	rococo = Math.random();
	view.layout(rococo);
	slider.layout(rococo);
});
document.addEventListener("mouseup", (e) => {
	input.blur();
});
input.addEventListener("input", (e) => {
	rococo = input.value / 1000;
	view.layout(rococo);
	slider.layout(rococo);
});
input.addEventListener("change", (e) => {
	rococo = input.value / 1000;
	view.layout(rococo);
	slider.layout(rococo);
})
input.addEventListener("mousedown", (e) => {
	input.focus();
});