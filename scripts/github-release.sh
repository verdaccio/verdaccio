#!/bin/bash
# Get the last tag from GitHub
lastTag=$(git describe --tags $(git rev-list --tags --max-count=1))
yarn ts-node scripts/trigger-release.ts $lastTag $changelog
