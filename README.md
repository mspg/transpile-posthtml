#### mspg-posthtml

[![NPM version][npm-image]][npm-url]
[![Linux Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]

transpiles html using posthtml,
then minifies the result and returns it.

##### Installation:
```javascript
npm install @mspg/transpile-posthtml
```

##### Usage:
First set up a [mspg](https://github.com/mspg/core) project.

then, in src/config.js
```javascript
  const HTML = require('@mspg/transpile-posthtml')

  module.exports = {
    TRANSPILERS: {
      HTML,
    },
  }
```

##### posthtml plugins
now you can use posthtml plugins in your html template.
enabled plugins: 

###### posthtml-extend
you can use posthtml-extend by adding a template.html file to /includes:
```html
<html>
  <body>
    <block name="content">
  </body>
</html>
```
then extend this in your files, eg /src/index.html
```html
<block name="content">
  <div>will be embedded into page.html's content block</div>
</block>
```

###### posthtml-include
you can include any file from the /includes folder.
/includes/included.html
```html
<div>file gets included</div>
```

src/index.html
```html
<include src="included.html"></include>
```

###### example app
a minimal example app is in the [example][example-url] directory of this repository,
using [config.js][config-url] from the root directory

###### example app on github.io
the example app is published to the [gh-pages][gh-pages] branch.
it is hosted @ [https://mspg.github.io/transpile-posthtml][page-url]


[npm-image]: https://img.shields.io/npm/v/@mspg/transpile-posthtml.svg
[npm-url]: https://www.npmjs.com/package/@mspg/transpile-posthtml
[travis-image]: https://travis-ci.org/mspg/transpile-posthtml.svg?branch=master
[travis-url]: https://travis-ci.org/mspg/transpile-posthtml
[appveyor-image]: https://ci.appveyor.com/api/projects/status/0cropq4gauy9lqf3?svg=true
[appveyor-url]: https://ci.appveyor.com/project/jaeh/transpile-posthtml/branch/master
[coveralls-image]: https://coveralls.io/repos/github/mspg/transpile-posthtml/badge.svg
[coveralls-url]: https://coveralls.io/github/mspg/transpile-posthtml

[example-url]: https://github.com/mspg/transpile-posthtml/tree/master/example
[config-url]: https://github.com/mspg/transpile-posthtml/blob/master/config.js
[core-url]: https://github.com/mspg/core
[gh-pages]: https://github.com/mspg/transpile-posthtml/tree/gh-pages
[page-url]: https://mspg.github.io/transpile-posthtml
