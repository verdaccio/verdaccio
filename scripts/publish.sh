#!/bin/bash

# Get the last tag from GitHub
lastTag=$(git describe --tags $(git rev-list --tags --max-count=1))

# Print it to the console for verification
echo "Bumping version to new tag: ${lastTag}"

# Publish to NPM
npm publish --tag next --registry https://registry.npmjs.org/
