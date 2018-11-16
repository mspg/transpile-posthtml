const { is } = require('@magic/test')

const vars = require('../../example/includes/html/variables.js')

module.exports = [
  { fn: vars, expect: is.object, info: 'vars are an object' },
  { fn: vars.var, expect: is.string, info: 'vars.var is a string' },
]
