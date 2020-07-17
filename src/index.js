import fs from '@magic/fs'
import path from 'path'

import posthtml from 'posthtml'
import posthtmlExtend from 'posthtml-extend'
import posthtmlInclude from 'posthtml-include'
import posthtmlExpressions from 'posthtml-expressions'
import posthtmlMixins from 'posthtml-mixins'
import posthtmlHint from 'posthtml-hint'

import is from '@magic/types'

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export const POST_HTML = async args => {
  const { buffer: buf, config } = args
  let buffer = await buf
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
    if (await fs.exists(varFilePath)) {
      const { default: fileModule } = await import(varFilePath)
      locals = {
        ...locals,
        ...fileModule,
      }
    }

    plugins.push(posthtmlExpressions({ locals }))
    plugins.push(posthtmlMixins())

    if (typeof config.LINT !== 'undefined' && config.LINT.HTML) {
      const optionsPath = path.join(process.cwd(), '.htmlhintrc')

      let options

      if (await fs.exists(optionsPath)) {
        options = JSON.parse(await fs.readFile(optionsPath))
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
          // 'doctype-first': true,
          'space-tab-mixed-disabled': 'space',
        }
      }

      plugins.push(posthtmlHint(options))
    }

    const mixinFile = path.join(config.HTML_DIR, 'mixins.html')
    if (await fs.exists(mixinFile)) {
      const mixinString = await fs.readFile(mixinFile, 'utf8')
      buffer = mixinString + buffer
    }
    const globalMixinFile = path.join(__dirname, 'mixins.html')
    if (await fs.exists(globalMixinFile)) {
      const globalMixinString = await fs.readFile(globalMixinFile, 'utf8')
      buffer = globalMixinString + buffer
    }

    const html = await posthtml(plugins).process(buffer)
    return html.html
  } catch (e) {
    return e
  }
}

export default POST_HTML
