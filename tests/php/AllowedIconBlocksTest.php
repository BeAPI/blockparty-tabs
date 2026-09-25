<?php
/**
 * Tests for allowed icon blocks helper.
 *
 * @package Blockparty\Tabs
 */

namespace Blockparty\Tabs\Tests;

use WP_UnitTestCase;
use function Blockparty\Tabs\get_allowed_icon_blocks;
use const Blockparty\Tabs\BLOCKPARTY_TABS_DEFAULT_ICON_BLOCK;

/**
 * @covers ::Blockparty\Tabs\get_allowed_icon_blocks
 */
class AllowedIconBlocksTest extends WP_UnitTestCase {

	/**
	 * @return void
	 */
	public function tearDown(): void {
		remove_all_filters( 'blockparty_tabs_allowed_icon_blocks' );
		parent::tearDown();
	}

	/**
	 * @return void
	 */
	public function test_defaults_to_core_icon(): void {
		$this->assertSame(
			[ BLOCKPARTY_TABS_DEFAULT_ICON_BLOCK ],
			get_allowed_icon_blocks()
		);
	}

	/**
	 * @return void
	 */
	public function test_filter_can_append_icon_blocks(): void {
		add_filter(
			'blockparty_tabs_allowed_icon_blocks',
			static function ( array $blocks ): array {
				$blocks[] = 'blockparty/icon';
				$blocks[] = 'beapi/icon-block';
				return $blocks;
			}
		);

		$this->assertSame(
			[
				'core/icon',
				'blockparty/icon',
				'beapi/icon-block',
			],
			get_allowed_icon_blocks()
		);
	}

	/**
	 * @return void
	 */
	public function test_invalid_block_names_are_stripped(): void {
		add_filter(
			'blockparty_tabs_allowed_icon_blocks',
			static function (): array {
				return [
					'core/icon',
					'Not A Block',
					123,
					'uppercase/Block',
					'beapi/icon-block',
					'core/icon',
				];
			}
		);

		$this->assertSame(
			[
				'core/icon',
				'uppercase/block',
				'beapi/icon-block',
			],
			get_allowed_icon_blocks()
		);
	}

	/**
	 * @return void
	 */
	public function test_non_array_filter_result_falls_back_to_default(): void {
		add_filter(
			'blockparty_tabs_allowed_icon_blocks',
			static function () {
				return 'core/icon';
			}
		);

		$this->assertSame(
			[ BLOCKPARTY_TABS_DEFAULT_ICON_BLOCK ],
			get_allowed_icon_blocks()
		);
	}

	/**
	 * @return void
	 */
	public function test_empty_sanitized_list_falls_back_to_default(): void {
		add_filter(
			'blockparty_tabs_allowed_icon_blocks',
			static function (): array {
				return [ 'invalid', 42 ];
			}
		);

		$this->assertSame(
			[ BLOCKPARTY_TABS_DEFAULT_ICON_BLOCK ],
			get_allowed_icon_blocks()
		);
	}
}
