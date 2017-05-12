require('babel-register');

const chalk     = require('chalk');
const config    = require('../config').default;
const webpack   = require('webpack');
const webpackConfig = require('../build/webpack/development_hot').default;
const fs 		= require('fs');
const path 		= require('path');
// const iconHelper  = require('../src/utils/iconHelper');

const host = process.env.HOST ? process.env.HOST : config.get('webpack_host');
const port = config.get('webpack_port');
global.webPackPath = "http://" + host + ":" + port;
var assets;

function startServer(){
	console.warn(chalk.yellow(" RUN this command for mobile debugging in different terminal --> weinre --boundHost -all- --httpPort 8081"))
	require("../src/server/index")
	console.warn(chalk.yellow(" RUN this command for mobile debugging in different terminal --> weinre --boundHost -all- --httpPort 8081"))
}

function readWebpackAssets(){
	try{
		assets  = require('../webpack-assets.json')
		processWebpack()
	}catch(err){
		console.log('err reading webpackassets', err)
		assets = false;
		processWebpack()
	}
}

function processWebpack(){
	if(assets && assets.vendor && assets.vendor.js == '/vendor.js'){
		startServer()
	}else{
		console.log('creating webpack dev build')
		webpackConfig.quiet = true;
		webpackConfig.noInfo = true;
		webpack(webpackConfig, function(err, stats){
			if(err){
				console.log('err', err)
			}
			startServer()
		});
	}
}

if (host){
	// try{
	// 	if((fs.readFileSync(path.resolve('iconHash.txt')).toString() != iconHelper.iconHash )) {
	// 		console.log('Icon Hash Found but is different from the current one, updating now')
	// 		iconHelper.createIcomoonFile().then(function(){
	// 			console.log('Finished updating Icon Hash, starting server now')
	// 			readWebpackAssets()
	// 		})
	// 	}else{
	// 		console.log('All looks good, starting server now')
	// 		readWebpackAssets()
	// 	}
	// }catch(err){
	// 	console.log('err', err)
	// 	console.log('Icon Hash not found, creating now')
	// 	iconHelper.createIcomoonFile().then(function(){
	// 		console.log('Finished creating Icon Hash, starting server now')
	// 		readWebpackAssets()
	// 	})
	// }
	readWebpackAssets()
} else {
	console.warn(chalk.red("[warn] Backend server has not been started!"))
	console.warn(chalk.red("[warn] To run backend server pass HOST=yourvm.housing.com"))
}
