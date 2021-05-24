#!/usr/bin/env bash

# this file is used by e2e-xx-cli-workflow.yml files


set -e

# create a temporary folder
HERE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
TEMP_DIR="$(mktemp -d)"

cd "${TEMP_DIR}"

echo $TEMP_DIR
echo $HERE_DIR

# set basic git config
git config --global user.email "jota@verdaccio.org"
git config --global user.name "Juan Picado"
