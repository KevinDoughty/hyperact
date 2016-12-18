var path = require("path");
var webpack = require("webpack");

var plugins = [];
if (process.env.WEBPACK_ENV === "build") {
	plugins = [new webpack.optimize.UglifyJsPlugin({ minimize:true })];
}

module.exports = {
	entry: "./index.js",
	output: {
		filename: "bundle.js"
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /(node_modules|bower_components)/,
				query: {
					presets: ["es2015"]
				}
			}
		]
	},
	plugins: plugins
}