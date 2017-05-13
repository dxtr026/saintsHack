const Speech = require('@google-cloud/speech');

const projectId = '5950145102080';

// Instantiates a client
const speechClient = Speech({
  projectId: projectId
});

// The audio file's encoding, sample rate in hertz, and BCP-47 language code
const options = {
  encoding: 'FLAC',
  languageCode: 'en-IN'
};

// The name of the audio file to transcribe FROM THE API
// const fileName = TODO


const recoSpeech = (fileName) => {
  return speechClient.recognize(fileName, options)
    .then((results) => {
      const transcription = results[0];
      console.log(`Transcription: fileName -> ${transcription}`);
      return {name: fileName, transcription}
    })
    .catch((err) => {
      console.error('ERROR:', err, fileName);
      return {}
    });
}

export default recoSpeech