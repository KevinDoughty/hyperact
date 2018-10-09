import { activate, HyperScale } from "hyperact";


class One {
	constructor(element) {
		activate(this);
		this.a = 0;
		this.b = 0;
		this.x = 0;
		this.y = 0;
		this.z = 0;
		this.display = function() {
			document.getElementById(element).innerHTML = "one:" + JSON.stringify(this.presentation);
			// document.getElementById(element).innerHTML = //element +":<br>" +
			// 	"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" +
			// 	"own&nbsp;" + JSON.stringify(Object.getOwnPropertyNames(this)) + "<br>" +
			// 	"this:" + JSON.stringify(this) + "<br>" +
			// 	"this.layer:" + JSON.stringify(this.layer) + "<br>" +
			// 	"this.model:" + JSON.stringify(this.model) + "<br>" +
			// 	"this.presentation:" + JSON.stringify(this.presentation) + "<br>" +
			// 	"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
		}
		this.animationForKey = function() {
			return 1;
		}
	}
}
const one = new One("one");


const e = {
	property:"e",
	duration: 5,
	from: 5,
	to: 0,
	onend: function(finished) {
		console.log("onend:",this);
	}
}
one.addAnimation(e);




// function Two(element) {
// 	activate(this,this,{});
// 	this.display = function() {
// 		document.getElementById(element).innerHTML = element+":" + "<br>" +
// 			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" +
// 			"own&nbsp;" + JSON.stringify(Object.getOwnPropertyNames(this)) + "<br>" +
// 			"this:" + JSON.stringify(this) + "<br>" +
// 			"this.layer:" + JSON.stringify(this.layer) + "<br>" +
// 			"this.model:" + JSON.stringify(this.model) + "<br>" +
// 			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" +
// 			"this.previous:" + JSON.stringify(this.previous) + "<br><br>";
// 	}
// }
// Two.prototype = {
// 	animationForKey: function(key,value,previous,presentation) {
// 		// if (key === "transform") return {
// 		// 	property: "transform",
// 		// 	type: transformType,
// 		// 	duration:1.0,
// 		// 	from:previous,
// 		// 	to:value
// 		// }
// 		return 1.0;
// 	},
// 	input:function(key,value) {
// 		//if (key === "transform") return transformType.input(value);
// 		return value;
// 	},
// 	output:function(key,value) {
// 		//if (key === "transform") return transformType.output(value);
// 		if (key === "x") return Number(value).toFixed(1);
// 		return value;
// 	}
// };
// const two = new Two("two");
// two.registerAnimatableProperty("x");
// two.layer["a"] = 1;
// two.layer["b"] = 2;
// //two.registerAnimatableProperty("transform");
// two.layer = {
// 	c: 3,
// 	//transform :"translate3d(100px, 100px, 0px)"
// }
//
// const three = {
// 	animationForKey: function(key,value,previous,presentation) {
// 		// if (key === "transform") return {
// 		// 	property: "transform",
// 		// 	type: transformType,
// 		// 	duration:1.0,
// 		// 	from:previous,
// 		// 	to:value
// 		// }
// 		return 1.0;
// 	},
// 	display:function() {
// 		document.getElementById("three").innerHTML = "three:<br>" +
// 			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" +
// 			"own&nbsp;" + JSON.stringify(Object.getOwnPropertyNames(this)) + "<br>" +
// 			"this:" + JSON.stringify(this) + "<br>" +
// 			"this.layer:" + JSON.stringify(this.layer) + "<br>" +
// 			"this.model:" + JSON.stringify(this.model) + "<br>" +
// 			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" +
// 			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
// 	},
// 	input:function(key,value) {
// 		//if (key === "transform") return transformType.input(value);
// 		if (key === "x" && value && value.length > 4 && value.substring(value.length-4) === " !!!") value = Number(value.substring(0, value.length-4));
// 		return value;
// 	},
// 	output:function(key,value) {
// 		//if (key === "transform") return transformType.output(value);
// 		if (key === "x" && value) return Math.round(value) + " !!!";
// 		return value;
// 	}
// }
// // activate(three);
// // three.registerAnimatableProperty("x");
// // //three.registerAnimatableProperty("transform");
// three.layer = {
// 	c: 3,
// 	//transform: "translate3d(100px, 100px, 0px)"
// }
//
// const four = {
// 	// animationForKey: function(key,value,previous,presentation) {
// 	// 	if (key === "transform") return {
// 	// 		property: "transform",
// 	// 		type: transformType,
// 	// 		duration:1.0,
// 	// 		from:previous,
// 	// 		to:value
// 	// 	}
// 	// 	return 1.0;
// 	// },
// 	display:function() {
// 		document.getElementById("four").innerHTML = "four:<br>" +
// 			"keys&nbsp;" + JSON.stringify(Object.keys(four)) + "<br>" +
// 			"own&nbsp;" + JSON.stringify(Object.getOwnPropertyNames(four)) + "<br>" +
// 			"this:" + JSON.stringify(this) + "<br>" +
// 			"this.layer:" + JSON.stringify(this.layer) + "<br>" +
// 			"this.model:" + JSON.stringify(this.model) + "<br>" +
// 			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" +
// 			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
// 	},
// 	// input:function(key,value) {
// 	// 	if (key === "transform") return transformType.input(value);
// 	// },
// 	// output:function(key,value) {
// 	// 	if (key === "transform") return transformType.output(value);
// 	// }
// }
// activate(four,four,{scale:1});
// four.registerAnimatableProperty("x");
// //four.registerAnimatableProperty("transform");
// four.layer = {
// 	c: 3,
// 	//transform:"translate3d(100px, 100px, 0px)"
// }
// four.registerAnimatableProperty("scale", {
// 	type: new HyperScale(),
// 	duration: 5.0
// });
// four.layer.scale = 2;



