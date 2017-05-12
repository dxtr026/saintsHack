export function userAgentCheck(req, res, next) {
	res.locals.browser = req.useragent.browser.toLowerCase()
	res.locals.browser_version = parseInt(req.useragent.version, 10)
	return next()
}
