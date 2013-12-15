#!/bin/sh

CWD=$(pwd)
PATH='../node_modules/.bin':$PATH
TESTDIR=$(dirname $0)
cd $TESTDIR
mocha -R list --ui exports ./tests.js ./unit
TESTRES=$?
cd $CWD
exit $TESTRES