document.addEventListener("mousemove",function(e) {
	one.x = e.clientX;
	//
	// //one.transform = "translate3d("+event.clientX+"px, "+event.clientY+"px, 0px)";
	// two.layer.x = e.clientX;
	// three.x = e.clientX;
	// //three.transform = "translate3d("+event.clientX+"px, "+event.clientY+"px, 0px)";
	// four.layer.x = e.clientX;
});

const cc = {
	property: "c",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute",
	additive:false
}
const ccc = {
	property: "c",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute"
}
const dd = {
	property: "d",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute",
	additive:false
}
const ddd = {
	property: "d",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute"
}
const ee = {
	property: "e",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute",
	additive:false
}
const aaa = {
	property: "a",
	duration:1.0,
	from:1,
	to:2,
	blend:"absolute",
	additive:true,
	delay:1.0
}
const bbb = {
	property: "b",
	duration:1.0,
	from:1,
	to:2,
	blend:"absolute",
	additive:true,
	delay:1.0,
	fillMode:"backwards"
}
one.registerAnimatableProperty("a");
one.registerAnimatableProperty("b");
one.registerAnimatableProperty("c");
one.registerAnimatableProperty("d");
one.registerAnimatableProperty("x");
one.registerAnimatableProperty("y");
one.registerAnimatableProperty("z");
document.addEventListener("mousedown",function(event) {
	one.x = event.clientX;
	one.y = event.clientY;
	one.addAnimation(aaa);
	one.addAnimation(bbb);


	// two.addAnimation(ccc);
	// two.addAnimation(ddd);
	// two.addAnimation(ee);
	//
	// //two.layer.transform = "translate3d("+event.clientX+"px, "+event.clientY+"px, 0px)";
	//
	//
	// three.addAnimation(ccc);
	// three.addAnimation(ddd);
	// three.addAnimation(ee);
	//
	//
	// four.addAnimation(cc);
	// four.addAnimation(dd);
	// four.addAnimation(ee);

	//four.layer.transform = "translate3d("+event.clientX+"px, "+event.clientY+"px, 0px)";


	// one.addAnimation([
	// 	{
	// 		property:"transform",
	// 		type:transformType,
	// 		from:"translate3d(0px, 0px, 1px)",
	// 		to:"translate3d(0px, 0px, 1px)",
	// 		duration:1.0,
	// 		blend:"absolute"
	// 	},
	// 	{
	// 		property:"a",
	// 		from:1,
	// 		to:1,
	// 		duration:2.0,
	// 		blend:"absolute"
	// 	},
	// 	{
	// 		property:"b",
	// 		from:1,
	// 		to:1,
	// 		duration:2.0,
	// 		blend:"absolute"
	// 	},
	// 	{
	// 		property:"c",
	// 		from:1,
	// 		to:1,
	// 		duration:2.0,
	// 		blend:"absolute"
	// 	}
	// ]);

});
