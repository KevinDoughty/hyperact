function isFunction(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

export function HyperNumber(settings) {
	this.debug = "HyperNumber";
}
HyperNumber.prototype = {
	constructor: HyperNumber,
	zero: function() {
		return 0;
	},
	add: function(a,b) {
		return a + b;
	},
	subtract: function(a,b) { // subtract b from a
		return a - b;
	},
	interpolate: function(a,b,progress) {
		return a + (b-a) * progress;
	}
};

export function HyperScale(settings) {
	this.debug = "HyperScale";
}
HyperScale.prototype = {
	constructor: HyperScale,
	zero: function() {
		return 1;
	},
	add: function(a,b) {
		return a * b;
	},
	subtract: function(a,b) { // subtract b from a
		if (b === 0) return 0;
		return a/b;
	},
	interpolate: function(a,b,progress) {
		return a + (b-a) * progress;
	}
};

export function HyperArray(type,length,settings) {
	this.type = type;
	if (isFunction(type)) this.type = new type(settings);
	this.length = length;
	this.debug = "HyperScale";
}
HyperArray.prototype = {
	constructor: HyperArray,
	zero: function() {
		const array = [];
		let i = this.length;
		while (i--) array.push(this.type.zero());
		return array;
	},
	add: function(a,b) {
		const array = [];
		for (let i = 0; i < this.length; i++) {
			array.push(this.type.add(a[i],b[i]));
		}
		return array;
	},
	subtract: function(a,b) { // subtract b from a
		const array = [];
		for (let i = 0; i < this.length; i++) {
			array.push(this.type.subtract(a[i],b[i]));
		}
		return array;
	},
	interpolate: function(a,b,progress) {
		const array = [];
		for (let i = 0; i < this.length; i++) {
			array.push(this.type.interpolate(a[i],b[i],progress));
		}
		return array;
	}
};

export function HyperSet(settings) {
	if (isFunction(settings)) this.sort = settings;
	else if (settings && isFunction(settings.sort)) this.sort = settings.sort;
	this.debug = "HyperSet";
}
HyperSet.prototype = {
	constructor: HyperSet,
	zero: function() {
		return [];
	},
	add: function(a,b) { // add b to a
		if (!Array.isArray(a) && !Array.isArray(b)) return [];
		if (!Array.isArray(a)) return b;
		if (!Array.isArray(b)) return a;

		let array = [];
		const aLength = a.length;
		const bLength = b.length;
		let i = 0;
		let j = 0;
		if (isFunction(this.sort)) while (i < aLength || j < bLength) {
			if (i === aLength) {
				array.push(b[j]);
				j++;
			} else if (j === bLength) {
				array.push(a[i]);
				i++;
			} else {
				const A = a[i];
				const B = b[j];
				const sort = this.sort(A,B);
				if (sort === 0) { // sort is used to determine identity, not just equality.
					array.push(A);
					i++;
					j++;
				} else if (sort < 0) {
					array.push(A);
					i++;
				} else if (sort > 0) {
					array.push(B);
					j++;
				}
			}
		} else {
			array = a.slice(0);
			i = b.length;
			while (i--) {
				if (a.indexOf(b[i]) < 0) array.push(b[i]);
			}
		}
		return array;
	},
	subtract: function(a,b) { // remove b from a
		if (!Array.isArray(a) && !Array.isArray(b)) return [];
		if (!Array.isArray(a)) return b;
		if (!Array.isArray(b)) return a;

		let array = [];
		const aLength = a.length;
		const bLength = b.length;
		let i = 0;
		let j = 0;
		if (isFunction(this.sort)) while (i < aLength || j < bLength) {
			if (i === aLength) {
				break;
			} else if (j === bLength) {
				array.push(a[i]);
				i++;
			} else {
				const A = a[i];
				const B = b[j];
				const sort = this.sort(A,B);
				if (sort === 0) { // sort is used to determine identity, not just equality.
					i++;
					j++;
				} else if (sort < 0) {
					array.push(A);
					i++;
				} else if (sort > 0) {
					j++;
				}
			}
		} else {
			array = a.slice(0);
			i = b.length;
			while (i--) {
				const loc = array.indexOf(b[i]);
				if (loc > -1) array.splice(loc,1);
			}
		}
		return array;
	},
	interpolate: function(a,b,progress) {
		if (progress >= 1) return b;
		return a;
	}
};

export function HyperPoint(settings) {
}
HyperPoint.prototype = {
	constructor: HyperPoint,
	zero: function() {
		return hyperZeroPoint();
	},
	add: function(a,b) {
		return hyperMakePoint(a.x + b.x, a.y + b.y);
	},
	subtract: function(a,b) { // subtract b from a
		return hyperMakePoint(a.x - b.x, a.y - b.y);
	},
	interpolate: function(a,b,progress) {
		return hyperMakePoint(a.x + (b.x-a.x) * progress, a.y + (b.y-a.y) * progress);
	}
};

export function HyperSize(settings) {
}
HyperSize.prototype = {
	constructor: HyperSize,
	zero: function() {
		return hyperZeroSize();
	},
	add: function(a,b) {
		return hyperMakeSize(a.width + b.width, a.height + b.height);
	},
	subtract: function(a,b) { // subtract b from a
		return hyperMakeSize(a.width - b.width, a.height - b.height);
	},
	interpolate: function(a,b,progress) {
		return hyperMakeSize(a.width + (b.width-a.width) * progress, a.height + (b.height-a.height) * progress);
	}
};

export function HyperRect(settings) {
}
HyperRect.prototype = {
	constructor: HyperRect,
	zero: function() {
		return hyperZeroRect();
	},
	add: function(a,b) {
		return {
			origin: HyperPoint.prototype.add(a.origin, b.origin),
			size: HyperSize.prototype.add(a.size, b.size)
		};
	},
	subtract: function(a,b) { // subtract b from a
		return {
			origin: HyperPoint.prototype.subtract(a.origin, b.origin),
			size: HyperSize.prototype.subtract(a.size, b.size)
		};
	},
	interpolate: function(a,b,progress) {
		return {
			origin: HyperPoint.prototype.interpolate(a.origin, b.origin, progress),
			size: HyperSize.prototype.interpolate(a.size, b.size, progress)
		};
	}
};

export function HyperRange(settings) { // TODO: negative values? // This should union the whole range, not add the individual values. NSUnionRange, not NSIntersectionRange, which is a range containing the indices that exist in both ranges.
	throw new Error("HyperRange not supported");
}
HyperRange.prototype = {
	constructor: HyperRange,
	zero: function() {
		return hyperNullRange();
	},
	add: function(a,b) { // union?
		if (a.location === hyperNotFound && b.location === hyperNotFound) return hyperNullRange();
		if (a.length === 0 && b.length === 0) return hyperNullRange();
		if (a.location === hyperNotFound || a.length === 0) return b;
		if (b.location === hyperNotFound || b.length === 0) return a;
		const finalLocation = Math.min( a.location, b.location );
		const finalEnd = Math.max( a.location + a.length, b.location + b.length );
		const result = hyperMakeRange(finalLocation, finalEnd - finalLocation );
		return result;
	},
	subtract: function(a,b) { // Subtraction is completely different.
		let result = a;
		if (a.location === hyperNotFound && b.location === hyperNotFound) result = hyperNullRange();
		else if (a.length === 0 && b.length === 0) result = hyperNullRange();
		else if (a.location === hyperNotFound || a.length === 0) result = hyperNullRange();
		else if (b.location === hyperNotFound || b.length === 0) result = a;
		else if (b.location <= a.location && b.location + b.length >= a.location + a.length) result = hyperNullRange();
		else if (b.location <= a.location && b.location + b.length > a.location && b.location + b.length < a.location + a.length) result = hyperMakeRange(b.location + b.length, (a.location + a.length) - (b.location + b.length));
		else if (b.location > a.location && b.location < a.location + a.length && b.location + b.length >= a.location + a.length) result = hyperMakeRange(a.location, (b.location + b.length) - a.location);
		return result;
	},
	interpolate: function(a,b,progress) {
		if (progress >= 1) return b;
		return a;
	},
	intersection: function(a,b) { // 0,1 and 1,1 do not intersect
		if (a.location === hyperNotFound || b.location === hyperNotFound || a.length === 0 || b.length === 0) return hyperNullRange();
		if (a.location + a.length <= b.location || b.location + b.length <= a.location) return hyperNullRange(); // TODO: Consider location should be NSNotFound (INT_MAX) not zero.
		const finalLocation = Math.max( a.location, b.location );
		const finalEnd = Math.min( a.location + a.length, b.location + b.length );
		return hyperMakeRange(finalLocation, finalEnd - finalLocation);
	}
};

export const hyperNotFound = Number.MAX_VALUE;
// struct convenience constructors:
export function hyperMakeRect(x,y,width,height) {
	return {
		origin: hyperMakePoint(x,y),
		size: hyperMakeSize(width,height)
	};
}
export function hyperZeroRect() {
	return hyperMakeRect(0,0,0,0);
}
export function hyperEqualRects(a,b) {
	return (hyperEqualPoints(a.origin,b.origin) && hyperEqualSizes(a.size,b.size));
}

export function hyperMakePoint(x,y) {
	return {
		x: x,
		y: y
	};
}
export function hyperZeroPoint() {
	return hyperMakePoint(0,0);
}
export function hyperEqualPoints(a,b) {
	return (a.x === b.x && a.y === b.y);
}

export function hyperMakeSize(width, height) {
	return {
		width: width,
		height: height
	};
}
export function hyperZeroSize() {
	return hyperMakeSize(0,0);
}
export function hyperEqualSizes(a,b) {
	return (a.width === b.width && a.height && b.height);
}

export function hyperMakeRange(location, length) {
	return {
		location: location,
		length: length
	};
}
export function hyperZeroRange() {
	return hyperMakeRange(0,0);
}
export function hyperNullRange() {
	return hyperMakeRange(hyperNotFound,0);
}
export function hyperIndexInRange(index,range) {
	return (index > range.location && index < range.location + range.length);
}
export function hyperEqualRanges(a,b) {
	return (a.location === b.location && a.length === b.length);
}
export function hyperIntersectionRange(a,b) {
	if (a.location + a.length <= b.location || b.location + b.length <= a.location) return hyperNullRange();
	const location = Math.max( a.location, b.location );
	const end = Math.min( a.location + a.length, b.location + b.length );
	return { location: location, length: end - location };
}