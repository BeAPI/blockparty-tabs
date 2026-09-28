/**
 * WordPress dependencies
 */
import { test, expect } from '../utils/fixtures';

/**
 * Resolve the block editor content root.
 *
 * WordPress 6.3+ uses an iframed canvas (`editor-canvas`). Older versions render
 * blocks in the parent document. `FrameLocator.or()` is unreliable when the
 * iframe is absent, so detect the canvas mode explicitly.
 *
 * @param {import('@playwright/test').Page} page
 */
const getEditorCanvas = async ( page ) => {
	const iframe = page.locator( 'iframe[name="editor-canvas"]' );
	const hasIframe = await iframe
		.waitFor( { state: 'attached', timeout: 3_000 } )
		.then( () => true )
		.catch( () => false );

	if ( hasIframe ) {
		return page.frameLocator( 'iframe[name="editor-canvas"]' );
	}

	return page.locator( 'body' );
};

test.describe( 'Blockparty Tabs editor', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'inserts the Tabs block from the inserter', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'blockparty/tabs' } );

		const canvas = await getEditorCanvas( page );
		const tabsRoot = canvas.locator( '.wp-block-blockparty-tabs' );
		await expect( tabsRoot ).toBeVisible( { timeout: 10_000 } );

		// Default template ships with three nav items and three panels.
		await expect(
			canvas.locator( '.wp-block-blockparty-tabs-nav-item' )
		).toHaveCount( 3 );
		await expect(
			canvas.locator( '.wp-block-blockparty-tabs-panel-item' )
		).toHaveCount( 3 );

		await editor.saveDraft();
		await expect(
			page.getByRole( 'button', { name: 'Saved' } )
		).toBeVisible( { timeout: 15_000 } );
	} );
} );
