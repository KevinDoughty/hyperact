// export function HyperValue(settings) { // The former base type class
// 	if (this instanceof HyperValue === false) {
// 		throw new Error("HyperValue is a constructor, not a function. Do not call it directly.");
// 	}
// 	if (this.constructor === HyperValue) {
// 		throw new Error("HyperValue is an abstract base class.");
// 	}
// }
// HyperValue.prototype = {
// 	constructor: HyperValue,
// 	zero: function() {
// 		throw new Error("HyperValue subclasses must implement function: zero()");
// 	},
// 	add: function() {
// 		throw new Error("HyperValue subclasses must implement function: add(a,b)");
// 	},
// 	subtract: function() {
// 		throw new Error("HyperValue subclasses must implement function: subtract(a,b) in the form subtract b from a");
// 	},
// 	interpolate: function(a,b,progress) { // new, meant to be overridden, otherwise you get discrete.
// 		//throw new Error("HyperValue subclasses must implement function: interpolate(a,b,progress)");
// 		if (progress >= 1) return b;
// 		return a;
// 	}
// };

function isFunction(w) { // WET
	return w && {}.toString.call(w) === "[object Function]";
}

export function HyperNumber(settings) {
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
}
HyperArray.prototype = {
	constructor: HyperArray,
	zero: function() {
		var array = [];
		var i = this.length;
		while (i--) array.push(this.type.zero());
		return array;
	},
	add: function(a,b) {
		var array = [];
		for (var i = 0; i < this.length; i++) {
			array.push(this.type.add(a[i],b[i]));
		}
		return array;
	},
	subtract: function(a,b) { // subtract b from a
		var array = [];
		for (var i = 0; i < this.length; i++) {
			array.push(this.type.subtract(a[i],b[i]));
		}
		return array;
	},
	interpolate: function(a,b,progress) {
		var array = [];
		for (var i = 0; i < this.length; i++) {
			array.push(this.type.interpolate(a[i],b[i],progress));
		}
		return array;
	}
};



