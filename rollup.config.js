import babel from "rollup-plugin-babel";
import eslint from "rollup-plugin-eslint";

function debug(options) {
	var plugin = {};
	plugin.name = "debug";
	plugin.transform = function(code) {
		if (options && options.debug) console.log("%s%s",options.debug,JSON.stringify(code));
		else console.log("DEBUG:%s;",JSON.stringify(code));
		if (options && options.sourceMap) console.log("sourceMap:%s;",options.sourceMap);
		if (options && options.inSourceMap) console.log("inSourceMap:%s;",options.inSourceMap);
		if (options && options.outSourceMap) console.log("outSourceMap:%s;",options.outSourceMap);
		
		return code;
	}
	return plugin;
}

var plugins = [
	eslint(), // redundant with pkg.scripts.test
	babel({
		exclude: "node_modules/**",
		babelrc: false,
		presets: ["es2015-rollup"] // .babelrc is required for pkg.scripts.test, override here // https://github.com/rollup/rollup-plugin-babel/issues/14#issuecomment-157445431
	})//,
	//debug({debug:"DEBUG:"})
]

export default {
	entry: "source/hyperact.js",
	plugins: plugins,
	external: [
// 		"react",
// 		"react-dom"
	],
// 	targets: [
// 		{
			dest: "hyperact.mjs",
			format: "es"
// 		},
// 		{
// 			dest: "hyperact.js",
// 			format: "umd",
// 			moduleName: "Hyperact"
// 		}
// 	]
};
