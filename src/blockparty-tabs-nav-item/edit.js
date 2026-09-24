import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { getBlockType } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import ComposeBlockControls from './ComposeBlockControls';
import getSynchedID from '../blockparty-tabs/GetSynchedID';

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context,
} ) {
	const DEFAULT_TABS_ICON_BLOCK = [ 'beapi/icon-block', 'blockparty/icon' ];
	let allowedTabsIconBlock = DEFAULT_TABS_ICON_BLOCK;
	const hasSupport = select( 'core/blocks' ).hasBlockSupport(
		'blockparty/tabs',
		'tabsIconBlock'
	);
	if ( hasSupport ) {
		const supportBlocks = select( 'core/blocks' ).getBlockSupport(
			'blockparty/tabs',
			'tabsIconBlock'
		);
		if (
			! Array.isArray( supportBlocks ) ||
			typeof supportBlocks[ 0 ] === 'undefined'
		) {
			allowedTabsIconBlock = [];
		} else {
			// Always include the two supported blocks (parent support + default).
			allowedTabsIconBlock = [
				...new Set( [ ...supportBlocks, ...DEFAULT_TABS_ICON_BLOCK ] ),
			];
		}
	}
	getSynchedID( clientId, context, setAttributes );
	// Keep only the actually registered blocks (active).
	const registeredIconBlocks = allowedTabsIconBlock.filter(
		( blockName ) => typeof getBlockType( blockName ) !== 'undefined'
	);
	const hasIconBlock = registeredIconBlocks.length > 0;
	const templateIconBlock = registeredIconBlocks[ 0 ];
	const { hasIcon, label, index, panelId, linkId } = attributes;
	const tabsActive = context?.[ 'blockparty/TabsActive' ];
	const isSelected = tabsActive === index;
	const blockProps = useBlockProps( {
		className: classnames( {
			'is-active': isSelected,
		} ),
	} );

	return (
		<>
			<ComposeBlockControls
				clientId={ clientId }
				index={ index }
				hasIcon={ hasIcon }
				hasIconBlock={ hasIconBlock }
				setAttributes={ setAttributes }
			/>
			<li { ...blockProps }>
				<a
					id={ linkId }
					role="tab"
					aria-controls={ panelId }
					aria-selected={ isSelected }
					tabIndex={ isSelected ? undefined : -1 }
					className="wp-block-blockparty-tabs-nav-link"
					href={ linkId ? `#${ linkId }` : '#' }
					onClick={ ( event ) => {
						event.preventDefault();
					} }
				>
					{ hasIcon && hasIconBlock && (
						<InnerBlocks
							allowedBlocks={ registeredIconBlocks }
							__experimentalDirectInsert={ false }
							templateLock={ false }
							template={ [
								[
									templateIconBlock,
									{ width: 24, maxIcons: 1 },
								],
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
				</a>
			</li>
		</>
	);
}
