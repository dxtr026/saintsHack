const os = require('os');

// System
exports.rss = (function(cb) {return cb(null, process.memoryUsage().rss)});
exports.total = (function(cb) {return cb(null, os.totalmem())});
exports.free = (function(cb) {return cb(null, os.freemem())});

// V8 Memory
exports.heapTotal = (function(cb) {return cb(null, process.memoryUsage().heapTotal)});
exports.heapUsed = (function(cb) {return cb(null, process.memoryUsage().heapUsed)});
