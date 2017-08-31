


function updateIndices(object, style, length) { // See all that stuff in there, Homie? That's why your robot didn't work.
	console.log("LAYER STYLE LENGTH:",Object.keys(style).length);
	//while (length < style.length) {
	while (length < Object.keys(style).length) {
		Object.defineProperty(object, length, {
			configurable: true,
			enumerable: false,
			get: (function(index) {
				return function() {
					return style[index];
				};
			})(length)
		});
		length++;
	}
	//while (length > style.length) {
	while (length > Object.keys(style).length) {
		length--;
		Object.defineProperty(object, length, {
			configurable: true,
			enumerable: false,
			value: undefined
		});
	}
	return length;
}


export function prepareDocument(animatables, HyperStyleDeclaration) {


	if (typeof document !== "undefined") {

//		const dict = animatables;

		const styles = Object.keys(document.documentElement.style);
		const dict = {};
		styles.forEach( key => {
			dict[key] = false;
		});
		Object.assign(dict, animatables);
		// Every property change will trigger call to animationForKey even if types are not declared,
		// so you can animate one style in response to change in another,
		// typically left/top to become transform, no other use cases really.
		// Maybe display change could be given a group animation with opacity fade.
		// There needs to be a discrete default, with no interpolation, just a step-end timing function

		for (var property in dict) {//document.documentElement.style) {
	// 		if (cssStyleDeclarationAttribute[property] || property in cssStyleDeclarationMethodModifiesStyle) {
	// 			continue;
	// 		}
			(function(property) {
				
				Object.defineProperty(HyperStyleDeclaration.prototype, property, {


					// This needs to be completely reassessed.
					// It's now different from the original web-animations technique.
					// web-animations-legacy depended on the original style object.
					// Whatever the problem, changes are not appearing on non-animated properties.

					// I am missing: _surrogateElement, updateIndices()

					get: function() {
						var layer = this.hyperStyleLayer;
						var ugly = layer[property];
						var type = animatables[property];
						if (type) return type.output(ugly);
						return ugly;
					},
					set: function(value) {
						this.hyperStyleLayer[property] = value; // This will produce animations from and to the ugly values, not CSS values.
						//this.hyperStyleController.registerAnimatableProperty(property); // automatic registration
						if (animatables[property]) {
							this.hyperStyleController.registerAnimatableProperty(property,animatables[property]); // automatic registration
						}
						console.log("element STYLE object:%s; layer:%s; length:%s;",this,JSON.stringify(this.hyperStyleLayer),this.hyperStyleLength);
						this.hyperStyleLength = updateIndices(this, this.hyperStyleLayer, this.hyperStyleLength);
						console.log("element STYLE set:%s; value:%s; result:",property,value,this.hyperStyleLayer);
					},
					configurable: true,
					enumerable: true
				});
			})(property);
		}
	}
}
// This function is a fallback for when we can't replace an element's style with
// AnimatatedCSSStyleDeclaration and must patch the existing style to behave
// in a similar way.
// Only the methods listed in cssStyleDeclarationMethodModifiesStyle will
// be patched to behave in the same manner as a native implementation,
// getter properties like style.left or style[0] will be tainted by the
// polyfill's animation engine.

// var patchInlineStyleForAnimation = function(style) {
// 	var surrogateElement = document.createElement('div');
// 	copyInlineStyle(style, surrogateElement.style);
// 	var isAnimatedProperty = {};
// 	for (var method in cssStyleDeclarationMethodModifiesStyle) {
// 		if (!(method in style)) {
// 			continue;
// 		}
// 		Object.defineProperty(style, method, configureDescriptor({
// 			value: (function(method, originalMethod, modifiesStyle) {
// 				return function() {
// 					var result = surrogateElement.style[method].apply(
// 							surrogateElement.style, arguments);
// 					if (modifiesStyle) {
// 						if (!isAnimatedProperty[arguments[0]]) {
// 							originalMethod.apply(style, arguments);
// 						}
// 						animatedInlineStyleChanged(); //retick
// 					}
// 					return result;
// 				}
// 			})(method, style[method], cssStyleDeclarationMethodModifiesStyle[method])
// 		}));
// 	}
// 	style._clearAnimatedProperty = function(property) {
// 		this[property] = surrogateElement.style[property];
// 		isAnimatedProperty[property] = false;
// 	};
// 	style._setAnimatedProperty = function(property, value) {
// 		this[property] = value;
// 		isAnimatedProperty[property] = true;
// 	};
// };



