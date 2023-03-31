import { activate, disableAnimation, HyperArray, HyperNumber, currentTransaction } from "../../module/hyperact.js";
import { work } from "./worker.js";
const glMatrix = require("gl-matrix");
const vec3 = glMatrix.vec3;
const mat3 = glMatrix.mat3;
const mat4 = glMatrix.mat4;
const tau = Math.PI * 2;
import createHistory from "history/createBrowserHistory";
const history = createHistory();


const drawLines = false;

const numberOfWorkers = 4;

const iterations = 25;
const iterationDiff = 50;
let plotIterations = iterations;

const vertices = 1000;

const duration = 2.5;
const interval = 1.0;
const omega = 20;
const zeta = 0.75;

const lissajous = true;
const lissajousMax = 5;//5;//3;
const lissajousMin = 1;//3;//1;
const lissajousBase = 3;

const detailLevel = 10;

const radius = 1.0;

const thetaThreshold = tau/vertices / detailLevel;
const thickness = 0.0025;
let plotThickness = thickness;
const additional = 0.0001;
const messy = false;

const barely = false;
const barelyStart = 0.25 * tau;
const barelyAmount = 0.001;

const stretchOnHold = false;
let toggling = false;



const beginning = currentTransaction().time;
let state = {
	symmetry:0,
	leadingEdge:0,
	trailingEdge:0,
	a:1,
	b:2,
	d:0,
	ribbon:0,
	radiusA:0,
	radiusB:0,
	progress:0,
	light:[-1.0,-1.0,-1.0],
	ambient:[0.5,0.5,0.5],
	directional:[1,1,1],
	rotation:[0,0,Math.PI/2],
	animations:[],
	time:beginning
};
if (history.location.state) {
	const copy = Object.assign({},history.location.state);
	Object.keys(state).forEach( key => {
		if (typeof copy[key] === "undefined") {
			copy[key] = state[key];
		} else if (Array.isArray(copy[key])) copy[key] = copy[key].slice(0);
	});
	copy.animations.forEach(animation => {
		const length = animation.to.length;
		animation.type = new HyperArray(new HyperNumber, length);
		animation.easing = easing;
		//if (animation.property === "positionArray") animation.onend = onend;
		animation.startTime = animation.startTime + state.time - beginning;
	});
	state = copy;
}

window.onpopstate = function(event) {
	state = event.state;
};


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

function onend() {
	const animations = controller.animations;
	animations.forEach(animation => {
		animation.type = null;
		animation.easing = null;
		animation.onend = null;
		animation.startTime = animation.startTime - beginning;
	});
	state.animations = animations;
	history.replace({state});
}

const layer = Object.assign(manual(),{
	progress: [state.progress,0.0,0.0],
	light:state.light,//[-1.0,-1.0,-1.0],
	ambient:[0.5,0.5,0.5],
	directional:state.directional,//[1,1,1],
	rotation:[0,0,Math.PI/2]
});
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
			//if (key === "positionArray") animation.onend = onend;
			if (!previous || !previous.length) animation.from = value.map( function() {
				return 0;
			});
			return animation;
		} else if (key === "progress" || key === "light" || key === "directional") {
			 const animation = {
				type: new HyperArray( new HyperNumber, 3),
				duration: duration,
				easing: easing
			};
			if (!previous || !previous.length) animation.from = value.map( function() {
				return 0;
			});
			return animation;
		}
	}
}
const controller = {};
activate(controller,delegate,layer);
state.animations.forEach(animation => {
	controller.addAnimation(animation);
});
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
window.addEventListener("keydown",keyDown);
window.addEventListener("keypress",keyPress);






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

	shaderProgram.progress = gl.getUniformLocation(shaderProgram, "progress");

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

function rotateMatrix(matrix) {
	const presentation = controller.presentation;
	const rotation = presentation.rotation;
	mat4.rotate(matrix, matrix, rotation[0], vec3.fromValues(1, 0, 0));
	mat4.rotate(matrix, matrix, rotation[1], vec3.fromValues(0, 1, 0));
	mat4.rotate(matrix, matrix, rotation[2], vec3.fromValues(0, 0, 1));
}

function lightScene() {
	const presentation = controller.presentation;
	const light = presentation.light;
	const ambient = presentation.ambient;
	const directional = presentation.directional;

	const adjusted = vec3.create();
	vec3.normalize(adjusted, light, adjusted);
	vec3.scale(adjusted, adjusted, -1);

	gl.uniform3f(shaderProgram.ambientColor, ambient[0], ambient[1], ambient[2]);
	gl.uniform3fv(shaderProgram.lightingDirection, adjusted);
	gl.uniform3f(shaderProgram.directionalColor, directional[0], directional[1], directional[2]);
}
function colorScene() {
	const progress = controller.presentation.progress;
	gl.uniform3fv(shaderProgram.progress, progress);
}

