export function cleanUrl () {
	if (window && window.location && window.location.pathname.match(/\/\/+/)) {
		let url = window.location.pathname
		url = url.replace(/\/+/g, '/').replace(/\/$/, '')
		url = url + window.location.search // new url with search string
		if (url && url[0] != '/') {
			url = `/${url}`
		}
		if (window.history && window.history.replaceState) {
			window.history.replaceState(window.history.state, document.title, url)
		} else if (window.location.replace) {
			window.location.replace(url)
		} else {
			window.location.href = url   //href as the url is with search string
		}
	}
}
