/**
 * Frontend entry: boot accessible tabs widgets.
 */
import { initTabs } from './tabs-automatic';

// Deferred scripts run after HTML is parsed; init immediately when ready.
if ( document.readyState === 'loading' ) {
	document.addEventListener( 'DOMContentLoaded', initTabs );
} else {
	initTabs();
}
