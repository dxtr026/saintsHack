//https://github.com/marcelduran/webpagetest-api

const webPageTest 	= require('webpagetest');
const fs 			= require('fs');
const path          = require("path");
const http 			= require('http');

require('es6-promise').polyfill()

const APIKey = 'A.9424c24ee3a18917df21f21e408360cf'

var baseUrl = 'https://mbeta.housing.com'
if(process.argv && process.argv.length>=3){
	if(process.argv[2].indexOf('housing.com')!=-1){
		baseUrl = process.argv[2]
	}
}
const urlsToTest = [baseUrl+'/', baseUrl+'/in/buy/real-estate-mumbai',baseUrl+'/in/buy/real-estate-bangalore',baseUrl+'/in/buy/mumbai/powai', baseUrl+'/in/buy/projects/page/16080', baseUrl+'/in/buy/resale/page/847487']

const wpt = new webPageTest('https://www.webpagetest.org', APIKey);

// const emails = 'rahul026@housing.com, chetan.garg@housing.com, aziz.khambati@housing.com, vivek.jagtap@housing.com, arun.premkumar@housing.com, riteshkumar@housing.com, parth.shah@housing.com, pranjal.jain@housing.com, dron.rathore@housing.com, vikash.agrawal@housing.com, nikhita.kale@housing.com, aman@housing.com, snehil@housing.com, bhavir.shah@housing.com, saurabh.khandelwal@housing.com'
const emails = ''

const testOptions = {
	pollResults 	: 10,
	connectivity 	: '3G',
	location 		: 'Dulles:Chrome',
	firstViewOnly 	: true,
	notifyEmail 	: emails,
	timeline 		: true,
	userAgent 		: 'Mozilla/5.0 (Linux; Android 4.0.4; Galaxy Nexus Build/IMM76B) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.133 Mobile Safari/535.19',
	emulateMobile 	: true,
	video 			: true,
	medianVideo 	: true,
	continuousVideoCapture: true,
	private 		: true
}

var promiseArray = [];
var testResultData = {}
const dir_name = new Date().toLocaleString().replace(/\s|__|\/|\:|\,|\__/g, '_').replace(/__/g, '_')

function initTests(){
	return new Promise(function(resolve, reject){
		urlsToTest.forEach( function(urlToTest, index) {
			promiseArray.push(new Promise(function(resolv, rejec){
				runTest(urlToTest, testOptions, dir_name, resolv, rejec)
			}));
		});

		Promise.all(promiseArray).then(function(value){
			console.log('Completed All Tests')
			// console.log('Have to start comparing now')
			// console.log('testResultData', testResultData)
			resolve(testResultData)
		}, function(err){
			console.log('err after', err)
			console.log('testResultData', testResultData)
		})
	})
}

function runTest(urlToTest, testOptions, dir_name, resolve, reject){
	var url_name  = urlToTest.replace(/https:\/\/|\.housing\.com|housing\.com/g,'').replace(/\s|__|\/|\:|\,|\__/g, '_').replace(/__/g, '_').replace(/\-/g, '_')
	if(url_name[0]==='_'){
		url_name = 'home'+url_name
	}

	console.log('Starting Test ', urlToTest, url_name)

	try{
		const stats = fs.lstatSync(path.resolve('./tmp/webPageTests'));
		if (stats.isDirectory()) {
		}
	}catch(err){
		console.log('creating results directory')
		fs.mkdirSync(path.resolve('./tmp/webPageTests'));
	}

	wpt.runTest(urlToTest, testOptions,
		function(error, testResult){
			if(error){
				console.log('Error : ', error)
			}
			if(testResult){

				if(testResult.data){
					console.log('got testResults : %s', testResult.data.id)
					testResultData[url_name] = testResult.data;

					const parent_dir =  path.resolve('./tmp/webPageTests/'+testResult.data.id);

					try{
						const parent_stats = fs.lstatSync(parent_dir);
					}catch(err){
						fs.mkdirSync(parent_dir);
					}

					data = JSON.stringify(testResult.data)
					const file_path = path.resolve(parent_dir+'/testResults.json')
					fs.writeFile(file_path , data, function(err, data){
						if(err){
							console.log('error after testResults file', err);
							return reject(err)
						}
						if(data){
							console.log('data after testResults file', data);
						}
						return resolve()
					} )
				}else{
					console.log('error in creating testResults File for ', testResult.data.id, ' error: ',  error);
					return reject(err)
				}
			}
		}
	)
}


module.exports = {
	initTests: initTests
}

