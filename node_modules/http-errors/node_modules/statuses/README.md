# Statuses

[![NPM version][npm-image]][npm-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

HTTP status utility for node.

## API

```js
var status = require('statuses');
```

### var code = status(Integer || String)

If `Integer` or `String` is a valid HTTP code or status message, then the appropriate `code` will be returned. Otherwise, an error will be thrown.

```js
status(403) // => 403
status('403') // => 403
status('forbidden') // => 403
status('Forbidden') // => 403
status(306) // throws, as it's not supported by node.js
```

### status.codes

Returns an array of all the status codes as `Integer`s.

### var msg = status[code]

Map of `code` to `status message`. `undefined` for invalid `code`s.

```js
status[404] // => 'Not Found'
```

### var code = status[msg]

Map of `status message` to `code`. `msg` can either be title-cased or lower-cased. `undefined` for invalid `status message`s.

```js
status['not found'] // => 404
status['Not Found'] // => 404
```

### status.redirect[code]

Returns `true` if a status code is a valid redirect status.

```js
status.redirect[200] // => undefined
status.redirect[301] // => true
```

### status.empty[code]

Returns `true` if a status code expects an empty body.

```js
status.empty[200] // => undefined
status.empty[204] // => true
status.empty[304] // => true
```

### status.retry[code]

Returns `true` if you should retry the rest.

```js
status.retry[501] // => undefined
status.retry[503] // => true
```

[npm-image]: https://img.shields.io/npm/v/statuses.svg?style=flat-square
[npm-url]: https://npmjs.org/package/statuses
[github-tag]: http://img.shields.io/github/tag/jshttp/statuses.svg?style=flat-square
[github-url]: https://github.com/jshttp/statuses/tags
[travis-image]: https://img.shields.io/travis/jshttp/statuses.svg?style=flat-square
[travis-url]: https://travis-ci.org/jshttp/statuses
[coveralls-image]: https://img.shields.io/coveralls/jshttp/statuses.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/jshttp/statuses?branch=master
[david-image]: http://img.shields.io/david/jshttp/statuses.svg?style=flat-square
[david-url]: https://david-dm.org/jshttp/statuses
[license-image]: http://img.shields.io/npm/l/statuses.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/statuses.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/statuses
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
