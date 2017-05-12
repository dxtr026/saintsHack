const DD = require("node-dogstatsd-events").StatsD;
// var util = require('util');
const Indy = require('./indy');

const datadog = new DD();
const process_stat = "node.mobile.process.";
datadog.dispatch = function (indy_data_object) {
    for (const key in indy_data_object) {
        datadog.gauge(process_stat + key, indy_data_object[key], 1)
    }
}

const indy = new Indy({
    interval: 10000,
    dispatcher: datadog
});
indy.whip({});

process.on('uncaughtException', function (err) {
  console.log(err.message, "\n", err.stack);
  datadog.event(`uncaughtException:${err.message}`, err.stack, {alert_type: 'error', tags: ['uncaughtException', "mobile"]})
})

module.exports = datadog;
