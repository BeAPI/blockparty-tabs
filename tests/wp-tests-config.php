<?php
/**
 * WordPress PHPUnit configuration for wp-env.
 *
 * @package Blockparty\Tabs
 */

$db_name = getenv( 'WORDPRESS_DB_NAME' );
define( 'DB_NAME', false !== $db_name && '' !== $db_name ? $db_name : 'wordpress' );

$db_user = getenv( 'WORDPRESS_DB_USER' );
define( 'DB_USER', false !== $db_user && '' !== $db_user ? $db_user : 'root' );

$db_password = getenv( 'WORDPRESS_DB_PASSWORD' );
define( 'DB_PASSWORD', false !== $db_password && '' !== $db_password ? $db_password : 'password' );

$db_host = getenv( 'WORDPRESS_DB_HOST' );
define( 'DB_HOST', false !== $db_host && '' !== $db_host ? $db_host : 'mysql' );

define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- Required by the WordPress PHPUnit bootstrap.
$table_prefix = 'wptests_';

define( 'WP_TESTS_DOMAIN', 'example.org' );
define( 'WP_TESTS_EMAIL', 'admin@example.org' );
define( 'WP_TESTS_TITLE', 'Test Blog' );

define( 'WP_PHP_BINARY', 'php' );

define( 'WP_DEFAULT_THEME', 'twentytwentyfour' );

define( 'ABSPATH', '/var/www/html/' );