// var propertyTypes = {
// 	backgroundColor: colorType,
// 	backgroundPosition: positionListType,
// 	borderBottomColor: colorType,
// 	borderBottomLeftRadius: percentLengthType,
// 	borderBottomRightRadius: percentLengthType,
// 	borderBottomWidth: lengthType,
// 	borderLeftColor: colorType,
// 	borderLeftWidth: lengthType,
// 	borderRightColor: colorType,
// 	borderRightWidth: lengthType,
// 	borderSpacing: lengthType,
// 	borderTopColor: colorType,
// 	borderTopLeftRadius: percentLengthType,
// 	borderTopRightRadius: percentLengthType,
// 	borderTopWidth: lengthType,
// 	bottom: percentLengthAutoType,
// 	boxShadow: shadowType,
// 	clip: typeWithKeywords(['auto'], rectangleType),
// 	color: colorType,
// 	cx: lengthType,
// 	// TODO: Handle these keywords properly.
// 	fontSize: typeWithKeywords(['smaller', 'larger'], percentLengthType),
// 	fontWeight: typeWithKeywords(['lighter', 'bolder'], fontWeightType),
// 	height: percentLengthAutoType,
// 	left: percentLengthAutoType,
// 	letterSpacing: typeWithKeywords(['normal'], lengthType),
// 	lineHeight: percentLengthType, // TODO: Should support numberType as well.
// 	marginBottom: lengthAutoType,
// 	marginLeft: lengthAutoType,
// 	marginRight: lengthAutoType,
// 	marginTop: lengthAutoType,
// 	maxHeight: typeWithKeywords(
// 			['none', 'max-content', 'min-content', 'fill-available', 'fit-content'],
// 			percentLengthType),
// 	maxWidth: typeWithKeywords(
// 			['none', 'max-content', 'min-content', 'fill-available', 'fit-content'],
// 			percentLengthType),
// 	minHeight: typeWithKeywords(
// 			['max-content', 'min-content', 'fill-available', 'fit-content'],
// 			percentLengthType),
// 	minWidth: typeWithKeywords(
// 			['max-content', 'min-content', 'fill-available', 'fit-content'],
// 			percentLengthType),
// 	//opacity: numberType, // does NOT use 1 as the default underlying value when not specified. animations relative to zero not one. Need to use propertyValueAliases
// 	opacity: opacityType, //
// 	outlineColor: typeWithKeywords(['invert'], colorType),
// 	outlineOffset: lengthType,
// 	outlineWidth: lengthType,
// 	paddingBottom: lengthType,
// 	paddingLeft: lengthType,
// 	paddingRight: lengthType,
// 	paddingTop: lengthType,
// 	right: percentLengthAutoType,
// 	textIndent: typeWithKeywords(['each-line', 'hanging'], percentLengthType),
// 	textShadow: shadowType,
// 	top: percentLengthAutoType,
// 	transform: transformType,
// 	WebkitTransform: transformType, // React?
// 	webkitTransform: transformType, // temporary
// 	msTransform: transformType, // temporary
// 	verticalAlign: typeWithKeywords([
// 		'baseline',
// 		'sub',
// 		'super',
// 		'text-top',
// 		'text-bottom',
// 		'middle',
// 		'top',
// 		'bottom'
// 	], percentLengthType),
// 	visibility: visibilityType,
// 	width: typeWithKeywords([
// 		'border-box',
// 		'content-box',
// 		'auto',
// 		'max-content',
// 		'min-content',
// 		'available',
// 		'fit-content'
// 	], percentLengthType),
// 	wordSpacing: typeWithKeywords(['normal'], percentLengthType),
// 	x: lengthType,
// 	y: lengthType,
// 	zIndex: typeWithKeywords(['auto'], integerType)
// };

