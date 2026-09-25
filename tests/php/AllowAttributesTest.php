<?php
/**
 * Tests for KSES allowlist required by saved tab markup.
 *
 * @package Blockparty\Tabs
 */

namespace Blockparty\Tabs\Tests;

use WP_UnitTestCase;
use function Blockparty\Tabs\allow_attributes;

/**
 * @covers ::Blockparty\Tabs\allow_attributes
 */
class AllowAttributesTest extends WP_UnitTestCase {

	/**
	 * @return void
	 */
	public function test_allows_aria_and_tabindex_in_post_context(): void {
		$tags = [
			'a'      => [],
			'button' => [],
			'div'    => [],
		];

		$result = allow_attributes( $tags, 'post' );

		$this->assertTrue( $result['a']['aria-controls'] );
		$this->assertTrue( $result['a']['aria-selected'] );
		$this->assertTrue( $result['a']['tabindex'] );
		$this->assertTrue( $result['div']['tabindex'] );
		$this->assertTrue( $result['button']['aria-expanded'] );
	}

	/**
	 * @return void
	 */
	public function test_does_not_modify_non_post_context(): void {
		$tags = [
			'a' => [],
		];

		$result = allow_attributes( $tags, 'strip' );

		$this->assertSame( $tags, $result );
	}

	/**
	 * @return void
	 */
	public function test_kses_preserves_tab_aria_attributes_on_anchor(): void {
		$html = '<a id="block-tab-0-0" role="tab" aria-controls="block-panel-0-0" aria-selected="true" tabindex="-1" href="#block-tab-0-0">Tab</a>';

		$filtered = wp_kses_post( $html );

		$this->assertStringContainsString( 'aria-selected="true"', $filtered );
		$this->assertStringContainsString( 'tabindex="-1"', $filtered );
		$this->assertStringContainsString( 'aria-controls="block-panel-0-0"', $filtered );
	}
}
