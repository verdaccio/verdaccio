#!/bin/bash

aws --endpoint-url http://localstack-s3:4572 s3 mb s3://localstack.s3.plugin.test --region eu-west-2