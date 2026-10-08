#!/usr/bin/env bash
# Install popular packages with large dependency trees through a registry, CONCURRENCY at a time.
# Exits non-zero if any install fails or resolves a tarball from anywhere but REGISTRY.
# Writes a Markdown report to $WORK/report.md and, in GitHub Actions, to the job summary.
set -uo pipefail

REGISTRY="${REGISTRY:-http://localhost:4873}"
CONCURRENCY="${CONCURRENCY:-5}"
MIN_RELEASE_AGE="${MIN_RELEASE_AGE:-7}"
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
  local slug
  slug=$(echo "$spec" | tr -c 'a-zA-Z0-9\n' '_')
  local dir="$WORK/$slug"
  local result="$WORK/results/$slug"
  mkdir -p "$dir"
  cd "$dir" || return 1
  echo '{"name":"proxy-install-probe","version":"1.0.0","private":true}' > package.json
  # Own userconfig and empty cache: only this policy applies, and every request hits the registry
  printf 'min-release-age=%s\nignore-scripts=true\n' "$MIN_RELEASE_AGE" > .npmrc
  local start=$SECONDS
  # shellcheck disable=SC2086 # a spec may name several packages
  if ! npm install $spec --registry "$REGISTRY" --userconfig "$dir/.npmrc" --cache "$dir/.npm-cache" \
      --no-audit --no-fund --loglevel=error > install.log 2>&1; then
    echo "FAIL  $spec ($((SECONDS - start))s)"
    tail -n 30 install.log | sed 's/^/      /'
    printf 'fail\t%s\t-\t%s\tinstall failed\n' "$spec" "$((SECONDS - start))" > "$result"
    return 1
  fi
  local secs=$((SECONDS - start))
  local foreign total versions=""
  foreign=$(grep -o '"resolved": "[^"]*"' package-lock.json | grep -vc "\"resolved\": \"$REGISTRY" || true)
  total=$(grep -c '"resolved": "' package-lock.json || true)
  for name in $spec; do
    versions+="$name@$(node -p "require('./node_modules/$name/package.json').version" 2>/dev/null || echo '?') "
  done
  if [ "$foreign" -ne 0 ] || [ "$total" -eq 0 ]; then
    echo "FAIL  $spec: $foreign of $total tarballs not resolved through $REGISTRY"
    printf 'fail\t%s\t%s\t%s\t%s of %s tarballs not resolved through the registry\n' \
      "$spec" "$total" "$secs" "$foreign" "$total" > "$result"
    return 1
  fi
  echo "ok    $spec: $total packages in ${secs}s"
  printf 'ok\t%s\t%s\t%s\t%s\n' "$spec" "$total" "$secs" "${versions% }" > "$result"
}
export -f install_one
export REGISTRY WORK MIN_RELEASE_AGE

mkdir -p "$WORK/results"
echo "Installing ${#PACKAGES[@]} specs through $REGISTRY, $CONCURRENCY at a time, no lifecycle scripts, releases older than $MIN_RELEASE_AGE days (work dir $WORK)"
started=$SECONDS
printf '%s\n' "${PACKAGES[@]}" | xargs -P "$CONCURRENCY" -I{} bash -c 'install_one "$1"' _ {}
elapsed=$((SECONDS - started))
echo "Finished in ${elapsed}s"

passed=0
failed=0
installed=0
rows=""
details=""
for spec in "${PACKAGES[@]}"; do
  slug=$(echo "$spec" | tr -c 'a-zA-Z0-9\n' '_')
  if [ -f "$WORK/results/$slug" ]; then
    IFS=$'\t' read -r status _ total secs info < "$WORK/results/$slug"
  else
    status=fail total=- secs=- info="no result recorded"
  fi
  if [ "$status" = ok ]; then
    passed=$((passed + 1))
    installed=$((installed + total))
    rows+="| ✅ | \`$spec\` | \`${info// /\` \`}\` | $total | ${secs}s |"$'\n'
  else
    failed=$((failed + 1))
    rows+="| ❌ | \`$spec\` | $info | $total | ${secs}s |"$'\n'
    if [ -f "$WORK/$slug/install.log" ]; then
      details+=$'\n'"<details><summary>❌ <code>$spec</code></summary>"$'\n\n```\n'"$(tail -n 40 "$WORK/$slug/install.log")"$'\n```\n</details>\n'
    fi
  fi
done

{
  if [ "$failed" -eq 0 ]; then
    echo "## ✅ Proxy install: $passed/${#PACKAGES[@]} passed"
  else
    echo "## ❌ Proxy install: $failed of ${#PACKAGES[@]} failed"
  fi
  echo
  echo "| Setting | Value |"
  echo "| --- | --- |"
  echo "| Registry | \`$REGISTRY\`${VERDACCIO_VERSION:+ (verdaccio $VERDACCIO_VERSION)} |"
  echo "| Concurrency | $CONCURRENCY installs at a time |"
  echo "| Policy | no lifecycle scripts, releases older than $MIN_RELEASE_AGE days, empty npm cache per project |"
  echo "| npm | $(npm --version) on Node.js $(node --version) |"
  echo "| Wall time | ${elapsed}s |"
  echo "| Packages installed | $installed across $passed passing specs, every tarball resolved through the registry |"
  echo
  echo "| | Spec | Installed versions | Packages | Time |"
  echo "| --- | --- | --- | ---: | ---: |"
  printf '%s' "$rows"
  printf '%s' "$details"
} > "$WORK/report.md"

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  cat "$WORK/report.md" >> "$GITHUB_STEP_SUMMARY"
fi
echo "Report: $WORK/report.md"

if [ "$failed" -ne 0 ]; then
  echo "$failed of ${#PACKAGES[@]} failed"
  exit 1
fi
echo "All ${#PACKAGES[@]} installs passed"
