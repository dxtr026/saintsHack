import axios from 'axios'

const saveVoice = (file) => {
  const data = new FormData()
  data.append('mp3', file, file.name);
  return axios({
    url: `/upload`,
    headers: { 'content-type': 'multipart/form-data' },
    data: data,
    method: 'POST'
  })
}

export default saveVoice