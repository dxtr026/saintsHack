import axios from 'axios'

const getEnglish = (finalString, target = 'en') => {
 
  return axios({
  	url: `http://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=en&dt=t&q=${encodeURIComponent(finalString)}&ie=UTF-8&oe=UTF-8`,
    // url: `https://translation.googleapis.com/language/translate/v2?key=AIzaSyAWCze2AXgAA7kgUMtLubpvmLuDGkbUP8g&target=${target}&q=${finalString}&model=base`,
    // url: 'http://translate.google.com/translate_a/t?key=AIzaSyAWCze2AXgAA7kgUMtLubpvmLuDGkbUP8g&client=t&text='+finalString+'&hl=en&sl=hi&tl=en&ie=UTF-8&oe=UTF-8&multires=1&otf=1&pc=1&trs=1&ssel=3&tsel=6&sc=1',
    // url: 'https://translate.google.co.in/translate_a/single?client=t&sl=hi&tl=en&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&otf=2&ssel=3&tsel=0&kc=3&tk=657160.807605&q='+encodeURIComponent('ok i think after going ahead dekhte ha'),
    // url: 'https://translate.google.com/translate_a/t?client=t&q=ab%20kya%20karna%20hai%20aage%20ye&hl=en&sl=hi&tl=en&ie=UTF-8&oe=UTF-8&multires=1&otf=1&pc=1&trs=1&ssel=3&tsel=6&sc=1',
    method: 'GET'
  })
}

export default getEnglish