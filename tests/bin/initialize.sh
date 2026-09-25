#!/usr/bin/env bash
set -euo pipefail

# Scalar, not an array: bash 3.2 (macOS) treats an empty array expansion as an
# unbound variable under `set -u`.
config_arg=""
for argument in "$@"; do
	case "$argument" in
		--config=*) config_arg="$argument" ;;
	esac
done

run_cli() {
	npx wp-env run cli ${config_arg:+"$config_arg"} -- "$@"
}

# Prefer a recent default theme shipped with WordPress core images.
if run_cli wp theme is-installed twentytwentyfour; then
	run_cli wp theme activate twentytwentyfour
elif run_cli wp theme is-installed twentytwentyfive; then
	run_cli wp theme activate twentytwentyfive
elif run_cli wp theme is-installed twentytwentythree; then
	run_cli wp theme activate twentytwentythree
fi

run_cli wp plugin activate blockparty-tabs
