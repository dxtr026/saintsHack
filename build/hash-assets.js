/*
 Hash Assets
 Steps: hashCSS -> hashFonts -> hashImages
 */

// Hash Key
const HASH_KEY = '1.0';

const crypto = require('crypto');
const fs = require('fs');
const glob = require('glob');
const path = require('path');
const rescue = function (e) {
  console.log('Fatal Error! Aborting', '\n', e, '\n', e.stack);
  process.exit(0)
};
const base = path.resolve(__dirname, '../');
const _dir = {
  'PRIVATE_DIR': base,
  'FONTS_BASE': `${base}/dist/fonts`,
  'IMAGE_BASE': `${base}/dist/images`

};

const manifest = (function () {
  try {
    return require(`${path.resolve(__dirname, '../../')}/manifest.json`);
  } catch (e) {
    return {};
  }
})();

let Build = {};
const getBuild = function () {
  try {
    const oldBuild = JSON.parse(fs.readFileSync(`${_dir.PRIVATE_DIR}/manifest.json`));
    Build = oldBuild
  } catch (e) {
    console.log('No existing Build File');
    Build = {}
  }
  return Build
};
const renameAndGzip = function (path, newpath, isImage) {
  try {
    fs.rename(path, newpath, () => {
      if (isImage)
        return true;
      const gzip = require('zlib').createGzip({ level: 9 });
      const inputFile = fs.createReadStream(newpath);
      const outputFile = fs.createWriteStream(`${newpath}.gz`, { flag: 'w' });
      console.log('Gzipped:', path, newpath);
      inputFile.pipe(gzip).pipe(outputFile);
    })
  } catch (e) {
    console.log(e)
  }
};

const hashImages = function () {
  /*
   Read all Images
   */
  Build = getBuild();
  glob(`${_dir.IMAGE_BASE}/**/*.*`, (err, files) => {
    if (err) return rescue(0);
    console.log('Total Image Files:', files.length);
    files.map(file => {
      const hasher = crypto.createHmac('md5', HASH_KEY);
      try {
        /*
         We take the Image extension in consideration
         In LESS do mention the extensions!
         */
        if (file.lastIndexOf('.gz') != -1) {
          return false
        }
        let webURL = file.replace(`${_dir.IMAGE_BASE}/`, '');
        const _isHashFile = webURL.substring(webURL.lastIndexOf('-') + 1, webURL.lastIndexOf('.'));
        if (_isHashFile != '' && _isHashFile.length == 32)
          webURL = webURL.replace(`-${_isHashFile}`, '');
        const data = fs.readFileSync(file);
        const _file = file;
        file = file.replace(`${_dir.IMAGE_BASE}/`, '');
        const hash = hasher.update(data).digest('hex');
        if (Build && Build[webURL]) {
          const oldHash = Build[webURL].substring(Build[webURL].lastIndexOf('-') + 1, Build[webURL].lastIndexOf('.'));
          if (oldHash != hash) {
            console.log('[hash-update]', file, 'old:', oldHash, 'new:', hash);

            Build[webURL] = `${webURL.substr(0, webURL.lastIndexOf('.'))}-${hash}${webURL.substr(webURL.lastIndexOf('.'), webURL.length)}`;
            // ToDo: Change File Name
            renameAndGzip(_file, `${_dir.IMAGE_BASE}/${Build[webURL]}`, true)
          }
        } else {
          Build || (Build = {});
          Build[webURL] = `${webURL.substr(0, webURL.lastIndexOf('.'))}-${hash}${webURL.substr(webURL.lastIndexOf('.'), webURL.length)}`;
          // ToDo: Change File Name
          renameAndGzip(_file, `${_dir.IMAGE_BASE}/${Build[webURL]}`, true);
          console.log('[new-image]', file, 'hash:', hash)
        }
      } catch (e) {
        console.log('FATAL! Cannot read file', file, '\nExiting!\nAbort Deployment!', e, e.stack);
        process.exit(0)
      }
    });
    const writeStram = fs.createWriteStream(`${base}/manifest.json`, {
      flags: 'w',
      encoding: 'utf-8'
    });
    writeStram.write(JSON.stringify(Build))
  })
};

if (process.argv[2] == 'images')
  hashImages();
else
  throw new Error('No arguments passed, images');
