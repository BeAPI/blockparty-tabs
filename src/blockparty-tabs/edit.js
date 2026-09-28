import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockControls,
	AlignmentControl,
} from '@wordpress/block-editor';
import { useEffect } from '@wordpress/element';
import { select, useSelect } from '@wordpress/data';
import {
	justifyRight,
	justifyCenter,
	justifyLeft,
	pullLeft,
	pullRight,
	justifySpaceBetween,
} from '@wordpress/icons';
import './editor.scss';
import { useSyncTabsActiveForTabsBlock } from './SyncTabsActive';
import { TabsAddRemoveToolbar } from './TabsAddRemoveControls';

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

export default function Edit( { attributes, setAttributes, clientId } ) {
	useSyncTabsActiveForTabsBlock( clientId );

	const currentIndex = useSelect(
		( selectStore ) =>
			selectStore( 'core/block-editor' ).getBlockIndex( clientId ),
		[ clientId ]
	);

	useEffect( () => {
		if ( attributes.tabsIndex === currentIndex ) {
			return;
		}
		setAttributes( { tabsIndex: currentIndex } );
	}, [ attributes.tabsIndex, currentIndex, setAttributes ] );

	const { mode } = attributes;
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
		directInsert: false,
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
				<TabsAddRemoveToolbar clientId={ clientId } />
			</BlockControls>
			<div { ...innerBlocksProps } />
		</>
	);
}
