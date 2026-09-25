import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { hasIcon, label, panelId, linkId, index } = attributes;
	const isSelected = 0 === index;
	const blockProps = useBlockProps.save( {
		className: isSelected ? 'is-active' : undefined,
	} );

	return (
		<li { ...blockProps }>
			<a
				id={ linkId }
				role="tab"
				aria-controls={ panelId }
				aria-selected={ isSelected }
				tabIndex={ isSelected ? undefined : -1 }
				className="wp-block-blockparty-tabs-nav-link"
				href={ '#' + linkId }
			>
				{ hasIcon && <InnerBlocks.Content /> }
				<RichText.Content tagName="span" value={ label } />
			</a>
		</li>
	);
}
