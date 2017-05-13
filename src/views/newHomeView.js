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
      <div className='home-cont'> Hi </div>
    )
  }
}

export default NewHomeView
