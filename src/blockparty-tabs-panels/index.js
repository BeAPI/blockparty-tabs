import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { tab } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: tab,
	edit: Edit,
	save,
} );
