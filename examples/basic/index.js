import { decorate, HyperScale, typeForStyle } from "../../hyperact.js";

const transformType = typeForStyle("transform");

function One(element) {
	decorate(this);
	this.display = function() {
		document.getElementById(element).innerHTML = element +":<br>" +
			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" + 
			"own&nbsp;" + JSON.stringify(Object.getOwnPropertyNames(this)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
	}
}
One.prototype = {
	animationForKey: function(key,value,previous,presentation) {
		if (key === "transform") return {
			property: "transform",
			type: transformType,
			duration:1.0,
			from:previous,
			to:value
		}
		return 1.0;
	},
	input:function(key,value) {
		if (key === "transform") return transformType.fromCssValue(value);
		return value;
	},
	output:function(key,value) {
		if (key === "transform") return transformType.toCssValue(value);
		return Math.round(value);
	}
};
const one = new One("one");
one.registerAnimatableProperty("x");
one.registerAnimatableProperty("a");
one.layer["a"] = 1;
one.layer["b"] = 2;
one.transform = "translate3d(0px, 0px, 0px)";
one.registerAnimatableProperty("transform");
one.layer = {
	c: 3,
	//transform :"translate3d(0px, 0px, 0px)"
}
//one.transform = "translate3d(100px, 100px, 0px)";


const e = {
	property:"e",
	duration: 5,
	from: 5,
	to: 0,
	onend: function(finished) {
		console.log("basic onend:%s; one:%s; animations:%s;",JSON.stringify(this),JSON.stringify(one),JSON.stringify(one.animations));
	}
}
one.addAnimation(e);

console.log("basic one.animations:%s;",JSON.stringify(one.animations));


function Two(element) {
	decorate(this,this,{});
	this.display = function() {
		document.getElementById(element).innerHTML = element+":" + "<br>" + 
			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" + 
			"own&nbsp;" + JSON.stringify(Object.getOwnPropertyNames(this)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous) + "<br><br>";
	}
}
Two.prototype = {
	animationForKey: function(key,value,previous,presentation) {
		if (key === "transform") return {
			property: "transform",
			type: typeForStyle("transform"),
			duration:1.0,
			from:previous,
			to:value
		}
		return 1.0;
	},
	input:function(key,value) {
		if (key === "transform") return transformType.fromCssValue(value);
		return value;
	},
	output:function(key,value) {
		if (key === "transform") return transformType.toCssValue(value);
		if (key === "x") return Number(value).toFixed(1);
		return value;
	}
};
const two = new Two("two");
two.registerAnimatableProperty("x");
two.layer["a"] = 1;
two.layer["b"] = 2;
two.registerAnimatableProperty("transform");
two.layer = {
	c: 3,
	transform :"translate3d(100px, 100px, 0px)"
}

const three = {
	animationForKey: function(key,value,previous,presentation) {
		if (key === "transform") return {
			property: "transform",
			type: typeForStyle("transform"),
			duration:1.0,
			from:previous,
			to:value
		}
		return 1.0;
	},
	display:function() {
		document.getElementById("three").innerHTML = "three:<br>" +
			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" + 
			"own&nbsp;" + JSON.stringify(Object.getOwnPropertyNames(this)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
	},
	input:function(key,value) {
		if (key === "transform") return transformType.fromCssValue(value);
		if (key === "x" && value && value.length > 4 && value.substring(value.length-4) === " !!!") value = Number(value.substring(0, value.length-4));
		return value;
	},
	output:function(key,value) {
		if (key === "transform") return transformType.toCssValue(value);
		if (key === "x" && value) return Math.round(value) + " !!!";
		return value;
	}
}
decorate(three);
three.registerAnimatableProperty("x");
three.registerAnimatableProperty("transform");
three.layer = {
	c: 3,
	transform: "translate3d(100px, 100px, 0px)"
}

const four = {
	animationForKey: function(key,value,previous,presentation) {
		if (key === "transform") return {
			property: "transform",
			type: typeForStyle("transform"),
			duration:1.0,
			from:previous,
			to:value
		}
		return 1.0;
	},
	display:function() {
		document.getElementById("four").innerHTML = "four:<br>" +
			"keys&nbsp;" + JSON.stringify(Object.keys(four)) + "<br>" + 
			"own&nbsp;" + JSON.stringify(Object.getOwnPropertyNames(four)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
	},
	input:function(key,value) {
		if (key === "transform") return transformType.fromCssValue(value);
	},
	output:function(key,value) {
		if (key === "transform") return transformType.toCssValue(value);
	}
}
decorate(four,four,{scale:1});
four.registerAnimatableProperty("x");
four.registerAnimatableProperty("transform");
four.layer = {
	c: 3,
	transform:"translate3d(100px, 100px, 0px)"
}
four.registerAnimatableProperty("scale", {
	type: new HyperScale(),
	duration: 5.0
});
four.layer.scale = 2;

document.addEventListener("mousemove",function(e) {
	one.x = e.clientX;
	two.layer.x = e.clientX;
	three.x = e.clientX;
	four.layer.x = e.clientX;
	one.transform = "translate3d("+event.clientX+"px, "+event.clientY+"px, 0px)";
	three.transform = "translate3d("+event.clientX+"px, "+event.clientY+"px, 0px)";
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

document.addEventListener("mousedown",function(event) {

	one.addAnimation(cc);
	two.addAnimation(ccc);
	three.addAnimation(ccc);
	four.addAnimation(cc);

	one.addAnimation(dd);
	two.addAnimation(ddd);
	three.addAnimation(ddd);
	four.addAnimation(dd);

	one.addAnimation(ee);
	two.addAnimation(ee);
	three.addAnimation(ee);
	four.addAnimation(ee);

	two.layer.transform = "translate3d("+event.clientX+"px, "+event.clientY+"px, 0px)";
	four.layer.transform = "translate3d("+event.clientX+"px, "+event.clientY+"px, 0px)";

	one.addAnimation([
		{
			property:"transform",
			type:transformType,
			from:"translate3d(0px, 0px, 1px)",
			to:"translate3d(0px, 0px, 1px)",
			delta:"translate3d(0px, 0px, 0px)",
			duration:2.0,
			blend:"absolute"
		},
		{
			property:"a",
			from:1,
			to:1,
			duration:2.0,
			blend:"absolute"
		},
		{
			property:"b",
			from:1,
			to:1,
			duration:2.0,
			blend:"absolute"
		},
		{
			property:"c",
			from:1,
			to:1,
			duration:2.0,
			blend:"absolute"
		}
	]);

});