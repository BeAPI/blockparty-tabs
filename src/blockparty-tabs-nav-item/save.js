import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { hasIcon, label, panelId, linkId } = attributes;

	return (
		<li { ...useBlockProps.save() }>
			<a
				id={ linkId }
				role="tab"
				aria-controls={ panelId }
				className={ 'wp-block-blockparty-tabs-nav-link' }
				href={ '#' + linkId }
			>
				{ hasIcon && <InnerBlocks.Content /> }
				<RichText.Content tagName="span" value={ label } />
			</a>
		</li>
	);
}
