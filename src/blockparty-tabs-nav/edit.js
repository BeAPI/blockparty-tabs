import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const BLOCKS_CHILD = 'blockparty/tabs-nav-item';
const ALLOWED_BLOCKS = [ BLOCKS_CHILD ];
const LOCK_TEMPLATE = { lock: { move: true, remove: true } };

export default function Edit() {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		__experimentalDirectInsert: false,
		orientation: 'horizontal',
		templateLock: false,
		template: [
			[ BLOCKS_CHILD, LOCK_TEMPLATE ],
			[ BLOCKS_CHILD, LOCK_TEMPLATE ],
			[ BLOCKS_CHILD, LOCK_TEMPLATE ],
		],
		templateInsertUpdatesSelection: true,
		renderAppender: false,
	} );

	return <ul { ...innerBlocksProps } />;
}
