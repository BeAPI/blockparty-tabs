import { getBlockType } from '@wordpress/blocks';

const DEFAULT_ICON_BLOCK = 'core/icon';

/**
 * Legacy Blockparty / BeAPI icon blocks expect width + maxIcons.
 * core/icon uses dimensions width support instead.
 *
 * @param {string} blockName Icon block name.
 * @return {Object} Template attributes for InnerBlocks.
 */
export const getIconTemplateAttributes = ( blockName ) => {
	if ( 'core/icon' === blockName ) {
		return {
			style: {
				dimensions: {
					width: '24px',
				},
			},
		};
	}

	return { width: 24, maxIcons: 1 };
};

/**
 * Resolves allowed icon blocks from PHP settings, keeping only registered ones.
 *
 * @return {string[]} Registered icon block names.
 */
export const getRegisteredIconBlocks = () => {
	const fromPhp = window?.blockpartyTabsSettings?.allowedIconBlocks;
	const candidates =
		Array.isArray( fromPhp ) && fromPhp.length > 0
			? fromPhp
			: [ DEFAULT_ICON_BLOCK ];

	return candidates.filter(
		( blockName ) => typeof getBlockType( blockName ) !== 'undefined'
	);
};
