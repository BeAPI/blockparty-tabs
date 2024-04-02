/*
 *   This content is licensed according to the W3C Software License at
 *   https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 *   File:   tabs-automatic.js
 *
 *   Desc:   Tablist widget that implements ARIA Authoring Practices
 */

'use strict';

class TabsAutomatic {
	constructor( groupNode ) {
		this.tablistNode = groupNode;

		this.tabs = [];

		this.firstTab = null;
		this.lastTab = null;

		this.tabs = Array.from(
			this.tablistNode.querySelectorAll( '[role=tab]' )
		);
		this.tabpanels = [];

		for ( let i = 0; i < this.tabs.length; i += 1 ) {
			const tab = this.tabs[ i ];
			const tabpanel = document.getElementById(
				tab.getAttribute( 'aria-controls' )
			);

			tab.tabIndex = -1;
			tab.setAttribute( 'aria-selected', 'false' );
			this.tabpanels.push( tabpanel );

			tab.addEventListener( 'keydown', this.onKeydown.bind( this ) );
			tab.addEventListener( 'click', this.onClick.bind( this ) );

			if ( ! this.firstTab ) {
				this.firstTab = tab;
			}
			this.lastTab = tab;
		}

		this.setSelectedTab( this.firstTab, false );
	}

	setSelectedTab( currentTab, setFocus ) {
		if ( typeof setFocus !== 'boolean' ) {
			setFocus = true;
		}
		for ( let i = 0; i < this.tabs.length; i += 1 ) {
			const tab = this.tabs[ i ];
			if ( currentTab === tab ) {
				tab.parentNode.classList.add( 'is-active' );
				tab.setAttribute( 'aria-selected', 'true' );
				tab.removeAttribute( 'tabindex' );
				this.tabpanels[ i ].classList.remove( 'is-hidden' );
				this.tabpanels[ i ].classList.add( 'is-active' );
				if ( setFocus ) {
					tab.focus();
				}
			} else {
				tab.parentNode.classList.remove( 'is-active' );
				tab.setAttribute( 'aria-selected', 'false' );
				tab.tabIndex = -1;
				this.tabpanels[ i ].classList.add( 'is-hidden' );
				this.tabpanels[ i ].classList.remove( 'is-active' );
			}
		}
	}

	setSelectedToPreviousTab( currentTab ) {
		let index;

		if ( currentTab === this.firstTab ) {
			this.setSelectedTab( this.lastTab );
		} else {
			index = this.tabs.indexOf( currentTab );
			this.setSelectedTab( this.tabs[ index - 1 ] );
		}
	}

	setSelectedToNextTab( currentTab ) {
		let index;

		if ( currentTab === this.lastTab ) {
			this.setSelectedTab( this.firstTab );
		} else {
			index = this.tabs.indexOf( currentTab );
			this.setSelectedTab( this.tabs[ index + 1 ] );
		}
	}

	/* EVENT HANDLERS */

	onKeydown( event ) {
		const tgt = event.currentTarget;
		let flag = false;

		switch ( event.key ) {
			case 'ArrowLeft':
				this.setSelectedToPreviousTab( tgt );
				flag = true;
				break;

			case 'ArrowRight':
				this.setSelectedToNextTab( tgt );
				flag = true;
				break;

			case 'Home':
				this.setSelectedTab( this.firstTab );
				flag = true;
				break;

			case 'End':
				this.setSelectedTab( this.lastTab );
				flag = true;
				break;

			default:
				break;
		}

		if ( flag ) {
			event.stopPropagation();
			event.preventDefault();
		}
	}

	onClick( event ) {
		event.preventDefault();
		this.setSelectedTab( event.currentTarget );
	}
}

// Initialize tablist

window.addEventListener( 'load', function () {
	const tablists = document.querySelectorAll( '.wp-block-blockparty-tabs' );
	for ( let i = 0; i < tablists.length; i++ ) {
		new TabsAutomatic( tablists[ i ] );
	}
} );
