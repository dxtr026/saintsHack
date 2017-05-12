const fs = require('fs');
const path  = require('path');
const config 	= require('../config');

function uploadFile(fileName, type){
	const file = fs.createReadStream(path.resolve('./tmp/webPageTests/'+fileName));
	const key = 'webPageTests/'+fileName;
	const body =  file;
	return new Promise(function(resolve, reject){
		AWS.upload({Key : key,Body : body, ContentType: type, ACL: 'public-read'}, function(err, data){
			if(err){
				return reject(err)
			}
			return resolve('https://assets-0.housingcdn.com/'+key)
		})
	})
}

module.exports = {
	uploadFile : uploadFile
}