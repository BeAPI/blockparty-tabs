import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

const BLOCKS_CHILD = 'blockparty/tabs-panel-item';
const ALLOWED_BLOCKS = [ BLOCKS_CHILD ];
const LOCK_TEMPLATE = { lock: { move: true, remove: true } };

export default function Edit( {} ) {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		allowedBlocks: ALLOWED_BLOCKS,
		__experimentalDirectInsert: false,
		templateLock: false,
		template: [
			[ BLOCKS_CHILD, LOCK_TEMPLATE ],
			[ BLOCKS_CHILD, LOCK_TEMPLATE ],
			[ BLOCKS_CHILD, LOCK_TEMPLATE ],
		],
		templateInsertUpdatesSelection: false,
		renderAppender: false,
	} );

	return <section { ...innerBlocksProps } />;
}
