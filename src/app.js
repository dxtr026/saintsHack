import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import css from 'styles/core.scss'
import { _registerServiceWorker } from './serviceWorker/indexController'

import { cleanUrl } from 'utils/cleanUrl'
import { Provider } from 'react-redux'
import axios from 'axios'

import { attachInterceptor } from 'utils/axiosInterceptor'

import makeRoutes from './routes'

const crf = window.ctoken
try {
  window.__INITIAL_STATE__.shell.ctoken = crf
  if (!delete window.ctoken) {
    window.ctoken = null
  }
} catch (e) {
  window.ctoken = null
}
cleanUrl()
const target = document.getElementById('app-root')
const store = configureStore(window.__INITIAL_STATE__)
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: state => state.router
})

attachInterceptor(axios, crf, store)

const routes = makeRoutes(store)

const node = <Root history={history} routes={routes} store={store} />

ReactDOM.render(node, target)

function onWindowLoad() {
  window.loaded = true
}
