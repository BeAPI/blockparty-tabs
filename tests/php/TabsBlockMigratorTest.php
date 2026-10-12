<?php
/**
 * Tests for beapi/tabs to blockparty/tabs migration.
 *
 * @package Blockparty\Tabs
 */

namespace Blockparty\Tabs\Tests;

use Blockparty\Tabs\Migration\TabsBlockMigrator;
use WP_UnitTestCase;

/**
 * @covers \Blockparty\Tabs\Migration\TabsBlockMigrator
 */
class TabsBlockMigratorTest extends WP_UnitTestCase {

	/**
	 * @return void
	 */
	public function test_migrates_tabs_block_names_title_and_markup(): void {
		$content = <<<'CONTENT'
<!-- wp:beapi/tabs {"title":"Our sections","tabsActive":1,"mode":"top-left"} -->
<div class="wp-block-beapi-tabs has-align-top-left" aria-label="Our sections" role="tablist"><!-- wp:beapi/tabs-nav -->
<ul class="wp-block-beapi-tabs-nav"><!-- wp:beapi/tabs-nav-item {"label":"First","linkId":"block-tab-0","panelId":"block-panel-0","index":0} -->
<li class="wp-block-beapi-tabs-nav-item"><a id="block-tab-0" role="tab" aria-controls="block-panel-0" class="wp-block-beapi-tabs-nav-link" href="#block-tab-0"><span>First</span></a></li>
<!-- /wp:beapi/tabs-nav-item -->

<!-- wp:beapi/tabs-nav-item {"label":"Second","linkId":"block-tab-1","panelId":"block-panel-1","index":1} -->
<li class="wp-block-beapi-tabs-nav-item"><a id="block-tab-1" role="tab" aria-controls="block-panel-1" class="wp-block-beapi-tabs-nav-link" href="#block-tab-1"><span>Second</span></a></li>
<!-- /wp:beapi/tabs-nav-item --></ul>
<!-- /wp:beapi/tabs-nav -->

<!-- wp:beapi/tabs-panels -->
<section class="wp-block-beapi-tabs-panels"><!-- wp:beapi/tabs-panel-item {"panelId":"block-panel-0","linkId":"block-tab-0","index":0} -->
<div role="tabpanel" tabindex="0" class="wp-block-beapi-tabs-panel-item" id="block-panel-0" aria-labelledby="block-tab-0"><div class="wp-block-beapi-tabs-panel-item__inner"><!-- wp:paragraph -->
<p>Panel one</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:beapi/tabs-panel-item -->

<!-- wp:beapi/tabs-panel-item {"panelId":"block-panel-1","linkId":"block-tab-1","index":1} -->
<div role="tabpanel" tabindex="0" class="wp-block-beapi-tabs-panel-item" id="block-panel-1" aria-labelledby="block-tab-1"><div class="wp-block-beapi-tabs-panel-item__inner"><!-- wp:paragraph -->
<p>Panel two</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:beapi/tabs-panel-item --></section>
<!-- /wp:beapi/tabs-panels --></div>
<!-- /wp:beapi/tabs -->
CONTENT;

		$migrator = new TabsBlockMigrator();
		$result   = $migrator->migrate_content( $content );

		$this->assertNotNull( $result );
		$this->assertStringContainsString( 'blockparty/tabs', $result );
		$this->assertStringNotContainsString( 'beapi/tabs', $result );
		$this->assertStringContainsString( 'wp-block-blockparty-tabs', $result );
		$this->assertStringNotContainsString( 'wp-block-beapi-tabs', $result );
		$this->assertStringNotContainsString( '"title":"Our sections"', $result );
		$this->assertStringContainsString( '"ariaLabel":"Our sections"', $result );
		$this->assertStringContainsString( 'role="tablist"', $result );
		$this->assertStringNotContainsString( 'wp-block-blockparty-tabs has-align-top-left" aria-label', $result );
		$this->assertStringContainsString( 'aria-selected="true"', $result );
		$this->assertStringContainsString( 'aria-selected="false"', $result );
		$this->assertStringContainsString( 'tabindex="-1"', $result );
		$this->assertStringContainsString( 'wp-block-blockparty-tabs-panel-item is-active', $result );
		$this->assertStringContainsString( 'wp-block-blockparty-tabs-panel-item is-hidden', $result );
		$this->assertStringContainsString( 'wp-block-blockparty-tabs-nav-item is-active', $result );
		$this->assertGreaterThan( 0, $migrator->migrated );
	}

