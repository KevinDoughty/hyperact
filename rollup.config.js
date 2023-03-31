import { terser } from "rollup-plugin-terser";

const config = [{
	input: "source/hyperact.js",
	output: {
		dir: "module",
		format: "es"
	}
},{
	input: "source/hyperact.js",
	output: {
		name: "Hyperact",
		dir: "dist",
		format: "umd"
	},
	plugins: [terser()]
}];
export default config;