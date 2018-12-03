const path = require('path')
const HTML = require('./src')

module.exports = {
  TRANSPILERS: {
    HTML,
  },
  // files get loaded from example/src and example/includes
  CWD: path.join(__dirname, 'example'),
  // and published in example/publish
  OUT_DIR: path.join(__dirname, 'example', 'public'),
  // web root of the github page
  WEB_ROOT: 'https://mspg.github.io/transpile-posthtml/',
  LINT: {
    HTML: true,
  },
}
