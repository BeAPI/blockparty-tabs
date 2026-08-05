#!/usr/bin/env bash
#
# Bump the plugin version across project metadata, blocks, and docs.
#
# Usage (no chmod required):
#   bash bin/bump.sh patch
#   bash bin/bump.sh minor
#   bash bin/bump.sh major
#   bash bin/bump.sh 1.2.0
#   npm run bump -- patch
#   npm run bump -- 1.2.0
#
# macOS sed (-i '') is assumed.
#

set -euo pipefail

# ---------------------------------------------------------------------------
# Assets — add or remove paths here
# ---------------------------------------------------------------------------

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# JSON files that expose a top-level "version" field
JSON_VERSION_FILES=(
	".plugin-data"
	"package.json"
	"src/blockparty-tabs/block.json"
	"src/blockparty-tabs-nav/block.json"
	"src/blockparty-tabs-nav-item/block.json"
	"src/blockparty-tabs-panel-item/block.json"
	"src/blockparty-tabs-panels/block.json"
)

PACKAGE_LOCK_FILE="package-lock.json"
PHP_FILE="blockparty-tabs.php"
README_TXT="readme.txt"
CHANGELOG="CHANGELOG.md"
README_MD="README.md"
BLUEPRINT=".wordpress-org/blueprints/blueprint.json"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

UPDATED_FILES=()

log_updated() {
	UPDATED_FILES+=( "$1" )
}

require_file() {
	local file="$1"
	if [[ ! -f "${ROOT_DIR}/${file}" ]]; then
		echo "Error: Missing file ${file}" >&2
		exit 1
	fi
}

replace_json_version() {
	local file="$1"
	local path="${ROOT_DIR}/${file}"
	require_file "${file}"
	sed -i '' "s/\"version\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"version\": \"${VERSION}\"/" "${path}"
	log_updated "${file}"
}

usage() {
	local code="${1:-0}"
	echo "Usage: bash bin/bump.sh <patch|minor|major|x.y.z>"
	echo ""
	echo "Examples:"
	echo "  bash bin/bump.sh patch"
	echo "  bash bin/bump.sh minor"
	echo "  bash bin/bump.sh 1.2.0"
	echo "  npm run bump -- patch"
	exit "${code}"
}

resolve_version() {
	local current="$1"
	local input="$2"

	if [[ "${input}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
		echo "${input}"
		return
	fi

	local major minor patch
	IFS='.' read -r major minor patch <<< "${current}"

	case "${input}" in
		major)
			echo "$((major + 1)).0.0"
			;;
		minor)
			echo "${major}.$((minor + 1)).0"
			;;
		patch)
			echo "${major}.${minor}.$((patch + 1))"
			;;
		*)
			echo "Error: Unknown bump argument \"${input}\". Use patch, minor, major, or an explicit x.y.z version." >&2
			exit 1
			;;
	esac
}

# ---------------------------------------------------------------------------
# Args
# ---------------------------------------------------------------------------

