<?php
/**
 * PHPUnit bootstrap file.
 *
 * @package Blockparty\Tabs
 */

require_once dirname( __DIR__ ) . '/vendor/autoload.php';

$_tests_dir = getenv( 'WP_TESTS_DIR' );

if ( ! $_tests_dir ) {
	$_tests_dir = getenv( 'WP_PHPUNIT__DIR' );
}

if ( ! $_tests_dir ) {
	$_tests_dir = dirname( __DIR__ ) . '/vendor/wp-phpunit/wp-phpunit';
}

if ( ! file_exists( $_tests_dir . '/includes/functions.php' ) ) {
	// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CLI bootstrap before WordPress is loaded.
	echo "Could not find {$_tests_dir}/includes/functions.php." . PHP_EOL;
	exit( 1 );
}

/*
 * Point the WordPress test library at our config file so PHPUnit uses
 * the isolated `wptests_` table prefix instead of the live `wp_` tables.
 */
if ( ! defined( 'WP_TESTS_CONFIG_FILE_PATH' ) ) {
	define( 'WP_TESTS_CONFIG_FILE_PATH', __DIR__ . '/wp-tests-config.php' );
}

require_once $_tests_dir . '/includes/functions.php';

/**
 * Manually load the plugin being tested.
 */
tests_add_filter(
	'muplugins_loaded',
	static function (): void {
		require dirname( __DIR__ ) . '/blockparty-tabs.php';
	}
);

require $_tests_dir . '/includes/bootstrap.php';
