/**
 * Shared Add / Remove tab toolbar controls for the tabs block tree.
 */

import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import { ToolbarGroup, ToolbarButton, Button } from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { plus } from '@wordpress/icons';

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
 * Computes tabsActive after removing the tab at removedIndex.
 *
 * @param {number} tabsActive   Current active index on the tabs block.
 * @param {number} removedIndex Index being removed.
 * @param {number} count        Tab count before removal.
 * @return {number} Active index after removal.
 */
function getTabsActiveAfterRemove( tabsActive, removedIndex, count ) {
	const newCount = count - 1;
	if ( newCount <= 0 ) {
		return 0;
	}

	let next = tabsActive;
	if ( tabsActive > removedIndex ) {
		next = tabsActive - 1;
	} else if ( tabsActive === removedIndex ) {
		next = Math.max( 0, removedIndex - 1 );
	}

	return Math.min( next, newCount - 1 );
}

/**
 * Hook exposing insert / remove / append helpers for a tabs tree.
 *
 * @param {string} clientId Block clientId (any block in the tabs tree).
 * @param {number} [index]  Explicit tab index; falls back to tabsActive.
 * @return {Object} Tabs mutation helpers and resolved state.
 */
export const useTabsMutations = ( clientId, index ) => {
	const {
		navId,
		panelId,
		nav,
		panels,
		count,
		resolvedIndex,
		tabsRootId,
		tabsActive,
	} = useSelect(
		( selectStore ) => {
			const { getBlockOrder, getBlockAttributes } =
				selectStore( 'core/block-editor' );
			const rootClientId = getTabsRootClientId( selectStore, clientId );

			if ( ! rootClientId ) {
				return {
					navId: null,
					panelId: null,
					nav: [],
					panels: [],
					count: 0,
					resolvedIndex: 0,
					tabsRootId: null,
					tabsActive: 0,
				};
			}

			const wrappers = getBlockOrder( rootClientId );
			const navBlocks = getBlockOrder( wrappers[ 0 ] );
			const storedTabsActive =
				getBlockAttributes( rootClientId )?.tabsActive ?? 0;
			const tabCount = navBlocks.length;
			const maxIndex = Math.max( 0, tabCount - 1 );
			const nextResolvedIndex =
				typeof index === 'number'
					? index
					: Math.min( Math.max( storedTabsActive, 0 ), maxIndex );

			return {
				navId: wrappers[ 0 ],
				panelId: wrappers[ 1 ],
				nav: navBlocks,
				panels: getBlockOrder( wrappers[ 1 ] ),
				count: tabCount,
				resolvedIndex: nextResolvedIndex,
				tabsRootId: rootClientId,
				tabsActive: storedTabsActive,
			};
		},
		[ clientId, index ]
	);

	const { removeBlock, insertBlock, updateBlockAttributes } =
		useDispatch( 'core/block-editor' );

	const insertTab = ( insertAt ) => {
		if ( ! navId || ! panelId ) {
			return;
		}

		const newNavItem = createBlock(
			'blockparty/tabs-nav-item',
			LOCK_TEMPLATE
		);
		const newPanelItem = createBlock(
			'blockparty/tabs-panel-item',
			LOCK_TEMPLATE
		);
		insertBlock( newPanelItem, insertAt, panelId, false );
		insertBlock( newNavItem, insertAt, navId, true );
	};

	const insertTabAfterActive = () => {
		insertTab( resolvedIndex + 1 );
	};

	const appendTab = () => {
		insertTab( count );
	};

	const removeTab = () => {
		if ( ! navId || ! panelId || ! tabsRootId || 1 >= count ) {
			return;
		}

		if ( 0 > resolvedIndex || resolvedIndex >= count ) {
			return;
		}

		const navClientId = nav[ resolvedIndex ];
		const panelClientId = panels[ resolvedIndex ];
		if ( ! navClientId || ! panelClientId ) {
			return;
		}

		const nextTabsActive = getTabsActiveAfterRemove(
			tabsActive,
			resolvedIndex,
			count
		);

		updateBlockAttributes( [ navClientId, panelClientId ], {
			lock: { move: true, remove: false },
		} );
		removeBlock( panelClientId );
		removeBlock( navClientId );
		updateBlockAttributes( tabsRootId, {
			tabsActive: nextTabsActive,
		} );
	};

	return {
		count,
		resolvedIndex,
		canRemove: 1 < count,
		insertTabAfterActive,
		appendTab,
		removeTab,
	};
};

/**
 * Toolbar group with Add tab / Remove tab buttons.
 *
 * @param {Object} props          Component props.
 * @param {string} props.clientId Block clientId (any block in the tabs tree).
 * @param {number} [props.index]  Explicit tab index; falls back to tabsActive.
 * @return {JSX.Element} Toolbar group.
 */
export const TabsAddRemoveToolbar = ( { clientId, index } ) => {
	const { canRemove, insertTabAfterActive, removeTab } = useTabsMutations(
		clientId,
		index
	);

	return (
		<ToolbarGroup>
			<ToolbarButton onClick={ insertTabAfterActive }>
				{ __( 'Add tab', 'blockparty-tabs' ) }
			</ToolbarButton>
			<ToolbarButton isDisabled={ ! canRemove } onClick={ removeTab }>
				{ __( 'Remove tab', 'blockparty-tabs' ) }
			</ToolbarButton>
		</ToolbarGroup>
	);
};

/**
 * Button-style appender that inserts a synced nav item + panel item.
 *
 * @param {Object} props          Component props.
 * @param {string} props.clientId tabs-nav block clientId.
 * @return {JSX.Element} Appender button.
 */
export const TabsNavAppender = ( { clientId } ) => {
	const { appendTab } = useTabsMutations( clientId );

	return (
		<Button
			className="block-list-appender__toggle"
			icon={ plus }
			label={ __( 'Add tab', 'blockparty-tabs' ) }
			onClick={ appendTab }
		/>
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
