var path = require("path");
var webpack = require("webpack");

module.exports = {
	entry: "./index.js",
	output: {
		path: __dirname,
		filename: "bundle.js"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: [
						["env", { "modules": false }]
					]
				}
			}
		]
	}
}
