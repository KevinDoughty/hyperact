import { activate } from "../../hyperact.js";

function push(progress) {
	var result = 1 + 0.5 * (1-progress) * Math.sin(progress * Math.PI * 2);
	return Number(result).toFixed(4);
}

var shorter = 1;
var longer = 10;

function Hydrogen(kdMeson,electron) {
	activate(this);
	
	this.kdMeson = kdMeson;
	this.electron = electron;
	this.shiftKeyPressed = false;
	this.radius = 200;
	this.value = 0;
	this.outer = 0;
	this.compensate = 0;
	this.x = 0;
	this.y = 0;
	
	this.registerAnimatableProperty("x");
	this.registerAnimatableProperty("y");
	this.registerAnimatableProperty("outer");
	this.registerAnimatableProperty("value");
	this.registerAnimatableProperty("compensate");
}

Hydrogen.prototype.layout = function() {
	var width = document.body.offsetWidth;
	var height = document.body.offsetHeight;
	var centerX = width/2;
	var centerY = height/2;
	
	var presentation = this.presentation;
	var presentationValue = presentation.value;
	
	var amount = Math.random() * Math.PI * 2;
	var destinationValue = (amount) - Math.PI;
	
	var ratio = shorter/longer;
	var travelled = ratio * Math.PI * 2;
	this.destinationX = Math.cos(destinationValue + travelled) * this.radius + centerX;
	this.destinationY = Math.sin(destinationValue + travelled) * this.radius + centerY;

	var oldX = Math.cos(presentationValue) * this.radius + centerX;
	var oldY = Math.sin(presentationValue) * this.radius + centerY;
	var newX = Math.cos(destinationValue) * this.radius + centerX;
	var newY = Math.sin(destinationValue) * this.radius + centerY;
	
	this.oldX = oldX;
	this.oldY = oldY;
	this.newX = newX;
	this.newY = newY;
	
	var duration = shorter * (this.shiftKeyPressed ? 5 : 1);
	
	var compensate = presentation.compensate;
	this.outer = destinationValue - compensate;
	
	this.addAnimation({
		property: "x",
		duration: duration,
		from: oldX,
		to: newX
	});
	this.addAnimation({
		property: "y",
		duration: duration,
		from: oldY,
		to: newY
	});
	this.addAnimation({
		property:"value",
		duration: longer,
		from:destinationValue,
		to:destinationValue + Math.PI * 2,
		iterations:Infinity,
		easing:"linear",
		blend:"absolute"
	},"revolution");
};

Hydrogen.prototype.animationForKey = function(key,value) {
	return shorter * (this.shiftKeyPressed ? 5 : 1);
}

Hydrogen.prototype.toggleKeys = function(e) {
	this.shiftKeyPressed = e.shiftKey;
}

Hydrogen.prototype.display = function() {
	var width = document.body.offsetWidth;
	var height = document.body.offsetHeight;
	var centerX = width/2;
	var centerY = height/2;
	
	if (this.kdMeson) {
		var x = this.x + Math.cos(this.value) * this.radius + centerX; // both x and value are interpolated
		var y = this.y + Math.sin(this.value) * this.radius + centerY; // both y and value are interpolated
		var innerString = "translate3d("+x+"px, "+y+"px, 0)";
		this.kdMeson.style.webkitTransform = innerString;
		this.kdMeson.style.transform = innerString;
	}
	if (this.electron) {
		var outerX = Math.cos(this.outer + this.compensate) * this.radius + centerX; // outer is interpolated
		var outerY = Math.sin(this.outer + this.compensate) * this.radius + centerY; // outer is interpolated
		var outerString = "translate3d("+outerX+"px, "+outerY+"px, 0)";
		this.electron.style.webkitTransform = outerString;
		this.electron.style.transform = outerString;
	}
}

var kdMeson = document.getElementById("kdMeson");
var electron = document.getElementById("electron");

var hydrogen = new Hydrogen(kdMeson,electron);

hydrogen.addAnimation({
	property:"value",
	duration: longer,
	from:0,
	to:Math.PI * 2,
	iterations:Infinity,
	easing:"linear",
	blend:"absolute"
},"revolution");

hydrogen.addAnimation({
	property:"compensate",
	duration: longer,
	from:-Math.PI * 2,
	to:0,
	iterations:Infinity,
	easing:"linear"
},"compensate");

document.addEventListener("mousedown", hydrogen.layout.bind(hydrogen));
document.addEventListener('keydown',hydrogen.toggleKeys.bind(hydrogen));
document.addEventListener('keyup',hydrogen.toggleKeys.bind(hydrogen));