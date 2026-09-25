import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import { tabsMenu } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: tabsMenu,
	edit: Edit,
	save,
	deprecated,
} );
