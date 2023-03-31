var path = require("path");

module.exports = [
	{
		entry: "./index.js",
		output: {
			filename: "bundle.js",
			path: path.resolve(__dirname)
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					loader: "babel-loader",
					exclude: /node_modules/,
				}
			]
		}
	}
];