#!/bin/bash
set -e
npm prune
npm install --production
rm -rf dist/*
rm -rf server/*
rm -f manifest.json
mkdir -p dist
cp -r assets/images dist/images
./node_modules/.bin/gulp prepare_icomoon_file
node build/hash-assets images
./node_modules/.bin/webpack
./node_modules/.bin/babel src/ --out-dir server/
./node_modules/.bin/gulp compile_worker
./node_modules/.bin/webpack --config worker-webpack.config.js
# this is for test so that its created everytime irrespective tests are run or not
export NODE_ENV=production
if [ "$BRANCH_NAME" == "master" ];
then
	./node_modules/.bin/webpack --profile --json > ./tmp/webpack_config/master-stats.json
	cp ./tmp/webpack_config/master-stats.json ./current-stats.json
else
	./node_modules/.bin/webpack --profile --json > ./current-stats.json
fi

{
	cp ./tmp/webpack_config/master-stats.json master-stats.json
}

