/**
 * @jest-environment jsdom
 */

/**
 * Internal dependencies
 */
import { TabsAutomatic } from '../../src/blockparty-tabs/tabs-automatic';

/**
 * Builds a minimal accessible tabs markup tree for unit tests.
 *
 * @param {number} count Number of tabs/panels.
 * @return {HTMLElement} Root tabs element.
 */
const createTabsMarkup = ( count = 3 ) => {
	const root = document.createElement( 'div' );
	root.className = 'wp-block-blockparty-tabs';

	const nav = document.createElement( 'ul' );
	nav.className = 'wp-block-blockparty-tabs-nav';
	nav.setAttribute( 'role', 'tablist' );

	const panels = document.createElement( 'section' );
	panels.className = 'wp-block-blockparty-tabs-panels';

	for ( let i = 0; i < count; i += 1 ) {
		const item = document.createElement( 'li' );
		item.className = 'wp-block-blockparty-tabs-nav-item';
		if ( 0 === i ) {
			item.classList.add( 'is-active' );
		}

		const tab = document.createElement( 'a' );
		tab.id = `block-tab-0-${ i }`;
		tab.href = `#block-tab-0-${ i }`;
		tab.setAttribute( 'role', 'tab' );
		tab.setAttribute( 'aria-controls', `block-panel-0-${ i }` );
		tab.setAttribute( 'aria-selected', 0 === i ? 'true' : 'false' );
		tab.tabIndex = 0 === i ? 0 : -1;
		tab.textContent = `Tab ${ i + 1 }`;
		item.appendChild( tab );
		nav.appendChild( item );

		const panel = document.createElement( 'div' );
		panel.id = `block-panel-0-${ i }`;
		panel.setAttribute( 'role', 'tabpanel' );
		panel.setAttribute( 'aria-labelledby', `block-tab-0-${ i }` );
		panel.className = `wp-block-blockparty-tabs-panel-item ${
			0 === i ? 'is-active' : 'is-hidden'
		}`;
		panel.textContent = `Panel ${ i + 1 }`;
		panels.appendChild( panel );
	}

	root.appendChild( nav );
	root.appendChild( panels );
	document.body.appendChild( root );

	return root;
};

describe( 'TabsAutomatic', () => {
	afterEach( () => {
		document.body.innerHTML = '';
	} );

	it( 'selects the first tab on init without forcing focus', () => {
		const root = createTabsMarkup( 3 );
		const widget = new TabsAutomatic( root );
		const tabs = root.querySelectorAll( 'a[role=tab]' );
		const panels = root.querySelectorAll( '[role=tabpanel]' );

		expect( tabs[ 0 ].getAttribute( 'aria-selected' ) ).toBe( 'true' );
		expect( tabs[ 0 ].hasAttribute( 'tabindex' ) ).toBe( false );
		expect( panels[ 0 ].classList.contains( 'is-hidden' ) ).toBe( false );
		expect( panels[ 1 ].classList.contains( 'is-hidden' ) ).toBe( true );
		expect( panels[ 2 ].classList.contains( 'is-hidden' ) ).toBe( true );
		expect( widget.firstTab ).toBe( tabs[ 0 ] );
	} );

	it( 'activates the clicked tab and hides other panels', () => {
		const root = createTabsMarkup( 3 );
		new TabsAutomatic( root );
		const tabs = root.querySelectorAll( 'a[role=tab]' );
		const panels = root.querySelectorAll( '[role=tabpanel]' );

		tabs[ 1 ].dispatchEvent(
			new MouseEvent( 'click', { bubbles: true, cancelable: true } )
		);

		expect( tabs[ 1 ].getAttribute( 'aria-selected' ) ).toBe( 'true' );
		expect( tabs[ 0 ].getAttribute( 'aria-selected' ) ).toBe( 'false' );
		expect( panels[ 1 ].classList.contains( 'is-active' ) ).toBe( true );
		expect( panels[ 1 ].classList.contains( 'is-hidden' ) ).toBe( false );
		expect( panels[ 0 ].classList.contains( 'is-hidden' ) ).toBe( true );
	} );

	it( 'moves selection with ArrowRight and wraps from last to first', () => {
		const root = createTabsMarkup( 3 );
		new TabsAutomatic( root );
		const tabs = [ ...root.querySelectorAll( 'a[role=tab]' ) ];

		tabs[ 0 ].dispatchEvent(
			new KeyboardEvent( 'keydown', {
				key: 'ArrowRight',
				bubbles: true,
				cancelable: true,
			} )
		);
		expect( tabs[ 1 ].getAttribute( 'aria-selected' ) ).toBe( 'true' );

		tabs[ 2 ].focus();
		tabs[ 2 ].dispatchEvent(
			new MouseEvent( 'click', { bubbles: true, cancelable: true } )
		);
		tabs[ 2 ].dispatchEvent(
			new KeyboardEvent( 'keydown', {
				key: 'ArrowRight',
				bubbles: true,
				cancelable: true,
			} )
		);
		expect( tabs[ 0 ].getAttribute( 'aria-selected' ) ).toBe( 'true' );
	} );

	it( 'supports Home and End keys', () => {
		const root = createTabsMarkup( 3 );
		new TabsAutomatic( root );
		const tabs = root.querySelectorAll( 'a[role=tab]' );

		tabs[ 1 ].dispatchEvent(
			new MouseEvent( 'click', { bubbles: true, cancelable: true } )
		);
		tabs[ 1 ].dispatchEvent(
			new KeyboardEvent( 'keydown', {
				key: 'End',
				bubbles: true,
				cancelable: true,
			} )
		);
		expect( tabs[ 2 ].getAttribute( 'aria-selected' ) ).toBe( 'true' );

		tabs[ 2 ].dispatchEvent(
			new KeyboardEvent( 'keydown', {
				key: 'Home',
				bubbles: true,
				cancelable: true,
			} )
		);
		expect( tabs[ 0 ].getAttribute( 'aria-selected' ) ).toBe( 'true' );
	} );
} );
