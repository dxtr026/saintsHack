import WaveformData from 'waveform-data'
import webAudioBuilder from 'waveform-data/webaudio'

const record = () => {
	return new Promise((resolve, reject) => {
		const audioContext = new AudioContext();
		const xhr = new XMLHttpRequest()
		xhr.open("GET", "/testMp.mp3")

		fetch('/testMp.mp3')
		  .then(response => response.arrayBuffer())
		  .then(buffer => {
		  	webAudioBuilder(audioContext, buffer, (error, waveform) => {
				resolve(waveform)
		    })
		  })
		})
}

export default record