#!/usr/bin/env bash

set -e

FIXTURE=$1

case $FIXTURE in 
  info)
    FIXTURE='npm info jquery'
    ;;
  tarball)
    FIXTURE='npm install jquery'
    ;;
  *)
    echo "no command found"  
    return 1;;
esac

hyperfine --ignore-failure --warmup 1 --min-runs=10 --show-output --export-json './hyper-results.json' "$FIXTURE"

