/*
	GulpFile
	Please add the corresponding gulp module in the package.json
*/
require('babel-register');
var ejs             = require("ejs");
var fs              = require("fs");
var gulp            = require('gulp');
var map             = require('map-stream');
var path            = require("path");
var iconHelper    	= require('./src/utils/iconHelper');

var babelrc = fs.readFileSync('./.babelrc');
var config;
var Watchers = {};
try {
	config = JSON.parse(babelrc);
} catch (err) {
	console.error('==>     ERROR: Error parsing your .babelrc.');
	console.error(err);
	process.exit(1);
}
var babel = require("gulp-babel")(config);

/*
	Asset.js.erb compilation
*/

var get_cache_arrays = function(paths){
	var pathsArray = []
	var jsToCache = [];
	var cssToCache = [];
	var commonCache = [];
	if(paths['chunks']){
		console.log('process.env.NODE_ENV')
		paths = paths['chunks']
		console.log(paths, '-->>>>')
		Object.keys(paths).forEach( function(key) {
			if(typeof(paths[key])=='object' && paths[key].length){
				paths[key].forEach(function(k){
					urlsToCache.push(k.publicPath)
				})
			}
		});
	}else{
		pathsArray.forEach(function(key){
			if(typeof(paths[key])==='object'){
				Object.keys(paths[key]).forEach(function(k){
					if(k == 'js'){
						jsToCache.push(paths[key]['js'])
					}else if(k == 'css'){
						cssToCache.push(paths[key]['css'])
					}else{
						commonCache.push(paths[key][k])
					}
				})
			}else if(typeof(paths[key]==='string')){
				commonCache.push(paths[key])
			}
		})

	}

	return {commonCache: commonCache, cssToCache: cssToCache, jsToCache: jsToCache}
}

var compile_ejs_file = function(file_path, assets){
	env = {}
	if (process.env.NODE_ENV != "production")
		env.development = true
	else
		env.production = true
	var data = fs.readFileSync(file_path).toString()
				.replace(/(?:if )([\S]+)(?:\?)/igm, "if($1){")
				.replace(/\<%[ ]*else[ ]*%\>/igm, "<% }else{ %>")
				.replace(/\<%[ ]*end[ ]*%\>/igm, "<% } %>")
	var assets = JSON.parse(fs.readFileSync('./webpack-assets.json'), 'utf8')
	var urlsToCacheObj = get_cache_arrays(assets)
	data = ejs.render(data, {commonCache: JSON.stringify(urlsToCacheObj.commonCache), cssToCache: JSON.stringify(urlsToCacheObj.cssToCache), jsToCache: JSON.stringify(urlsToCacheObj.jsToCache)})
	if (file_path.match(/(\.js\.ejs)$/)){
		file_path = path.resolve("public/public_assets/sw.js")
		stream = fs.createWriteStream(file_path , {flags:"w+"})
		stream.write(data, 'utf-8');
		stream.close();
		return file_path;
	}
}

var src_and_move = function(){
	gulp.src(path.resolve("./public/public_assets/sw.js"))
	.pipe(babel)
	.pipe(gulp.dest(path.resolve("./public/public_assets")))
}

console.log('gulp started')
var erbToEjs = function(){
	var stream;
	return map(function(file, cb){
		file.path = compile_ejs_file(file.path)
		if (file.path.match(/(\.js\.ejs)$/)){
			return cb(null, file);
		}
	})
}

var watch_service_worker = function(){
	if((!process.env.NODE_ENV) || (process.env.NODE_ENV === 'development')){
		var chokidar		= require("chokidar")
		var WebpackAssetsWatcher = chokidar.watch("./webpack-assets.json", {
			persistent: true,
			poll: 100,
			awaitWriteFinish: true
		})

		WebpackAssetsWatcher
			.on("add", function(file_path){
				console.log('add --------->>>>>>>>>', file_path)
				compile_ejs_file(path.resolve("./src/serviceWorker/index.js.ejs"))
				src_and_move()
			})
			.on("change", function(file_path){
				console.log('change --------->>>>>>>>>', file_path)
				compile_ejs_file(path.resolve("./src/serviceWorker/index.js.ejs"))
				src_and_move()
			})
			.on("unlink", function(file_path){
				console.log("[js-watcher]: File removed", file_path)
			})
			.on("ready", function(){
				console.log("[js-watcher] Initialised.. Watching Now!");
				Watchers["WebpackAssetsWatcher"] = true;
			})
	}
}

gulp.task("compile_worker", function(){
	console.log('compiling service worker ...............')
	compile_ejs_file(path.resolve("./src/serviceWorker/index.js.ejs"))
	src_and_move()

	gulp.src(path.resolve("./node_modules/sw-toolbox/sw-toolbox.js"))
	.pipe(gulp.dest(path.resolve("./public/public_assets")))

	gulp.src(path.resolve("./node_modules/sw-toolbox/sw-toolbox.map.json"))
	.pipe(gulp.dest(path.resolve("./public/public_assets")))
})

gulp.task("prepare_icomoon_file", function(){
	console.log('Preparing icomoon file')
	iconHelper.createIcomoonFile()
})

gulp.task("watch", function(){
	console.log('watching file webpack-assets')
	watch_service_worker()
	gulp.watch('./src/serviceWorker/index.js.ejs', ["compile_worker"])
})

gulp.task('default', ['watch'])

gulp.task("build", ["compile_worker"])
