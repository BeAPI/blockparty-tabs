import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { panelId, linkId } = attributes;
	const blockProps = useBlockProps.save( {
		role: `tabpanel`,
		tabindex: 0,
	} );
	const innerBlocksProps = useInnerBlocksProps.save( {
		className: `wp-block-blockparty-tabs-panel-item__inner`,
	} );
	return (
		<div { ...blockProps } id={ panelId } aria-labelledby={ linkId }>
			<div { ...innerBlocksProps } />
		</div>
	);
}
