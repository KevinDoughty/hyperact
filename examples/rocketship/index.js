import { activateElement, transformType, registerAnimatableStyles } from "../../hyperact.mjs";

var duration = 2.5;
var counter = 0;
var toggled = true;
var rocket1 = document.getElementById("rocket1");
var rocket2 = document.getElementById("rocket2");
var planet = document.getElementById("planet");

registerAnimatableStyles({
	transform: transformType
});

layout(false);

activateElement(rocket1);
activateElement(rocket2);
activateElement(planet);

document.addEventListener('mousedown', function(e) {
	e.stopPropagation();
	e.preventDefault();
	layout(true);
},false);

function makeFrame(at,toggled) { // animations are additive but you specify values as you would normally
	var radius = 200;
	var theta;
	if (toggled) theta = (1 - at) * Math.PI * 1;
	else theta = at * Math.PI * -1;
	var x = Number( Math.cos(theta) * radius ).toFixed(4);
	var y = Number( Math.sin(theta) * radius ).toFixed(4);
	var r = theta * (180/Math.PI);
	return "translate3d("+x+"px,"+y+"px,0) rotate("+r+"deg)";
}

function makeFrames(toggled) {
	var length = 25;
	var i = length;
	var frames = [];
	while (i--) {
		var at = i/(length-1);
		frames.unshift(makeFrame(at,toggled));
	}
	return frames;
}

function layout(animate) {
	toggled = !toggled;
	
	if (rocket1) { // shorter path (result of additive blending)
		if (animate) rocket1.addAnimation({
			property:"transform",
			keyframes:makeFrames(toggled), // keyframes are automatically converted to relative values with default ink:"relative", to use values unmodified you must specify ink:"absolute"
			duration:duration,
			//easing: "cubic-bezier(.5,0,.5,1)", // default
		});
		if (toggled) {
			rocket1.style.transform = "translate3d(200px,0,0) rotate(-45deg)";
		} else {
			rocket1.style.transform = "translate3d(-200px,0,0) rotate(135deg)";
		}
	}

	if (rocket2) { // accelerates (result of additive blending)
		if (animate) rocket2.addAnimation({
			property:"transform",
			duration:duration,
			//easing: "cubic-bezier(.5,0,.5,1)", // default
			from: "rotate(180deg) translate3d(0,0,0) rotate(0deg)",
			to: "rotate(0deg) translate3d(0,0,0) rotate(0deg)", // have to specify all three values, even though we just rotate, because of the way additive transforms work.
		});
		if (toggled) {
			rocket2.style.transform = "rotate(180deg) translate3d(200px,0,0) rotate(-45deg)";
		} else {
			rocket2.style.transform = "rotate(0deg) translate3d(200px,0,0) rotate(-45deg)";
		}
	}
	
	if (planet) { // queued, total duration is longer (animations are not interrupted)
		if (animate) {
			var animation = planet.animationNamed("planetRotation"+(counter-1)); // get the previous animation
			if (animation) { // add a duplicate animation that starts when the previous one completes
				animation.startTime = animation.startTime + duration;
				planet.addAnimation(animation,"planetRotation"+(counter++));
			} else { // create the first planet rotation animation
				planet.addAnimation({
					property:"transform",
					duration:duration,
					fillMode:"backwards",
					//easing: "cubic-bezier(.5,0,.5,1)", // default
					from: "rotate(180deg)",
					to: "rotate(0deg)",
				},"planetRotation"+(counter++)); // animation name is optional second argument, if you need to access it later
			}
		}
		if (toggled) {
			planet.style.transform = "rotate(270deg)";
		} else {
			planet.style.transform = "rotate(90deg)";
		}
	}
}