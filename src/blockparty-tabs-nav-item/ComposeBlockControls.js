import { __ } from '@wordpress/i18n';
import { BlockControls } from '@wordpress/block-editor';
import { withDispatch, withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';
import { SVG, Path, ToolbarGroup, ToolbarButton } from '@wordpress/components';
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
				icon={
					<SVG
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						fill="none"
					>
						<Path d="M6 9.5h3.5V6H6v3.5Zm5 .5a1 1 0 0 1-.898.995L10 11H5.5l-.103-.005a1 1 0 0 1-.892-.893L4.5 10V5.5a1 1 0 0 1 1-1H10a1 1 0 0 1 1 1V10ZM18.25 7.75a2 2 0 1 0-4 0 2 2 0 0 0 4 0Zm1.5 0a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM6.88 13.535a1 1 0 0 1 1.74 0l2.534 4.472a1 1 0 0 1-.87 1.493H5.216a1 1 0 0 1-.87-1.493l2.534-4.472ZM6.074 18h3.352L7.75 15.041l-1.676 2.96ZM14.952 13h2.596a1 1 0 0 1 .866.5l1.298 2.25a1 1 0 0 1 0 1L18.414 19l-.074.11a1 1 0 0 1-.792.39h-2.596a1 1 0 0 1-.792-.39l-.074-.11-1.298-2.25a1.001 1.001 0 0 1 0-1l1.298-2.25a1 1 0 0 1 .866-.5Zm-.72 3.25 1.01 1.75h2.017l1.009-1.75-1.01-1.75h-2.017l-1.01 1.75Z" />
					</SVG>
				}
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
