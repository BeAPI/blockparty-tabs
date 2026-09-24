/**
 * Deprecated versions of the tabs-panel-item block.
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Panel without active/hidden classes derived from tabsActive context.
 */
const v1 = {
	attributes: {
		linkId: {
			type: 'string',
		},
		panelId: {
			type: 'string',
		},
		index: {
			type: 'integer',
		},
	},
	supports: {
		html: false,
		visibility: false,
		color: {
			background: true,
			text: true,
		},
	},
	save( { attributes } ) {
		const { panelId, linkId } = attributes;
		const blockProps = useBlockProps.save( {
			role: 'tabpanel',
			tabIndex: 0,
		} );
		const innerBlocksProps = useInnerBlocksProps.save( {
			className: 'wp-block-blockparty-tabs-panel-item__inner',
		} );
		return (
			<div { ...blockProps } id={ panelId } aria-labelledby={ linkId }>
				<div { ...innerBlocksProps } />
			</div>
		);
	},
};

export default [ v1 ];
