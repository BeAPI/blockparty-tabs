#!/usr/bin/env bash
set -euo pipefail

config_args=()
for argument in "$@"; do
	case "$argument" in
		--config=*) config_args+=( "$argument" ) ;;
	esac
done

run_cli() {
	npx wp-env run cli "${config_args[@]}" -- "$@"
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
