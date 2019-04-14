# Get the last tag from GitHub
lastTag=$(git describe --tags $(git rev-list --tags --max-count=1))

changelog=$(git show $GITHUB_SHA --unified=0 CHANGELOG.md | tail +12 | sed -e 's/^\+//')

echo "$changelog"

echo "$changelog" | node scripts/trigger-release.js $lastTag
