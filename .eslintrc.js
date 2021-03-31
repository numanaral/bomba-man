const OFF = 0;
const WARN = 1;
const ERROR = 2;

/**
 * @typedef {Object} ESLintRules
 * @property {import('eslint/rules').ESLintRules} rules
 * @typedef {import('eslint').Linter.Config&ESLintRules} ESLintConfig
 */

/**
 * @type {ESLintConfig}
 */
module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
		'jest/globals': true,
	},
	extends: [
		'plugin:react/recommended',
		'airbnb',
		'plugin:jest/recommended',
		'plugin:prettier/recommended',
		// 'plugin:@typescript-eslint/recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: [
		'react',
		'react-hooks',
		// '@babel',
		'@typescript-eslint',
		'prettier',
		'jest',
	],
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.ts', '.jsx', '.tsx'],
				paths: 'src',
			},
		},
	},
	rules: {
		'arrow-parens': [ERROR, 'as-needed'],
		'default-case': [ERROR, { commentPattern: 'No Default' }],
		'no-param-reassign': [
			ERROR,
			{
				props: true,
				ignorePropertyModificationsFor: ['draft', 'acc'],
				ignorePropertyModificationsForRegex: ['[Rr]ef$'],
			},
		],
		'import/no-named-as-default': OFF,
		'import/no-unresolved': [ERROR, { caseSensitive: false }],
		'import/prefer-default-export': OFF,
		'linebreak-style': [ERROR, 'windows'],
		'max-len': [
			ERROR,
			{
				// Ignore import lines and jsx props
				// \w+=".*$ doesn't work
				ignorePattern: '^import .*|S*w*=".*$',
				ignoreComments: true,
				ignoreUrls: true,
				ignoreRegExpLiterals: true,
				ignoreTrailingComments: true,
				ignoreTemplateLiterals: true,
			},
		],
		'no-alert': WARN,
		'no-console': OFF,
		'no-continue': OFF,
		'no-debugger': OFF,
		'no-plusplus': OFF,
		'no-tabs': OFF,
		'no-underscore-dangle': OFF,
		'react-hooks/exhaustive-deps': WARN,
		'react-hooks/rules-of-hooks': ERROR,
		'react/jsx-filename-extension': [
			WARN,
			{ extensions: ['.js', '.jsx', '.jsx', '.tsx'] },
		],
		'react/jsx-indent': [ERROR, 'tab'],
		'react/jsx-indent-props': [ERROR, 'tab'],
		'react/jsx-props-no-spreading': OFF,
		'react/no-array-index-key': OFF,
		'prettier/prettier': ERROR,
		// Overrides for ts
		'react/prop-types': OFF,
		'react/require-default-props': OFF,
		'react/jsx-uses-react': OFF,
		'react/react-in-jsx-scope': OFF,
		'no-unused-vars': OFF,
		'@typescript-eslint/no-unused-vars': ERROR,
		'jest/no-disabled-tests': WARN,
		'jest/no-focused-tests': ERROR,
		'jest/no-identical-title': ERROR,
		'jest/prefer-to-have-length': WARN,
		'jest/valid-expect': ERROR,
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				js: 'never',
				jsx: 'never',
				ts: 'never',
				tsx: 'never',
			},
		],
		'no-undef': OFF,
		// '@typescript-eslint/no-undef': [ERROR],
		'no-use-before-define': OFF,
		'@typescript-eslint/no-use-before-define': [ERROR],
		'no-redeclare': OFF,
		'@typescript-eslint/no-redeclare': [ERROR],
		'no-shadow': 'off',
		'@typescript-eslint/no-shadow': [ERROR],
	},
};
