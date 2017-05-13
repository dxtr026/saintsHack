import React, { Component } from 'react'
import record from 'actions/record'
import WaveformView from 'views/WaveformView'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

if (!__SERVER__) {
  require('styles/views/newHomeView.scss')
}

class CallView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      calling: false,
      generatingReport: false
    }
    this.onCall = this.onCall.bind(this)
  }

  onCall () {
    if(this.state.calling){
      this.setState({
        generatingReport: true
      })
      record().then((waveform)=>{
          if(this.wf){
            this.wf.draw(waveform)
            setTimeout(()=>{
              this.wf.animate()
            },1000)
          }
          this.setState({
            calling: false
          })
      })
      // onComplete setState
    }else {
      this.setState({ calling:!this.state.calling })
    }
  }

  render () {
    const btnCls = this.state.calling ? 'usr-btn usr-end-call-btn' : 'usr-btn usr-call-btn'
    return (
      <div className='call-p'>
        {this.state.generatingReport && <div className='ovrl'></div>}
        <div className='call-1 call-img'></div>
        <div className='user-1 call-img'></div>
        <div className={btnCls} onClick={this.onCall}></div>
        { this.state.generatingReport &&
          <ReactCSSTransitionGroup
            transitionName='md-example'
            transitionEnterTimeout={200}
            transitionLeaveTimeout={100}
            transitionAppear
            transitionAppearTimeout={100}
          >
            <WaveformView ref={(node) => { this.wf = node }}/>
          </ReactCSSTransitionGroup>
        }
      </div>
    )
  }
}

export default CallView