	/**
	 * @return void
	 */
	public function test_migrates_nested_tabs_inside_panel(): void {
		$content = <<<'CONTENT'
<!-- wp:beapi/tabs -->
<div class="wp-block-beapi-tabs has-align-top-left" aria-label="" role="tablist"><!-- wp:beapi/tabs-nav -->
<ul class="wp-block-beapi-tabs-nav"><!-- wp:beapi/tabs-nav-item {"label":"Outer","linkId":"outer-tab","panelId":"outer-panel","index":0} -->
<li class="wp-block-beapi-tabs-nav-item"><a id="outer-tab" role="tab" aria-controls="outer-panel" class="wp-block-beapi-tabs-nav-link" href="#outer-tab"><span>Outer</span></a></li>
<!-- /wp:beapi/tabs-nav-item --></ul>
<!-- /wp:beapi/tabs-nav -->

<!-- wp:beapi/tabs-panels -->
<section class="wp-block-beapi-tabs-panels"><!-- wp:beapi/tabs-panel-item {"panelId":"outer-panel","linkId":"outer-tab","index":0} -->
<div role="tabpanel" tabindex="0" class="wp-block-beapi-tabs-panel-item" id="outer-panel" aria-labelledby="outer-tab"><div class="wp-block-beapi-tabs-panel-item__inner"><!-- wp:beapi/tabs -->
<div class="wp-block-beapi-tabs has-align-top-left" role="tablist"><!-- wp:beapi/tabs-nav -->
<ul class="wp-block-beapi-tabs-nav"><!-- wp:beapi/tabs-nav-item {"label":"Inner","linkId":"inner-tab","panelId":"inner-panel","index":0} -->
<li class="wp-block-beapi-tabs-nav-item"><a id="inner-tab" role="tab" aria-controls="inner-panel" class="wp-block-beapi-tabs-nav-link" href="#inner-tab"><span>Inner</span></a></li>
<!-- /wp:beapi/tabs-nav-item --></ul>
<!-- /wp:beapi/tabs-nav -->

<!-- wp:beapi/tabs-panels -->
<section class="wp-block-beapi-tabs-panels"><!-- wp:beapi/tabs-panel-item {"panelId":"inner-panel","linkId":"inner-tab","index":0} -->
<div role="tabpanel" tabindex="0" class="wp-block-beapi-tabs-panel-item" id="inner-panel" aria-labelledby="inner-tab"><div class="wp-block-beapi-tabs-panel-item__inner"><!-- wp:paragraph -->
<p>Nested</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:beapi/tabs-panel-item --></section>
<!-- /wp:beapi/tabs-panels --></div>
<!-- /wp:beapi/tabs --></div></div>
<!-- /wp:beapi/tabs-panel-item --></section>
<!-- /wp:beapi/tabs-panels --></div>
<!-- /wp:beapi/tabs -->
CONTENT;

		$migrator = new TabsBlockMigrator();
		$result   = $migrator->migrate_content( $content );

		$this->assertNotNull( $result );
		$this->assertSame( 10, $migrator->migrated );
		$this->assertStringNotContainsString( 'beapi/tabs', $result );
		$this->assertStringContainsString( 'blockparty/tabs', $result );
	}

	/**
	 * @return void
	 */
	public function test_returns_null_when_no_legacy_tabs(): void {
		$migrator = new TabsBlockMigrator();
		$content  = '<!-- wp:paragraph --><p>Hello</p><!-- /wp:paragraph -->';

		$this->assertNull( $migrator->migrate_content( $content ) );
	}
}
