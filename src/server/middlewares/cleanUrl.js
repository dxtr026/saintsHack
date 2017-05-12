export default function cleanUrl (req, res, next) {
	req.originalUrl = req.originalUrl.replace(/\/+/g, '/')
	req.url = req.url.replace(/\/+/g, '/')
	return next()
}
