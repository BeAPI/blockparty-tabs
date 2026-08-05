#!/usr/bin/env node
/**
 * Bump the plugin version across project metadata, blocks, and docs.
 *
 * Usage:
 *   npm run bump -- patch
 *   npm run bump -- minor
 *   npm run bump -- major
 *   npm run bump -- 1.2.0
 *
 * @package blockparty-tabs
 */

const fs = require( 'fs' );
const path = require( 'path' );

const ROOT = path.resolve( __dirname, '..' );
const SEMVER_RE = /^\d+\.\d+\.\d+$/;

const FILES = {
	pluginData: '.plugin-data',
	packageJson: 'package.json',
	packageLock: 'package-lock.json',
	mainPhp: 'blockparty-tabs.php',
	changelog: 'CHANGELOG.md',
	readmeMd: 'README.md',
	readmeTxt: 'readme.txt',
	blueprint: '.wordpress-org/blueprints/blueprint.json',
	blockJson: [
		'src/blockparty-tabs/block.json',
		'src/blockparty-tabs-nav/block.json',
		'src/blockparty-tabs-nav-item/block.json',
		'src/blockparty-tabs-panel-item/block.json',
		'src/blockparty-tabs-panels/block.json',
	],
};

/**
 * Read a UTF-8 file relative to the plugin root.
 *
 * @param {string} relativePath Relative path from plugin root.
 * @return {string} File contents.
 */
function read( relativePath ) {
	return fs.readFileSync( path.join( ROOT, relativePath ), 'utf8' );
}

/**
 * Write a UTF-8 file relative to the plugin root.
 *
 * @param {string} relativePath Relative path from plugin root.
 * @param {string} contents     New file contents.
 * @return {void}
 */
function write( relativePath, contents ) {
	fs.writeFileSync( path.join( ROOT, relativePath ), contents );
}

/**
 * Parse a semver string into numeric parts.
 *
 * @param {string} version Semver string (x.y.z).
 * @return {{ major: number, minor: number, patch: number }} Parsed parts.
 */
function parseVersion( version ) {
	if ( ! SEMVER_RE.test( version ) ) {
		throw new Error( `Invalid version "${ version }". Expected x.y.z.` );
	}

	const [ major, minor, patch ] = version.split( '.' ).map( Number );
	return { major, minor, patch };
}

/**
 * Resolve the next version from a bump type or explicit version.
 *
 * @param {string} current Current version.
 * @param {string} input   "patch" | "minor" | "major" | "x.y.z".
 * @return {string} Next version.
 */
function resolveNextVersion( current, input ) {
	if ( SEMVER_RE.test( input ) ) {
		return input;
	}

	const { major, minor, patch } = parseVersion( current );

	switch ( input ) {
		case 'major':
			return `${ major + 1 }.0.0`;
		case 'minor':
			return `${ major }.${ minor + 1 }.0`;
		case 'patch':
			return `${ major }.${ minor }.${ patch + 1 }`;
		default:
			throw new Error(
				`Unknown bump argument "${ input }". Use patch, minor, major, or an explicit x.y.z version.`
			);
	}
}

/**
 * Replace the top-level "version" field in a JSON file, preserving formatting.
 *
 * @param {string} relativePath Relative path from plugin root.
 * @param {string} newVersion   New version.
 * @return {void}
 */
function bumpJsonVersion( relativePath, newVersion ) {
	const contents = read( relativePath );
	const updated = contents.replace(
		/"version"\s*:\s*"[^"]+"/,
		`"version": "${ newVersion }"`
	);

	if ( updated === contents ) {
		throw new Error( `Could not find a "version" field in ${ relativePath }.` );
	}

	write( relativePath, updated );
}

/**
 * Update package-lock.json root package version fields.
 *
 * @param {string} newVersion New version.
 * @return {void}
 */
