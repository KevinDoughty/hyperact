import { activate, disableAnimation, HyperArray, HyperNumber } from "../../hyperact.mjs";
import { work } from "./worker.js";

const glMatrix = require("gl-matrix");
const vec3 = glMatrix.vec3;
const mat3 = glMatrix.mat3;
const mat4 = glMatrix.mat4;

import createHistory from "history/createBrowserHistory";
const history = createHistory();

const numberOfWorkers = 4;

const iterations = 50;

const vertices = 2500;

const duration = 5.0;
const interval = 1.0;
const omega = 20;
const zeta = 0.75;

let state = {
	asymmetry:0,
	leadingEdge:0,
	trailingEdge:0,
	a:1,
	b:2,
	d:0,
	ribbon:0,
	radiusA:0,
	radiusB:0
};
if (history.location.state) state = history.location.state;

window.onpopstate = function(event) {
	state = event.state;
};

const lissajous = true;
const lissajousMax = 3;
const lissajousMin = 1;


const radius = 1.0;

const rotationX = 0;
const rotationY = 0;
const rotationZ = Math.PI / 2;

let toggling = false;

const tau = Math.PI * 2;
const thetaThreshold = tau/vertices;
const thickness = 0.002;
const additional = 0;
const base = 25;
const messy = false;

const stretchOnHold = false;

let running = true;

let timer;
let working = 0;
let queued = false;
let animated = false;
const workers = [];
let date = performance.now();
let incompleteLayer = [];
if (!numberOfWorkers) incompleteLayer = {
	positionArray:[],
	normalArray:[],
	coordArray:[]
};

const plot = work();
const blob = new Blob(["("+work.toString()+")()"], {type: "application/javascript"});
//const blob = new Blob(Array.prototype.map.call(document.querySelectorAll('script[type=\'text\/js-worker\']'), function (oScript) { return oScript.textContent; }),{type: 'text/javascript'});
const url = URL.createObjectURL(blob);

for (let i=0; i<numberOfWorkers; i++) {
	const worker = new Worker(window.URL.createObjectURL(blob));
	worker.addEventListener("message", (e) => {
		respond(i,e.data);
	}, false);
	workers.push(worker);
}

const canvas = document.createElement("canvas");
document.body.appendChild(canvas);

const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl"); 
if (!gl) throw new Error("no web gl");

const layer = manual();
const delegate = {
	display: function(presentation) {
		applyBuffers(presentation);
		drawScene();
	},
	animationForKey: function(key,value,previous) {
		if (key === "positionArray" || key === "normalArray") {
			 const animation = {
				type: new HyperArray( new HyperNumber, value.length),
				duration: duration,
				easing: easing
			};
			if (!previous.length) animation.from = value.map( function() {
				return 0;
			});
			return animation;
		}
	}
}
const controller = {};
activate(controller,delegate,layer);

const shaderProgram = initShaders();

const positionBuffer = initBuffer(3,layer.positionArray.slice(0));
const normalBuffer = initBuffer(3,layer.normalArray.slice(0));
const coordBuffer = initBuffer(2,layer.coordArray.slice(0));

gl.enable(gl.BLEND);
gl.blendEquation(gl.FUNC_ADD);
gl.blendFunc(gl.SRC_COLOR, gl.ONE); // http://delphic.me.uk/webglalpha.html // http://mrdoob.github.io/webgl-blendfunctions/blendfunc.html

randomize();
resize();
layout();

document.addEventListener("mousedown",mouseDown);
document.addEventListener("mouseup",mouseUp);
window.addEventListener("resize", resize);


function getShader(gl, id) { // http://learningwebgl.com/blog/?page_id=1217
	const shaderScript = document.getElementById(id);
	if (!shaderScript) return null;
	let str = "";
	let k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}
	let shader;
	if (shaderScript.type == "x-shader/x-fragment") shader = gl.createShader(gl.FRAGMENT_SHADER);
	else if (shaderScript.type == "x-shader/x-vertex") shader = gl.createShader(gl.VERTEX_SHADER);
	else return null;
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return shader;
	console.log(gl.getShaderInfoLog(shader));
	return null;
}

