<?php
/**
 * Converts beapi/tabs content to blockparty/tabs.
 *
 * @package Blockparty\Tabs
 */

namespace Blockparty\Tabs\Migration;

/**
 * Turns old beapi/tabs markup into blockparty/tabs blocks.
 */
class TabsBlockMigrator {

	/**
	 * How many blocks were converted.
	 *
	 * @var int
	 */
	public int $migrated = 0;

	/**
	 * How many blocks could not be converted.
	 *
	 * @var int
	 */
	public int $skipped = 0;

	/**
	 * Old block name to new block name.
	 *
	 * @var array<string, string>
	 */
	private const BLOCK_MAP = [
		'beapi/tabs'            => 'blockparty/tabs',
		'beapi/tabs-nav'        => 'blockparty/tabs-nav',
		'beapi/tabs-nav-item'   => 'blockparty/tabs-nav-item',
		'beapi/tabs-panels'     => 'blockparty/tabs-panels',
		'beapi/tabs-panel-item' => 'blockparty/tabs-panel-item',
	];

	/**
	 * Class replacements (longest keys first).
	 *
	 * @var array<string, string>
	 */
	private const CLASS_MAP = [
		'wp-block-beapi-tabs-panel-item__inner' => 'wp-block-blockparty-tabs-panel-item__inner',
		'wp-block-beapi-tabs-nav-link'           => 'wp-block-blockparty-tabs-nav-link',
		'wp-block-beapi-tabs-nav-item'           => 'wp-block-blockparty-tabs-nav-item',
		'wp-block-beapi-tabs-panel-item'         => 'wp-block-blockparty-tabs-panel-item',
		'wp-block-beapi-tabs-panels'             => 'wp-block-blockparty-tabs-panels',
		'wp-block-beapi-tabs-nav'                => 'wp-block-blockparty-tabs-nav',
		'wp-block-beapi-tabs'                    => 'wp-block-blockparty-tabs',
	];

	/**
	 * Entry point: rewrite post content, or return null if nothing to do.
	 *
	 * @param string $content Post content.
	 * @return string|null
	 */
	public function migrate_content( string $content ): ?string {
		if ( ! $this->content_has_legacy_tabs( $content ) ) {
			return null;
		}

		$new = serialize_blocks( $this->migrate_blocks( parse_blocks( $content ) ) );

		return $new === $content ? null : $new;
	}

