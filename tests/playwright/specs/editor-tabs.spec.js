/**
 * WordPress dependencies
 */
import { test, expect } from '../utils/fixtures';

test.describe( 'Blockparty Tabs editor', () => {
	test.beforeEach( async ( { admin } ) => {
		await admin.createNewPost();
	} );

	test( 'inserts the Tabs block from the inserter', async ( {
		editor,
		page,
	} ) => {
		await editor.insertBlock( { name: 'blockparty/tabs' } );

		const canvas = editor.canvas;
		const tabsRoot = canvas.locator( '.wp-block-blockparty-tabs' );
		await expect( tabsRoot ).toBeVisible();

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
