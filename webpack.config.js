/**
 * External dependencies
 */
const path = require( 'path' );
/**
 * WordPress dependencies
 */
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

/**
 * Polyfill for the `react-jsx-runtime` script handle added in WordPress 6.6.
 * Modern @wordpress/scripts builds declare this dependency; without it, editor
 * scripts never load on WordPress 6.2–6.5 and blocks stay unregistered.
 *
 * Compiled after the main blocks config (`dependencies`) so `output.clean` from
 * `@wordpress/scripts` cannot delete the polyfill asset in a parallel race.
 *
 * @see https://make.wordpress.org/core/2024/06/06/jsx-in-wordpress-6-6/
 */
const reactJSXRuntimePolyfill = {
	name: 'react-jsx-runtime',
	dependencies: [ 'blocks' ],
	mode: defaultConfig.mode,
	target: defaultConfig.target,
	devtool: defaultConfig.devtool,
	entry: {
		'react-jsx-runtime': {
			import: 'react/jsx-runtime',
		},
	},
	output: {
		filename: 'react-jsx-runtime.js',
		path: path.resolve( __dirname, 'build' ),
		library: {
			name: 'ReactJSXRuntime',
			type: 'window',
		},
	},
	externals: {
		react: 'React',
	},
};

module.exports = [
	{
		...defaultConfig,
		name: 'blocks',
	},
	reactJSXRuntimePolyfill,
];
