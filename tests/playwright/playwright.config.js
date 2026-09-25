/**
 * External dependencies
 */
import { join } from 'node:path';
import { defineConfig } from '@playwright/test';
/**
 * WordPress dependencies
 */
import baseConfig from '@wordpress/scripts/config/playwright.config.js';

process.env.WP_ARTIFACTS_PATH ??= join( process.cwd(), 'artifacts' );
process.env.STORAGE_STATE_PATH ??= join(
	process.env.WP_ARTIFACTS_PATH,
	'storage-states/admin.json'
);
process.env.WP_BASE_URL ??= 'http://localhost:8889';

export default defineConfig( {
	...baseConfig,
	testDir: './specs',
	forbidOnly: Boolean( process.env.CI ),
	workers: 1,
	retries: 0,
	use: {
		...( baseConfig.use || {} ),
		baseURL: process.env.WP_BASE_URL,
	},
	webServer: {
		command: 'npm run env:start-ci',
		port: 8889,
		timeout: 120_000,
		reuseExistingServer: true,
	},
} );
