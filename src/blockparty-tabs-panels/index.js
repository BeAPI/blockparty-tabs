import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { grid } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: grid,
	edit: Edit,
	save,
} );
