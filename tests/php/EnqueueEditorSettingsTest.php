<?php
/**
 * Tests for editor settings passed to the nav-item script.
 *
 * @package Blockparty\Tabs
 */

namespace Blockparty\Tabs\Tests;

use WP_UnitTestCase;
use function Blockparty\Tabs\enqueue_editor_settings;

/**
 * @covers ::Blockparty\Tabs\enqueue_editor_settings
 */
class EnqueueEditorSettingsTest extends WP_UnitTestCase {

	/**
	 * @return void
	 */
	public function setUp(): void {
		parent::setUp();
		// phpcs:disable WordPress.WP.GlobalVariablesOverride.Prohibited -- Reset script registry between tests.
		wp_scripts()->registered = [];
		wp_scripts()->queue      = [];
		wp_scripts()->done       = [];
		// phpcs:enable WordPress.WP.GlobalVariablesOverride.Prohibited
	}

	/**
	 * @return void
	 */
	public function test_adds_inline_settings_when_nav_item_script_is_registered(): void {
		$handle = generate_block_asset_handle( 'blockparty/tabs-nav-item', 'editorScript' );

		wp_register_script( $handle, false, [], '1.0.0', true );

		enqueue_editor_settings();

		$after  = wp_scripts()->get_data( $handle, 'after' );
		$before = wp_scripts()->get_data( $handle, 'before' );
		$data   = is_array( $before ) ? implode( "\n", $before ) : (string) $before;

		if ( '' === $data && is_array( $after ) ) {
			$data = implode( "\n", $after );
		}

		$this->assertStringContainsString( 'window.blockpartyTabsSettings', $data );
		$this->assertStringContainsString( 'allowedIconBlocks', $data );
		$this->assertMatchesRegularExpression( '/core\\\\?\/icon/', $data );
	}

	/**
	 * @return void
	 */
	public function test_is_noop_when_nav_item_script_is_not_registered(): void {
		enqueue_editor_settings();

		$handle = generate_block_asset_handle( 'blockparty/tabs-nav-item', 'editorScript' );
		$before = wp_scripts()->get_data( $handle, 'before' );

		$this->assertFalse( $before );
	}
}
