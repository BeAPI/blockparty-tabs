import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { tabsMenuItem } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: tabsMenuItem,
	edit: Edit,
	save,
} );
