const fs = require('fs')
const path = require('path')
const util = require('util')

const posthtml = require('posthtml')
const posthtmlExtend = require('posthtml-extend')
const posthtmlInclude = require('posthtml-include')
const posthtmlExpressions = require('posthtml-expressions')
const posthtmlMixins = require('posthtml-mixins')

const is = require('@magic/types')
const log = require('@magic/log')

const exists = util.promisify(fs.exists)
const readFile = util.promisify(fs.readFile)

const POST_HTML = async ({ buffer, config }) => {
  const { ENV } = config
  config.HTML_DIR = config.HTML_DIR || '/'

  config.WEB_ROOT = ENV === 'production' && config.WEB_ROOT ? config.WEB_ROOT : '/'

  try {
    if (is.empty(buffer)) {
      throw new Error('POST_HTML: Missing argument: { buffer } missing in first argument')
    }

    if (!is.string(buffer)) {
      if (is.buffer(buffer)) {
        buffer = buffer.toString()
      } else {
        throw new Error('POST_HTML: buffer has to be a string or buffer')
      }
    }

    const plugins = [
      posthtmlExtend({ root: config.HTML_DIR }),
      posthtmlInclude({ root: config.HTML_DIR }),
      posthtmlMixins(),
    ]

    const varFilePath = path.join(config.HTML_DIR, 'variables.js')
    let locals = config
    if (await exists(varFilePath)) {
      locals = {
        ...locals,
        ...require(varFilePath),
      }
    }
    plugins.push(posthtmlExpressions({ locals }))

    const mixinFile = path.join(config.HTML_DIR, 'mixins.html')
    if (await exists(mixinFile)) {
      const mixinString = await readFile(mixinFile, 'utf8')
      buffer = mixinString + buffer
    }
    const globalMixinFile = path.join(__dirname, 'mixins.html')
    if (await exists(globalMixinFile)) {
      const globalMixinString = await readFile(globalMixinFile, 'utf8')
      buffer = globalMixinString + buffer
    }
  
    const html = await posthtml(plugins).process(buffer /*, options */)
    return html.html
  } catch (e) {
    throw e
  }
}

module.exports = POST_HTML
