[![Be API Github Banner](.github/banner-github.png)](https://beapi.fr)

# Blockparty Tabs

An accessible tabs block for WordPress Gutenberg editor that follows ARIA best practices.

## Features

- ✅ **Accessible**: Built with proper ARIA attributes and keyboard navigation support
- 🎨 **Customizable**: Add custom colors and icons to your tabs
- 🧩 **Flexible**: Nest any WordPress block inside tab panels
- ⚡ **Easy to use**: Simple interface to add, remove, and reorder tabs

## Requirements

- WordPress 6.2 or higher
- PHP 8.1 or higher
- Gutenberg editor enabled

## Installation

### Manual Installation

1. Download the plugin files
2. Upload the `blockparty-tabs` folder to the `/wp-content/plugins/` directory
3. Activate the plugin through the 'Plugins' menu in WordPress

### Composer Installation

```bash
composer require beapi/blockparty-tabs
```

## Usage

### Adding a Tabs Block

1. In the WordPress editor, click the **+** button to add a new block
2. Search for "Tabs" or "Blockparty Tabs"
3. Click on the block to insert it into your content

By default, the block comes with 3 tabs. Each tab contains a panel where you can add any content.

### Adding/Removing Tabs

- **Add a tab**: Click the "Add Item After" button in the block toolbar
- **Remove a tab**: Select the tab you want to remove and click the trash icon in the toolbar

### Customizing Tabs

#### Adding Icons

1. Select a tab item
2. In the block toolbar, click the "Icon" button
3. Choose an icon from the available options

#### Changing Colors

1. Select the tabs block
2. Use the color settings in the right sidebar to customize:
   - Tab background colors
   - Text colors
   - Active tab colors

### Adding Content to Tabs

1. Click inside a tab panel
2. Add any WordPress block (paragraphs, images, buttons, etc.)
3. You can nest multiple blocks within each tab panel

## Accessibility

The plugin generates semantic HTML with proper ARIA attributes:

- `role="tablist"` for the tabs container
- `role="tab"` for each tab button
- `role="tabpanel"` for each content panel
- Proper `aria-controls`, `aria-labelledby`, and `aria-selected` attributes
- Keyboard navigation support (Arrow keys, Tab, Enter)

## Generated Markup Example

```html
<div class="wp-block-blockparty-tabs" role="tablist">
  <ul class="wp-block-blockparty-tabs-nav">
    <li class="wp-block-blockparty-tabs-nav-item is-active">
      <a id="block-tab-0-0" role="tab" aria-controls="block-panel-0-0"
         class="wp-block-blockparty-tabs-nav-link" href="#block-tab-0-0"
         aria-selected="true">
        <span>Tab 1</span>
      </a>
    </li>
    <!-- More tabs... -->
  </ul>

  <section class="wp-block-blockparty-tabs-panels">
    <div role="tabpanel" tabindex="0"
         class="wp-block-blockparty-tabs-panel-item is-active"
         id="block-panel-0-0" aria-labelledby="block-tab-0-0">
      <div class="wp-block-blockparty-tabs-panel-item__inner">
        <!-- Your content here -->
      </div>
    </div>
    <!-- More panels... -->
  </section>
</div>
```

## Development

### Building the Plugin

```bash
npm install
npm run build
```

### Development Mode

```bash
npm start
```

### Linting

```bash
npm run lint:js
npm run lint:css
```

## Support

For bug reports and feature requests, please use the [GitHub issues](https://github.com/BeAPI/blockparty-tabs/issues) page.

## Credits

Developed by [Be API Technical Team](https://beapi.fr)

## License

GPL-2.0-or-later
