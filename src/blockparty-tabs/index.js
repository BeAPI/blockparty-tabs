import { registerBlockType } from '@wordpress/blocks';
import './style.scss';
import Edit from './edit';
import save from './save';
import metadata from './block.json';
import { tabs } from '@beapi/icons';

registerBlockType( metadata.name, {
	icon: tabs,
	edit: Edit,
	save,
} );
