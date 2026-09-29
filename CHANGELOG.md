# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## 2.0.1 - 2026-09-29

- Fix full-width (`alignfull`) tabs so panel padding is reset correctly
- Scope add/remove tab toolbar controls per block type (avoid ambiguous deletions from the panels wrapper)
- Update French translations

## 2.0.0 - 2026-09-28

- Require WordPress 6.2 or later
- Prefer native `core/icon` for tab icons when available (WordPress 7.0+), with Blockparty / BeAPI icon blocks still allowed by default for WordPress 6.2–6.8
- Fix frontend spacing and styles for `core/icon` next to tab labels
- Add `blockparty_tabs_allowed_icon_blocks` filter to customize allowed icon blocks
- Limit tabs to a single icon block (no duplication)
- Improve accessibility: move `tablist` to nav and complete ARIA roles
- Expand block supports and refresh block descriptions
- Remove anchor support from the panel item block
- Share add/remove tab toolbar controls across nav and panels
- Add appender to insert synced tabs from the navigation
- Fix KSES stripping of tab ARIA attributes (`aria-controls`, `aria-selected`, `aria-expanded`) and `tabindex`
- Fix stale active index after tab removal
- Fix panel pairing locks when moving tabs
- Fix deprecated block versions omitting original supports
- Fix block validation after save when existing tabs were invalidated
- Fix saved tab nav items missing the active class
- Ship a `react-jsx-runtime` webpack polyfill so editor scripts load on WordPress 6.2–6.5
- Fix editor warnings by avoiding setState during render and enabling direct inner block insertion
- Add PHPUnit, Jest, and Playwright test suites with GitHub Actions CI
- Update French translations
- Move release/version scripts under `tests/bin`
- Remove `@beapi/icons` dependency

## 1.1.5 - 2026-08-24

- Fix editor margin reset for tabs block

## 1.1.4 - 2026-08-04

- Performance improvements removed script blocking time.

## 1.1.3 - 2026-04-27

- Performance improvements

## 1.1.2 - 2026-04-24

- Fix css for nested tabs block

## 1.1.1 - 2026-04-20

- Update block icons
- Add WordPress Playground blueprint file
- Pin Volta toolchain to Node.js 24.15.0 (was 20.12.0)

## 1.1.0 - 2026-02-18

- Support for `blockparty/icons` block

## 1.0.6 - 2026-02-11

- Update view and edit script to allow to use nested tabs block (tabs inside tab panel).

## 1.0.5 - 2025-11-10

- Update block icons

## 1.0.4 - 2025-11-07

- Replacement of icon for the icon block

## 1.0.3 - 2025-09-05

- fix icon inserter

## 1.0.2 - 2025-02-26

- allow aria and tabindex attributes

## 1.0.1 - 2024-12-04

- fix tabs scripts

## 1.0.0- 2024-04-03

- Initial release