// var svgProperties = {
// 	'cx': 1,
// 	'width': 1,
// 	'x': 1,
// 	'y': 1
// };

// var borderWidthAliases = {
// 	initial: '3px',
// 	thin: '1px',
// 	medium: '3px',
// 	thick: '5px'
// };

// var propertyValueAliases = {
// 	backgroundColor: { initial: 'transparent' },
// 	backgroundPosition: { initial: '0% 0%' },
// 	borderBottomColor: { initial: 'currentColor' },
// 	borderBottomLeftRadius: { initial: '0px' },
// 	borderBottomRightRadius: { initial: '0px' },
// 	borderBottomWidth: borderWidthAliases,
// 	borderLeftColor: { initial: 'currentColor' },
// 	borderLeftWidth: borderWidthAliases,
// 	borderRightColor: { initial: 'currentColor' },
// 	borderRightWidth: borderWidthAliases,
// 	// Spec says this should be 0 but in practise it is 2px.
// 	borderSpacing: { initial: '2px' },
// 	borderTopColor: { initial: 'currentColor' },
// 	borderTopLeftRadius: { initial: '0px' },
// 	borderTopRightRadius: { initial: '0px' },
// 	borderTopWidth: borderWidthAliases,
// 	bottom: { initial: 'auto' },
// 	clip: { initial: 'rect(0px, 0px, 0px, 0px)' },
// 	color: { initial: 'black' }, // Depends on user agent.
// 	fontSize: {
// 		initial: '100%',
// 		'xx-small': '60%',
// 		'x-small': '75%',
// 		'small': '89%',
// 		'medium': '100%',
// 		'large': '120%',
// 		'x-large': '150%',
// 		'xx-large': '200%'
// 	},
// 	fontWeight: {
// 		initial: '400',
// 		normal: '400',
// 		bold: '700'
// 	},
// 	height: { initial: 'auto' },
// 	left: { initial: 'auto' },
// 	letterSpacing: { initial: 'normal' },
// 	lineHeight: {
// 		initial: '120%',
// 		normal: '120%'
// 	},
// 	marginBottom: { initial: '0px' },
// 	marginLeft: { initial: '0px' },
// 	marginRight: { initial: '0px' },
// 	marginTop: { initial: '0px' },
// 	maxHeight: { initial: 'none' },
// 	maxWidth: { initial: 'none' },
// 	minHeight: { initial: '0px' },
// 	minWidth: { initial: '0px' },
// 	opacity: { initial: '1.0' },
// 	outlineColor: { initial: 'invert' },
// 	outlineOffset: { initial: '0px' },
// 	outlineWidth: borderWidthAliases,
// 	paddingBottom: { initial: '0px' },
// 	paddingLeft: { initial: '0px' },
// 	paddingRight: { initial: '0px' },
// 	paddingTop: { initial: '0px' },
// 	right: { initial: 'auto' },
// 	textIndent: { initial: '0px' },
// 	textShadow: {
// 		initial: '0px 0px 0px transparent',
// 		none: '0px 0px 0px transparent'
// 	},
// 	top: { initial: 'auto' },
// 	transform: {
// 		initial: "matrix(1, 0, 0, 1, 0, 0)",
// 		none: "matrix(1, 0, 0, 1, 0, 0)"
// 	},
// 	verticalAlign: { initial: '0px' },
// 	visibility: { initial: 'visible' },
// 	width: { initial: 'auto' },
// 	wordSpacing: { initial: 'normal' },
// 	zIndex: { initial: 'auto' }
// };