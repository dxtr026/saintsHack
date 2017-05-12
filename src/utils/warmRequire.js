import path from 'path'

if (process.env.NODE_ENV === 'production') {
  module.exports = require
} else {
  var warmRequire = require('warm-require').watch({
    paths: path.resolve(__dirname, '../**/*.js')
  })
  module.exports = warmRequire
}