function drawScene(deltaTime) {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	colorScene();
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

	if (drawLines) gl.drawArrays(gl.LINES, 0, positionBuffer.numItems);
	else gl.drawArrays(gl.TRIANGLE_STRIP, 0, positionBuffer.numItems);

}

function mouseDown(e) {
	running = !running && toggling;
	randomize();
	layout();
};

function mouseUp(e) {
	if (stretchOnHold) {
		trailingEdge = leadingEdge;
		layout();
	}
}
function keyPress(e) {
	if (e.keyCode < 20 && e.keyCode > 15) return;
	running = !running && toggling;
	randomize();
	layout();
}
function keyDown(e) {
	// if (e.keyCode > 19 || e.keyCode < 16) return;
	// running = !running && toggling;
	// randomize();
	// layout();
}

function manual() {
	const result = {};
	let nextPositionArray = [];
	let nextNormalArray = [];
	let nextCoordArray = [];
	const count = Math.max(1,numberOfWorkers);
	for (let index=0; index<count; index++) {
		const nextLayer = plot({iterations:plotIterations,radiusA:state.radiusA,radiusB:state.radiusB,a:state.a,b:state.b,d:state.d,thetaThreshold,divisions:count,index,leadingEdge:state.leadingEdge,trailingEdge:state.trailingEdge,ribbon:state.ribbon});
		nextPositionArray = nextPositionArray.concat(nextLayer.positionArray);
		nextNormalArray = nextNormalArray.concat(nextLayer.normalArray);
		nextCoordArray = nextCoordArray.concat(nextLayer.coordArray);
	}
	result.positionArray = nextPositionArray.slice(0);
	result.normalArray = nextNormalArray.slice(0);
	result.coordArray = nextCoordArray.slice(0);
	result.progress = [0.0,0.0,0.0];
	return result;
}

function randomize() {

	plotIterations = Math.max(iterations, iterations + Math.floor(iterationDiff * Math.random()) * (Math.round(Math.random()) ? 1 : -1));
	plotThickness = Math.max(thickness, thickness + (iterations - plotIterations));

	let symmetry,leadingEdge,trailingEdge,a,b,d,ribbon;

	const scale = 1.0;
	const x = Math.random() * 2 * scale - 1 * scale;
	const y = Math.random() * 2 * scale - 1 * scale;
	const z = -1;
	const light = [x,y,z];
	layer.light = light;

	const X = Math.random() * 1;
	const Y = Math.random() * 1;
	const Z = Math.random() * 1;
	const directional = [X,Y,Z];
	layer.directional = directional;

	const progress = Math.random();
	layer.progress = [progress,0,0];

	const numerator = Math.ceil(Math.random() * lissajousBase);
	const denominator = numerator + Math.ceil(Math.random() * lissajousBase);

	if (messy) symmetry = Math.random() * tau;
	else symmetry = numerator/denominator * tau;
	if (barely && Math.round(Math.random())) symmetry = barelyStart + ((numerator/denominator * tau) * barelyAmount);
	if (Math.round(Math.random())) {
		symmetry += Math.random() * additional;
	}
	leadingEdge = symmetry;
	if (!stretchOnHold || running) trailingEdge = symmetry;

	a = lissajousMin + Math.ceil(Math.random() * lissajousMax);
	b = a + 1;
	//d = Math.random() * tau;
	const dd = Math.floor(Math.random() * 255);
	d = dd * tau;

	ribbon = plotThickness * tau / a;

	const animations = [];
	animations.forEach(animation => {
		animation.type = null;
		animation.easing = null;
		animation.onend = null;
		animation.startTime = animation.startTime - beginning;
	});

	state = {
		symmetry,
		leadingEdge,
		trailingEdge,
		a,
		b,
		d,
		ribbon,
		radiusA:radius,
		radiusB:radius,
		progress,
		light,
		directional,
		animations,
		time:beginning
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
		workers[index].postMessage({iterations:plotIterations,radiusA:state.radiusA,radiusB:state.radiusB,a:state.a,b:state.b,d:state.d,thetaThreshold,divisions:numberOfWorkers,index,leadingEdge:state.leadingEdge,trailingEdge:state.trailingEdge,ribbon:state.ribbon});
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
		let nextPositionArray = [];
		let nextNormalArray = [];
		let nextCoordArray = [];
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
