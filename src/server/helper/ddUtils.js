
export function track_req(req, key, value) {
  if (!req || !req.dd || !req.dd.hasOwnProperty(key)) {
    return
  }
  return req.dd[key] = value
}
