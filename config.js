import path from 'path'
import html from './src/index.js'

const cwd = process.cwd()

export default {
  TRANSPILERS: {
    html,
  },
  // files get loaded from example/src and example/includes
  CWD: path.join(cwd, 'example'),
  // and published in example/publish
  OUT_DIR: path.join(cwd, 'example', 'public'),
  // web root of the github page
  WEB_ROOT: 'https://mspg.github.io/transpile-posthtml/',
  LINT: {
    HTML: true,
  },
}
