/**
 * Shared Add / Remove tab toolbar controls for the tabs block tree.
 */

import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

const TABS_BLOCK_NAME = 'blockparty/tabs';
const LOCK_TEMPLATE = { lock: { move: true, remove: true } };

/**
 * Resolves the owning blockparty/tabs clientId from any block in the tree.
 * Uses the closest ancestor so nested tabs stay scoped to their own root.
 *
 * @param {Function} selectStore Bound select from useSelect.
 * @param {string}   clientId    Current block clientId.
 * @return {string|null} Tabs root clientId, or null.
 */
function getTabsRootClientId( selectStore, clientId ) {
	const { getBlockName, getBlockParents } =
		selectStore( 'core/block-editor' );

	if ( getBlockName( clientId ) === TABS_BLOCK_NAME ) {
		return clientId;
	}

	const parents = getBlockParents( clientId, true );
	for ( let i = 0; i < parents.length; i += 1 ) {
		if ( getBlockName( parents[ i ] ) === TABS_BLOCK_NAME ) {
			return parents[ i ];
		}
	}

	return null;
}

/**
 * Toolbar group with Add tab / Remove tab buttons.
 *
 * @param {Object} props          Component props.
 * @param {string} props.clientId Block clientId (any block in the tabs tree).
 * @param {number} [props.index]  Explicit tab index; falls back to tabsActive.
 * @return {JSX.Element|null} Toolbar group, or null when the tabs root is missing.
 */
export const TabsAddRemoveToolbar = ( { clientId, index } ) => {
	const { navId, panelId, nav, panels, count, resolvedIndex } = useSelect(
		( selectStore ) => {
			const { getBlockOrder, getBlockAttributes } =
				selectStore( 'core/block-editor' );
			const tabsRootId = getTabsRootClientId( selectStore, clientId );

			if ( ! tabsRootId ) {
				return {
					navId: null,
					panelId: null,
					nav: [],
					panels: [],
					count: 0,
					resolvedIndex: 0,
				};
			}

			const wrappers = getBlockOrder( tabsRootId );
			const navBlocks = getBlockOrder( wrappers[ 0 ] );
			const tabsActive =
				getBlockAttributes( tabsRootId )?.tabsActive ?? 0;

			return {
				navId: wrappers[ 0 ],
				panelId: wrappers[ 1 ],
				nav: navBlocks,
				panels: getBlockOrder( wrappers[ 1 ] ),
				count: navBlocks.length,
				resolvedIndex: typeof index === 'number' ? index : tabsActive,
			};
		},
		[ clientId, index ]
	);

	const { removeBlock, insertBlock, updateBlockAttributes } =
		useDispatch( 'core/block-editor' );

	if ( ! navId || ! panelId ) {
		return null;
	}

	const onInsertBlock = () => {
		const insertAt = resolvedIndex + 1;
		const newNavItem = createBlock(
			'blockparty/tabs-nav-item',
			LOCK_TEMPLATE
		);
		const newPanelItem = createBlock(
			'blockparty/tabs-panel-item',
			LOCK_TEMPLATE
		);
		insertBlock( newPanelItem, insertAt, panelId );
		insertBlock( newNavItem, insertAt, navId );
	};

	const onRemoveBlocks = () => {
		updateBlockAttributes(
			[ nav[ resolvedIndex ], panels[ resolvedIndex ] ],
			{
				lock: { move: true, remove: false },
			}
		);
		removeBlock( panels[ resolvedIndex ] );
		removeBlock( nav[ resolvedIndex ] );
	};

	return (
		<ToolbarGroup>
			<ToolbarButton onClick={ onInsertBlock }>
				{ __( 'Add tab', 'blockparty-tabs' ) }
			</ToolbarButton>
			<ToolbarButton isDisabled={ 1 >= count } onClick={ onRemoveBlocks }>
				{ __( 'Remove tab', 'blockparty-tabs' ) }
			</ToolbarButton>
		</ToolbarGroup>
	);
};

/**
 * BlockControls wrapper for Add / Remove tab actions.
 *
 * @param {Object} props          Component props.
 * @param {string} props.clientId Block clientId (any block in the tabs tree).
 * @param {number} [props.index]  Explicit tab index; falls back to tabsActive.
 * @return {JSX.Element} Block controls with shared toolbar.
 */
export const TabsAddRemoveBlockControls = ( { clientId, index } ) => (
	<BlockControls>
		<TabsAddRemoveToolbar clientId={ clientId } index={ index } />
	</BlockControls>
);
