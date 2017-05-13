import axios from 'axios'
import getEnglishSpeech from 'actions/getEnglishSpeech'
import getSummary, { getSentiment } from 'actions/getSummary'

const saveVoice = (file) => {
  const data = new FormData()
  data.append('file', file, file.name)
  return axios({
    url: `/upload`,
    headers: { 'content-type': 'multipart/form-data' },
    data: data,
    method: 'POST'
  })
}

const getLanguageResults = (interimScript, lng = 'en') => {
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

const getFileData = (file) => {
  return axios({
    url: '/getFileData',
    method: 'GET'
  }).then(({data}) => {
    const sentenceArr = []
    const convertStr = []
    data.results.forEach((r) => {
      sentenceArr.push(getLanguageResults(r))
    })
    return Promise.all(sentenceArr).then((ss) => {
      ss.forEach((s) => {
        convertStr.push(s)
      })
      const fStr = convertStr.join('. ')
      return Promise.all([getSummary(fStr), getSentiment(fStr)]).then((dataFinal) => {
        const sumFinal = dataFinal[0]
        const sentFinal = dataFinal[1]
        return {summary: sumFinal.data.summary2 || sumFinal.data.summary, sentimentData: sentFinal.data}
      })
    })
  })
}

export {getFileData}
export default saveVoice
