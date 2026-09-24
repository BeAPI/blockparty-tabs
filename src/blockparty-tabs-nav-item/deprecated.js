/**
 * Deprecated versions of the tabs-nav-item block.
 */

import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

/**
 * Tab link without aria-selected / tabIndex in the saved markup.
 */
const v1 = {
	attributes: {
		label: {
			type: 'string',
		},
		hasIcon: {
			type: 'boolean',
			value: false,
		},
		hasFocus: {
			type: 'boolean',
			value: false,
		},
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
		lock: false,
	},
	save( { attributes } ) {
		const { hasIcon, label, panelId, linkId } = attributes;

		return (
			<li { ...useBlockProps.save() }>
				<a
					id={ linkId }
					role="tab"
					aria-controls={ panelId }
					className="wp-block-blockparty-tabs-nav-link"
					href={ '#' + linkId }
				>
					{ hasIcon && <InnerBlocks.Content /> }
					<RichText.Content tagName="span" value={ label } />
				</a>
			</li>
		);
	},
};

export default [ v1 ];
