import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import saveVoice, {getFileData} from 'actions/common'
import SummaryBot from 'utils/summary-bot'
import getEnglishSpeech from 'actions/getEnglishSpeech'
import getSummary, { getSentiment } from 'actions/getSummary'
import { isValidSentence } from 'utils/grammar'
import Graph from 'containers/sentimentGraph'

class HomeView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      recognizing: false,
      ignoreOnend: false,
      finalScript: '',
      hasRecognition: false,
      summary: ''
    }
    this.recognition = null
    this.finalSts = []
    this.onStart = this.onStart.bind(this)
    this.onError = this.onError.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.onResult = this.onResult.bind(this)
    this.startListening = this.startListening.bind(this)
    this.stopListening = this.stopListening.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.createSummary = this.createSummary.bind(this)
    this.englishTimer = null
  }

  componentDidMount () {
    this.startReco()
    getFileData().then((data) => {
      debugger
    })
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
    this.setState({recognizing: false})
    console.log('==>> khatam hua ==>> ', this.finalSts.join('. '))
  }

  createSummary (response) {
    if (response && response.data && response.data.summary) {
      this.setState({summary: response.data.summary2 || response.data.summary})
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
    // console.log(event)
    // let finalScript = this.state.finalScript
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      // console.log('--->>',event.results[i][0].transcript)
      interimScript += event.results[i][0].transcript
      // if (event.results[i].isFinal) {
      // } else {
        // interimScript += event.results[i][0].transcript
      // }
    }
    // console.log(interimScript)
    if (interimScript) {
      this.postFinalScript(interimScript)
    }
  }

  postFinalScript (interimScript) {
    this.setState({finalScript: `${interimScript}`})
    this.finalSts.push(interimScript)
    // if (this.englishTimer) {
    //   clearTimeout(this.englishTimer)
    //   this.englishTimer = null
    // }
    // this.englishTimer = setTimeout(() => {
    //   this.getLanguageResults(interimScript).then((results) => {
    //     this.setState({finalEnglishScript: results})
    //     getSummary(results).then(this.createSummary)
    //   })
    // }, 2000)
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
    if (files[0]) {
      saveVoice(files[0]).then((res) => {
        console.log('mp3 translated', res.data)
        // const finalStr = ''
        const finalStr = res.data.results.join('. ')
        this.setState({finalScript: finalStr, fileName: files[0].name})
        this.postFinalScript(finalStr)
        // const finalStr = res.data.data
        let convertStr = []
        const sentenceArr = []
        res.data.results.forEach((r) => {
          sentenceArr.push(this.getLanguageResults(r))
        })
        Promise.all(sentenceArr).then((ss) => {
          ss.forEach((s) => {
            convertStr.push(s)
            // console.log('is valid or not', isValidSentence(r))
            // if (isValidSentence(r)) {
            // }
          })
          this.setState({finalEnglishScript: convertStr.join('. ')})
          getSummary(convertStr.join('. ')).then(this.createSummary)
          getSentiment(convertStr.join('. ')).then(({data}) => {
            this.setState({sentimentData: data})
            // console.log('sentiment data', data)
          })
        })
      }, (err) => {
        console.log('mp3 translated err', err)
      })
    }
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
        <h3> {this.state.finalEnglishScript} </h3>
        <br />
        <h2> Summary from our Bot </h2>
        <h3> {this.state.summary} </h3>
        <br />
        <Dropzone onDrop={this.onDrop}>
          <p>Select or drop your voice note</p>
        </Dropzone>
        <br />
        {this.state.sentimentData &&
          <Graph sentimentData={this.state.sentimentData} fileName={this.state.fileName} />
        }
      </div>
    )
  }
}

export default HomeView
