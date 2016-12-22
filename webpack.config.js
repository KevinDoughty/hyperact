var webpack = require("webpack");
var path = require("path");

var modulesPlugins = [];
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
	chunksPlugins.push(new webpack.optimize.UglifyJsPlugin({ minimize:true }));
	modulesPlugins.push(new webpack.optimize.UglifyJsPlugin({ minimize:true }));
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
					exclude: /(node_modules|bower_components)/,
					query: {
						//presets: ["es2015"]
						presets: [["es2015", { "modules": false }]]
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
					exclude: /(node_modules|bower_components)/,
					query: {
						presets: ["es2015"]
					}
				}
			]
		},
		plugins: chunksPlugins
	}
];