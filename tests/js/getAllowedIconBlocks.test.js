/**
 * @jest-environment jsdom
 */

/**
 * Internal dependencies
 */
import {
	BLOCKPARTY_TABS_DEFAULT_ICON_BLOCKS,
	getIconTemplateAttributes,
	getRegisteredIconBlocks,
} from '../../src/blockparty-tabs-nav-item/getAllowedIconBlocks';

jest.mock( '@wordpress/blocks', () => ( {
	getBlockType: jest.fn(),
} ) );

import { getBlockType } from '@wordpress/blocks';

describe( 'getIconTemplateAttributes', () => {
	it( 'returns core/icon dimensions style attributes', () => {
		expect( getIconTemplateAttributes( 'core/icon' ) ).toEqual( {
			style: {
				dimensions: {
					width: '24px',
				},
			},
		} );
	} );

	it( 'returns legacy width/maxIcons attributes for other icon blocks', () => {
		expect( getIconTemplateAttributes( 'blockparty/icon' ) ).toEqual( {
			width: 24,
			maxIcons: 1,
		} );
	} );
} );

describe( 'getRegisteredIconBlocks', () => {
	beforeEach( () => {
		getBlockType.mockReset();
		delete window.blockpartyTabsSettings;
	} );

	it( 'defaults to registered candidates from the shared default list', () => {
		getBlockType.mockImplementation( ( name ) =>
			name === 'blockparty/icon' ? { name } : undefined
		);

		expect( BLOCKPARTY_TABS_DEFAULT_ICON_BLOCKS ).toEqual( [
			'core/icon',
			'blockparty/icon',
			'beapi/icon-block',
		] );
		expect( getRegisteredIconBlocks() ).toEqual( [ 'blockparty/icon' ] );
	} );

	it( 'prefers core/icon when it is registered among defaults', () => {
		getBlockType.mockImplementation( ( name ) =>
			[ 'core/icon', 'blockparty/icon' ].includes( name )
				? { name }
				: undefined
		);

		expect( getRegisteredIconBlocks() ).toEqual( [
			'core/icon',
			'blockparty/icon',
		] );
	} );

	it( 'keeps only registered blocks from PHP settings', () => {
		window.blockpartyTabsSettings = {
			allowedIconBlocks: [
				'core/icon',
				'blockparty/icon',
				'beapi/icon-block',
			],
		};
		getBlockType.mockImplementation( ( name ) =>
			[ 'core/icon', 'beapi/icon-block' ].includes( name )
				? { name }
				: undefined
		);

		expect( getRegisteredIconBlocks() ).toEqual( [
			'core/icon',
			'beapi/icon-block',
		] );
	} );

	it( 'returns an empty list when no candidate is registered', () => {
		window.blockpartyTabsSettings = {
			allowedIconBlocks: [ 'blockparty/icon' ],
		};
		getBlockType.mockReturnValue( undefined );

		expect( getRegisteredIconBlocks() ).toEqual( [] );
	} );

	it( 'returns an empty list on WordPress without core/icon or legacy plugins', () => {
		getBlockType.mockReturnValue( undefined );

		expect( getRegisteredIconBlocks() ).toEqual( [] );
	} );
} );
