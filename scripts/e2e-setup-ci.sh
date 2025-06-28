#!/usr/bin/env bash

set -e
# Enable strict error handling - script exits immediately if any command fails
# This prevents the script from continuing with potentially corrupted state

HERE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
# Capture the absolute path of the directory containing this script
# ${BASH_SOURCE[0]} = path to current script file
# dirname extracts the directory portion of the path
# cd to that directory, then pwd gives us the absolute path
# >/dev/null 2>&1 suppresses any output or error messages

TEMP_DIR="$(mktemp -d)"
# Create a new temporary directory and store its path
# mktemp -d creates a unique temporary directory
# The directory will be created with secure permissions (700)

cd "${TEMP_DIR}"
# Change current working directory to the temporary directory
# Note: This doesn't affect the git config commands since they're global

echo $TEMP_DIR
# Print the temporary directory path for debugging/informational purposes

echo $HERE_DIR

git config --global user.email "you@example.com"
git config --global user.name "John Doe"

