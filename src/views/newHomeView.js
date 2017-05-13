import React, { Component } from 'react'

if (!__SERVER__) {
  require('styles/views/newHomeView.scss')
}


class NewHomeView extends Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className='hp'>
        <div className='cs1 hp-img'></div>
        <div className='cs2 hp-img'></div>
        <div className='cs3 hp-img'></div>
        <div className='cs4 hp-img'></div>
      </div>
    )
  }
}

export default NewHomeView
