// import axios from 'axios'
// axios.defaults.timeout = 5000

// import Rabbit from './mqtt'
// import config from 'config/application'

// const boot_apis = {
// 	InitOptions: `${config.rails}api/v1/init_options`,
// 	Cities: `${config.regions}api/v1/polygon/top/cities/list`
// };

// const reBuildCache = function(key, callback){
// 	return function(){
// 		let api_url;
// 		if ((api_url = boot_apis[key])){
// 			axios.get(api_url).then(function(response){
// 				// http://www.nooooooooooooooo.com/
// 				// Avoid global.
// 				// Use something like Map and use get and set variables.
// 				global[key] = response.data;
// 				console.info('Reloaded', key, 'from', api_url);
// 				if (callback){
// 					return callback()
// 				}
// 			}).catch(function(response){
// 				console.warn('Failed to load', api_url, response);
// 			})
// 		} else {
// 			console.log('Missing cache loading url for', key);
// 		}
// 	}
// };
// function setCityMap(){
// 	const cityMap = {};
// 	global.Cities.top_cities.map(function (val) {
// 		cityMap[val.url_name] = val;
// 	});
// 	global.Cities.other_cities.map(function (val) {
// 		cityMap[val.url_name] = val;
// 	});
// 	global.cityMap = cityMap;
// }
// const rebuildAll = function(){
// 	Object.keys(boot_apis).forEach(function(key){
// 		if (key == 'Cities'){
// 			reBuildCache(key, setCityMap)();
// 		} else {
// 			reBuildCache(key)();
// 		}
// 	})
// };

// Rabbit.init();
// Rabbit.register({name: 'housing.rails.cache.init_options'}, reBuildCache('InitOptions'))
// Rabbit.register({name: 'housing.rails.cache.cities'}, reBuildCache('Cities', setCityMap))
// // register more listeners here
// rebuildAll()
// global.Rabbit = Rabbit;
// module.exports = {
// 	rebuildAll: rebuildAll,
// 	reBuildCache: reBuildCache
// }
