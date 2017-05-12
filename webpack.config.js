require('babel-register');

const config   = require('./config').default;
module.exports = require('./build/webpack/' + config.get('env')).default;
