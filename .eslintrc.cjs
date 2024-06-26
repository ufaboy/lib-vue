module.exports = {
	root: true,
	parserOptions: {
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	extends: ['eslint:recommended', 'plugin:vue/vue3-recommended', 'plugin:tailwindcss/recommended'],
	rules: {
		'vue/no-unused-vars': 'warn',
		'no-unused-vars': 'warn',
		'tailwindcss/no-custom-classname': 0,
		'padding-line-between-statements': [
			'error',
			{ blankLine: 'always', prev: 'function', next: 'function' },
			// { "blankLine": "always", "prev": "function", "next": "block" },
			// { "blankLine": "always", "prev": "block", "next": "function" },
		],
		'vue/html-closing-bracket-newline': [
			'error',
			{
				singleline: 'never',
				multiline: 'never',
				selfClosingTag: {
					singleline: 'never',
					multiline: 'never',
				},
			},
		],
		"vue/max-attributes-per-line": ["error", {
			"singleline": {
				"max": 3
			},
			"multiline": {
				"max": 1
			}
		}]
	},
	overrides: [
		{
			files: ['*.vue'],
			parser: 'vue-eslint-parser',
		},
	],
};
