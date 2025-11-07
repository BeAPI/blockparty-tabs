import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { createBlock } from '@wordpress/blocks';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { shapes } from '@beapi/icons';

const ComposeBlockControls = ( {
	hasIcon,
	hasIconBlock,
	index,
	count,
	onMoveDown,
	onMoveUp,
	onRemoveBlocks,
	onInsertBlock,
	setAttributes,
} ) => (
	<BlockControls key="toolbar">
		<ToolbarGroup
			controls={ [
				{
					icon: 'arrow-left-alt2',
					title: __( 'Move Item Before', 'blockparty-tabs' ),
					isDisabled: 0 === index,
					onClick: () => {
						onMoveUp( index );
					},
				},
				{
					icon: 'arrow-right-alt2',
					title: __( 'Move Item After', 'blockparty-tabs' ),
					isDisabled: count === index + 1,
					onClick: () => {
						onMoveDown( index );
					},
				},
			] }
		/>
		<ToolbarGroup>
			<ToolbarButton
				icon={ shapes }
				label={ __( 'Icon', 'blockparty-tabs' ) }
				className={ hasIcon ? 'is-pressed' : '' }
				isDisabled={ ! hasIconBlock }
				onClick={ () => {
					setAttributes( { hasIcon: ! hasIcon } );
				} }
			/>
		</ToolbarGroup>
		<ToolbarGroup
			controls={ [
				{
					icon: 'table-col-before',
					title: __( 'Add Item Before', 'blockparty-tabs' ),
					onClick: () => {
						onInsertBlock( index );
					},
				},
				{
					icon: 'table-col-after',
					title: __( 'Add Item After', 'blockparty-tabs' ),
					onClick: () => {
						onInsertBlock( index + 1 );
					},
				},
				{
					icon: 'trash',
					title: __( 'Delete Item', 'blockparty-tabs' ),
					onClick: () => {
						onRemoveBlocks( index );
					},
				},
			] }
		/>
	</BlockControls>
);

export default compose( [
	withSelect( ( select, ownProps ) => {
		const { getBlockOrder, getBlockRootClientId } =
			select( 'core/block-editor' );
		const navId = getBlockRootClientId( ownProps.clientId );
		const parentId = getBlockRootClientId( navId );
		const wrappers = getBlockOrder( parentId );
		const navBlocks = getBlockOrder( wrappers[ 0 ] );

		return {
			navId: wrappers[ 0 ],
			panelId: wrappers[ 1 ],
			nav: navBlocks,
			count: navBlocks.length,
			panels: getBlockOrder( wrappers[ 1 ] ),
			clientId: ownProps.clientId,
			index: ownProps.index,
			hasIconBlock: ownProps.hasIconBlock,
			hasIcon: ownProps.hasIcon,
			setAttributes: ownProps.setAttributes,
		};
	} ),
	withDispatch( ( dispatch, { nav, navId, panels, panelId } ) => {
		const {
			removeBlock,
			moveBlocksDown,
			moveBlocksUp,
			insertBlock,
			updateBlockAttributes,
		} = dispatch( 'core/block-editor' );
		const LOCK_TEMPLATE = { lock: { move: true, remove: true } };
		return {
			onMoveDown( index ) {
				updateBlockAttributes( [ nav[ index ], panels[ index ] ], {
					lock: { move: false, remove: true },
				} );
				moveBlocksDown( [ panels[ index ] ], panelId );
				moveBlocksDown( [ nav[ index ] ], navId );
				updateBlockAttributes( [ nav[ index ], panels[ index ] ], {
					lock: { move: true, remove: true },
				} );
			},
			onMoveUp( index ) {
				updateBlockAttributes( [ nav[ index ], panels[ index ] ], {
					lock: { move: false, remove: true },
				} );
				moveBlocksUp( [ panels[ index ] ], panelId );
				moveBlocksUp( [ nav[ index ] ], navId );
				updateBlockAttributes( [ nav[ index ], panels[ index ] ], {
					lock: { move: true, remove: true },
				} );
			},
			onRemoveBlocks( index ) {
				updateBlockAttributes( [ nav[ index ], panels[ index ] ], {
					lock: { move: true, remove: false },
				} );
				removeBlock( panels[ index ] );
				removeBlock( nav[ index ] );
			},
			onInsertBlock( index ) {
				const newNavItem = createBlock(
					'blockparty/tabs-nav-item',
					LOCK_TEMPLATE
				);
				const newPanelItem = createBlock(
					'blockparty/tabs-panel-item',
					LOCK_TEMPLATE
				);
				insertBlock( newPanelItem, index, panelId );
				insertBlock( newNavItem, index, navId );
			},
		};
	} ),
] )( ComposeBlockControls );
