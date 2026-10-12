# Migrating from `beapi/tabs-block` to `blockparty-tabs`

This document describes how to move from the abandoned [`beapi/tabs-block`](https://github.com/BeAPI/beapi-tabs-block) package to `beapi/blockparty-tabs`.

## Package swap

```bash
composer remove beapi/tabs-block
composer require beapi/blockparty-tabs
```

Activate `blockparty-tabs` and deactivate `beapi-tabs-block` (or `tabs-block`).

## Block model changes

| Old | New |
|---|---|
| `beapi/tabs` | `blockparty/tabs` |
| `beapi/tabs-nav` | `blockparty/tabs-nav` |
| `beapi/tabs-nav-item` | `blockparty/tabs-nav-item` |
| `beapi/tabs-panels` | `blockparty/tabs-panels` |
| `beapi/tabs-panel-item` | `blockparty/tabs-panel-item` |
| Parent `title` (saved as `aria-label` on the root) | `ariaLabel` on `blockparty/tabs-nav` |
| CSS `.wp-block-beapi-tabs` | CSS `.wp-block-blockparty-tabs` |

Nested structure (nav + panels, paired nav/panel items) is preserved. Icons inside tab labels keep working when `blockparty-icons` or `beapi/icon-block` is active (`blockparty_tabs_allowed_icon_blocks` filter).

## Content migration (WP-CLI)

WP-CLI only loads **active** plugins. If you see `'blockparty-tabs' is not a registered wp command`, activate the plugin first:

```bash
wp plugin activate blockparty-tabs
```

After activating `blockparty-tabs` and updating theme allowlists:

```bash
# Preview (current site)
wp blockparty-tabs migrate-from-tabs-block --dry-run

# Apply on the current site
wp blockparty-tabs migrate-from-tabs-block

# Limit post types
wp blockparty-tabs migrate-from-tabs-block --post-type=post,page
```

The command always targets **one site only**. On multisite, repeat it yourself with `--url=` for each site:

```bash
wp blockparty-tabs migrate-from-tabs-block --url=https://example.com/
```

The command:

1. Scans `post_content` for `beapi/tabs*` block comments and legacy class names
2. Parses blocks, converts markup recursively, serializes back
3. Moves the parent `title` attribute to `ariaLabel` on `blockparty/tabs-nav`
4. Aligns saved HTML with blockparty-tabs `save()` output (ARIA roles, `is-active` / `is-hidden` classes)
5. Updates posts with `wp_slash()` on content
6. Logs migrated / skipped counts

### Revisions

Only the scanned post types are migrated (public REST post types + `wp_block` by default). **Revisions are not included** unless you pass them explicitly:

```bash
wp blockparty-tabs migrate-from-tabs-block --post-type=revision
```

### Duplicate Post (Yoast)

If [Yoast Duplicate Post](https://wordpress.org/plugins/duplicate-post/) is active, updating a Rewrite & Republish **copy** via `wp_update_post()` can abort the WP-CLI run.

Preferred workaround: skip that plugin for the migration only:

```bash
wp --skip-plugins=duplicate-post blockparty-tabs migrate-from-tabs-block --url=https://example.com/
```

## Front-end checklist

- Update theme allowlists from `beapi/tabs*` to `blockparty/tabs*`
- Update theme SCSS selectors from `.wp-block-beapi-tabs` to `.wp-block-blockparty-tabs`
- Smoke-test top alignment and sidebar layouts, keyboard navigation, and nested tabs
