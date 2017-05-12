const extensions = ['jpg', 'jpeg', 'gif', 'png'];
const isImage = function (path) {
  const ext = path.substr(path.lastIndexOf('.') + 1);
  return extensions.indexOf(ext) !== -1;
};

const base64Encode = function (filePath, data, mimetype) {
  try {
    data = new Buffer(data).toString('base64');
    if (isImage(filePath)) {
      return `data:image/${filePath.substr(filePath.lastIndexOf('.') + 1, filePath.length)};base64,${data}`;
    } else {
      return `data:${mimetype};base64,${data}`;
    }
  } catch (e) {
    console.log('[error] Asset Data Path not found for', filePath, e);
    return filePath;
  }
};

module.exports = function (content) {
  const filePath = this.resourcePath;
  const _path = this.resourcePath.substr(this.resourcePath.indexOf('/images') + 8);
  const options = JSON.parse(this.query.replace('?{', '{'));
  if (options.env === 'production') {
    if (options.manifest[_path]) {
      return `module.exports = ${JSON.stringify(options.cdn_base + (isImage(filePath) ? '/images/' : '/fonts/') + options.manifest[_path])}`;
    }
    return `module.exports = ${JSON.stringify(this.resourcePath)}`;
  } else {
    return `module.exports = ${JSON.stringify(base64Encode(filePath, content, options.mimetype))}`;
  }
};

module.exports.raw = true;
