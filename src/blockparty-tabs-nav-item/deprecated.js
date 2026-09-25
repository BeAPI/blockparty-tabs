/**
 * Deprecated versions of the tabs-nav-item block.
 */

import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

/**
 * Tab link with aria-selected / tabIndex but without is-active on the wrapper.
 */
const v2 = {
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
		reusable: false,
		color: {
			background: true,
			text: true,
		},
		typography: {
			fontSize: true,
		},
		__experimentalBorder: {
			color: true,
			radius: true,
			style: true,
			width: true,
		},
		layout: {
			default: {
				type: 'flex',
				flexWrap: 'wrap',
			},
			allowVerticalAlignment: false,
			allowOrientation: false,
			allowWrap: false,
		},
		spacing: {
			padding: true,
			blockGap: true,
		},
	},
	save( { attributes } ) {
		const { hasIcon, label, panelId, linkId, index } = attributes;
		const isSelected = 0 === index;

		return (
			<li { ...useBlockProps.save() }>
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
	},
};

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
		color: {
			background: true,
			text: true,
		},
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

export default [ v2, v1 ];
