const Bench = require('./bench');

module.exports = function loopDelay(cb) {
  const bench = new Bench();
  setImmediate(function measure() {
    return cb(null, bench.elapsed());
  });
};
