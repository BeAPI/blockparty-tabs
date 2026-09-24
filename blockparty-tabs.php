<?php
/**
 * Plugin Name:       Blockparty Tabs
 * Description:       Accessible Tabs block for WordPress gutenberg.
 * Requires at least: 6.2
 * Requires PHP:      8.1
 * Version:           1.1.5
 * Author:            Be API Technical team
 * Author URI:        https://beapi.fr
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       blockparty-tabs
 */

namespace Blockparty\Tabs;

define( 'BLOCKPARTY_TABS_VERSION', '1.1.5' );
define( 'BLOCKPARTY_TABS_URL', plugin_dir_url( __FILE__ ) );
define( 'BLOCKPARTY_TABS_DIR', plugin_dir_path( __FILE__ ) );
define( 'BLOCKPARTY_TABS_PLUGIN_BASENAME', plugin_basename( __FILE__ ) );

function init(): void {
	register_block_type( __DIR__ . '/build/blockparty-tabs' );
	register_block_type( __DIR__ . '/build/blockparty-tabs-nav' );
	register_block_type( __DIR__ . '/build/blockparty-tabs-nav-item' );
	register_block_type( __DIR__ . '/build/blockparty-tabs-panels' );
	register_block_type( __DIR__ . '/build/blockparty-tabs-panel-item' );

	do_action( 'blockparty_tabs_init' );
}

add_action( 'init', __NAMESPACE__ . '\\init' );

/**
 * Default icon block used inside tab nav items.
 */
const BLOCKPARTY_TABS_DEFAULT_ICON_BLOCK = 'core/icon';

/**
 * Returns the icon block names allowed inside tab nav items.
 *
 * @return string[] Block names (e.g. `core/icon`).
 */
function get_allowed_icon_blocks(): array {
	/**
	 * Filters the icon block types allowed inside tab nav items.
	 *
	 * By default only `core/icon` is allowed. To keep supporting
	 * Blockparty Icons / BeAPI Icon Block as before:
	 *
	 *     add_filter(
	 *         'blockparty_tabs_allowed_icon_blocks',
	 *         static function ( array $blocks ): array {
	 *             $blocks[] = 'blockparty/icon';
	 *             $blocks[] = 'beapi/icon-block';
	 *             return $blocks;
	 *         }
	 *     );
	 *
	 * The first registered block in the list is used as the InnerBlocks
	 * template when enabling an icon on a tab.
	 *
	 * @param string[] $blocks Allowed block names.
	 */
	$blocks = apply_filters(
		'blockparty_tabs_allowed_icon_blocks',
		[ BLOCKPARTY_TABS_DEFAULT_ICON_BLOCK ]
	);

	if ( ! is_array( $blocks ) ) {
		return [ BLOCKPARTY_TABS_DEFAULT_ICON_BLOCK ];
	}

	$sanitized = [];
	foreach ( $blocks as $block ) {
		if ( ! is_string( $block ) ) {
			continue;
		}

		$block = strtolower( trim( $block ) );
		if ( ! preg_match( '/^[a-z0-9-]+\/[a-z0-9-]+$/', $block ) ) {
			continue;
		}

		$sanitized[] = $block;
	}

	$sanitized = array_values( array_unique( $sanitized ) );

	return [] === $sanitized ? [ BLOCKPARTY_TABS_DEFAULT_ICON_BLOCK ] : $sanitized;
}

/**
 * Passes editor settings (allowed icon blocks) to the nav-item script.
 */
function enqueue_editor_settings(): void {
	$handle = generate_block_asset_handle( 'blockparty/tabs-nav-item', 'editorScript' );

	if ( ! wp_script_is( $handle, 'registered' ) ) {
		return;
	}

	$settings = [
		'allowedIconBlocks' => get_allowed_icon_blocks(),
	];

	wp_add_inline_script(
		$handle,
		'window.blockpartyTabsSettings = ' . wp_json_encode( $settings ) . ';',
		'before'
	);
}

add_action( 'enqueue_block_editor_assets', __NAMESPACE__ . '\\enqueue_editor_settings' );

/**
 * Allow ARIA and tabindex attributes required by the saved tabs markup.
 *
 * Users without the `unfiltered_html` capability have post content filtered
 * through KSES. Without these allowlist entries, attributes emitted by
 * `save()` are stripped and the block fails validation on the next edit.
 *
 * @param array  $tags    Allowed HTML tags and attributes.
 * @param string $context Context for the allowed tags.
 * @return array
 */
function allow_attributes( $tags, $context ) {
	if ( 'post' !== $context ) {
		return $tags;
	}

	$tags['button']['aria-expanded'] = true;
	$tags['div']['tabindex']         = true;
	$tags['a']['aria-selected']      = true;
	$tags['a']['tabindex']           = true;

	return $tags;
}

add_filter( 'wp_kses_allowed_html', __NAMESPACE__ . '\\allow_attributes', 10, 2 );
