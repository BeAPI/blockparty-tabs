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
