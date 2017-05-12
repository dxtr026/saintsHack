import axios from 'axios'

const getEnglish = (finalString) => {
  return axios({
    url: `https://translation.googleapis.com/language/translate/v2?key=AIzaSyAWCze2AXgAA7kgUMtLubpvmLuDGkbUP8g&target=en&source=en-IN&q=${finalString}`,
    method: 'POST'
  })
}

export default getEnglish