var webpack = require("webpack");
var path = require("path");

var modulesPlugins = [
	new webpack.LoaderOptionsPlugin({ minimize: true }),
	new webpack.optimize.UglifyJsPlugin({
		compress: false,
		mangle: false,
		beautify: true,
		comments: true,
		sourceMap: true
	})
];
if (process.env.HYPERACT === "build") modulesPlugins = [
	new webpack.LoaderOptionsPlugin({ minimize: true }),
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
if (process.env.HYPERACT === "build") {
	chunksPlugins.push(new webpack.optimize.UglifyJsPlugin({ minimize:true }));
}
module.exports = [
	{
		entry: "./source/hyperact.js",
		output: {
			path: __dirname,
			filename: "hyperact.js",
			library: "Hyperact",
			libraryTarget: "umd"
		},
		module: {
			loaders: [
				{
					test: /\.js$/,
					loader: "babel-loader",
					exclude: /node_modules/,
					query: {
						presets: [
							["es2015", { "modules": false }]
						]
					}
				}
			]
		},
		plugins: modulesPlugins
	},
	{
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