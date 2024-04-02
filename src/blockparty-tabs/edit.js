import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	BlockControls,
	AlignmentControl,
} from '@wordpress/block-editor';
import { PanelBody, PanelRow, TextControl } from '@wordpress/components';
import { select } from '@wordpress/data';
import TabsFocus from './TabsFocus';
import {
	heading,
	justifyRight,
	justifyCenter,
	justifyLeft,
	pullLeft,
	pullRight,
	justifySpaceBetween,
} from '@wordpress/icons';
import './editor.scss';

const DEFAULT_TABS_POSITIONS = [
	{
		icon: justifyLeft,
		title: __( 'Align top left', 'blockparty-tabs' ),
		align: 'top-left',
	},
	{
		icon: justifyCenter,
		title: __( 'Align top center', 'blockparty-tabs' ),
		align: 'top-center',
	},
	{
		icon: justifyRight,
		title: __( 'Align top right', 'blockparty-tabs' ),
		align: 'top-right',
	},
	{
		icon: justifySpaceBetween,
		title: __( 'Align top justified', 'blockparty-tabs' ),
		align: 'top-justify',
	},
	{
		icon: pullLeft,
		title: __( 'Align sidebar right', 'blockparty-tabs' ),
		align: 'sidebar-right',
	},
	{
		icon: pullRight,
		title: __( 'Align sidebar left', 'blockparty-tabs' ),
		align: 'sidebar-left',
	},
];

const setTabsIndex = ( setAttributes, clientId ) => {
	const currentIndex =
		select( 'core/block-editor' ).getBlockIndex( clientId );
	setAttributes( { tabsIndex: currentIndex } );
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	setTabsIndex( setAttributes, clientId );
	const { title, mode } = attributes;
	const blockProps = useBlockProps( {
		className: classnames( {
			[ `has-align-${ mode }` ]: mode,
		} ),
	} );

	const hasSupport = select( 'core/blocks' ).hasBlockSupport(
		'blockparty/tabs',
		'tabsPosition'
	);
	let tabsPositions = DEFAULT_TABS_POSITIONS;
	if ( hasSupport ) {
		tabsPositions = select( 'core/blocks' ).getBlockSupport(
			'blockparty/tabs',
			'tabsPosition'
		);
		if ( ! Array.isArray( tabsPositions ) ) {
			tabsPositions = [];
		}
	}

	const innerBlocksProps = useInnerBlocksProps( blockProps, {
		__experimentalDirectInsert: false,
		templateLock: 'all',
		template: [ [ 'blockparty/tabs-nav' ], [ 'blockparty/tabs-panels' ] ],
		templateInsertUpdatesSelection: true,
	} );
	return (
		<>
			<BlockControls key="block">
				<AlignmentControl
					value={ mode }
					describedBy={ __( 'Change tabs alignment' ) }
					alignmentControls={ tabsPositions }
					onChange={ ( newAlign ) =>
						setAttributes( { mode: newAlign } )
					}
				/>
			</BlockControls>
			<InspectorControls>
				<PanelBody
					title={ __( 'Accessibility', 'blockparty-tabs' ) }
					icon={ heading }
					initialOpen={ true }
				>
					<PanelRow>
						<TextControl
							value={ title }
							label={ __( 'Title' ) }
							onChange={ ( content ) => {
								setAttributes( { title: content } );
							} }
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<TabsFocus clientId={ clientId } setAttributes={ setAttributes } />
			<div { ...innerBlocksProps } />
		</>
	);
}
