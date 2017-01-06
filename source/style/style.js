import { typeWithKeywords } from "./shared.js";

import { transformType } from "./transform.js";
import { colorType } from "./color.js";
import { nonNumericType } from "./nonNumeric.js";
import { integerType, opacityType } from "./number.js";
import { lengthType, lengthAutoType } from "./length.js";
//import { positionType } from "./position.js";
import { positionListType } from "./positionList.js";
import { rectangleType } from "./rectangle.js";
import { shadowType } from "./shadow.js";
import { fontWeightType } from "./fontWeight.js";
import { visibilityType } from "./visibility.js";

export function typeForStyle(property) {
	return propertyTypes[property] || nonNumericType;
}

var propertyTypes = {
	backgroundColor: colorType,
	backgroundPosition: positionListType,
	borderBottomColor: colorType,
	borderBottomLeftRadius: lengthType,
	borderBottomRightRadius: lengthType,
	borderBottomWidth: lengthType,
	borderLeftColor: colorType,
	borderLeftWidth: lengthType,
	borderRightColor: colorType,
	borderRightWidth: lengthType,
	borderSpacing: lengthType,
	borderTopColor: colorType,
	borderTopLeftRadius: lengthType,
	borderTopRightRadius: lengthType,
	borderTopWidth: lengthType,
	bottom: lengthAutoType,
	boxShadow: shadowType,
	clip: typeWithKeywords(["auto"], rectangleType),
	color: colorType,
	cx: lengthType,

	// TODO: Handle these keywords properly.
	fontSize: typeWithKeywords(["smaller", "larger"], lengthType),
	fontWeight: typeWithKeywords(["lighter", "bolder"], fontWeightType),

	height: lengthAutoType,
	left: lengthAutoType,
	letterSpacing: typeWithKeywords(["normal"], lengthType),
	lineHeight: lengthType, // TODO: Should support numberType as well.
	marginBottom: lengthAutoType,
	marginLeft: lengthAutoType,
	marginRight: lengthAutoType,
	marginTop: lengthAutoType,
	maxHeight: typeWithKeywords(
			["none", "max-content", "min-content", "fill-available", "fit-content"],
			lengthType),
	maxWidth: typeWithKeywords(
			["none", "max-content", "min-content", "fill-available", "fit-content"],
			lengthType),
	minHeight: typeWithKeywords(
			["max-content", "min-content", "fill-available", "fit-content"],
			lengthType),
	minWidth: typeWithKeywords(
			["max-content", "min-content", "fill-available", "fit-content"],
			lengthType),
	//opacity: numberType, // does NOT use 1 as the default underlying value when not specified. animations relative to zero not one. Need to use propertyValueAliases
	opacity: opacityType, //
	outlineColor: typeWithKeywords(["invert"], colorType),
	outlineOffset: lengthType,
	outlineWidth: lengthType,
	paddingBottom: lengthType,
	paddingLeft: lengthType,
	paddingRight: lengthType,
	paddingTop: lengthType,
	right: lengthAutoType,
	textIndent: typeWithKeywords(["each-line", "hanging"], lengthType),
	textShadow: shadowType,
	top: lengthAutoType,
	transform: transformType,
	WebkitTransform: transformType, // React?
	webkitTransform: transformType, // temporary
	msTransform: transformType, // temporary

	verticalAlign: typeWithKeywords([
		"baseline",
		"sub",
		"super",
		"text-top",
		"text-bottom",
		"middle",
		"top",
		"bottom"
	], lengthType),
	visibility: visibilityType,
	width: typeWithKeywords([
		"border-box",
		"content-box",
		"auto",
		"max-content",
		"min-content",
		"available",
		"fit-content"
	], lengthType),
	wordSpacing: typeWithKeywords(["normal"], lengthType),
	x: lengthType,
	y: lengthType,
	zIndex: typeWithKeywords(["auto"], integerType)
};

/*
var svgProperties = {
	"cx": 1,
	"width": 1,
	"x": 1,
	"y": 1
};

var borderWidthAliases = {
	initial: "3px",
	thin: "1px",
	medium: "3px",
	thick: "5px"
};

var propertyValueAliases = {
	backgroundColor: { initial: "transparent" },
	backgroundPosition: { initial: "0% 0%" },
	borderBottomColor: { initial: "currentColor" },
	borderBottomLeftRadius: { initial: "0px" },
	borderBottomRightRadius: { initial: "0px" },
	borderBottomWidth: borderWidthAliases,
	borderLeftColor: { initial: "currentColor" },
	borderLeftWidth: borderWidthAliases,
	borderRightColor: { initial: "currentColor" },
	borderRightWidth: borderWidthAliases,
	// Spec says this should be 0 but in practise it is 2px.
	borderSpacing: { initial: "2px" },
	borderTopColor: { initial: "currentColor" },
	borderTopLeftRadius: { initial: "0px" },
	borderTopRightRadius: { initial: "0px" },
	borderTopWidth: borderWidthAliases,
	bottom: { initial: "auto" },
	clip: { initial: "rect(0px, 0px, 0px, 0px)" },
	color: { initial: "black" }, // Depends on user agent.
	fontSize: {
		initial: "100%",
		"xx-small": "60%",
		"x-small": "75%",
		"small": "89%",
		"medium": "100%",
		"large": "120%",
		"x-large": "150%",
		"xx-large": "200%"
	},
	fontWeight: {
		initial: "400",
		normal: "400",
		bold: "700"
	},
	height: { initial: "auto" },
	left: { initial: "auto" },
	letterSpacing: { initial: "normal" },
	lineHeight: {
		initial: "120%",
		normal: "120%"
	},
	marginBottom: { initial: "0px" },
	marginLeft: { initial: "0px" },
	marginRight: { initial: "0px" },
	marginTop: { initial: "0px" },
	maxHeight: { initial: "none" },
	maxWidth: { initial: "none" },
	minHeight: { initial: "0px" },
	minWidth: { initial: "0px" },
	opacity: { initial: "1.0" },
	outlineColor: { initial: "invert" },
	outlineOffset: { initial: "0px" },
	outlineWidth: borderWidthAliases,
	paddingBottom: { initial: "0px" },
	paddingLeft: { initial: "0px" },
	paddingRight: { initial: "0px" },
	paddingTop: { initial: "0px" },
	right: { initial: "auto" },
	textIndent: { initial: "0px" },
	textShadow: {
		initial: "0px 0px 0px transparent",
		none: "0px 0px 0px transparent"
	},
	top: { initial: "auto" },
	transform: {
		initial: "matrix(1, 0, 0, 1, 0, 0)",
		none: "matrix(1, 0, 0, 1, 0, 0)"
	},
	verticalAlign: { initial: "0px" },
	visibility: { initial: "visible" },
	width: { initial: "auto" },
	wordSpacing: { initial: "normal" },
	zIndex: { initial: "auto" }
};

var propertyIsSVGAttrib = function(property, target) {
	return target.namespaceURI === SVG_NS && property in svgProperties;
};
*/
