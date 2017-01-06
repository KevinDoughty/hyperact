var path = require("path");
var webpack = require("webpack");

var plugins = [
	new webpack.optimize.UglifyJsPlugin({
		compress: false,
		mangle: false,
		beautify: true,
		comments: true,
		sourceMap: true
	}),
	new webpack.LoaderOptionsPlugin({ minimize: true })
];
if (process.env.WEBPACK_ENV === "build") {
	plugins = [
		new webpack.optimize.UglifyJsPlugin({
			compress: true,
			mangle: true,
			beautify: false,
			comments: false,
			sourceMap: false
		}),
		new webpack.LoaderOptionsPlugin({ minimize: true }),
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
				query: {
					presets: [
						["es2015", { "modules": false }],
						"react"
					]
				}
			}
		]
	},
	plugins: plugins
}