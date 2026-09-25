import classnames from 'classnames';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { select } from '@wordpress/data';
import useSynchedID from '../blockparty-tabs/GetSynchedID';
import { TabsAddRemoveBlockControls } from '../blockparty-tabs/TabsAddRemoveControls';

export default function Edit( {
	setAttributes,
	clientId,
	context,
	attributes,
} ) {
	useSynchedID( clientId, context, attributes, setAttributes );
	const { index, panelId, linkId } = attributes;
	const tabsActive = context?.[ 'blockparty/TabsActive' ];
	const isSelected = tabsActive === index;
	const blockProps = useBlockProps( {
		className: classnames( {
			'is-active': isSelected,
		} ),
		role: 'tabpanel',
		tabIndex: 0,
		id: panelId,
		'aria-labelledby': linkId,
	} );
	let allowedBlocks = [];
	const hasSupport = select( 'core/blocks' ).hasBlockSupport(
		'blockparty/tabs',
		'tabsPanelBlocks'
	);
	if ( hasSupport ) {
		allowedBlocks = select( 'core/blocks' ).getBlockSupport(
			'blockparty/tabs',
			'tabsPanelBlocks'
		);
	} else {
		allowedBlocks = select( 'core/blocks' )
			.getBlockTypes()
			.map( ( block ) => {
				return block.name;
			} )
			.filter( ( blockName ) => {
				return (
					blockName !== 'blockparty/tabs' &&
					blockName !== 'blockparty/tabs-nav' &&
					blockName !== 'blockparty/tabs-nav-item' &&
					blockName !== 'blockparty/tabs-panels' &&
					blockName !== 'blockparty/tabs-panel-item'
				);
			} );
	}

	return (
		<>
			<TabsAddRemoveBlockControls clientId={ clientId } index={ index } />
			<div { ...blockProps }>
				<InnerBlocks
					allowedBlocks={ allowedBlocks }
					templateLock={ false }
					templateInsertUpdatesSelection={ false }
					template={ [ [ 'core/paragraph' ] ] }
				/>
			</div>
		</>
	);
}