function initShaders() { // http://learningwebgl.com/blog/?p=1253
	const fragmentShader = getShader(gl, "shader-fs");
	const vertexShader = getShader(gl, "shader-vs");
	
	const shaderProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		console.log("Could not initialise shaders");
	}
	
	gl.useProgram(shaderProgram);
	
	shaderProgram.vertexPosition = gl.getAttribLocation(shaderProgram, "vertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPosition);

	shaderProgram.textureCoord = gl.getAttribLocation(shaderProgram, "textureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoord);

	shaderProgram.vertexNormal = gl.getAttribLocation(shaderProgram, "vertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormal);

	shaderProgram.perspectiveMatrix = gl.getUniformLocation(shaderProgram, "perspectiveMatrix");
	shaderProgram.modelMatrix = gl.getUniformLocation(shaderProgram, "modelMatrix");
	shaderProgram.normalMatrix = gl.getUniformLocation(shaderProgram, "normalMatrix");

	shaderProgram.ambientColor = gl.getUniformLocation(shaderProgram, "ambientColor");
	shaderProgram.lightingDirection = gl.getUniformLocation(shaderProgram, "lightingDirection");
	shaderProgram.directionalColor = gl.getUniformLocation(shaderProgram, "directionalColor");
	
	return shaderProgram;
}

function initBuffer(size,array) { // must plot before
	const buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(array), gl.DYNAMIC_DRAW); // gl.STATIC_DRAW
	buffer.itemSize = size;
	buffer.numItems = array.length / size;
	return buffer;
}

function applyBuffers(layer) {
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(layer.positionArray));
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(layer.normalArray));
	gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, new Float32Array(layer.coordArray));
}

function rotateMatrix(matrix,deltaTime) {
	mat4.rotate(matrix, matrix, rotationX, vec3.fromValues(1, 0, 0));
	mat4.rotate(matrix, matrix, rotationY, vec3.fromValues(0, 1, 0));
	mat4.rotate(matrix, matrix, rotationZ, vec3.fromValues(0, 0, 1));
}

function lightScene() {
	const light = [-1,-1,-1];
	const ambient = [0,0,0];
	const directional = [1,1,1];
	
	const adjusted = vec3.create();
	vec3.normalize(adjusted, light, adjusted);
	vec3.scale(adjusted, adjusted, -1);
	
	gl.uniform3f(shaderProgram.ambientColor, ambient[0], ambient[1], ambient[2]);
	gl.uniform3fv(shaderProgram.lightingDirection, adjusted);
	gl.uniform3f(shaderProgram.directionalColor, directional[0], directional[1], directional[2]);
}

