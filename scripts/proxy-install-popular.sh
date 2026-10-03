#!/usr/bin/env bash
# Install popular packages with large dependency trees through a registry, CONCURRENCY at a time.
# Exits non-zero if any install fails or resolves a tarball from anywhere but REGISTRY.
set -uo pipefail

REGISTRY="${REGISTRY:-http://localhost:4873}"
CONCURRENCY="${CONCURRENCY:-5}"
WORK="${WORK:-$(mktemp -d)}"

PACKAGES=(
  "@angular/cli"
  "next react react-dom"
  "webpack webpack-cli"
  "@nestjs/cli"
  "gatsby-cli"
  "@vue/cli"
  "nuxt"
  "@sveltejs/kit svelte vite"
  "vite"
  "eslint typescript-eslint typescript"
  "jest"
  "storybook"
  "nx"
  "react-native"
  "expo"
  "@babel/core @babel/preset-env"
  "@remix-run/dev"
  "aws-cdk-lib"
  "firebase-tools"
  "lerna"
)

install_one() {
  local spec="$1"
  local dir="$WORK/$(echo "$spec" | tr -c 'a-zA-Z0-9\n' '_')"
  mkdir -p "$dir"
  cd "$dir" || return 1
  echo '{"name":"proxy-install-probe","version":"1.0.0","private":true}' > package.json
  # Empty userconfig and cache: nothing from the machine's npm setup, every request hits the registry
  : > .npmrc
  local start=$SECONDS
  # shellcheck disable=SC2086 # a spec may name several packages
  if ! npm install $spec --registry "$REGISTRY" --userconfig "$dir/.npmrc" --cache "$dir/.npm-cache" \
      --ignore-scripts --no-audit --no-fund --loglevel=error > install.log 2>&1; then
    echo "FAIL  $spec ($((SECONDS - start))s)"
    tail -n 30 install.log | sed 's/^/      /'
    echo "$spec" >> "$WORK/failed"
    return 1
  fi
  local foreign
  foreign=$(grep -o '"resolved": "[^"]*"' package-lock.json | grep -vc "\"resolved\": \"$REGISTRY" || true)
  local total
  total=$(grep -c '"resolved": "' package-lock.json || true)
  if [ "$foreign" -ne 0 ] || [ "$total" -eq 0 ]; then
    echo "FAIL  $spec: $foreign of $total tarballs not resolved through $REGISTRY"
    echo "$spec" >> "$WORK/failed"
    return 1
  fi
  echo "ok    $spec: $total packages in $((SECONDS - start))s"
}
export -f install_one
export REGISTRY WORK

echo "Installing ${#PACKAGES[@]} specs through $REGISTRY, $CONCURRENCY at a time (work dir $WORK)"
started=$SECONDS
printf '%s\n' "${PACKAGES[@]}" | xargs -P "$CONCURRENCY" -I{} bash -c 'install_one "$1"' _ {}
echo "Finished in $((SECONDS - started))s"

if [ -s "$WORK/failed" ]; then
  echo "$(wc -l < "$WORK/failed" | tr -d ' ') of ${#PACKAGES[@]} failed:"
  sed 's/^/  - /' "$WORK/failed"
  exit 1
fi
echo "All ${#PACKAGES[@]} installs passed"
