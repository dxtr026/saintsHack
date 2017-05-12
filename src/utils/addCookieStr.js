export function convertToCookieString (cookies) {
	let cookieStr = ''
	Object.keys(cookies).forEach( function(cookie, index) {
		cookieStr += `${cookie}=${encodeURIComponent(cookies[cookie])};`
	});
	return cookieStr
}


