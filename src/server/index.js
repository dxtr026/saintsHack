global.__SERVER__ = true
import config from 'config/application'
import express from 'express'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import useragent from 'express-useragent'
import React from 'react'
import ReactDOM from 'react-dom/server'
import {Provider} from 'react-redux'
import { createMemoryHistory } from 'history'
import fileUpload from 'express-fileupload'

import {match, RouterContext} from 'react-router'
import {createInlineCss, cssAssetPaths} from '../utils/inlineCss'
import appConfig from '../config/application'

import {errorHandler} from './middlewares/errorHandler'
import configureStore from 'store/configureStore'
import {fetchComponentsData} from 'utils'
import assets from '../../webpack-assets'
import {registerMiddlewares} from './middlewares'
import cleanUrl from './middlewares/cleanUrl'
import https from 'https'
import fs from 'fs'
import path from 'path'
import cmd from 'node-cmd'
// import google_speech from 'google-speech'
// import speech from 'google-speech-api'

import recoSpeech from 'server/helper/speech'

import warmRequire from 'utils/warmRequire'

let routesCreator = warmRequire('routes').default

const app = express()
const env = (process.env.NODE_ENV || '')

const cssAssets = cssAssetPaths(assets)

app.set('views', `${process.cwd()}/src/server/views`)
app.set('view engine', 'ejs')
app.set('x-powered-by', false)

if (env !== 'production') {
  console.log('[info] Registering Webpack dev middleware')
  app.use(require('../../build/webpack-dev-server').default)
}
/*
  This is will create the string for app.css once before starting the server and keep it in Memory
  global.inlineCssObj = { chunkname : string_value} e.g {app : somestring}
  is the format we need to keep for this.
 */
if (env == 'production') {
  Object.keys(assets).forEach((element, index) => {
    if (assets[element] && assets[element].css) {
      createInlineCss((assets[element].css || ''), element, (`${config.cdn_path}/`))
    }
  })
}

global.isBackendPrinted = true

app.disable('x-powered-by')
app.use(cookieParser())
app.use(useragent.express())
app.use(cleanUrl)
app.use(fileUpload())

app.listen(process.env.PORT || 4000, () => console.log(`[info] Sun raha hu main ${process.env.PORT || 4000} par`))

if (process.env.SECURE) {
  let privateKey = fs.readFileSync(path.resolve('server.key')).toString()
  let certificate = fs.readFileSync(path.resolve('server.crt')).toString()
  let options = {key: privateKey, cert: certificate}
  const httpsServer = https.createServer(options, app)
  httpsServer.listen(5000, () =>
    console.log('https running on 5000')
  )
}

app.use(morgan('dev'))
app.use(express.static(path.resolve('./public/public_assets')))

registerMiddlewares(app)

if (config.cdn_path == '') {
  console.log('using express.static("dist")')
  app.use(express.static('dist'))
}

app.use((req, res, next) => {
  const store = configureStore({}, createMemoryHistory)
  req.store = store
  return next()
})

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    routesCreator = warmRequire('routes').default
    next()
  })
}

const getCmdPromise = (command) => {
  return new Promise((resolve, reject) => {
    cmd.get(command, (err, data, stderr) => {
      if (err) {
        return reject(err)
      }

      return resolve()
    })
  })
}

