import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import ComposeBlockControls from './ComposeBlockControls';
import getSynchedID from '../blockparty-tabs/GetSynchedID';
import SyncTabsActive from '../blockparty-tabs/SyncTabsActive';

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context,
} ) {
	const DEFAULT_TABS_ICON_BLOCK = [ 'beapi/icon-block' ];
	let allowedTabsIconBlock = DEFAULT_TABS_ICON_BLOCK;
	let tabsIconBlock = allowedTabsIconBlock[ 0 ];
	const hasSupport = select( 'core/blocks' ).hasBlockSupport(
		'blockparty/tabs',
		'tabsIconBlock'
	);
	if ( hasSupport ) {
		allowedTabsIconBlock = select( 'core/blocks' ).getBlockSupport(
			'blockparty/tabs',
			'tabsIconBlock'
		);
		if (
			! Array.isArray( allowedTabsIconBlock ) ||
			typeof allowedTabsIconBlock[ 0 ] === 'undefined'
		) {
			tabsIconBlock = false;
			allowedTabsIconBlock = [];
		} else {
			tabsIconBlock = allowedTabsIconBlock[ 0 ];
		}
	}
	getSynchedID( clientId, context, setAttributes );
	const hasIconBlock =
		typeof getBlockType( tabsIconBlock ) !== 'undefined' && tabsIconBlock;
	const { hasIcon, label, index } = attributes;
	const TabsActive = context[ 'blockparty/TabsActive' ];
	const blockProps = useBlockProps( {
		className: classnames( {
			'is-active': TabsActive === index,
		} ),
	} );

	return (
		<>
			<SyncTabsActive clientId={ clientId } />
			<ComposeBlockControls
				clientId={ clientId }
				index={ index }
				hasIcon={ hasIcon }
				hasIconBlock={ hasIconBlock }
				setAttributes={ setAttributes }
			/>
			<li { ...blockProps }>
				{ hasIcon && hasIconBlock && (
					<InnerBlocks
						allowedBlocks={ allowedTabsIconBlock }
						__experimentalDirectInsert={ false }
						templateLock={ false }
						template={ [
							[ tabsIconBlock, { width: 24, maxIcons: 1 } ],
						] }
						templateInsertUpdatesSelection={ false }
						directInsert={ false }
						renderAppender={ false }
					/>
				) }
				<RichText
					tagName="span"
					allowedFormats={ [
						'core/image',
						'core/italic',
						'core/bold',
					] }
					value={ label }
					placeholder={ __( 'Item…', 'blockparty-tabs' ) }
					onChange={ ( content ) => {
						setAttributes( { label: content } );
					} }
				/>
			</li>
		</>
	);
}
