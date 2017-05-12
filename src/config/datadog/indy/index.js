// Heavily modified form of npmjs.org/package/indy

const EventEmitter = require('events').EventEmitter;
const util = require('util');
const async = require('async');

const delay = require('./lib/loop-delay');
const memory = require('./lib/memory');

function Indy(options) {
  EventEmitter.call(this);

  this.options = options || {};
  this.dispatcher = this.options.dispatcher;
  this.interval = this.options.interval || 10000; // in ms
  this.intervalRef = undefined;
}

util.inherits(Indy, EventEmitter);

// Start watching for any events and publish them to our dispatcher.
Indy.prototype.whip = function () {
  const self = this;
  const collect = function () {
    const metrics =
      { loop_delay: delay,
        memRss: memory.rss,
        memHeapTotal: memory.heapTotal,
        memHeapUsed: memory.heapUsed,
      };

    async.parallelLimit(metrics, 2, function (err, data) {
      if (err) {
        return;
      }
      self.dispatcher.dispatch(data);
    });
  };

  self.intervalRef = setInterval(collect, self.interval);
};

Indy.prototype.pause = function (done) {
  const self = this;
  if (!self.intervalRef) {
    return;
  }
  clearInterval(self.intervalRef);
  done();
};

Indy.prototype.resume = function () {
  if (this.intervalRef) {
    return;
  }
  this.whip();
};

module.exports = Indy;
