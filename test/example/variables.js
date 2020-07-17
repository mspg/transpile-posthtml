import { is } from '@magic/test'

import vars from '../../example/includes/html/variables.js'

export default [
  { fn: vars, expect: is.object, info: 'vars are an object' },
  { fn: vars.var, expect: is.string, info: 'vars.var is a string' },
]
