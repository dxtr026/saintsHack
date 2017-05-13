import React, { Component } from 'react'
import record from 'actions/record'
import WaveformView from 'views/WaveformView'
import Graph from 'containers/sentimentGraph'
import {getFileData} from 'actions/common'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

if (!__SERVER__) {
  require('styles/views/newHomeView.scss')
}

class CallView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      calling: false,
      generatingReport: false,
      showSummary: false
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
          setTimeout(()=>{
            getFileData().then((data)=>{
              this.setState({
                showSummary : true,
                generatingReport: false,
                sentimentData: data.sentimentData,
                summary: data.summary 
              })  
            })
            
          }, 3000)
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
        { this.state.generatingReport && !this.state.showSummary &&
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
        { this.state.showSummary &&
          <div className='sumry'>
            <div className='smtr-hdr'>Report</div>
            <div className='smtr-macow'></div>
            <div>
              23 sec (Call Time)
            </div>
            <div className='smry-dtls'>
              <h3>Summary</h3>
              <div className='smry-txt'>{this.state.summary}</div>
            </div>
            <div className='smry-analysis'>
              <h3>Sentiment Analysis</h3>
              <div className='smry-grph'>
                <Graph sentimentData={this.state.sentimentData} fileName={'asd'} />
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default CallView
