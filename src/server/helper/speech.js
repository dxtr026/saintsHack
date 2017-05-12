const Speech = require('@google-cloud/speech');

const projectId = 'alert-height-850';

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const options = {
  encoding: 'LINEAR16',
  sampleRateHertz: 16000,
  languageCode: 'en-IN'
};

// The name of the audio file to transcribe FROM THE API
// const fileName = TODO


const recoSpeech = (fileName) => {
  speechClient.recognize(fileName, options)
    .then((results) => {
      const transcription = results[0];
      console.log(`Transcription: ${transcription}`);
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}

export default recoSpeech