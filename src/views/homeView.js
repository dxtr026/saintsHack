import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
// import speech from 'google-speech-api'
import getEnglishSpeech from 'actions/getEnglishSpeech'
import saveVoice from 'actions/common'

class HomeView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recognizing: false,
      ignoreOnend: false,
      finalScript: '',
      hasRecognition: false
    }
    this.recognition = null
    this.onStart = this.onStart.bind(this)
    this.onError = this.onError.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.onResult = this.onResult.bind(this)
    this.startListening = this.startListening.bind(this)
    this.stopListening = this.stopListening.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.englishTimer = null
  }

  componentDidMount() {
    this.startReco()
  }

  startListening () {
    if (this.recognition) {
      this.recognition.start()
    }
  }

  stopListening () {
    if (this.recognition) {
      this.recognition.stop()
    }
  }

  onStart () {
    console.log('ho rha hai kya start hua -====>>>')
    this.setState({recognizing: true, finalScript: '', interimScript: '', finalEnglishScript: ''})
  }

  onError (event) {
    console.log(event)
    console.log('ho rha hai kya error --->>>')
    this.setState({ignoreOnend: true})
  }

  onEnd (event) {
    console.log('ho rha hai kya')
    this.setState({recognizing: false})
  }

  onResult (event) {
    let interimScript = ''
    // let finalScript = this.state.finalScript
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      interimScript += event.results[i][0].transcript
      // if (event.results[i].isFinal) {
      // } else {
        // interimScript += event.results[i][0].transcript
      // }
    }
    // console.log(interimScript)
    this.setState({finalScript: `${interimScript}`})
    if (this.englishTimer) {
      clearTimeout(this.englishTimer)
      this.englishTimer = null
    }
    this.englishTimer = setTimeout(() => {
      getEnglishSpeech(interimScript).then(({data: {data}}) => {
        console.log('data ===>', data)
        if (data.translations && data.translations.length) {
          let results = ''
          data.translations.forEach((t, i) => {
            results += t.translatedText
          })
          this.setState({finalEnglishScript: results})
        }
      }, (error) => {
        console.log('error ===>', error)
      })
    }, 2000)
  }

  startReco () {
    if (!('webkitSpeechRecognition' in window)) {
      alert('webkitSpeechRecognition not supported')
      return
    }
    this.recognition = new webkitSpeechRecognition()
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.lang = 'en-IN'
    this.recognition.onstart = this.onStart
    this.recognition.onstart = this.onStart
    this.recognition.onerror = this.onError
    this.recognition.onend = this.onEnd
    this.recognition.onresult = this.onResult
    this.setState({hasRecognition: true})
  }

  onDrop (files) {
    for(let i=0;i<=files.length;i++){
      const opts = {
        file: files[i],
        key: 'AIzaSyAWCze2AXgAA7kgUMtLubpvmLuDGkbUP8g'
      }
      saveVoice(files[i])
      // speech(opts, function (err, results) {
      //   console.log(results);
      //   // [{result: [{alternative: [{transcript: '...'}]}]}]
      // })
    }
  }

  render () {
    return (
      <div>
        {this.state.hasRecognition && <button onClick={this.startListening}>Start</button>}
        {this.state.hasRecognition && <button onClick={this.stopListening}>Stop</button>}
        <h3> {this.state.finalScript}</h3>
        <br />
        <h4> {this.state.finalEnglishScript} </h4>
        <Dropzone onDrop={this.onDrop}>
          <p>Select or drop your voice note</p>
        </Dropzone>
      </div>
    )
  }
}

export default HomeView