/*
    Error Logger
*/
const fs          = require("fs");
const datadog = require('../../config/datadog');

const restricted_keys = {
    stack: 1,
    message: 1,
    alert_type: 1,
    tags: 1,
    aggregation_key: 1
};

function format(data) {
    if (typeof data !== 'object') {
        return `${data}`;
    }
    let value;
    let formatted = '';
    for (const key in data) {
        if (!restricted_keys[key] && data[key]) {
            value = JSON.stringify(data[key]).substr(0, 120)
            formatted += (`${key}:${value}\\n`);
        }
    }
    if (data.stack) {
        formatted += data.stack.replace(/\n/gm, '\\n');
    }

    return formatted;
}


function trigger_datadog_event(event_data) {
    try{
        const post_data = format(event_data);
        const message = event_data.message || 'error';
        const alert_type = event_data.alert_type || 'error';
        const tags = event_data.tags;
        datadog.event(message, post_data, {
            alert_type: alert_type,
            tags: tags,
            aggregation_key: event_data.aggregation_key
        });
    } catch(e) {

    }
}

function logger() {
    let kill = false;
    let errorData = Array.prototype.slice.call(arguments).map(function(argv){
        let out = null;
        switch (typeof argv){
            case "string" : return argv;
            case "object" : out = argv.stack?argv.stack:(argv.kill?kill=true:JSON.stringify(argv));break;
        }
        return out;
    });

    if (process.NODE_ENV != "production"){
        console.log(errorData)
        if (kill) {
            console.log('\nProcess Exiting...')
            process.exit(1)
        }
    } else {
        errorData = JSON.stringify(errorData)
        hlog(new Date()+errorData, "utf-8")
    }
}


export default function errorLogger(event_data) {
    trigger_datadog_event(event_data)
    logger.apply(null, Array.prototype.slice.call(arguments))
}
