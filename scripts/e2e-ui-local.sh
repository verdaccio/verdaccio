#!/usr/bin/env bash
#
# Run the Cypress e2e-ui suite against an isolated Verdaccio instance.
#
# Spins up a fresh Verdaccio on port 4874 with a throwaway storage dir and
# htpasswd, creates the "test" user, runs cypress, then tears everything down.
#
# Usage:
#   scripts/e2e-ui-local.sh            # headless run
#   scripts/e2e-ui-local.sh --open     # interactive runner
#
set -euo pipefail

PORT="${VERDACCIO_PORT:-4874}"
URL="http://localhost:${PORT}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TMP_DIR="$(mktemp -d -t verdaccio-e2e-ui-XXXXXX)"
CONFIG="${TMP_DIR}/config.yaml"
LOG_FILE="${TMP_DIR}/verdaccio.log"
PID_FILE="${TMP_DIR}/verdaccio.pid"

cleanup() {
  if [[ -f "${PID_FILE}" ]]; then
    local pid
    pid="$(cat "${PID_FILE}")"
    if kill -0 "${pid}" 2>/dev/null; then
      echo ">> stopping verdaccio (pid ${pid})"
      kill "${pid}" 2>/dev/null || true
      wait "${pid}" 2>/dev/null || true
    fi
  fi
  if [[ -n "${KEEP_TMP:-}" ]]; then
    echo ">> keeping temp dir: ${TMP_DIR}"
  else
    rm -rf "${TMP_DIR}"
  fi
}
trap cleanup EXIT INT TERM

echo ">> temp dir: ${TMP_DIR}"

# Generate a config that points at the throwaway storage + htpasswd.
cat > "${CONFIG}" <<EOF
storage: ${TMP_DIR}/storage

web:
  title: Verdaccio e2e
  enable: true
  login: true
  showSettings: true

auth:
  htpasswd:
    file: ${TMP_DIR}/htpasswd
    max_users: 1000

uplinks:
  npmjs:
    url: https://registry.npmjs.org/

packages:
  '@*/*':
    access: \$all
    publish: \$anonymous \$authenticated
    unpublish: \$anonymous \$authenticated
    proxy: npmjs
  '**':
    access: \$all
    publish: \$anonymous \$authenticated
    unpublish: \$anonymous \$authenticated
    proxy: npmjs

server:
  keepAliveTimeout: 60

middlewares:
  audit:
    enabled: true

userRateLimit:
  windowMs: 1000
  max: 10000

listen: 0.0.0.0:${PORT}

log: { type: stdout, format: json, level: warn }
EOF

# Make sure the build artifacts exist so bin/verdaccio has something to run.
if [[ ! -d "${ROOT}/packages/verdaccio/build" ]]; then
  echo ">> packages/verdaccio/build missing — running pnpm build"
  (cd "${ROOT}" && pnpm build)
fi

echo ">> starting verdaccio on ${URL}"
(
  cd "${ROOT}"
  node packages/verdaccio/bin/verdaccio --config "${CONFIG}" > "${LOG_FILE}" 2>&1 &
  echo $! > "${PID_FILE}"
)

# Wait for ping.
for i in $(seq 1 30); do
  if curl -sf "${URL}/-/ping" > /dev/null; then
    echo ">> verdaccio is up"
    break
  fi
  sleep 1
  if [[ "${i}" == "30" ]]; then
    echo "!! verdaccio failed to start"
    cat "${LOG_FILE}" || true
    exit 1
  fi
done

# Create the "test" user for signinTests. 409 is fine.
echo ">> creating test user"
curl -s -o /dev/null -w ">> PUT /-/user -> %{http_code}\n" \
  -X PUT -H "Content-Type: application/json" \
  -d '{"name":"test","password":"test","_id":"org.couchdb.user:test","type":"user","roles":[]}' \
  "${URL}/-/user/org.couchdb.user:test" || true

export VERDACCIO_URL="${URL}"

if [[ "${1:-}" == "--open" ]]; then
  (cd "${ROOT}" && pnpm exec cypress open)
else
  (cd "${ROOT}" && pnpm exec cypress run)
fi