	/**
	 * @param string $content Post content.
	 * @return bool
	 */
	private function content_has_legacy_tabs( string $content ): bool {
		foreach ( array_keys( self::BLOCK_MAP ) as $legacy_name ) {
			if ( false !== strpos( $content, $legacy_name ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Walk every block. Rename tabs blocks and fix saved markup.
	 *
	 * @param array<int, array<string, mixed>> $blocks Parsed blocks.
	 * @return array<int, array<string, mixed>>
	 */
	private function migrate_blocks( array $blocks ): array {
		$out = [];

		foreach ( $blocks as $block ) {
			$name = $block['blockName'] ?? '';

			if ( ! empty( $block['innerBlocks'] ) ) {
				$block['innerBlocks'] = $this->migrate_blocks( $block['innerBlocks'] );
			}

			if ( isset( self::BLOCK_MAP[ $name ] ) ) {
				$block = $this->convert_block( $block, $name );
				++$this->migrated;
			}

			$out[] = $block;
		}

		return $out;
	}

	/**
	 * @param array<string, mixed> $block Parsed block.
	 * @param string               $legacy_name Legacy block name.
	 * @return array<string, mixed>
	 */
	private function convert_block( array $block, string $legacy_name ): array {
		$attrs = is_array( $block['attrs'] ?? null ) ? $block['attrs'] : [];
		$title = '';

		if ( 'beapi/tabs' === $legacy_name ) {
			$title = (string) ( $attrs['title'] ?? '' );
			unset( $attrs['title'] );
			$block['innerBlocks'] = $this->apply_title_to_nav( $block['innerBlocks'] ?? [], $title );
		}

		$block['blockName'] = self::BLOCK_MAP[ $legacy_name ];
		$block['attrs']     = $attrs;

		$this->rewrite_block_markup( $block, $block['blockName'], $attrs );

		return $block;
	}

	/**
	 * Move legacy parent title onto the tabs-nav block as ariaLabel.
	 *
	 * @param array<int, array<string, mixed>> $inner_blocks Nav / panels children.
	 * @param string                           $title        Parent title attribute.
	 * @return array<int, array<string, mixed>>
	 */
	private function apply_title_to_nav( array $inner_blocks, string $title ): array {
		if ( '' === $title ) {
			return $inner_blocks;
		}

		foreach ( $inner_blocks as $index => $inner ) {
			if ( 'blockparty/tabs-nav' !== ( $inner['blockName'] ?? '' ) ) {
				continue;
			}

			$nav_attrs = is_array( $inner['attrs'] ?? null ) ? $inner['attrs'] : [];
			if ( empty( $nav_attrs['ariaLabel'] ) ) {
				$nav_attrs['ariaLabel']      = $title;
				$inner['attrs']              = $nav_attrs;
				$this->rewrite_block_markup( $inner, 'blockparty/tabs-nav', $nav_attrs );
			}

			$inner_blocks[ $index ] = $inner;
			break;
		}

		return $inner_blocks;
	}

	/**
	 * Replace legacy classes and adjust ARIA in innerHTML / innerContent.
	 *
	 * @param array<string, mixed> $block     Parsed block (by reference).
	 * @param string               $block_name New block name.
	 * @param array<string, mixed> $attrs     Block attributes.
	 * @return void
	 */
	private function rewrite_block_markup( array &$block, string $block_name, array $attrs ): void {
		if ( isset( $block['innerHTML'] ) && is_string( $block['innerHTML'] ) ) {
			$block['innerHTML'] = $this->transform_markup( $block['innerHTML'], $block_name, $attrs );
		}

		if ( empty( $block['innerContent'] ) || ! is_array( $block['innerContent'] ) ) {
			return;
		}

		foreach ( $block['innerContent'] as $index => $chunk ) {
			if ( ! is_string( $chunk ) || '' === $chunk ) {
				continue;
			}

			$block['innerContent'][ $index ] = $this->transform_markup( $chunk, $block_name, $attrs );
		}
	}

	/**
	 * @param string               $html        Markup fragment.
	 * @param string               $block_name  Block name after migration.
	 * @param array<string, mixed> $attrs       Block attributes.
	 * @return string
	 */
	private function transform_markup( string $html, string $block_name, array $attrs ): string {
		$html = $this->replace_classes( $html );

		switch ( $block_name ) {
			case 'blockparty/tabs':
				return $this->transform_tabs_root_markup( $html );
			case 'blockparty/tabs-nav':
				return $this->transform_tabs_nav_markup( $html, $attrs );
			case 'blockparty/tabs-nav-item':
				return $this->transform_tabs_nav_item_markup( $html, $attrs );
			case 'blockparty/tabs-panel-item':
				return $this->transform_tabs_panel_item_markup( $html, $attrs );
			default:
				return $html;
		}
	}

	/**
	 * @param string $html Markup.
	 * @return string
	 */
	private function replace_classes( string $html ): string {
		return str_replace( array_keys( self::CLASS_MAP ), array_values( self::CLASS_MAP ), $html );
	}

	/**
	 * @param string $html Markup.
	 * @return string
	 */
	private function transform_tabs_root_markup( string $html ): string {
		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return preg_replace( '/\srole=(["\'])tablist\1/i', '', $html ) ?? $html;
		}

		$processor = new \WP_HTML_Tag_Processor( $html );
		if ( $processor->next_tag() ) {
			$processor->remove_attribute( 'role' );
			$processor->remove_attribute( 'aria-label' );
		}

		return $processor->get_updated_html();
	}

	/**
	 * @param string               $html   Markup.
	 * @param array<string, mixed> $attrs  Block attributes.
	 * @return string
	 */
	private function transform_tabs_nav_markup( string $html, array $attrs ): string {
		$label = (string) ( $attrs['ariaLabel'] ?? '' );

		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $html;
		}

		$processor = new \WP_HTML_Tag_Processor( $html );
		if ( $processor->next_tag( [ 'tag_name' => 'UL' ] ) ) {
			$processor->set_attribute( 'role', 'tablist' );
			if ( '' !== $label ) {
				$processor->set_attribute( 'aria-label', $label );
			}
		}

		return $processor->get_updated_html();
	}

	/**
	 * @param string               $html   Markup.
	 * @param array<string, mixed> $attrs  Block attributes.
	 * @return string
	 */
	private function transform_tabs_nav_item_markup( string $html, array $attrs ): string {
		$index     = (int) ( $attrs['index'] ?? 0 );
		$is_active = 0 === $index;

		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $html;
		}

		$processor = new \WP_HTML_Tag_Processor( $html );
		while ( $processor->next_tag() ) {
			if ( 'LI' === $processor->get_tag() ) {
				$processor->set_attribute( 'class', $this->toggle_state_class( (string) $processor->get_attribute( 'class' ), 'is-active', $is_active ) );
			}

			if ( 'A' === $processor->get_tag() && 'tab' === $processor->get_attribute( 'role' ) ) {
				$processor->set_attribute( 'aria-selected', $is_active ? 'true' : 'false' );
				if ( $is_active ) {
					$processor->remove_attribute( 'tabindex' );
				} else {
					$processor->set_attribute( 'tabindex', '-1' );
				}
			}
		}

		return $processor->get_updated_html();
	}

	/**
	 * @param string               $html   Markup.
	 * @param array<string, mixed> $attrs  Block attributes.
	 * @return string
	 */
	private function transform_tabs_panel_item_markup( string $html, array $attrs ): string {
		$index     = (int) ( $attrs['index'] ?? 0 );
		$is_active = 0 === $index;

		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $html;
		}

		$processor = new \WP_HTML_Tag_Processor( $html );
		while ( $processor->next_tag() ) {
			if ( 'DIV' !== $processor->get_tag() || 'tabpanel' !== $processor->get_attribute( 'role' ) ) {
				continue;
			}

			$class = (string) $processor->get_attribute( 'class' );
			$class = $this->toggle_state_class( $class, 'is-active', $is_active );
			$class = $this->toggle_state_class( $class, 'is-hidden', ! $is_active );
			$processor->set_attribute( 'class', $class );
		}

		return $processor->get_updated_html();
	}

	/**
	 * @param string $class       Existing class string.
	 * @param string $state_class State class to add or remove.
	 * @param bool   $enable      Whether the state class should be present.
	 * @return string
	 */
	private function toggle_state_class( string $class, string $state_class, bool $enable ): string {
		$parts = array_filter( preg_split( '/\s+/', trim( $class ) ) ?: [] );
		$parts = array_values( array_diff( $parts, [ $state_class ] ) );

		if ( $enable ) {
			$parts[] = $state_class;
		}

		return implode( ' ', $parts );
	}
}
