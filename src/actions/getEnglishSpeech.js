import axios from 'axios'

const getEnglish = (finalString) => {
  return axios({
    url: `https://translation.googleapis.com/language/translate/v2?key=AIzaSyAWCze2AXgAA7kgUMtLubpvmLuDGkbUP8g&target=en&q=${finalString}`,
    method: 'POST'
  })
}

export default getEnglish