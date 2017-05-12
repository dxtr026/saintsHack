const fs = require('fs');
const path  = require('path');
const fileUtil = require('../file');
const awsUtil   = require('../aws');

function createDir(dirPath){
	try{
		const parent_stats = fs.lstatSync(dirPath);
	}catch(err){
		fs.mkdirSync(dirPath);
	}
}

function deleteFolderRecursive(dirPath){
	try{
		if( fs.existsSync(dirPath) ) {
			fs.readdirSync(dirPath).forEach(function(file,index){
				var curPath = dirPath + "/" + file;
				if(fs.lstatSync(curPath).isDirectory()) { // recurse
					deleteFolderRecursive(curPath);
				} else { // delete file
					fs.unlinkSync(curPath);
				}
			});
			fs.rmdirSync(dirPath);
		}
	}catch(err){
	}
}

function processData(testData, url){
	const baseFolderName = testData.id
	createDir(path.resolve('./tmp/webPageTests/'))
	createDir(path.resolve('./tmp/webPageTests/'+baseFolderName))
	const basePath = path.resolve('./tmp/webPageTests/'+baseFolderName)
	try{
		return new Promise(function(resolve, reject){
			console.log('processing data for : ', url)
			const waterFall = testData.runs['1'].firstView.images.waterfall
			const screenShot = testData.runs['1'].firstView.images.screenShot
			const frames = testData.runs['1'].firstView.videoFrames
			fileUtil.processFile(waterFall,baseFolderName+'/waterfall.png', 'image/png')
			.then(function(data){

				testData.waterFallUrl = data.url;

				fileUtil.processFile(screenShot,baseFolderName+'/screenShot.png','image/png')
				.then(function(data){

					testData.screenShotUrl = data.url;

					var framesPromiseArray = []
					frames.forEach(function(frame, index){

						createDir(basePath+'/videoFrame')

						framesPromiseArray.push( new Promise(function(res, rej){

							fileUtil.processFile(frame.image, baseFolderName+'/videoFrame/frame_'+index+'.jpg', 'image/jpeg')
							.then(function(data){
								frames[index].imageUrl = data.url;
								return res()
							}).catch(function(err){
								console.log('err', err)
								return rej(err)
							})
						}))
					})

					Promise.all(framesPromiseArray).then(function(){

						// upload the json file also
						awsUtil.uploadFile(baseFolderName+'/testResults.json', 'application/json').then(function(data){
							deleteFolderRecursive(path.resolve('./tmp/webPageTests/'+baseFolderName))
							testData.jsonFileUrl = data;
							return resolve(testData)
						}).catch(function(err){
							console.log('err', err)
							return reject(err)
						})
					}).catch(function(err){
						console.log('err', err)
						return reject(err)
					})
				}).catch(function(err){
					console.log('err', err)
					return reject(err)
				})
			}).catch(function(err){
				console.log('err',err)
				return reject(err)
			})
		})

	}catch(e){
		return Promise.reject('error in processing testData', err)
	}
}

function processTestData(testDataObject){
	// testDataObject = {
	// 	'mbeta_' : testData
	// }
	const urls =  Object.keys(testDataObject);
	return new Promise(function(resolve, reject){

		const promiseArray = [];
		console.log('processing data started')
		urls.forEach( function(url, index) {
			promiseArray.push(processData(testDataObject[url], url))
		});

		Promise.all(promiseArray).then(function(){
			return resolve(testDataObject)
		}).catch(function(err){
			console.log('err after all is done', err)
			return reject(err)
		})

	})
}

module.exports = {
	processTestData : processTestData,
	processData : processData,
	deleteFolderRecursive: deleteFolderRecursive
};