#!/bin/bash

sed -i -e "s|XX_REMOTE_URL_XX|$REMOTE_URL|g" /etc/nginx/conf.d/default.conf

exec nginx -g "daemon off;"
