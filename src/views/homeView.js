import React, { Component } from 'react'
import SummaryBot from 'utils/summary-bot'
import getEnglishSpeech from 'actions/getEnglishSpeech'
import getSummary from 'actions/getSummary'

class HomeView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recognizing: false,
      ignoreOnend: false,
      finalScript: '',
      hasRecognition: false,
      summary: ''
    }
    this.speechParts = []
    this.recognition = null
    this.onStart = this.onStart.bind(this)
    this.onError = this.onError.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.onResult = this.onResult.bind(this)
    this.startListening = this.startListening.bind(this)
    this.stopListening = this.stopListening.bind(this)
    this.createSummary = this.createSummary.bind(this)
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

  createSummary (response) {
    if (response && response.data && response.data.summary) {
      this.setState({summary: response.data.summary})
    }
  }

  getLanguageResults (interimScript, lng = 'en') {
    return getEnglishSpeech(interimScript, lng).then(({data: {data}}) => {
      if (data.translations && data.translations.length) {
        let results = ''
        data.translations.forEach((t, i) => {
          results += t.translatedText
        })
        return results
      }
    }, (error) => {
      console.log('error ===>', error)
    })
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
    this.speechParts.push(interimScript)
    console.log('-->> parts', interimScript)
    this.setState({finalScript: `${interimScript}`})
    if (this.englishTimer) {
      clearTimeout(this.englishTimer)
      this.englishTimer = null
    }
    this.englishTimer = setTimeout(() => {
      this.getLanguageResults(interimScript).then((results) => {
        this.setState({finalEnglishScript: results})
        getSummary(results).then(this.createSummary)
      })
      this.getLanguageResults(interimScript, 'hi').then((results) => {
        this.getLanguageResults(results).then((res) => {
          console.log('english to hindi to english', res)          
        })
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

  render () {
    return (
      <div>
        {this.state.hasRecognition && <button onClick={this.startListening}>Start</button>}
        {this.state.hasRecognition && <button onClick={this.stopListening}>Stop</button>}
        <h2> Original Text </h2>
        <h3> {this.state.finalScript}</h3>
        <br />
        <h2>English Translation</h2>
        <h4> {this.state.finalEnglishScript} </h4>
        <br />
        <h2> Summary from our Bot </h2>
        <h4> {this.state.summary} </h4>
      </div>
    )
  }
}

export default HomeView