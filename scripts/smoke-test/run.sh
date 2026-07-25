#!/usr/bin/env bash
set -e

# Smoke test runner for verifying verdaccio ESM and CJS module imports
# Usage: VERDACCIO_VERSION=x.x.x REGISTRY=http://localhost:4873 ./scripts/smoke-test/run.sh

REGISTRY="${REGISTRY:-http://localhost:4873}"
VERDACCIO_VERSION="${VERDACCIO_VERSION:?VERDACCIO_VERSION is required}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

run_spec() {
  local spec_file="$1"
  local spec_name
  spec_name="$(basename "$spec_file")"

  echo "==> Running smoke test: $spec_name"

  local temp_dir
  temp_dir="$(mktemp -d)"

  cp "$spec_file" "$temp_dir/$spec_name"
  cd "$temp_dir"

  npm init --force --silent
  npm install vitest --registry "$REGISTRY" --silent
  npm install "verdaccio@$VERDACCIO_VERSION" --loglevel info --registry "$REGISTRY"

  DEBUG=verdaccio* npx vitest run "$spec_name" --reporter verbose

  echo "==> Passed: $spec_name"
  echo ""
}

run_spec "$SCRIPT_DIR/esm.spec.mjs"
run_spec "$SCRIPT_DIR/cjs.spec.mjs"
run_spec "$SCRIPT_DIR/legacy.spec.mjs"

echo "All smoke tests passed."
