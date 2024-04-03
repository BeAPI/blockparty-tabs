import classnames from 'classnames';
import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';

export default function save( { attributes } ) {
	const { title, mode } = attributes;

	const innerBlocksProps = useInnerBlocksProps.save(
		useBlockProps.save( {
			className: classnames( {
				[ `has-align-${ mode }` ]: mode,
			} ),
		} )
	);
	return <div { ...innerBlocksProps } aria-label={ title } role="tablist" />;
}
