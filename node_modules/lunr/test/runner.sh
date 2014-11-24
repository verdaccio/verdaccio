#!/usr/bin/env bash

NODE=/usr/local/bin/node
PHANTOMJS=./node_modules/.bin/phantomjs
SERVER_PORT=${1:-54545}

echo "Starting test server at http://localhost:$SERVER_PORT"
$NODE server.js "$SERVER_PORT" > /dev/null 2>&1 &
$PHANTOMJS ./test/env/runner.js "http://localhost:$SERVER_PORT/test" 2> /dev/null
