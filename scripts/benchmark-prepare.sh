#!/usr/bin/env bash

set -e

VERSION=$1

tmp_registry_log=`mktemp`

npm i -g verdaccio@$VERSION
nohup verdaccio &>$tmp_registry_log &
grep -q 'http address' <(tail -f $tmp_registry_log)
npm set registry http://localhost:4873
