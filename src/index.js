const fs = require('fs')
const path = require('path')
const util = require('util')

const posthtml = require('posthtml')
const posthtmlExtend = require('posthtml-extend')
const posthtmlInclude = require('posthtml-include')
const posthtmlExpressions = require('posthtml-expressions')
const posthtmlMixins = require('posthtml-mixins')
const posthtmlHint = require('posthtml-hint')

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
      throw new Error('POST_HTML: expects { buffer } to be non-empty')
    }

    if (!is.string(buffer)) {
      if (is.buffer(buffer)) {
        buffer = buffer.toString()
      } else {
        throw new Error('POST_HTML: expects buffer to be a string or buffer')
      }
    }

    const plugins = [
      posthtmlExtend({ root: config.HTML_DIR }),
      posthtmlInclude({ root: config.HTML_DIR }),
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
    plugins.push(posthtmlMixins())

    if (typeof config.LINT !== 'undefined' && config.LINT.HTML) {
      const optionsPath = path.join(process.cwd(), '.htmlhintrc')

      if (fs.existsSync(optionsPath)) {
        options = JSON.parse(fs.readFileSync(optionsPath))
      } else {
        options = {
          'tagname-lowercase': true,
          'attr-lowercase': true,
          'attr-value-double-quotes': true,
          'tag-pair': true,
          'spec-char-escape': true,
          'id-unique': true,
          'src-not-empty': true,
          'attr-no-duplication': true,
          'title-require': true,
          'head-script-disabled': true,
          'attr-value-not-empty': true,
          'alt-require': true,
          'doctype-html5': true,
          'doctype-first': true,
          'space-tab-mixed-disabled': 'space',
        }
      }

      plugins.push(posthtmlHint(options))
    }

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

    const html = await posthtml(plugins).process(buffer)
    return html.html
  } catch (e) {
    return e
  }
}

module.exports = POST_HTML
