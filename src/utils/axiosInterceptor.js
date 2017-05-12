// import {showCaptcha} from '../componentActions/initActions'
// import {showOffline, isOffline} from 'utils/offlineNotif'

export function attachInterceptor(axios, crf, store) {
	axios.interceptors.request.use(function (config) {
		if (!config.excludeCSRF && crf) {
			config.headers["X-CSRF-TOKEN-V2"] = crf;
		}
		return config;
	}, function (error) {
		// if (store) {
		// 	showOffline(store.dispatch)
		// }
		return Promise.reject(error);
	});

	axios.interceptors.response.use(function (response) {
		// if(response.data.captcha_required && store){
		// 	return new Promise( (resolve, reject) => {
		// 		showCaptcha(store.dispatch, {req: response.config, resolve: resolve, reject: reject})
		// 	})
		// }
		return response;
	  }, function (error) {
	  	// if (error && error.message === 'Network Error') {
			// if (store) {
				// showOffline(store.dispatch)
			// }
	  	// }
		return Promise.reject(error);
	});
}

