import { select } from '@wordpress/data';

const GetSynchedID = ( clientId, context, setAttributes ) => {
	const InstanceId = context[ 'blockparty/Tabs' ];
	const currentIndex =
		select( 'core/block-editor' ).getBlockIndex( clientId );
	const synkedId = InstanceId + '-' + currentIndex;
	setAttributes( { linkId: 'block-tab-' + synkedId } );
	setAttributes( { panelId: 'block-panel-' + synkedId } );
	setAttributes( { index: currentIndex } );
};

export default GetSynchedID;
