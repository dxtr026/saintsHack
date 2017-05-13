import axios from 'axios'

const getSummary = (text) => {
  return axios({
    url: `http://10.1.2.22:3000/get-summary?text=${text}`,
    method: 'POST'
  })
}

const getSentiment = (text) => {
  return axios({
    url: `http://10.1.2.22:3000/get-sentiment-score?text=${text}`,
    method: 'POST'
  })
}

export { getSentiment }
export default getSummary