export function HyperSet(settings) {
	if (isFunction(settings)) this.sort = settings;
	else if (settings && isFunction(settings.sort)) this.sort = settings.sort;
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

		var array = [];
		var aLength = a.length;
		var bLength = b.length;
		var i = 0;
		var j = 0;
		if (isFunction(this.sort)) while (i < aLength || j < bLength) {
			if (i === aLength) {
				array.push(b[j]);
				j++;
			} else if (j === bLength) {
				array.push(a[i]);
				i++;
			} else {
				var A = a[i];
				var B = b[j];
				var sort = this.sort(A,B);
				if (sort === 0) {
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

		var array = [];
		var aLength = a.length;
		var bLength = b.length;
		var i = 0;
		var j = 0;
		if (isFunction(this.sort)) while (i < aLength || j < bLength) {
			if (i === aLength) {
				break;
			} else if (j === bLength) {
				array.push(a[i]);
				i++;
			} else {
				var A = a[i];
				var B = b[j];
				var sort = this.sort(A,B);
				if (sort === 0) {
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
				var loc = array.indexOf(b[i]);
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
		return HyperZeroPoint();
	},
	add: function(a,b) {
		return HyperMakePoint(a.x + b.x, a.y + b.y);
	},
	subtract: function(a,b) { // subtract b from a
		return HyperMakePoint(a.x - b.x, a.y - b.y);
	},
	interpolate: function(a,b,progress) {
		return HyperMakePoint(a.x + (b.x-a.x) * progress, a.y + (b.y-a.y) * progress);
	}
};



export function HyperSize(settings) {
}
HyperSize.prototype = {
	constructor: HyperSize,
	zero: function() {
		return HyperZeroSize();
	},
	add: function(a,b) {
		return HyperMakeSize(a.width + b.width, a.height + b.height);
	},
	subtract: function(a,b) { // subtract b from a
		return HyperMakeSize(a.width - b.width, a.height - b.height);
	},
	interpolate: function(a,b,progress) {
		return HyperMakeSize(a.width + (b.width-a.width) * progress, a.height + (b.height-a.height) * progress);
	}
};



export function HyperRect(settings) {
}
HyperRect.prototype = {
	constructor: HyperRect,
	zero: function() {
		return HyperZeroRect();
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
		return HyperNullRange();
	},
	add: function(a,b) { // union?
		if (a.location === HyperNotFound && b.location === HyperNotFound) return HyperNullRange();
		if (a.length === 0 && b.length === 0) return HyperNullRange();
		if (a.location === HyperNotFound || a.length === 0) return b;
		if (b.location === HyperNotFound || b.length === 0) return a;
		var finalLocation = Math.min( a.location, b.location );
		var finalEnd = Math.max( a.location + a.length, b.location + b.length );
		var result = HyperMakeRange(finalLocation, finalEnd - finalLocation );
		return result;
	},
	subtract: function(a,b) { // Subtraction is completely different.
		var result = a;
		if (a.location === HyperNotFound && b.location === HyperNotFound) result = HyperNullRange();
		else if (a.length === 0 && b.length === 0) result = HyperNullRange();
		else if (a.location === HyperNotFound || a.length === 0) result = HyperNullRange();
		else if (b.location === HyperNotFound || b.length === 0) result = a;
		else if (b.location <= a.location && b.location + b.length >= a.location + a.length) result = HyperNullRange();
		else if (b.location <= a.location && b.location + b.length > a.location && b.location + b.length < a.location + a.length) result = HyperMakeRange(b.location + b.length, (a.location + a.length) - (b.location + b.length));
		else if (b.location > a.location && b.location < a.location + a.length && b.location + b.length >= a.location + a.length) result = HyperMakeRange(a.location, (b.location + b.length) - a.location);
		return result;
	},
	interpolate: function(a,b,progress) {
		if (progress >= 1) return b;
		return a;
	},
	intersection: function(a,b) { // 0,1 and 1,1 do not intersect
		if (a.location === HyperNotFound || b.location === HyperNotFound || a.length === 0 || b.length === 0) return HyperNullRange();
		if (a.location + a.length <= b.location || b.location + b.length <= a.location) return HyperNullRange(); // TODO: Consider location should be NSNotFound (INT_MAX) not zero.
		var finalLocation = Math.max( a.location, b.location );
		var finalEnd = Math.min( a.location + a.length, b.location + b.length );
		return HyperMakeRange(finalLocation, finalEnd - finalLocation);
	}
};

export const HyperNotFound = Number.MAX_VALUE;
// struct convenience constructors:
export function HyperMakeRect(x,y,width,height) {
	return {
		origin: HyperMakePoint(x,y),
		size: HyperMakeSize(width,height)
	};
}
export function HyperZeroRect() {
	return HyperMakeRect(0,0,0,0);
}
export function HyperEqualRects(a,b) {
	return (HyperEqualPoints(a.origin,b.origin) && HyperEqualSizes(a.size,b.size));
}

export function HyperMakePoint(x,y) {
	return {
		x: x,
		y: y
	};
}
export function HyperZeroPoint() {
	return HyperMakePoint(0,0);
}
export function HyperEqualPoints(a,b) {
	return (a.x === b.x && a.y === b.y);
}

export function HyperMakeSize(width, height) {
	return {
		width: width,
		height: height
	};
}
export function HyperZeroSize() {
	return HyperMakeSize(0,0);
}
export function HyperEqualSizes(a,b) {
	return (a.width === b.width && a.height && b.height);
}

export function HyperMakeRange(location, length) {
	return {
		location: location,
		length: length
	};
}
export function HyperZeroRange() {
	return HyperMakeRange(0,0);
}
export function HyperNullRange() {
	return HyperMakeRange(HyperNotFound,0);
}
export function HyperIndexInRange(index,range) {
	return (index > range.location && index < range.location + range.length);
}
export function HyperEqualRanges(a,b) {
	return (a.location === b.location && a.length === b.length);
}
export function HyperIntersectionRange(a,b) {
	if (a.location + a.length <= b.location || b.location + b.length <= a.location) return HyperNullRange();
	var location = Math.max( a.location, b.location );
	var end = Math.min( a.location + a.length, b.location + b.length );
	return { location: location, length: end - location };
}