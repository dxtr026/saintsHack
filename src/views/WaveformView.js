import React, { Component } from 'react'
import record from 'actions/record'

class WaveformView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      cls : 'dummy-mask'
    }
    this.draw = this.draw.bind(this)
  }

  draw (waveform) {
    const canvas = this.canvas//document.getElementById('canvasElem')
    const y = interpolateHeight(canvas.height)
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#5e23dc';
    ctx.beginPath()
     
    // from 0 to 100 
    waveform.min.forEach((val, x) => ctx.lineTo(x + 0.5, y(val) + 0.5))
     
    // then looping back from 100 to 0 
    waveform.max.reverse().forEach((val, x) => {
      ctx.lineTo((waveform.offset_length - x) + 0.5, y(val) + 0.5)
    })
    ctx.closePath()
    ctx.fill()
  }

  animate (){
    this.setState({
      cls : 'dummy-mask move'
    })
  }

  render () {
    return (
      <div className='wf'>
        <canvas id='canvasElem' ref={(node) => { this.canvas = node }}/>
        <div className={this.state.cls}>
          <hr className='hr'/>
        </div>
        <div className='wf-mascow'></div>
        <div className='wf-gen-rpt'>Generating Report...</div>
      </div>
    )
  }
}

const interpolateHeight = (total_height) => {
  const amplitude = 256
  return (size) => total_height - ((size + 128) * total_height) / amplitude
}

export default WaveformView