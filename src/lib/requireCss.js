// inspiration
//http://www.phpied.com/when-is-a-stylesheet-really-loaded/
//https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js
//https://github.com/guybedford/require-css/blob/master/css.js << --- copied from

export function requireCss (chunkName, cb) {
	if (typeof window === 'undefined') {
		return cb()
	}
	if (!assetPaths[chunkName] || typeof(assetPaths[chunkName].css) === 'undefined'){
		return cb()
	}
	let cssPath = assetPaths[chunkName].css
	if (assetPaths[chunkName].css !== ''){
		cssPath = `.${assetPaths[chunkName].css}`
	}
	let cssFilePath = `${cdnHost}/${chunkName}${cssPath}.css`
	cssFilePath = cssFilePath.replace(/^\/\//,'/')
	const head = document.getElementsByTagName("head")[0]
	const engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)|AndroidWebKit\/([^ ;]*)/) || 0;

	// use <style> @import load method (IE < 9, Firefox < 18)
	let useImportLoad = false;

	// set to false for explicit <link> load checking when onload doesn't work perfectly (webkit)
	let useOnload = true

	if (engine[1] || engine[7]){
		// trident / msie
		useImportLoad = parseInt(engine[1]) < 6 || parseInt(engine[7]) <= 9
	}
	else if (engine[2] || engine[8]) {
		// webkit
		useOnload = false
	}
	else if (engine[4]) {
		// gecko
		useImportLoad = parseInt(engine[4]) < 18
	}

	// <style> @import load method
	let curStyle, curSheet
	const createStyle = () => {
		curStyle = document.createElement('style')
		head.appendChild(curStyle)
		curSheet = curStyle.styleSheet || curStyle.sheet
	}

	let ieCnt = 0
	let ieLoads = []
	let ieCurCallback

	const createIeLoad = (url) => {
		curSheet.addImport(url)
		curStyle.onload = () => { processIeLoad() }
		ieCnt++
		if (ieCnt == 31) {
			createStyle()
			ieCnt = 0
		}
	}

	const processIeLoad = () => {
		ieCurCallback()
		const nextLoad = ieLoads.shift()
		if (!nextLoad) {
			ieCurCallback = null;
			return;
		}

		ieCurCallback = nextLoad[1];
		createIeLoad(nextLoad[0]);
	}

	const importLoad = (url, callback) => {
		if (!curSheet || !curSheet.addImport)
			createStyle()

		if (curSheet && curSheet.addImport) {
			// old IE
			if (ieCurCallback) {
				ieLoads.push([url, callback])
			} else {
				createIeLoad(url)
				ieCurCallback = callback
			}
		} else {
			// old Firefox
			curStyle.textContent = '@import "' + url + '";'
			const loadInterval = setInterval(() => {
				try {
					curStyle.sheet.cssRules
					clearInterval(loadInterval)
					callback()
				} catch(e) {
					// console.log(e)
				}
			}, 10)
		}
	}

	// <link> load method
	const linkLoad = (url, callback) => {
		let link = document.createElement('link')
		link.type = 'text/css'
		link.rel = 'stylesheet'
		if (useOnload) {
			link.onload = () => {
				link.onload = () => {}
				// for style dimensions queries, a short delay can still be necessary
				setTimeout(callback, 7)
			}
		} else {
			const loadInterval = setInterval(() => {
				for (var i = 0; i < document.styleSheets.length; i++) {
					const sheet = document.styleSheets[i]
					if (sheet.href == link.href) {
						clearInterval(loadInterval)
						return callback()
					}
				}
			}, 10)
		}
		link.href = url
		link.id = `chunk-${chunkName}`
		head.appendChild(link)
	}
	(useImportLoad ? importLoad : linkLoad)(cssFilePath, cb)
}
