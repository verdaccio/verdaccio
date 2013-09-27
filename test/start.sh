#!/bin/sh

CWD=$(pwd)
TESTDIR=$(dirname $0)
cd $TESTDIR
../node_modules/mocha/bin/mocha -R list --ui exports ./tests.js
cd $CWD

