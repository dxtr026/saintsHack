const fs = require('fs');
const path = require('path');

export const createInlineCss = (css_path, chunkname, cdn_path) => {
	console.log('creating inline css for : ',chunkname);
	if(!global.inlineCssObj){
		global.inlineCssObj = {}
	}
	try {
		if(css_path && chunkname){
			let file_path = `./dist/${css_path.replace(cdn_path,'')}`
			file_path = file_path.replace('//','/')
			global.inlineCssObj[chunkname] = fs.readFileSync(path.resolve(file_path)).toString()
			console.log('filePath --> made')
		}else{
			global.inlineCssObj[chunkname] = ''
		}
	} catch(e) {
		global.inlineCssObj[chunkname] = ''
		console.log('Error in making css file')
	}
};

export const cssAssetPaths = (assets) => {
	let tem_obj = {};
	const notUsedViews = ['bottomNotification', 'voucherDerails']
	Object.keys(assets).forEach( function(element, index) {
		if(!!assets[element].css && (notUsedViews.indexOf(element)===-1)){
			let cssHash = assets[element].css.split('.css')
			cssHash = cssHash[0].split(element)
			cssHash = cssHash[1].replace(/^\./,'')
			tem_obj[element] = {css : cssHash}
		}
	});
	return tem_obj
}
