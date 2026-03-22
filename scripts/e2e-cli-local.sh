#!/usr/bin/env bash
set -euo pipefail

REGISTRY_URL="http://localhost:4873"
PM="${1:-npm}"
VERDACCIO_PID=""
WORK_DIR=""

cleanup() {
  if [ -n "$VERDACCIO_PID" ] && kill -0 "$VERDACCIO_PID" 2>/dev/null; then
    echo "Stopping Verdaccio (PID $VERDACCIO_PID)..."
    kill "$VERDACCIO_PID" 2>/dev/null || true
  fi
  if [ -n "$WORK_DIR" ] && [ -d "$WORK_DIR" ]; then
    echo "Cleaning up $WORK_DIR"
    rm -rf "$WORK_DIR"
  fi
}
trap cleanup EXIT

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

WORK_DIR="$(mktemp -d)"
echo "Using temp storage: $WORK_DIR"

cat > "$WORK_DIR/config.yaml" <<EOF
storage: $WORK_DIR/storage
plugins: $WORK_DIR/plugins
web:
  title: Verdaccio E2E
auth:
  htpasswd:
    file: $WORK_DIR/htpasswd
uplinks:
  npmjs:
    url: https://registry.npmjs.org/
packages:
  '@*/*':
    access: \$all
    publish: \$authenticated
    proxy: npmjs
  '**':
    access: \$all
    publish: \$authenticated
    proxy: npmjs
middlewares:
  audit:
    enabled: true
log:
  type: stdout
  format: pretty
  level: warn
EOF

echo "Starting Verdaccio..."
node "$ROOT_DIR/bin/verdaccio" --config "$WORK_DIR/config.yaml" --listen 4873 &
VERDACCIO_PID=$!

for i in $(seq 1 30); do
  if curl -s "$REGISTRY_URL/-/ping" > /dev/null 2>&1; then
    echo "Verdaccio is ready"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "Verdaccio failed to start"
    exit 1
  fi
  sleep 1
done

echo "Running e2e-cli tests with pm=$PM..."
yarn verdaccio-e2e --registry "$REGISTRY_URL" --pm "$PM" -v
