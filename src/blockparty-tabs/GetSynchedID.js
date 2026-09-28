import { useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';

/**
 * Keeps nav/panel item linkId, panelId, and index in sync with the parent tabs instance.
 * Must run as a hook (not during render) to avoid updating BlockTools while editing.
 *
 * @param {string}   clientId      Block client ID.
 * @param {Object}   context       Block context (expects blockparty/Tabs).
 * @param {Object}   attributes    Current block attributes.
 * @param {Function} setAttributes Block setAttributes callback.
 */
const useSynchedID = ( clientId, context, attributes, setAttributes ) => {
	const instanceId = context?.[ 'blockparty/Tabs' ];
	const currentIndex = useSelect(
		( select ) => select( 'core/block-editor' ).getBlockIndex( clientId ),
		[ clientId ]
	);

	useEffect( () => {
		if ( typeof instanceId === 'undefined' ) {
			return;
		}

		const synkedId = instanceId + '-' + currentIndex;
		const linkId = 'block-tab-' + synkedId;
		const panelId = 'block-panel-' + synkedId;

		if (
			attributes.linkId === linkId &&
			attributes.panelId === panelId &&
			attributes.index === currentIndex
		) {
			return;
		}

		setAttributes( { linkId, panelId, index: currentIndex } );
	}, [
		instanceId,
		currentIndex,
		attributes.linkId,
		attributes.panelId,
		attributes.index,
		setAttributes,
	] );
};

export default useSynchedID;
