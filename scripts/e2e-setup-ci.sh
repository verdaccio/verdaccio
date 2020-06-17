#!/usr/bin/env bash

set -e

HERE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
TEMP_DIR="$(mktemp -d)"

cd "${TEMP_DIR}"

echo $TEMP_DIR
echo $HERE_DIR

git config --global user.email "you@example.com"
git config --global user.name "John Doe"
