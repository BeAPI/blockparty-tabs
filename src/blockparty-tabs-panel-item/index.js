import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { homeButton } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: homeButton,
	edit: Edit,
	save,
} );
