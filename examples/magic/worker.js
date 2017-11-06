export function work() {
	const plot = function({iterations,radiusA,radiusB,a,b,d,thetaThreshold,divisions,index,leadingEdge,trailingEdge,ribbon}) {
		const tau = Math.PI * 2;
		const radiusC = Math.min(radiusA,radiusB);
		const start = index/divisions * tau;
		const end = start + tau / divisions;
		const span = end - start;
		const full = Math.round(tau / thetaThreshold);
		const divided = Math.round(full / divisions);
		const total = divided * divisions;
		const vertices = divided;
		const slice = span / vertices;
		const lissajous = true;
		const latitudeBands = vertices;
		const longitudeBands = 1;//ribbon;
		const positionArray = [];
		const normalArray = [];
		const coordArray = [];
		for (let latNumber = 0; latNumber < latitudeBands; latNumber++) { // vertices
			const theta1 = start + latNumber * slice;
			const theta2 = start + (latNumber + 1) * slice;
			for (let longNumber = 0; longNumber <= longitudeBands; longNumber++) { // ribbon
				const U = longNumber / longitudeBands;
				const V = theta1 / tau;
				const phi = longNumber * ribbon;
				let asymmetry = trailingEdge;
				if ((longNumber % 2)) asymmetry = leadingEdge;
				let vx1 = 0, vy1 = 0, vz1 = 0, vx2 = 0, vy2 = 0, vz2 = 0;
				let nx1 = 0, ny1 = 0, nz1 = 0, nx2 = 0, ny2 = 0, nz2 = 0;
				let i = iterations;
				do {
					const v = i * i * asymmetry, v1 = v + i * theta1, v2 = v + i * theta2, v3 = v + i * phi;
					const sin1 = lissajous ? Math.sin(b * v1) : Math.sin(v1);
					const cos1 = lissajous ? Math.sin(a * v1 + d) : Math.cos(v1);
					const sin2 = lissajous ? Math.sin(b * v2) : Math.sin(v2);
					const cos2 = lissajous ? Math.sin(a * v2 + d) : Math.cos(v2);
					const sin3 = lissajous ? Math.sin(b * v3) : Math.sin(v3);
					const cos3 = lissajous ? Math.sin(a * v3 + d) : Math.cos(v3);
					const x1 = sin1 * cos3 / i, 
						y1 = cos1 / i, 
						z1 = sin1 * sin3 / i, 
						x2 = sin2 * cos3 / i, 
						y2 = cos2 / i, 
						z2 = sin2 * sin3 / i;
					nx1 += x1;
					ny1 += y1;
					nz1 += z1;
					nx2 += x2;
					ny2 += y2;
					nz2 += z2;
					vx1 += radiusA * x1;
					vy1 += radiusB * y1;
					vz1 += radiusC * z1;
					vx2 += radiusA * x2;
					vy2 += radiusB * y2;
					vz2 += radiusC * z2;
				} while (--i);
				positionArray.push(vx1);
				positionArray.push(vy1);
				positionArray.push(vz1);
				positionArray.push(vx2);
				positionArray.push(vy2);
				positionArray.push(vz2);
				normalArray.push(nx1);
				normalArray.push(ny1);
				normalArray.push(nz1);
				normalArray.push(nx2);
				normalArray.push(ny2);
				normalArray.push(nz2);
				coordArray.push(U);
				coordArray.push(V);
				coordArray.push(U);
				coordArray.push(V);
			}
		}
		return {
			positionArray: positionArray,
			normalArray: normalArray,
			coordArray: coordArray
		};
	}

	self.addEventListener("message", function(e) {
		const result = plot(e.data);
		self.postMessage(result);
	}, false);
	
	return plot; // DRY plot function, used outside of worker
}