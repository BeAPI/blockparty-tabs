=== Blockparty Tabs ===
Contributors:      Be API Technical team
Tags:              block, tabs, accessibility
Requires at least: 6.4
Requires PHP:      8.1
Tested up to:      7.1
Stable tag:        2.1.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

Accessible Tabs block for the WordPress block editor.

== Description ==

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/blockparty-tabs` directory, or install the plugin through the WordPress plugins screen directly.
1. Activate the plugin through the 'Plugins' screen in WordPress

== Frequently Asked Questions ==

= A question that someone might have =

An answer to that question.

== Screenshots ==

1. This screen shot description corresponds to screenshot-1.(png|jpg|jpeg|gif). Note that the screenshot is taken from
the /assets directory or the directory that contains the stable readme.txt (tags or trunk). Screenshots in the /assets
directory take precedence. For example, `/assets/screenshot-1.png` would win over `/tags/4.3/screenshot-1.png`
(or jpg, jpeg, gif).
2. This is the second screen shot

== Changelog ==

= 2.1.0 =

* Add WP-CLI command `wp blockparty-tabs migrate-from-tabs-block` to migrate `beapi/tabs*` content to `blockparty/tabs*`
* Add `MIGRATION.md` for upgrading from `beapi/tabs-block`
* Add PHPUnit coverage for the tabs block migrator

= 2.0.1 =

* Fix full-width (`alignfull`) tabs so panel padding is reset correctly
* Scope add/remove tab toolbar controls per block type (avoid ambiguous deletions from the panels wrapper)
* Update French translations

= 2.0.0 =

* Require WordPress 6.2 or later
* Prefer native `core/icon` for tab icons when available (WordPress 7.0+), with Blockparty / BeAPI icon blocks still allowed by default for WordPress 6.2–6.8
* Fix frontend spacing and styles for `core/icon` next to tab labels
* Add `blockparty_tabs_allowed_icon_blocks` filter to customize allowed icon blocks
* Limit tabs to a single icon block (no duplication)
* Improve accessibility: move `tablist` to nav and complete ARIA roles
* Expand block supports and refresh block descriptions
* Remove anchor support from the panel item block
* Share add/remove tab toolbar controls across nav and panels
* Add appender to insert synced tabs from the navigation
* Fix KSES stripping of tab ARIA attributes (`aria-controls`, `aria-selected`, `aria-expanded`) and `tabindex`
* Fix stale active index after tab removal
* Fix panel pairing locks when moving tabs
* Fix deprecated block versions omitting original supports
* Fix block validation after save when existing tabs were invalidated
* Fix saved tab nav items missing the active class
* Ship a `react-jsx-runtime` webpack polyfill so editor scripts load on WordPress 6.2–6.5
* Fix editor warnings by avoiding setState during render and enabling direct inner block insertion
* Add PHPUnit, Jest, and Playwright test suites with GitHub Actions CI
* Update French translations
* Move release/version scripts under `tests/bin`
* Remove `@beapi/icons` dependency

= 1.1.5 =

* Fix editor margin reset for tabs block

= 1.1.4 =

* Performance improvements removed script blocking time.

= 1.1.3 =

* Performance improvements

= 1.1.2 =

* Fix css for nested tabs block

= 1.1.1 =

* Update block icons
* Add WordPress Playground blueprint file

= 1.1.0 =

* Support for `blockparty/icons` block

= 1.0.6 =

* Update view and edit script to allow to use nested tabs block (tabs inside tab panel).

= 1.0.5 =

* Update block icons

= 1.0.4 =

* Replacement of icon for the icon block

= 1.0.3 =

* fix icon inserter

= 1.0.2 =

* allow aria and tabindex attributes

= 1.0.1 =

* fix tabs scripts

= 1.0.0 =

* Initial release
