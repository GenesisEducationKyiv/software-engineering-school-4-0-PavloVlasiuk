#!/bin/bash

protoc \
--plugin=./node_modules/.bin/protoc-gen-ts_proto \
--ts_proto_out=./dist/types  ./**/*.proto \
--ts_proto_opt=nestJs=true \
--ts_proto_opt=fileSuffix=.type