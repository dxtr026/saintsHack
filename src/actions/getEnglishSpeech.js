import axios from 'axios'

const getEnglish = (finalString, target = 'en') => {
  return axios({
    url: `https://translation.googleapis.com/language/translate/v2?key=AIzaSyAWCze2AXgAA7kgUMtLubpvmLuDGkbUP8g&target=${target}&q=${finalString}&model=base`,
    method: 'POST'
  })
}

export default getEnglish