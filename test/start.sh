#!/bin/sh

CWD=$(pwd)
PATH='../node_modules/.bin':$PATH
TESTDIR=$(dirname $0)
cd $TESTDIR
mocha ./functional ./unit
TESTRES=$?
cd $CWD
exit $TESTRES