app.post('/upload', (req, res, next) => {
  if (!req.files.file) { return res.status(400).send('No files were uploaded.') }

  let file = req.files.file
  const fileName = file.name.split('.')[0]

  file.mv(path.resolve(`./${file.name}`), (err) => {
    if (err) { return res.status(500).send(err) }

    const results = []
    const starts = []
    const ends = []
    let transcript = ''
    cmd.get('rm ./audioTmp/*', (err, data, stderr) => {
      cmd.get(`./ffmpeg -i ./${file.name} -f mp3 ./audioTmp/output.mp3`, (err, data, stderr) => {
        if (err) { return res.status(500).send(err) }

        cmd.get(`./ffmpeg -i ./audioTmp/output.mp3 -af silencedetect=noise=-30dB:d=0.5 -f null - 2> ./audioTmp/vol.txt; cat ./audioTmp/vol.txt | grep 'silence_start' > ./audioTmp/silence_start.txt; cat ./audioTmp/vol.txt | grep 'silence_end' > ./audioTmp/silence_end.txt; ./ffmpeg -i ./audioTmp/output.mp3 2>&1 | grep Duration | cut -d ' ' -f 4 | sed s/,// > ./audioTmp/duration.txt`, (err, data, stderr) => {
          const silenceStart = fs.readFileSync('./audioTmp/silence_start.txt').toString()
          const silenceEnd = fs.readFileSync('./audioTmp/silence_end.txt').toString()
          const duration = fs.readFileSync('./audioTmp/duration.txt').toString().split(':')

          const durat = duration[0] * 3600 + duration[1] * 60 + duration[2] * 1

          starts.push(0)
          silenceStart.trim('\n').split('\n').forEach((ss) => {
            starts.push(parseFloat(ss.split('silence_start: ')[1]))
          })
          silenceEnd.trim('\n').split('\n').forEach((ss) => {
            ends.push(parseFloat(ss.split('silence_end: ')[1].split(' | ')[0]))
          })
          if (ends.length < starts.length) {
            while (ends.length !== starts.length) {
              ends.push(durat)
            }
          }
          if (ends.length !== starts.length) {
            ends.push(durat)
          }

          const newDurations = []

          if (starts.length && ends.length && starts.length === ends.length) {
            starts.forEach((s, i) => {
              newDurations.push(parseFloat((ends[i] - starts[i]).toFixed(3)))
            })
          }

          const newProms = []
          newDurations.forEach((d, i) => {
            newProms.push(getCmdPromise(`./ffmpeg -i ./audioTmp/output.mp3 -ss ${starts[i]} -t ${d} -y ./audioTmp/fileout${i}.flac`))
          })

          Promise.all(newProms).then(() => {
            fs.readdir('./audioTmp', (err, filenames) => {
              if (err) {
                return res.status(500).send(err)
              }

              const promiseArr = []
              filenames.forEach((f) => {
                if (f.indexOf('fileout') !== -1) {
                  promiseArr.push(recoSpeech(path.resolve(`./audioTmp/${f}`)))
                }
              })
              return Promise.all(promiseArr).then((datas) => {
                datas.forEach((d) => {
                  if (d.name && d.transcription) {
                    results.push(d.transcription)
                    transcript += ` ${d.transcription}`
                  }
                })

                cmd.get('rm ./audioTmp/*', (err, data, stderr) => {
                  res.send({data: transcript, results})
                })
              })
            })
          })
        })

        // cmd.get('./ffmpeg -i ./audioTmp/output.mp3 -f segment -segment_time 30 ./audioTmp/fileout%01d.flac', (err, data, stderr) => {
        //   if (err)
        //     return res.status(500).send(err);

        // })
      })
    })

    // recoSpeech(path.resolve(`./${file.name}`)).then((data) => {
    //   res.send({data});
    // })
  })
})

// app.use((req, res, next) => {
//  if(req.url === '/upload'){
//      google_speech.ASR({
//        developer_key: 'AIzaSyCl0Czr9FhSgodO5yAqtPxZq4nOiN5v0_Q',
//        file: 'speech.mp3',
//      }, function(err, httpResponse, xml){
//        if(err){
//            console.log('failed again... : ',err);
//          }else{
//            console.log(httpResponse.statusCode, xml)
//          }
//        }
//    );
//  }
// })

// app.use((req, res, next) => {
//   // console.log('req.url : ',req)
//   if(req.url === '/upload'){
//       google_speech.ASR({
//         developer_key: 'AIzaSyAWCze2AXgAA7kgUMtLubpvmLuDGkbUP8g',
//         file: 'speech.mp3',
//       }, function(err, httpResponse, xml){
//         if(err){
//             console.log('failed again... : ',err);
//           }else{
//             console.log(httpResponse.statusCode, xml)
//           }
//         }
//     );

