/**
 * WordPress dependencies
 */
import { test, expect } from '../utils/fixtures';

const TABS_MARKUP = `<!-- wp:blockparty/tabs -->
<div class="wp-block-blockparty-tabs has-align-top-left"><!-- wp:blockparty/tabs-nav -->
<ul class="wp-block-blockparty-tabs-nav" role="tablist"><!-- wp:blockparty/tabs-nav-item {"label":"First tab","linkId":"block-tab-e2e-0","panelId":"block-panel-e2e-0","index":0} -->
<li class="wp-block-blockparty-tabs-nav-item is-active"><a id="block-tab-e2e-0" role="tab" aria-controls="block-panel-e2e-0" aria-selected="true" class="wp-block-blockparty-tabs-nav-link" href="#block-tab-e2e-0"><span>First tab</span></a></li>
<!-- /wp:blockparty/tabs-nav-item -->

<!-- wp:blockparty/tabs-nav-item {"label":"Second tab","linkId":"block-tab-e2e-1","panelId":"block-panel-e2e-1","index":1} -->
<li class="wp-block-blockparty-tabs-nav-item"><a id="block-tab-e2e-1" role="tab" aria-controls="block-panel-e2e-1" aria-selected="false" tabindex="-1" class="wp-block-blockparty-tabs-nav-link" href="#block-tab-e2e-1"><span>Second tab</span></a></li>
<!-- /wp:blockparty/tabs-nav-item -->

<!-- wp:blockparty/tabs-nav-item {"label":"Third tab","linkId":"block-tab-e2e-2","panelId":"block-panel-e2e-2","index":2} -->
<li class="wp-block-blockparty-tabs-nav-item"><a id="block-tab-e2e-2" role="tab" aria-controls="block-panel-e2e-2" aria-selected="false" tabindex="-1" class="wp-block-blockparty-tabs-nav-link" href="#block-tab-e2e-2"><span>Third tab</span></a></li>
<!-- /wp:blockparty/tabs-nav-item --></ul>
<!-- /wp:blockparty/tabs-nav -->

<!-- wp:blockparty/tabs-panels -->
<section class="wp-block-blockparty-tabs-panels"><!-- wp:blockparty/tabs-panel-item {"panelId":"block-panel-e2e-0","linkId":"block-tab-e2e-0","index":0} -->
<div role="tabpanel" tabindex="0" class="wp-block-blockparty-tabs-panel-item is-active" id="block-panel-e2e-0" aria-labelledby="block-tab-e2e-0"><div class="wp-block-blockparty-tabs-panel-item__inner"><!-- wp:paragraph -->
<p>First panel content</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:blockparty/tabs-panel-item -->

<!-- wp:blockparty/tabs-panel-item {"panelId":"block-panel-e2e-1","linkId":"block-tab-e2e-1","index":1} -->
<div role="tabpanel" tabindex="0" class="wp-block-blockparty-tabs-panel-item is-hidden" id="block-panel-e2e-1" aria-labelledby="block-tab-e2e-1"><div class="wp-block-blockparty-tabs-panel-item__inner"><!-- wp:paragraph -->
<p>Second panel content</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:blockparty/tabs-panel-item -->

<!-- wp:blockparty/tabs-panel-item {"panelId":"block-panel-e2e-2","linkId":"block-tab-e2e-2","index":2} -->
<div role="tabpanel" tabindex="0" class="wp-block-blockparty-tabs-panel-item is-hidden" id="block-panel-e2e-2" aria-labelledby="block-tab-e2e-2"><div class="wp-block-blockparty-tabs-panel-item__inner"><!-- wp:paragraph -->
<p>Third panel content</p>
<!-- /wp:paragraph --></div></div>
<!-- /wp:blockparty/tabs-panel-item --></section>
<!-- /wp:blockparty/tabs-panels --></div>
<!-- /wp:blockparty/tabs -->`;

test.describe( 'Blockparty Tabs frontend', () => {
	let post;

	test.beforeEach( async ( { requestUtils } ) => {
		post = await requestUtils.createPost( {
			title: 'Blockparty Tabs E2E',
			content: TABS_MARKUP,
			status: 'publish',
		} );
	} );

	test.afterEach( async ( { requestUtils } ) => {
		if ( post?.id ) {
			await requestUtils.rest( {
				method: 'DELETE',
				path: `/wp/v2/posts/${ post.id }`,
				params: { force: true },
			} );
		}
	} );

	test( 'renders ARIA tablist and switches panels on click and keyboard', async ( {
		page,
	} ) => {
		await page.goto( post.link );

		const tabsRoot = page.locator( '.wp-block-blockparty-tabs' );
		await expect( tabsRoot ).toBeVisible();

		const tabs = page.getByRole( 'tab' );
		await expect( tabs ).toHaveCount( 3 );
		await expect( tabs.nth( 0 ) ).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect( page.getByText( 'First panel content' ) ).toBeVisible();

		await tabs.nth( 1 ).click();
		await expect( tabs.nth( 1 ) ).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect( page.getByText( 'Second panel content' ) ).toBeVisible();
		await expect( page.getByText( 'First panel content' ) ).toBeHidden();

		await tabs.nth( 1 ).press( 'ArrowRight' );
		await expect( tabs.nth( 2 ) ).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect( page.getByText( 'Third panel content' ) ).toBeVisible();

		await tabs.nth( 2 ).press( 'Home' );
		await expect( tabs.nth( 0 ) ).toHaveAttribute(
			'aria-selected',
			'true'
		);
		await expect( page.getByText( 'First panel content' ) ).toBeVisible();
	} );
} );
