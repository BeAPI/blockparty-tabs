/**
 * Syncs each blockparty/tabs block's tabsActive attribute with the editor selection.
 *
 * Runs once per tabs block (not per tab item) for performance. When the selected
 * block or its ancestors imply a tab item owned by this tabs block, updates
 * tabsActive to that item's index. Nested tabs only update their own block.
 *
 * @since 1.0.6
 */

import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch, select } from '@wordpress/data';

/** Block names that represent a single tab (nav link or panel). */
const TAB_ITEM_NAMES = [
	'blockparty/tabs-nav-item',
	'blockparty/tabs-panel-item',
];

/**
 * Finds the tab item (nav or panel) closest to the current selection.
 *
 * @param {Function} selectStore Bound select from useSelect.
 * @return {string|null} Closest tab item clientId, or null.
 */
function getClosestTabItemClientId( selectStore ) {
	const { getBlockName, getSelectedBlockClientId, getBlockParents } =
		selectStore( 'core/block-editor' );
	const selected = getSelectedBlockClientId();
	if ( ! selected ) {
		return null;
	}
	if ( TAB_ITEM_NAMES.indexOf( getBlockName( selected ) ) !== -1 ) {
		return selected;
	}
	const parents = getBlockParents( selected );
	for ( let i = 0; i < parents.length; i += 1 ) {
		if ( TAB_ITEM_NAMES.indexOf( getBlockName( parents[ i ] ) ) !== -1 ) {
			return parents[ i ];
		}
	}
	return null;
}

/**
 * Resolves the blockparty/tabs clientId that owns a tab item (same chain as legacy per-item sync).
 *
 * @param {Function} selectStore Bound select from useSelect.
 * @param {string}   tabItemId   tabs-nav-item or tabs-panel-item clientId.
 * @return {string|null} Owning blockparty/tabs clientId.
 */
function getOwningTabsBlockClientId( selectStore, tabItemId ) {
	const { getBlockRootClientId } = selectStore( 'core/block-editor' );
	const directParent = getBlockRootClientId( tabItemId );
	return directParent ? getBlockRootClientId( directParent ) : null;
}

/**
 * Subscribes to selection and syncs this tabs block's tabsActive when appropriate.
 *
 * @param {string} tabsBlockClientId This blockparty/tabs block clientId.
 * @return {void}
 */
export function useSyncTabsActiveForTabsBlock( tabsBlockClientId ) {
	const { shouldSync, targetTabsActive } = useSelect(
		( selectStore ) => {
			const closest = getClosestTabItemClientId( selectStore );
			if ( ! closest ) {
				return { shouldSync: false, targetTabsActive: 0 };
			}
			const owningTabsId = getOwningTabsBlockClientId(
				selectStore,
				closest
			);
			if ( owningTabsId !== tabsBlockClientId ) {
				return { shouldSync: false, targetTabsActive: 0 };
			}
			const { getBlockIndex } = selectStore( 'core/block-editor' );
			return {
				shouldSync: true,
				targetTabsActive: getBlockIndex( closest ),
			};
		},
		[ tabsBlockClientId ]
	);

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	useEffect( () => {
		if ( ! shouldSync ) {
			return;
		}
		const current =
			select( 'core/block-editor' ).getBlockAttributes(
				tabsBlockClientId
			)?.tabsActive;
		if ( current === targetTabsActive ) {
			return;
		}
		updateBlockAttributes( tabsBlockClientId, {
			tabsActive: targetTabsActive,
		} );
	}, [
		shouldSync,
		targetTabsActive,
		tabsBlockClientId,
		updateBlockAttributes,
	] );
}
