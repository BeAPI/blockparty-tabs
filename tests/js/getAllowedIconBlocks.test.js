/**
 * @jest-environment jsdom
 */

/**
 * Internal dependencies
 */
import {
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

	it( 'defaults to core/icon when settings are missing', () => {
		getBlockType.mockImplementation( ( name ) =>
			name === 'core/icon' ? { name } : undefined
		);

		expect( getRegisteredIconBlocks() ).toEqual( [ 'core/icon' ] );
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
} );
