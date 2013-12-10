#!/bin/sh

CWD=$(pwd)
PATH='../node_modules/.bin':$PATH
TESTDIR=$(dirname $0)
cd $TESTDIR
mocha -R list --ui exports ./tests.js ./no_proxy.js
TESTRES=$?
cd $CWD
exit $TESTRES
