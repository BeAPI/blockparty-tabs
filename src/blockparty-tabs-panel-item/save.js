import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { panelId, linkId, index } = attributes;
	const isSelected = 0 === index;
	const blockProps = useBlockProps.save( {
		role: 'tabpanel',
		tabIndex: 0,
		className: isSelected ? 'is-active' : 'is-hidden',
	} );
	const innerBlocksProps = useInnerBlocksProps.save( {
		className: 'wp-block-blockparty-tabs-panel-item__inner',
	} );
	return (
		<div { ...blockProps } id={ panelId } aria-labelledby={ linkId }>
			<div { ...innerBlocksProps } />
		</div>
	);
}
