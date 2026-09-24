/**
 * Deprecated versions of the tabs-nav block.
 */

import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

/**
 * Nav list without role="tablist" (role lived on the parent tabs wrapper).
 */
const v1 = {
	supports: {
		html: false,
		anchor: false,
		align: false,
		lock: false,
		reusable: false,
	},
	save() {
		const innerBlocksProps = useInnerBlocksProps.save(
			useBlockProps.save()
		);
		return <ul { ...innerBlocksProps } />;
	},
};

export default [ v1 ];
