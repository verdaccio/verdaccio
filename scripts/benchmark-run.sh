#!/usr/bin/env bash

set -e

VERSION=$1
FIXTURE=$2

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

hyperfine --ignore-failure --warmubp 1 --runs 2 --show-output --export-json './hyper-results.json' --prepare ./scripts/benchmark-prepare.sh $FIXTURE
