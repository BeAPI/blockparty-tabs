import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import ComposeBlockControls from './ComposeBlockControls';
import getSynchedID from '../blockparty-tabs/GetSynchedID';
import {
	getIconTemplateAttributes,
	getRegisteredIconBlocks,
} from './getAllowedIconBlocks';

export default function Edit( {
	attributes,
	setAttributes,
	clientId,
	context,
} ) {
	getSynchedID( clientId, context, setAttributes );

	const registeredIconBlocks = getRegisteredIconBlocks();
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
							templateLock="insert"
							template={ [
								[
									templateIconBlock,
									{
										...getIconTemplateAttributes(
											templateIconBlock
										),
										lock: {
											move: true,
											remove: true,
										},
									},
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
