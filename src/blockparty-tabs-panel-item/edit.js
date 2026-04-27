import classnames from 'classnames';
import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { select } from '@wordpress/data';
import getSynchedID from '../blockparty-tabs/GetSynchedID';
export default function Edit( {
	setAttributes,
	clientId,
	context,
	attributes,
} ) {
	getSynchedID( clientId, context, setAttributes );
	const { index } = attributes;
	const TabsActive = context[ 'blockparty/TabsActive' ];
	const blockProps = useBlockProps( {
		className: classnames( {
			'is-active': TabsActive === index,
		} ),
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
		<div { ...blockProps }>
			<InnerBlocks
				allowedBlocks={ allowedBlocks }
				templateLock={ false }
				templateInsertUpdatesSelection={ false }
				template={ [ [ 'core/paragraph' ] ] }
			/>
		</div>
	);
}