//     // var opts = {
//     //   file: 'speech.mp3',
//     //   key: 'AIzaSyAWCze2AXgAA7kgUMtLubpvmLuDGkbUP8g'
//     // }
//     // console.log('test : ',opts)
//     // speech(opts, function (err, results) {
//     //   console.log('err : ',err)
//     //   // [{result: [{alternative: [{transcript: '...'}]}]}]
//     //   res.end(JSON.stringify(results))
//     //   return
//     // })
//     // res.end('asdf')
//     // return
//   }
// })

app.use((req, res, next) => {
  match({
    routes: routesCreator(req.store),
    location: req.url
  }, (err, redirectLocation, renderProps) => {
    if (redirectLocation) {
      return res.redirect(301, redirectLocation.pathname + redirectLocation.search)
    }

    const routesMatched = renderProps.routes
    const propsMatched = routesMatched[routesMatched.length - 1]
    const chunkname = propsMatched.chunkname

    // require for datadog tracking
    req.pageType = propsMatched.pageType
    res.route_name = propsMatched.name
    res.renderProps = renderProps

    res.locals.pageType = propsMatched.pageType
    res.locals.chunkname = chunkname
    res.locals.cdnHost = `${config.cdn_path}/`
    res.locals.inlineAppCSs = false
    if (global.inlineCssObj && global.inlineCssObj.app != '') {
      res.locals.inlineAppCSs = global.inlineCssObj.app
    }
    res.locals.inlineChunkcss = false
    res.locals.stringifiedChunkCss = false
    res.locals.chunkJS = false
    res.locals.hasChunk = false
    if (global.inlineCssObj && global.inlineCssObj[chunkname]) {
      res.locals.stringifiedChunkCss = global.inlineCssObj[chunkname]
    }
    if (assets && assets[chunkname] && assets[chunkname].js) {
      res.locals.hasChunk = true
      res.locals.chunkJS = [`${assets[chunkname].js}`]
    }
    if (res.locals.chunkJS) {
      res.locals.chunkJS = JSON.stringify(res.locals.chunkJS)
    }
    res.locals.assets = assets
    res.locals.env = env
    res.locals.cssAssetPaths = cssAssets
    res.locals.enable_errorception = false

    res.type('html')
    return res.render('static_head_chunk', res.locals, function (err, str) {
      if (err) return next(err)
      req.chunk_sent = true
      res.vary('User-Agent').write(str)
      return next()
    })
  })
})

app.use((req, res, next) => {
  fetchComponentsData(req.store.dispatch, res.renderProps.components, req.store.getState(), Object.assign({}, res.renderProps.params, res.renderProps.query), req).then(() => {
    return next()
  }).catch((err) => {
    if (env != 'production') {
      const PrettyError = require('pretty-error')
      const pe = new PrettyError()
      console.log(pe.render(err))
    }
    next()
  })
})

app.use((req, res) => {
  const renderProps = res.renderProps
  const renderedMarkup = <Provider store={req.store}><RouterContext {...renderProps} /></Provider>
  res.locals.markup = ReactDOM.renderToString(renderedMarkup)
  const state = req.store.getState()
  res.locals.initialState = JSON.stringify(state)
  res.locals.static_chunk_sent = req.chunk_sent ? req.chunk_sent : false
  return res.render('index', res.locals, function (err, str) {
    if (err) return req.next(err)
    if (req.chunk_sent) {
      res.write(str)
      res.end()
    } else {
      res.vary('User-Agent').send(str)
    }
  })
})

if (env != 'production') {
  const PrettyError = require('pretty-error')
  const pe = new PrettyError()

  app.use(function (err, req, res, next) {
    console.log(pe.render(err))
    next()
  })

  pe.skipNodeFiles()
}

app.use(errorHandler)
