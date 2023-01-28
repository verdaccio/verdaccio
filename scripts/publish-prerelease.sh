#!/bin/bash

# Get the last tag from GitHub
lastTag=$(git describe --tags $(git rev-list --tags --max-count=1))

# Print it to the console for verification
echo "Bumping version to new tag: ${lastTag}"

# creating .npmrc
echo "//$REGISTRY_URL/:_authToken=$REGISTRY_AUTH_TOKEN" > .npmrc

# Publish to NPM
npm publish --registry https://$REGISTRY_URL/ --tag canary-5x
