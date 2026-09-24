import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { TabsAddRemoveBlockControls } from '../blockparty-tabs/TabsAddRemoveControls';

const BLOCKS_CHILD = 'blockparty/tabs-nav-item';
const ALLOWED_BLOCKS = [ BLOCKS_CHILD ];
const LOCK_TEMPLATE = { lock: { move: true, remove: true } };

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { ariaLabel } = attributes;
	const blockProps = useBlockProps( {
		role: 'tablist',
	} );
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

	return (
		<>
			<TabsAddRemoveBlockControls clientId={ clientId } />
			<InspectorControls>
				<PanelBody
					title={ __( 'Settings', 'blockparty-tabs' ) }
					initialOpen={ true }
				>
					<PanelRow>
						<TextControl
							value={ ariaLabel }
							label={ __( 'Label', 'blockparty-tabs' ) }
							help={ __(
								'Describe the purpose of this tabbed interface for assistive technologies.',
								'blockparty-tabs'
							) }
							onChange={ ( content ) => {
								setAttributes( { ariaLabel: content } );
							} }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<ul { ...innerBlocksProps } />
		</>
	);
}
