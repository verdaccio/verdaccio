#!/bin/bash

if pgrep -f "/usr/bin/dumb-init" > /dev/null; then
    if pgrep -f "apm" > /dev/null; then
        exit 0
    else
        exit 1
    fi
else
    exit 1
fi
