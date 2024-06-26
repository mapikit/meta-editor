module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
    "plugin:import/typescript",
    'plugin:svelte/base',
    'plugin:svelte/recommended'
	],
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['*.cjs', '*.eslint.*', '*.config.js'],
	overrides: [{
    files: ['*.svelte'],
    parser: 'svelte-eslint-parser',
    parserOptions: {
      parser: '@typescript-eslint/parser'
    }
  }],
	settings: {
	},
	parserOptions: {
		sourceType: 'module',
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
		extraFileExtensions: [".svelte"],
		ecmaVersion: 2019
	},
	env: {
		browser: true,
		es2017: true
	},
	rules: { //individual rule config for typescript
    "@typescript-eslint/type-annotation-spacing": ["error", { "before": true } ],
    "@typescript-eslint/indent": [ "error", 2],
    "@typescript-eslint/no-parameter-properties": ["off"],
    "@typescript-eslint/no-use-before-define": ["off"],
    "@typescript-eslint/no-unused-vars": ["error"],
    "@typescript-eslint/explicit-function-return-type": ["error", { "allowExpressions": true }],
    "@typescript-eslint/no-floating-promises" : "error",
    "@typescript-eslint/ban-types" : ["error", { "types": { "Function": false, "object": false } }],
    "@typescript-eslint/no-extra-semi" : ["off"],
    "@typescript-eslint/no-shadow": ["error"],
    "@typescript-eslint/explicit-module-boundary-types": ["warn", { allowArgumentsExplicitlyTypedAsAny: true }],
    "no-trailing-spaces": ["warn"],
    "max-len": ["warn" , { "code" : 120 }],
    "no-warning-comments": ["warn", { terms: ["TODO", "FIX"], location: "start" }],
    "max-depth": ["error", { "max" : 4 }],
    "semi": ["error", "always"],
    "space-before-blocks": ["warn", "always"],
    "space-before-function-paren": ["warn", "always"],
    "space-in-parens": ["error", "never"],
    "max-classes-per-file": ["error", 1],
    "no-param-reassign": ["error"],
    "no-return-assign": ["error"],
    "no-return-await": ["error"],
    "no-self-compare": ["error"],
    "no-shadow": ["off"],
    "comma-dangle": ["warn", "always-multiline"],
    "eol-last": ["error", "always"],
    "max-params": ["error", 3],
    "max-lines-per-function": ["warn", { max: 15, skipComments: true, skipBlankLines: true }],
    "object-curly-spacing": ["warn", "always"],
    "space-before-function-paren": ["warn", "always"],
    "quotes": ["warn", "double"],
    "lines-between-class-members": ["warn", "always", { "exceptAfterSingleLine": true }],
    "curly": ["error", "multi-line"],
  },
};
