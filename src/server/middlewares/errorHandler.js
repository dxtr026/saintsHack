import errorLogger from '../helper/errorLogger';

function format_error_message(message) {
  if (!message) {
    return '';
  }

  if (typeof message === 'string') {
    return message;
  }

  if (typeof message.message === 'string') {
    return message.message;
  }

  try{
    message = JSON.stringify(message).substr(0, 70)
  } catch (e) {
    message = '';
  }
  return message;
}
const fs = require("fs");
const path = require("path");
const page500 = fs.readFileSync(path.resolve(__dirname, "../../../public/public_assets/500.html"));
const page404 = fs.readFileSync(path.resolve(__dirname, "../../../public/public_assets/404.html"));

export function errorHandler(err, req, res, next) {
  const isProduction = process.env.NODE_ENV == 'production';
  if (err.message && err.message.status){
    err.status = err.message.status
  }
  // error status (default: 500) and message
  const code = err.status || 500;
  var message = format_error_message(err.message) || http.STATUS_CODES[code] || 'Unknown error occurred'

  // log error
  err.message = `Router - ${code} - ${message}`;
  err.alert_type = (code >= 500) ? 'error' : 'info'
  err.original_url = req.originalUrl
  err.referrer = req.header('Referrer')
  err.useragent = req.useragent && req.useragent.source
  err.ip = req._ip
  err.status_code = code
  err.tags = [`router-${code}`]
  err.aggregation_key = `router-${code}`
  errorLogger(err)

  // set response status
  res.status(code)
  if (parseInt(code) == 500){
    return res.end(page500);
  } else if (parseInt(code) == 404){
    return res.end(page404);
  }
  // handle html response
  if (req.accepts('json')){
    res.json({
      code: code,
      message: message
    })
  } else {
    res.type('txt').send(`${code}: ${message}`)
  }
  next();
}
