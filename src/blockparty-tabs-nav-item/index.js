import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { button } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: button,
	edit: Edit,
	save,
} );
