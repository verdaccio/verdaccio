#!/usr/bin/env bash

set -e

VERSION=$1
FIXTURE=$2

hyperfine --ignore-failure --warmup 1 --runs 2 --show-output --export-json ./hyper-results.json--prepare ./scripts/benchmark-prepare.sh $2
