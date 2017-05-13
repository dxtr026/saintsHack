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
        <a className='btn-action' href='/call'></a>
      </div>
    )
  }
}

export default NewHomeView
