var webpack = require("webpack");
var path = require("path");

module.exports = [
	{
		entry: "./source/hyperact.js",
		output:{
			filename: "hyperact.js",
			library: "Hyperact",
			libraryTarget: "umd"
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					loader: "babel-loader",
					exclude: /node_modules/,
					//options: { presets: [ ["es2015", { modules: false }] ] } // .babelrc is different for mocha, so this is specified there. Also now babel-preset-env not es2015
				}
			]
		}
	}
];