if [[ -z "${1:-}" || "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
	usage "$([[ -n "${1:-}" ]] && echo 0 || echo 1)"
fi

INPUT="$1"

require_file ".plugin-data"
CURRENT="$(sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([0-9]*\.[0-9]*\.[0-9]*\)".*/\1/p' "${ROOT_DIR}/.plugin-data" | head -n 1)"

if [[ -z "${CURRENT}" ]]; then
	echo "Error: Could not read current version from .plugin-data" >&2
	exit 1
fi

if ! [[ "${CURRENT}" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
	echo "Error: Invalid current version \"${CURRENT}\" in .plugin-data" >&2
	exit 1
fi

VERSION="$(resolve_version "${CURRENT}" "${INPUT}")"

if [[ "${VERSION}" == "${CURRENT}" ]]; then
	echo "Error: Version is already ${CURRENT}" >&2
	exit 1
fi

echo "Bumping version: ${CURRENT} → ${VERSION}"

# ---------------------------------------------------------------------------
# JSON version fields
# ---------------------------------------------------------------------------

for file in "${JSON_VERSION_FILES[@]}"; do
	replace_json_version "${file}"
done

# ---------------------------------------------------------------------------
# package-lock.json (root + packages[""] only)
# ---------------------------------------------------------------------------

if [[ -f "${ROOT_DIR}/${PACKAGE_LOCK_FILE}" ]]; then
	# Root "version" (near top of file)
	sed -i '' '1,5s/"version": "[0-9]*\.[0-9]*\.[0-9]*"/"version": "'"${VERSION}"'"/' "${ROOT_DIR}/${PACKAGE_LOCK_FILE}"
	# packages[""].version
	sed -i '' '6,12s/"version": "[0-9]*\.[0-9]*\.[0-9]*"/"version": "'"${VERSION}"'"/' "${ROOT_DIR}/${PACKAGE_LOCK_FILE}"
	log_updated "${PACKAGE_LOCK_FILE}"
fi

# ---------------------------------------------------------------------------
# Main plugin PHP
# ---------------------------------------------------------------------------

require_file "${PHP_FILE}"
sed -i '' "s/^\( \* Version:[[:space:]]*\)[0-9]*\.[0-9]*\.[0-9]*/\1${VERSION}/" "${ROOT_DIR}/${PHP_FILE}"
sed -i '' "s/define( 'BLOCKPARTY_TABS_VERSION', '[0-9]*\.[0-9]*\.[0-9]*' )/define( 'BLOCKPARTY_TABS_VERSION', '${VERSION}' )/" "${ROOT_DIR}/${PHP_FILE}"
log_updated "${PHP_FILE}"

# ---------------------------------------------------------------------------
# readme.txt — Stable tag + changelog section
# ---------------------------------------------------------------------------

require_file "${README_TXT}"
sed -i '' "s/^\(Stable tag:[[:space:]]*\)[0-9]*\.[0-9]*\.[0-9]*/\1${VERSION}/" "${ROOT_DIR}/${README_TXT}"

if ! grep -q "^= ${VERSION} =$" "${ROOT_DIR}/${README_TXT}"; then
	awk -v ver="${VERSION}" '
		{
			print
			if ( $0 == "== Changelog ==" ) {
				print ""
				print "= " ver " ="
				print ""
				print "* "
				print ""
				getline
				# Consume the blank line that followed "== Changelog ==".
				if ( $0 != "" ) {
					print
				}
			}
		}
	' "${ROOT_DIR}/${README_TXT}" > "${ROOT_DIR}/${README_TXT}.tmp"
	mv "${ROOT_DIR}/${README_TXT}.tmp" "${ROOT_DIR}/${README_TXT}"
fi
log_updated "${README_TXT}"

# ---------------------------------------------------------------------------
# CHANGELOG.md — Keep a Changelog entry
# ---------------------------------------------------------------------------

require_file "${CHANGELOG}"
TODAY="$(date +%Y-%m-%d)"

if grep -q "^## ${VERSION}" "${ROOT_DIR}/${CHANGELOG}"; then
	echo "  skip ${CHANGELOG} (entry for ${VERSION} already exists)"
else
	awk -v ver="${VERSION}" -v today="${TODAY}" '
		{
			print
			if ( !inserted && index( $0, "Semantic Versioning" ) ) {
				getline
				print ""
				print "## " ver " - " today
				print ""
				print "- "
				print ""
				inserted = 1
				# Marker is followed by a blank line; skip the consumed blank.
				next
			}
		}
	' "${ROOT_DIR}/${CHANGELOG}" > "${ROOT_DIR}/${CHANGELOG}.tmp"
	mv "${ROOT_DIR}/${CHANGELOG}.tmp" "${ROOT_DIR}/${CHANGELOG}"
	log_updated "${CHANGELOG}"
fi

# ---------------------------------------------------------------------------
# Playground blueprint tag ref
# ---------------------------------------------------------------------------

require_file "${BLUEPRINT}"
sed -i '' "s/\"ref\": \"[0-9]*\.[0-9]*\.[0-9]*\"/\"ref\": \"${VERSION}\"/" "${ROOT_DIR}/${BLUEPRINT}"
log_updated "${BLUEPRINT}"

# ---------------------------------------------------------------------------
# README.md — replace old version string when present
# ---------------------------------------------------------------------------

if [[ -f "${ROOT_DIR}/${README_MD}" ]]; then
	if grep -q "${CURRENT}" "${ROOT_DIR}/${README_MD}"; then
		sed -i '' "s/${CURRENT}/${VERSION}/g" "${ROOT_DIR}/${README_MD}"
		log_updated "${README_MD}"
	else
		echo "  skip ${README_MD} (no version string to update)"
	fi
fi

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

echo ""
echo "Version updated to ${VERSION} in:"
for file in "${UPDATED_FILES[@]}"; do
	echo "  - ${file}"
done
echo ""
echo "Done. Fill in CHANGELOG.md / readme.txt notes before releasing."
