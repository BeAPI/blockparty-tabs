<?php
/**
 * Tests for block registration and plugin bootstrap.
 *
 * @package Blockparty\Tabs
 */

namespace Blockparty\Tabs\Tests;

use WP_UnitTestCase;

/**
 * @covers ::Blockparty\Tabs\init
 */
class BlockRegistrationTest extends WP_UnitTestCase {

	/**
	 * @return void
	 */
	public function test_plugin_constants_are_defined(): void {
		$this->assertTrue( defined( 'BLOCKPARTY_TABS_VERSION' ) );
		$this->assertTrue( defined( 'BLOCKPARTY_TABS_DIR' ) );
		$this->assertTrue( defined( 'BLOCKPARTY_TABS_URL' ) );
		$this->assertTrue( defined( 'BLOCKPARTY_TABS_PLUGIN_BASENAME' ) );
		$this->assertNotEmpty( BLOCKPARTY_TABS_VERSION );
	}

	/**
	 * @return void
	 */
	public function test_all_tabs_blocks_are_registered(): void {
		$expected = [
			'blockparty/tabs',
			'blockparty/tabs-nav',
			'blockparty/tabs-nav-item',
			'blockparty/tabs-panels',
			'blockparty/tabs-panel-item',
		];

		foreach ( $expected as $block_name ) {
			$this->assertTrue(
				\WP_Block_Type_Registry::get_instance()->is_registered( $block_name ),
				sprintf( 'Expected block "%s" to be registered.', $block_name )
			);
		}
	}

	/**
	 * @return void
	 */
	public function test_parent_tabs_block_exposes_view_script(): void {
		$block = \WP_Block_Type_Registry::get_instance()->get_registered( 'blockparty/tabs' );

		$this->assertNotNull( $block );
		$this->assertNotEmpty( $block->view_script_handles );
	}

	/**
	 * @return void
	 */
	public function test_init_callback_is_registered_on_init(): void {
		$this->assertNotFalse(
			has_action( 'init', 'Blockparty\\Tabs\\init' )
		);
	}

	/**
	 * @return void
	 */
	public function test_blockparty_tabs_init_action_ran_during_bootstrap(): void {
		$this->assertGreaterThan( 0, did_action( 'blockparty_tabs_init' ) );
	}

	/**
	 * @return void
	 */
	public function test_react_jsx_runtime_script_is_registered(): void {
		$this->assertTrue(
			wp_script_is( 'react-jsx-runtime', 'registered' ),
			'Expected react-jsx-runtime to be registered (core or plugin polyfill).'
		);
	}

	/**
	 * Editor scripts depend on the `react-jsx-runtime` handle; it must be emitted by webpack.
	 *
	 * @return void
	 */
	public function test_react_jsx_runtime_polyfill_asset_is_built(): void {
		$asset = BLOCKPARTY_TABS_DIR . 'build/react-jsx-runtime.js';

		$this->assertFileIsReadable(
			$asset,
			'Run `npm run build` so webpack emits build/react-jsx-runtime.js (see webpack.config.js).'
		);
	}

	/**
	 * @return void
	 */
	public function test_react_jsx_runtime_polyfill_registers_plugin_script(): void {
		$asset = BLOCKPARTY_TABS_DIR . 'build/react-jsx-runtime.js';
		if ( ! is_readable( $asset ) ) {
			$this->markTestSkipped( 'Built polyfill asset missing; run npm run build.' );
		}

		global $wp_scripts;

		unset( $wp_scripts->registered['react-jsx-runtime'] );

		\Blockparty\Tabs\register_react_jsx_runtime( $wp_scripts );

		$this->assertTrue( wp_script_is( 'react-jsx-runtime', 'registered' ) );
		$this->assertStringContainsString(
			'build/react-jsx-runtime.js',
			$wp_scripts->registered['react-jsx-runtime']->src
		);
	}
}
