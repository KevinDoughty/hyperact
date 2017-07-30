var webpack = require("webpack");
var path = require("path");

// Dev mode only watches webpack, not rollup (which produces the .mjs)

var plugins = [
	new webpack.optimize.UglifyJsPlugin({
		compress: false,
		mangle: false,
		beautify: true,
		comments: true,
		sourceMap: true
	})
];
if (process.env.WEBPACK_ENV === "build") plugins = [
	new webpack.optimize.UglifyJsPlugin({
		compress: true,
		mangle: true,
		beautify: false,
		comments: false,
		sourceMap: false
	})
];

module.exports = [{
	entry: "./source/hyperact.js",
	output: {
		path: __dirname,
		filename: "hyperact.js",
		library: "Hyperact", // support for script tags is important
		libraryTarget: "umd" // support for script tags is important
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				//options: { presets: [ ["es2015", { modules: false }] ] } // .babelrc is different for mocha
			}
		]
	},
	plugins: plugins
}];