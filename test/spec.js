const fs = require('fs')
const path = require('path')
const { is, tryCatch } = require('@magic/test')
const conf = require('../config')
const POST_HTML = require('../src/index')

const templateString = `<div class="c">
  <div id="id" class="class" data-wr="{{ WEB_ROOT }}">{{ HTML_DIR }}</div>
</div>`

const templateBuffer = fs.readFileSync(path.join(__dirname, 'includes', 'test.html'))
const includeBuffer = fs.readFileSync(path.join(__dirname, 'includes', 'include.html'))

const expect = '<div class="c"><div id="id" class="class" data-wr="/">/testing</div></div>'
const expectRooted = '<div class="c"><div id="id" class="class" data-wr="/root">/testing</div></div>'
const includeDir = path.join(__dirname, 'includes')
const expectIncluded = `<div class="tostring">${includeDir}</div>`

const config = {
  dev: {
    ENV: 'development',
    HTML_DIR: '/testing',
  },
  prod: {
    ENV: 'production',
    HTML_DIR: '/testing',
  },
  rooted: {
    dev: {
      ENV: 'development',
      HTML_DIR: '/testing',
      WEB_ROOT: '/root',
    },
    prod: {
      ENV: 'production',
      HTML_DIR: '/testing',
      WEB_ROOT: '/root',
    },
  },
}

module.exports = [
  { fn: () => POST_HTML, expect: is.fn, info: 'POST_HTML is a function' },
  {
    fn: async () => await POST_HTML({ buffer: templateString, config: config.dev }),
    expect,
    info: 'can render posthtml in development',
  },
  {
    fn: async () => await POST_HTML({ buffer: templateString, config: config.prod }),
    expect,
    info: 'can render posthtml in production',
  },
  {
    fn: async () => await POST_HTML({ buffer: templateString, config: config.rooted.dev }),
    expect,
    info: 'WEB_ROOT does not get applied in development mode',
  },
  {
    fn: async () => await POST_HTML({ buffer: templateString, config: config.rooted.prod }),
    expect: expectRooted,
    info: 'WEB_ROOT gets applied in production mode',
  },
  {
    fn: async () => await POST_HTML({ buffer: '<div class="t">{{ HTML_DIR }}</div>', config: { ENV: 'development' } }),
    expect: '<div class="t">/</div>',
    info: 'HTML_DIR fallback is "/"',
  },
  {
    fn: async () => await POST_HTML({ buffer: templateString, config: config.dev }),
    expect: res => res.indexOf(`>${config.dev.HTML_DIR}<`) > -1,
    info: 'Can handle global pug variables in dev',
  },
  {
    fn: async () => await POST_HTML({ buffer: templateString, config: config.prod }),
    expect: res => res.indexOf(`>${config.prod.HTML_DIR}<`) > -1,
    info: 'Can handle global pug variables in prod',
  },
  {
    fn: async () => await POST_HTML({ buffer: templateBuffer, config: config.dev }),
    expect: `<div class="tostring">${config.dev.HTML_DIR}</div>`,
    info: 'Function can handle buffers',
  },
  {
    fn: tryCatch(POST_HTML, { buffer: {}, config: config.dev }),
    expect: is.error,
    info: 'Passing empty objects errors',
  },
  {
    fn: tryCatch(POST_HTML, { buffer: [], config: config.dev }),
    expect: is.error,
    info: 'Passing empty arrays errors',
  },
  {
    fn: tryCatch(POST_HTML, { buffer: { toString: () => {} }, config: config.dev }),
    expect: is.error,
    info: 'Passing non buffer objects errors even if they have a toString function',
  },
  {
    fn: tryCatch(POST_HTML, { config: config.dev }),
    expect: is.error,
    info: 'Calling POST_HTML without a buffer errors',
  },
  {
    fn: POST_HTML({ buffer: includeBuffer, config: { ...config.dev, HTML_DIR: includeDir } }),
    expect: str => expectIncluded,
    info: 'including html files works',
  }
]
