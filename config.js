import path from 'path'
import HTML from './src/index.js'

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export default {
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
