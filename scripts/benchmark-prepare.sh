#!/usr/bin/env bash

set -e

VERSION=$1

tmp_registry_log=`mktemp`

npm i -g verdaccio@$VERSION
# start in the background the registry
nohup verdaccio &>$tmp_registry_log &
# wait until has started (using stdout)
grep -q 'http address' <(tail -f $tmp_registry_log)
npm set registry http://localhost:4873
