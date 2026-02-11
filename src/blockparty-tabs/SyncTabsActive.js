/**
 * Syncs the active tab state with the block selection in the editor.
 *
 * When this tab item (nav-item or panel-item) is the one selected or is the
 * closest tab item to the current block selection, updates the parent
 * blockparty/tabs block's tabsActive attribute to this item's index.
 *
 * This direct link (the clicked block updates its own tabs block) ensures
 * correct behavior with nested tabs: only the tabs block that owns the
 * selected tab is updated.
 *
 * @since 1.0.6
 *
 * @param {Object}   props         Component props.
 * @param {string}   props.clientId This block's clientId (tabs-nav-item or tabs-panel-item).
 * @return {null} Renders nothing.
 */
import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';

/** Block names that represent a single tab (nav link or panel). */
const TAB_ITEM_NAMES = [
	'blockparty/tabs-nav-item',
	'blockparty/tabs-panel-item',
];

export default function SyncTabsActive( { clientId } ) {
	const { selectedBlockClientId, closestTabItemId, tabsBlockId, myIndex } =
		useSelect(
			( select ) => {
				const {
					getBlockName,
					getBlockIndex,
					getSelectedBlockClientId,
					getBlockParents,
					getBlockRootClientId,
				} = select( 'core/block-editor' );
				const selected = getSelectedBlockClientId();
				if ( ! selected ) {
					return {
						selectedBlockClientId: null,
						closestTabItemId: null,
						tabsBlockId: null,
						myIndex: 0,
					};
				}
				// Find the tab item closest to the selection: the selected block if it
				// is a tab item, otherwise the first tab item in the ancestor chain.
				let closest = null;
				if (
					TAB_ITEM_NAMES.indexOf( getBlockName( selected ) ) !== -1
				) {
					closest = selected;
				} else {
					const parents = getBlockParents( selected );
					for ( let i = 0; i < parents.length; i += 1 ) {
						if (
							TAB_ITEM_NAMES.indexOf(
								getBlockName( parents[ i ] )
							) !== -1
						) {
							closest = parents[ i ];
							break;
						}
					}
				}
				// Parent chain: this block → tabs-nav or tabs-panels → blockparty/tabs.
				const directParent = getBlockRootClientId( clientId );
				const tabsId = directParent
					? getBlockRootClientId( directParent )
					: null;
				return {
					selectedBlockClientId: selected,
					closestTabItemId: closest,
					tabsBlockId: tabsId,
					myIndex: getBlockIndex( clientId ),
				};
			},
			[ clientId ]
		);

	const { updateBlockAttributes } = useDispatch( 'core/block-editor' );

	// When this block is the active tab (closest to selection or selected), sync tabsActive.
	useEffect( () => {
		if ( ! selectedBlockClientId || ! tabsBlockId ) {
			return;
		}
		const isActiveTab =
			closestTabItemId === clientId || selectedBlockClientId === clientId;
		if ( ! isActiveTab ) {
			return;
		}
		updateBlockAttributes( tabsBlockId, { tabsActive: myIndex } );
	}, [
		selectedBlockClientId,
		closestTabItemId,
		clientId,
		tabsBlockId,
		myIndex,
		updateBlockAttributes,
	] );

	return null;
}
