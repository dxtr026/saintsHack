const yaml = require('yamljs');
const path = require('path');

const config = yaml.load(path.resolve('config/application.yml'));

module.exports = config;