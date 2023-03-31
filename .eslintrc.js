module.exports = {
	"env": {
		"browser": true,
		"es2021": true,
		"mocha": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"overrides": [
	],
	"parserOptions": {
		"ecmaVersion": "latest",
		"sourceType": "module"
	},
	"rules": {
		// "indent": [
		// 	"error",
		// 	"tab"
		// ],
		// "linebreak-style": [
		// 	"error",
		// 	"unix"
		// ],
		// "quotes": [
		// 	"error",
		// 	"double"
		// ],
		// "semi": [
		// 	"error",
		// 	"always"
		// ]
		"indent": ["error", "tab", { "SwitchCase": 1 }],
		"linebreak-style": ["error", "unix"],
		"quotes": ["error", "double"],
		"semi": ["error", "always"],
		"comma-dangle": ["error", "never"],
		"no-cond-assign": ["error", "except-parens"],
		"no-console": "off",
		"no-unused-vars": ["error", {"args": "none"}],
		"eqeqeq": 2,
		"no-trailing-spaces": [2, { "skipBlankLines": true }],
		"no-constant-condition": ["error", { "checkLoops": false }]
	}
};
