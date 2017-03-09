var webpack = require("webpack");
var path = require("path");

var modulesPlugins = [
	new webpack.optimize.UglifyJsPlugin({
		compress: false,
		mangle: false,
		beautify: true,
		comments: true,
		sourceMap: true
	})
];
if (process.env.WEBPACK_ENV === "build") modulesPlugins = [
	new webpack.optimize.UglifyJsPlugin({
		compress: true,
		mangle: true,
		beautify: false,
		comments: false,
		sourceMap: false
	})
];
var chunksPlugins = [
	new webpack.optimize.CommonsChunkPlugin({
// 		filename: "hyperact.js",
// 		name: "hyperact",
// 		chunks: ["core","types"]
		filename: "core.js",
		name: "core",
		chunks: ["types"]
	})
];
if (process.env.WEBPACK_ENV === "build") {
	chunksPlugins.push(new webpack.optimize.UglifyJsPlugin({
		compress: true,
		mangle: true,
		beautify: false,
		comments: false,
		sourceMap: false
	}));
}
module.exports = [
	{
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
		plugins: modulesPlugins
	},
	{ // chunks deprecated:
		entry: {
			core: "./source/core.js",
			types: "./source/types.js",
			style: "./source/style/style.js"
		},
		output: {
			path: path.join(__dirname, "chunks"),
			filename: "[name].js",
			library: ["Hyperact","[name]"],
			libraryTarget: "umd"
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: "babel-loader",
					exclude: /node_modules/,
					query: {
						presets: ["es2015"]
					}
				}
			]
		},
		plugins: chunksPlugins
	}
];