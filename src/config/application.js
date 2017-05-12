import yaml from 'yamljs';
import fs   from 'fs';

const userConfig = yaml.load('config/application.yml');
// The foll. is done to remove the need of emailing everyone
// that a new required key has been added.
let sampleConfig
if (process.env.NODE_ENV !== 'production') {
  sampleConfig = yaml.load('config/application.yml.sample');
}
const appConfig = {
  ...sampleConfig,
  ...userConfig
};
export default appConfig;

const clientConfig = Object.keys(appConfig)
  .reduce((acc, key) => {
    if (key.indexOf('_public') !== -1) {
      acc[key.replace(/_public/, '')] = appConfig[key];
    }
    return acc;
  }, {});

fs.writeFileSync('config/client.js', `module.exports=${JSON.stringify(clientConfig)}`);