function drawScene(deltaTime) {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	lightScene();
	
	const normalMatrix = mat3.create();
	const perspectiveMatrix = mat4.create();
	mat4.perspective(perspectiveMatrix, 50, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
	
	const modelMatrix = mat4.create();

	mat4.translate(modelMatrix, modelMatrix, vec3.fromValues(0, 0, -10));
	
	rotateMatrix(modelMatrix,deltaTime);

	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPosition, positionBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, coordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoord, coordBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormal, normalBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
	gl.uniformMatrix3fv(shaderProgram.normalMatrix, false, normalMatrix);
	gl.uniformMatrix4fv(shaderProgram.perspectiveMatrix, false, perspectiveMatrix);
	gl.uniformMatrix4fv(shaderProgram.modelMatrix, false, modelMatrix);
	
	gl.drawArrays(gl.TRIANGLE_STRIP, 0, positionBuffer.numItems);
}


function mouseUp(e) {
	if (stretchOnHold) {
		trailingEdge = leadingEdge;
		layout();
	}
}

function mouseDown(e) {
	running = !running && toggling;
	randomize();
	layout();
};

function manual() {
	const result = {};
	let nextPositionArray = [];
	let nextNormalArray = [];
	let nextCoordArray = [];
	const count = Math.max(1,numberOfWorkers);
	for (let index=0; index<count; index++) {
		const nextLayer = plot({iterations,radiusA:state.radiusA,radiusB:state.radiusB,a:state.a,b:state.b,d:state.d,thetaThreshold,divisions:count,index,leadingEdge:state.leadingEdge,trailingEdge:state.trailingEdge,ribbon:state.ribbon});
		nextPositionArray = nextPositionArray.concat(nextLayer.positionArray);
		nextNormalArray = nextNormalArray.concat(nextLayer.normalArray);
		nextCoordArray = nextCoordArray.concat(nextLayer.coordArray);
	}
	result.positionArray = nextPositionArray.slice(0);
	result.normalArray = nextNormalArray.slice(0);
	result.coordArray = nextCoordArray.slice(0);
	return result;
}

function randomize() {
	let asymmetry,leadingEdge,trailingEdge,a,b,d,ribbon;

	const numerator = Math.ceil(Math.random() * base);
	let denominator = numerator;
	while (denominator === numerator || numerator > denominator) denominator = Math.ceil(Math.random() * base * 2);
	if (messy) asymmetry = Math.random() * tau;
	else asymmetry = numerator/denominator * tau;
	if (Math.round(Math.random())) {
		asymmetry += Math.random() * additional;
	}
	leadingEdge = asymmetry;
	if (!stretchOnHold || running) trailingEdge = asymmetry;
	a = lissajousMin + Math.ceil(Math.random() * lissajousMax);
	b = a + 1;
	d = Math.random() * tau;
	ribbon = thickness * tau / a;
	state = {
		asymmetry,
		leadingEdge,
		trailingEdge,
		a,
		b,
		d,
		ribbon,
		radiusA:radius,
		radiusB:radius
	};
	history.replace({state});
}

function layout() {
	if (working) {
		queued = true;
		return;
	}
	queued = false;
	date = performance.now();

	if (numberOfWorkers) incompleteLayer = [];
	else incompleteLayer = {
		positionArray:[],
		normalArray:[],
		coordArray:[]
	};

	if (running) randomize();

	for (let index=0; index<numberOfWorkers; index++) {
		working++;
		workers[index].postMessage({iterations,radiusA:state.radiusA,radiusB:state.radiusB,a:state.a,b:state.b,d:state.d,thetaThreshold,divisions:numberOfWorkers,index,leadingEdge:state.leadingEdge,trailingEdge:state.trailingEdge,ribbon:state.ribbon});
	}

	if (!numberOfWorkers) respond(0, manual());
}


function respond(index,data) {
	if (numberOfWorkers) incompleteLayer[index] = data;
	else incompleteLayer = data;
	if (numberOfWorkers) working--;
	if (!numberOfWorkers || !working) {
		stroke();
		const now = performance.now();
		date = now;
		if (timer && timer.clearTimeout) timer.clearTimeout();
		if (timer && timer.cancelTimeout) timer.cancelTimeout();
		timer = null;
		const clock = Math.random() * interval * 1000;
		if (running) timer = setTimeout(layout, clock);
		else if (queued) layout();
	}
}

function stroke() {
	let previousPositionArray = layer.positionArray;
	let previousNormalArray = layer.normalArray;
	let previousCoordArray = layer.coordArray;
	if (numberOfWorkers) {
		let nextPositionArray = []
		let nextNormalArray = []
		let nextCoordArray = []
		for (let i=0; i<numberOfWorkers; i++) {
			const nextLayerArray = incompleteLayer[i];
			nextPositionArray = nextPositionArray.concat(nextLayerArray.positionArray);
			nextNormalArray = nextNormalArray.concat(nextLayerArray.normalArray);
			nextCoordArray = nextCoordArray.concat(nextLayerArray.coordArray);
		}
		layer.positionArray = nextPositionArray.slice(0);
		layer.normalArray = nextNormalArray.slice(0);
		layer.coordArray = nextCoordArray.slice(0);
	} else {
		layer.positionArray = incompleteLayer.positionArray.slice(0);
		layer.normalArray = incompleteLayer.normalArray.slice(0);
		layer.coordArray = incompleteLayer.coordArray.slice(0);
	}
}

function resize(e) {
	const width = window.innerWidth;
	const height = window.innerHeight;
	canvas.width = width;
	canvas.height = height;
	gl.viewportWidth = width;
	gl.viewportHeight = height;

	state = Object.assign({},state,{radiusA:radius,radiusB:radius});
	history.replace({state});
	delegate.display(controller.presentation);
}

function easing(progress) {
	const beta = Math.sqrt(1.0 - zeta * zeta);
	progress = 1 - Math.cos(progress * Math.PI / 2);
	progress = 1 / beta * Math.exp(-zeta * omega * progress) * Math.sin( beta * omega * progress + Math.atan(beta / zeta));
	return 1 - progress;
}