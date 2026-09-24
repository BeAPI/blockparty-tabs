import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';
import { homeButton } from '@wordpress/icons';

registerBlockType( metadata.name, {
	icon: homeButton,
	edit: Edit,
	save,
	deprecated,
} );
