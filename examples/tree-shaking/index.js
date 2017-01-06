// import { activate } from "../../source/core.js";
// import { HyperScale } from "../../source/types.js";
import { activate, HyperScale } from "../../hyperact.mjs";

function One(element) {
	activate(this);
	this.display = function() {
		document.getElementById(element).innerHTML = element +":<br>" +
			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
	}
}
One.prototype = {
	animationForKey: function(key,value,previous,presentation) {
		return 1.0;
	},
	input:function(key,value) {
		return value;
	},
	output:function(key,value) {
		return Math.round(value);
	}
};
var one = new One("one");
one.registerAnimatableProperty("x");
one.layer["a"] = 1;
one.layer["b"] = 2;
one.layer = {
	c: 3
}
var e = {
	property:"e",
	duration: 5,
	from: 5,
	to: 0,
	onend: function(finished) {
		console.log("onend:%s; two:%s;",JSON.stringify(this),JSON.stringify(two));
	}
}
one.addAnimation(e);

console.log("animations:%s;",JSON.stringify(one.animations));

function Two(element) {
	activate(this,this,{});
	this.display = function() {
		document.getElementById(element).innerHTML = element+":" + "<br>" + 
			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous) + "<br><br>";
	}
}
Two.prototype = {
	animationForKey: function(key,value,previous,presentation) {
		return 1.0;
	},
	input:function(key,value) {
		return value;
	},
	output:function(key,value) {
		if (key === "x") return Number(value).toFixed(1);
		return value;
	}
};
var two = new Two("two");
two.registerAnimatableProperty("x");
two.layer["a"] = 1;
two.layer["b"] = 2;
two.layer = {
	c: 3
}

var three = {
	animationForKey: function(key,value,previous,presentation) {
		return 1.0;
	},
	display:function() {
		document.getElementById("three").innerHTML = "three:<br>" +
			"keys&nbsp;" + JSON.stringify(Object.keys(this)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
	},
	input:function(key,value) {
		if (key === "x" && value && value.length > 4 && value.substring(value.length-4) === " !!!") value = Number(value.substring(0, value.length-4));
		return value;
	},
	output:function(key,value) {
		if (key === "x" && value) return Math.round(value) + " !!!";
		return value;
	}
}
activate(three);
three.display();
three.registerAnimatableProperty("x");
three.layer = {
	c: 3
}

var four = {
	animationForKey: function(key,value,previous,presentation) {
		return 1.0;
	},
	display:function() {
		document.getElementById("four").innerHTML = "four:<br>" +
			"keys&nbsp;" + JSON.stringify(Object.keys(four)) + "<br>" + 
			"this:" + JSON.stringify(this) + "<br>" + 
			"this.layer:" + JSON.stringify(this.layer) + "<br>" + 
			"this.model:" + JSON.stringify(this.model) + "<br>" + 
			"this.presentation:" + JSON.stringify(this.presentation) + "<br>" + 
			"this.previous:" + JSON.stringify(this.previous)+ "<br><br>";
	}
}

activate(four,four,{scale:1});
four.registerAnimatableProperty("x");
four.layer = {
	c: 3
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
});

var c = {
	property: "c",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute",
	additive:false
}
var cc = {
	property: "c",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute"
}
var d = {
	property: "d",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute",
	additive:false
}
var dd = {
	property: "d",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute"
}
var e = {
	property: "e",
	duration:1.0,
	from:1,
	to:1,
	blend:"absolute",
	additive:false
}

document.addEventListener("mousedown",function(event) {
	one.addAnimation(c);
	two.addAnimation(cc);
	three.addAnimation(cc);
	four.addAnimation(c);

	one.addAnimation(d);
	two.addAnimation(dd);
	three.addAnimation(dd);
	four.addAnimation(d);

	one.addAnimation(e);
	two.addAnimation(e);
	three.addAnimation(e);
	four.addAnimation(e);
});