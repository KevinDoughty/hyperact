var path = require("path");
var webpack = require("webpack");

var plugins = [
	new webpack.optimize.UglifyJsPlugin({
		compress: false,
		mangle: false,
		beautify: true,
		comments: true,
		sourceMap: true
	})
	
];
if (process.env.WEBPACK_ENV === "build") {
	plugins = [
		new webpack.optimize.UglifyJsPlugin({
			compress: true,
			mangle: true,
			beautify: false,
			comments: false,
			sourceMap: false
		})
	];
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
				exclude: /node_modules/,
				options: {
					presets: [
						["es2015", { modules: false }]
					]
				}
			}
		]
	},
	plugins: plugins
}