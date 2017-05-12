const fs = require('fs')
const path = require('path')
require('../../../src/utils/uniqueArray')

function createUrlComment (url, data) {
  const viewData = data.runs['1'].firstView
  var str = '\n'
  str += '> **' + url + '**\n'
  str += '> [Test Results](' + data.jsonFileUrl + ')\n'
  str += '\n'
  str += '| Time to First Byte  |  Render Started | Visualy Completed  |  SpeedIndex |  Load Time |  Fully Complete | Bytes Loaded  |\n'
  str += '|:-:|:-:|:-:|:-:|:-:|---|---|\n'
  str += '|  ' + viewData.TTFB / 1000 + 's | **' + viewData.render / 1000 + '**s  |  ' + viewData.visualComplete / 1000 + 's | ' + viewData.SpeedIndex + '  | **' + viewData.loadTime / 1000 + '**s  | ' + viewData.fullyLoaded / 1000 + 's  | ' + viewData.bytesIn / 1000 + 'kb  |\n'
  str += '\n'
  return str
}

function createImageContent (url, data) {
  var str = '\n'
  const viewData = data.runs['1'].firstView
  const frames = viewData.videoFrames
  str += '\n'
  str += '> WaterFall and ScreenShot for **' + url + '** looked like this'
  str += '\n'
  str += '\n'
  str += '|  WaterFall | ScreenShot  |\n'
  str += '|:-:|:-:|\n'
  str += '|  <img width="150" alt="screenShot for ' + url + '" src="' + data.screenShotUrl + '"> | <img width="300" alt="waterFall for ' + url + '" src="' + data.waterFallUrl + '">  |\n'
  str += '\n'
  str += '> Frames for **' + url + '** looked like this'
  str += '\n'
  str += '\n'
  frame_head = '|'
  frame_divider = '|'
  frame_first_row = '|'
  frame_second_row = '|'
  frames.forEach(function (frame, index) {
    frame_head += ' ' + frame.time / 1000 + 's |'
    frame_divider += ':-:|'
    frame_first_row += ' <img width="100" alt="frame at ' + frame.time + '" src="' + frame.imageUrl + '"> |'
    frame_second_row += ' ' + frame.VisuallyComplete + '% |'
  })
  frame_head += '\n'
  frame_divider += '\n'
  frame_first_row += '\n'
  frame_second_row += '\n'
  str += frame_head + frame_divider + frame_first_row + frame_second_row
  return str
}

function create (data) {
  const keys = Object.keys(data).sort()
  var comment = ''

  comment += createSizeData()

  keys.forEach(function (key, index) {
    comment += createUrlComment(key, data[key])
  })

  keys.forEach(function (key, index) {
    comment += createImageContent(key, data[key])
  })

  return new Promise(function (resolve, reject) {
    resolve(comment)
  })
}

function createSizeData () {
  var assetsJSON = {}
  try {
    assetsJSON = fs.readFileSync(path.resolve('./current-stats.json'))
    assetsJSON = assetsJSON.toString()
    assetsJSON = JSON.parse(assetsJSON)
  } catch(err) {
    return '\n###No current-stats.json found, please check! this should never happen###\n'
  }
  var oldAssetsJSON = {}
  try {
    oldAssetsJSON = fs.readFileSync(path.resolve('./master-stats.json'))
    oldAssetsJSON = oldAssetsJSON.toString()
    oldAssetsJSON = JSON.parse(oldAssetsJSON)
  } catch(er) {
    oldAssetsJSON = {}
  }
  var str = ''
  if (!assetsJSON.assets) {
    return '\n###No stats.json found, please check! this should never happen###\n'
  }
  var chunkObjNew = getChunkSizes(assetsJSON.assets)
  var chunkObjOld = getChunkSizes(oldAssetsJSON.assets)

  var newKeys = Object.keys(chunkObjNew).sort()
  var oldKeys = Object.keys(chunkObjOld).sort()

  var clonedKeys = newKeys.concat(oldKeys).unique()

  if (!newKeys.length) {
    return '\n###No chunks in assets found, please check! this should never happend###\n'
  }

  str += '| FileName | NewSize (kb) | OldSize (kb) | MaxShouldBe (kb) |\n'
  str += '|---|--:|---|:-:|\n'
  clonedKeys.forEach(function (key, index) {
    str += '| ' + key + ' | '
    if (chunkObjNew[key] && chunkObjOld[key]) {
      if (chunkObjNew[key] > chunkObjOld[key]) {
        str += ' **' + chunkObjNew[key] + '** | ' + chunkObjOld[key] + ' | - |\n'
      }else if (chunkObjNew[key] < chunkObjOld[key]) {
        str += ' ' + chunkObjNew[key] + ' | **' + chunkObjOld[key] + '** | - |\n'
      }else {
        str += chunkObjNew[key] + ' | ' + chunkObjOld[key] + ' | - |\n'
      }
    } else if (chunkObjNew[key] && !chunkObjOld[key]) {
      str += chunkObjNew[key] + ' | - | - |\n'
    }else if (!chunkObjNew[key] && chunkObjOld[key]) {
      str += ' - | ' + chunkObjOld[key] + ' | - |\n'
    }else {
      str += ' - | - | - |\n'
    }
  })
  return str
}

function getChunkSizes (assets) {
  var chunkObj = {}
  assets.forEach(function (chunk, index) {
    var name
    var size
    split_name = chunk.name.split('.')
    if (split_name.length == 4 && split_name[split_name[3] == 'gz']) {
      name = split_name[0] + '.' + split_name[2]
      chunkObj[name] = chunk.size / 1000
    }else if (split_name.length == 3) {
      name = split_name[0] + '.' + split_name[2]
      if (Object.keys(chunkObj).indexOf(name) == -1) {
        chunkObj[name] = chunk.size / 1000
      }
    }else if (split_name.length == 2) {
      name = split_name[0] + '.' + split_name[1]
      if (Object.keys(chunkObj).indexOf(name) == -1) {
        chunkObj[name] = chunk.size / 1000
      }
    }
  })
  return chunkObj
}

function inPlace (url , data) {
  var str = ''
  const viewData = data.runs['1'].firstView
  const frames = viewData.videoFrames
  str += '\n'
  str += 'Results for '
  str += '\n'
  str += '\nRender Started    --->>>> ' + viewData.render / 1000
  str += '\nLoad Time     --->>>> ' + viewData.loadTime / 1000
  str += '\njsonFileUrl     --->>>> ' + data.jsonFileUrl
  str += '\nscreenShotUrl   --->>>> ' + data.screenShotUrl
  str += '\nwaterFallUrl    --->>>> ' + data.waterFallUrl
  return str
}

function createInPlace (data) {
  const keys = Object.keys(data).sort()
  var comment = ''
  keys.forEach(function (url, index) {
    comment += '\n'
    comment += inPlace(url , data[url])
    comment += '\n'
  })

  return new Promise(function (resolve, reject) {
    resolve(comment)
  })
}

module.exports = {
  create: create,
  createInPlace: createInPlace,
  createSizeData: createSizeData
}