function bumpPackageLock( newVersion ) {
	const relativePath = FILES.packageLock;
	const lockPath = path.join( ROOT, relativePath );

	if ( ! fs.existsSync( lockPath ) ) {
		return;
	}

	let contents = read( relativePath );

	// Root "version" field.
	contents = contents.replace(
		/^(\s*"version"\s*:\s*")[^"]+(")/m,
		`$1${ newVersion }$2`
	);

	// packages[""].version field (npm lockfile v2/v3).
	contents = contents.replace(
		/("packages"\s*:\s*\{\s*""\s*:\s*\{[^}]*"version"\s*:\s*")[^"]+(")/s,
		`$1${ newVersion }$2`
	);

	write( relativePath, contents );
}

/**
 * Update the main plugin PHP header and version constant.
 *
 * @param {string} newVersion New version.
 * @return {void}
 */
function bumpMainPhp( newVersion ) {
	const relativePath = FILES.mainPhp;
	let contents = read( relativePath );

	contents = contents.replace(
		/( \* Version:\s*)[\d.]+/,
		`$1${ newVersion }`
	);
	contents = contents.replace(
		/(define\(\s*'BLOCKPARTY_TABS_VERSION',\s*')[^']+(')/,
		`$1${ newVersion }$2`
	);

	const hasHeader = new RegExp(
		`\\* Version:\\s*${ newVersion.replace( /\./g, '\\.' ) }`
	).test( contents );
	const hasConstant = contents.includes(
		`define( 'BLOCKPARTY_TABS_VERSION', '${ newVersion }' )`
	);

	if ( ! hasHeader || ! hasConstant ) {
		throw new Error( `Failed to bump version in ${ relativePath }.` );
	}

	write( relativePath, contents );
}

/**
 * Prepend a Keep a Changelog entry for the new version.
 *
 * @param {string} newVersion New version.
 * @return {void}
 */
function bumpChangelog( newVersion ) {
	const relativePath = FILES.changelog;
	const contents = read( relativePath );
	const today = new Date().toISOString().slice( 0, 10 );
	const heading = `## ${ newVersion } - ${ today }`;

	if ( contents.includes( `## ${ newVersion }` ) ) {
		console.log( `  skip ${ relativePath } (entry for ${ newVersion } already exists)` );
		return;
	}

	const entry = `${ heading }\n\n- \n\n`;
	const marker =
		'and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).\n\n';

	if ( ! contents.includes( marker ) ) {
		throw new Error( `Could not find changelog intro marker in ${ relativePath }.` );
	}

	write( relativePath, contents.replace( marker, `${ marker }${ entry }` ) );
}

/**
 * Update Stable tag and prepend a wordpress.org changelog section.
 *
 * @param {string} newVersion New version.
 * @return {void}
 */
function bumpReadmeTxt( newVersion ) {
	const relativePath = FILES.readmeTxt;
	let contents = read( relativePath );

	contents = contents.replace(
		/(Stable tag:\s*)[\d.]+/,
		`$1${ newVersion }`
	);

	const section = `= ${ newVersion } =`;
	if ( ! contents.includes( section ) ) {
		const marker = '== Changelog ==\n\n';
		if ( ! contents.includes( marker ) ) {
			throw new Error( `Could not find changelog section in ${ relativePath }.` );
		}
		contents = contents.replace(
			marker,
			`${ marker }${ section }\n\n* \n\n`
		);
	}

	write( relativePath, contents );
}

/**
 * Update the Playground blueprint git tag ref.
 *
 * @param {string} newVersion New version.
 * @return {void}
 */
function bumpBlueprint( newVersion ) {
	const relativePath = FILES.blueprint;
	const contents = read( relativePath );
	const updated = contents.replace(
		/"ref"\s*:\s*"[^"]+"/,
		`"ref": "${ newVersion }"`
	);

	if ( updated === contents ) {
		throw new Error( `Could not find a "ref" field in ${ relativePath }.` );
	}

	write( relativePath, updated );
}

/**
 * Replace occurrences of the old version in README.md when present.
 *
 * @param {string} oldVersion Previous version.
 * @param {string} newVersion New version.
 * @return {void}
 */
function bumpReadmeMd( oldVersion, newVersion ) {
	const relativePath = FILES.readmeMd;
	const contents = read( relativePath );

	if ( ! contents.includes( oldVersion ) ) {
		console.log( `  skip ${ relativePath } (no version string to update)` );
		return;
	}

	write( relativePath, contents.split( oldVersion ).join( newVersion ) );
}

/**
 * Print usage help and exit.
 *
 * @param {number} code Exit code.
 * @return {void}
 */
function usage( code = 0 ) {
	console.log( `Usage:
  npm run bump -- <patch|minor|major|x.y.z>

Examples:
  npm run bump -- patch
  npm run bump -- minor
  npm run bump -- 1.2.0` );
	process.exit( code );
}

/**
 * Main entry point.
 *
 * @return {void}
 */
function main() {
	const arg = process.argv[ 2 ];

	if ( ! arg || arg === '-h' || arg === '--help' ) {
		usage( arg ? 0 : 1 );
	}

	const current = JSON.parse( read( FILES.pluginData ) ).version;
	parseVersion( current );

	const next = resolveNextVersion( current, arg );

	if ( next === current ) {
		console.error( `Version is already ${ current }.` );
		process.exit( 1 );
	}

	console.log( `Bumping version: ${ current } → ${ next }` );

	bumpJsonVersion( FILES.pluginData, next );
	console.log( `  updated ${ FILES.pluginData }` );

	bumpJsonVersion( FILES.packageJson, next );
	console.log( `  updated ${ FILES.packageJson }` );

	bumpPackageLock( next );
	if ( fs.existsSync( path.join( ROOT, FILES.packageLock ) ) ) {
		console.log( `  updated ${ FILES.packageLock }` );
	}

	for ( const blockJson of FILES.blockJson ) {
		bumpJsonVersion( blockJson, next );
		console.log( `  updated ${ blockJson }` );
	}

	bumpMainPhp( next );
	console.log( `  updated ${ FILES.mainPhp }` );

	bumpChangelog( next );
	console.log( `  updated ${ FILES.changelog }` );

	bumpReadmeTxt( next );
	console.log( `  updated ${ FILES.readmeTxt }` );

	bumpBlueprint( next );
	console.log( `  updated ${ FILES.blueprint }` );

	bumpReadmeMd( current, next );

	console.log( '\nDone. Fill in CHANGELOG.md / readme.txt notes before releasing.' );
}

try {
	main();
} catch ( error ) {
	console.error( error.message || error );
	process.exit( 1 );
}
