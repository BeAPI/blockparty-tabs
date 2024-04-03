import { withSelect } from '@wordpress/data';
import { compose } from '@wordpress/compose';

const TabsFocus = ( { activeTab, setAttributes } ) => {
	if ( activeTab >= 0 ) {
		setAttributes( { tabsActive: activeTab } );
	}
	return null;
};

export default compose( [
	withSelect( ( select, ownProps ) => {
		const {
			getBlockName,
			getBlockIndex,
			getSelectedBlockClientId,
			getBlockParentsByBlockName,
			hasSelectedInnerBlock,
		} = select( 'core/block-editor' );
		if ( ! hasSelectedInnerBlock( ownProps.clientId, true ) ) {
			return {
				activeTab: -1,
				setAttributes: ownProps.setAttributes,
			};
		}
		const selected = getSelectedBlockClientId();
		const name = getBlockName( selected );
		let currentIndex = getBlockIndex( selected );
		if (
			'blockparty/tabs-panel-item' !== name &&
			'blockparty/tabs-nav-item' !== name
		) {
			const parents = getBlockParentsByBlockName( selected, [
				'blockparty/tabs-nav-item',
				'blockparty/tabs-panel-item',
			] );
			currentIndex = getBlockIndex( parents[ 0 ] );
		}
		return {
			activeTab: currentIndex,
			setAttributes: ownProps.setAttributes,
		};
	} ),
] )( TabsFocus );
