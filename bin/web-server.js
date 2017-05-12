require("babel-register");
var path = require('path');
var rootDir = path.resolve(__dirname, '..');
require(rootDir + '/src/server')
