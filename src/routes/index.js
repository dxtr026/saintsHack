import React                 from 'react'
import { Route, Redirect, IndexRoute } from 'react-router'
import {requireCss} from '../lib/requireCss'

if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require)

let requireStyle

if(!__SERVER__){
  window.requireStyle = requireStyle = function(chunkname) {
    if (document.getElementById(`chunk-${chunkname}`)) {
      return new Promise((resolve, reject)=>{
        resolve()
      })
    }
    return new Promise((resolve, reject)=>{
      const callCb = () => {
        resolve()
      }
      requireCss(chunkname, callCb)
    })
  }
}else {
  requireStyle = function(chunkName){
    return new Promise((resolve, reject)=>{
      resolve()
    })
  }
}

function handleChange (prev, next) {
  isBackendPrinted = false
}

function loadView (chunkname, jsPath) {
  if (typeof(window) === 'undefined') return
  if (window.loaded) {
    requireStyle(chunkname)
  } else {
    window.addEventListener('load', ()=>{
      requireStyle(chunkname)
    })
  }
}

requireStyle('lazyView')

const getHomeRoute = (store) => {
  return (
    <IndexRoute chunkname='homeView'
      pageType = 'home-page'
      getComponent={(location, cb) => {
        require.ensure(['../views/homeView'], function (require) {
          requireStyle('homeView').then(()=>{
            cb(null, require('../views/homeView').default)
          })
        }, 'homeView')
      }}
    />
  )
}

export default (store) => (
  <Route path='/' onChange={handleChange}>
    {getHomeRoute()}
    <Route
      chunkname='newHomeView'
      path='/home'
      pageType='new-home-page'
      getComponent={(nextState, cb) => {
        require.ensure(['views/newHomeView'], (require) => {
          requireStyle('newHomeView').then(() => {
            cb(null, require('views/newHomeView').default)
          })
        }, 'newHomeView')
      }}
    />
    <Route
      chunkname='homeView'
      path='/:id'
      pageType='home-page'
      getComponent={(nextState, cb) => {
        require.ensure(['views/homeView'], (require) => {
          requireStyle('homeView').then(() => {
            cb(null, require('views/homeView').default)
          })
        }, 'homeView')
      }}
    />
  </Route>
)
