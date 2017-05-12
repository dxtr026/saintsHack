import axios from 'axios'

const getSummary = (text) => {
  return axios({
    url: `http://10.1.2.22:3000/get-summary?text=${text}`,
    method: 'POST'
  })
}

export default getSummary