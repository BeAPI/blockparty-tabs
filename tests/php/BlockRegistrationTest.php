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
}
