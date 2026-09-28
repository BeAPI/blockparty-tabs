const defaultConfig = require( '@wordpress/scripts/config/eslint.config.cjs' );
const globals = require( 'globals' );

module.exports = [
	...defaultConfig,
	{
		files: [ 'tests/js/**/*.js' ],
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
		settings: {
			jsdoc: {
				tagNamePreference: {
					'jest-environment': 'jest-environment',
				},
			},
		},
		rules: {
			'jsdoc/check-tag-names': [
				'error',
				{
					definedTags: [ 'jest-environment' ],
				},
			],
		},
	},
	{
		files: [ 'tests/playwright/**/*.js' ],
		rules: {
			'jsdoc/check-tag-names': 'off',
		},
	},
];
