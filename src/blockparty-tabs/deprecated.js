/**
 * Deprecated versions of the tabs block.
 */

import classnames from 'classnames';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Moves a legacy parent label onto the tabs-nav inner block as ariaLabel.
 *
 * @param {Object} attributes  Parent block attributes.
 * @param {Array}  innerBlocks Parent inner blocks.
 * @param {string} label       Label to apply on the nav block.
 * @return {Array} Migrated [ attributes, innerBlocks ].
 */
function migrateLabelToNav( attributes, innerBlocks, label ) {
	const { title, ariaLabel, ...rest } = attributes;
	const value = label || ariaLabel || title || '';

	if ( ! value || ! Array.isArray( innerBlocks ) ) {
		return [ rest, innerBlocks ];
	}

	const nextInnerBlocks = innerBlocks.map( ( block ) => {
		if ( block.name !== 'blockparty/tabs-nav' ) {
			return block;
		}

		return {
			...block,
			attributes: {
				...block.attributes,
				ariaLabel: value,
			},
		};
	} );

	return [ rest, nextInnerBlocks ];
}

/**
 * Parent wrapper with role="tablist" and supports.ariaLabel (pre-nav move).
 */
const v2 = {
	attributes: {
		tabsIndex: {
			type: 'integer',
			default: 0,
		},
		tabsActive: {
			type: 'integer',
			default: 0,
		},
		mode: {
			type: 'string',
			default: 'top-left',
		},
		ariaLabel: {
			type: 'string',
			source: 'attribute',
			attribute: 'aria-label',
			selector: '*',
		},
	},
	supports: {
		html: false,
		anchor: true,
		align: [ 'wide', 'full' ],
		ariaLabel: true,
	},
	migrate( attributes, innerBlocks ) {
		return migrateLabelToNav( attributes, innerBlocks );
	},
	save( { attributes } ) {
		const { mode } = attributes;

		const innerBlocksProps = useInnerBlocksProps.save(
			useBlockProps.save( {
				className: classnames( {
					[ `has-align-${ mode }` ]: mode,
				} ),
				role: 'tablist',
			} )
		);

		return <div { ...innerBlocksProps } />;
	},
};

/**
 * Original parent wrapper using a custom title attribute as aria-label.
 */
const v1 = {
	attributes: {
		tabsIndex: {
			type: 'integer',
			default: 0,
		},
		title: {
			type: 'string',
			default: '',
		},
		tabsActive: {
			type: 'integer',
			default: 0,
		},
		mode: {
			type: 'string',
			default: 'top-left',
		},
	},
	supports: {
		html: false,
		anchor: true,
		align: [ 'wide', 'full' ],
	},
	migrate( attributes, innerBlocks ) {
		return migrateLabelToNav( attributes, innerBlocks, attributes.title );
	},
	save( { attributes } ) {
		const { title, mode } = attributes;

		const innerBlocksProps = useInnerBlocksProps.save(
			useBlockProps.save( {
				className: classnames( {
					[ `has-align-${ mode }` ]: mode,
				} ),
			} )
		);

		return (
			<div { ...innerBlocksProps } aria-label={ title } role="tablist" />
		);
	},
};

export default [ v2, v1 ];
