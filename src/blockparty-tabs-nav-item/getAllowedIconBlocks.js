import { getBlockType } from '@wordpress/blocks';

/**
 * Default icon blocks allowed inside tab nav items.
 *
 * `core/icon` ships in WordPress 7.0+. Legacy Blockparty / BeAPI icon blocks
 * remain so icons keep working on WordPress 6.2–6.8 when those plugins are
 * active. Only registered names are kept by getRegisteredIconBlocks().
 */
export const BLOCKPARTY_TABS_DEFAULT_ICON_BLOCKS = [
	'core/icon',
	'blockparty/icon',
	'beapi/icon-block',
];

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
			: BLOCKPARTY_TABS_DEFAULT_ICON_BLOCKS;

	return candidates.filter(
		( blockName ) => typeof getBlockType( blockName ) !== 'undefined'
	);
};
