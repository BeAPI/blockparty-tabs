import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { ToolbarGroup, ToolbarButton } from '@wordpress/components';
import { shapes } from '@beapi/icons';
import { TabsAddRemoveToolbar } from '../blockparty-tabs/TabsAddRemoveControls';

const ComposeBlockControls = ( {
	clientId,
	hasIcon,
	hasIconBlock,
	index,
	count,
	onMoveDown,
	onMoveUp,
	setAttributes,
} ) => (
	<BlockControls key="toolbar">
		<ToolbarGroup
			controls={ [
				{
					icon: 'arrow-left-alt2',
					title: __( 'Move tab before', 'blockparty-tabs' ),
					isDisabled: 0 === index,
					onClick: () => {
						onMoveUp( index );
					},
				},
				{
					icon: 'arrow-right-alt2',
					title: __( 'Move tab after', 'blockparty-tabs' ),
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
				isPressed={ hasIcon }
				isDisabled={ ! hasIconBlock }
				onClick={ () => {
					setAttributes( { hasIcon: ! hasIcon } );
				} }
			/>
		</ToolbarGroup>
		<TabsAddRemoveToolbar clientId={ clientId } index={ index } />
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
		const { moveBlocksDown, moveBlocksUp, updateBlockAttributes } =
			dispatch( 'core/block-editor' );
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
		};
	} ),
] )( ComposeBlockControls );
