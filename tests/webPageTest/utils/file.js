
const fs 		= require('fs');
const path 		= require('path');
const request 	= require('request');
const awsUtil   = require('./aws');

function processFile(url, fileName, type){
	return new Promise(function(resolve, reject){
		request.head(url, function(err, res, body){
			if(err){
				return reject(err)
			}
			request(url).pipe(

				fs.createWriteStream(path.resolve('./tmp/webPageTests/'+fileName))
				.on('error', function(err){
					return reject()
				})
				.on('finish', function(){
				})
			).on('close', function(){
				awsUtil.uploadFile(fileName, type).then(function(data){
					return resolve({url: data, fileName: fileName})
				}).catch(function(err){
					return reject(err)
				})
			})
		})
	})
}


module.exports = {
	processFile : processFile
}