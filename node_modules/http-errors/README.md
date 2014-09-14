
# http-errors

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]

Create HTTP errors for Express, Koa, Connect, etc. with ease.

## Example

```js
var createError = require('http-errors');

app.use(function (req, res, next) {
  if (!req.user) return next(createError(401, 'Please login to view this page.'));
  next();
})
```

## API

This is the current API, currently extracted from Koa and subject to change.

### Error Properties

- `message`
- `status` and `statusCode` - the status code of the error, defaulting to `500`

### createError([status], [message], [properties])

```js
var err = createError(404, 'This video does not exist!');
```

- `status: 500` - the status code as a number
- `message` - the message of the error, defaulting to node's text for that status code.
- `properties` - custom properties to attach to the object

### new createError\[code || name\](\[msg]\))

```js
var err = new createError.NotFound();
```

- `code` - the status code as a number
- `name` - the name of the error as a "bumpy case", i.e. `NotFound` or `InternalServerError`.

[npm-image]: https://img.shields.io/npm/v/http-errors.svg?style=flat-square
[npm-url]: https://npmjs.org/package/http-errors
[travis-image]: https://img.shields.io/travis/jshttp/http-errors.svg?style=flat-square
[travis-url]: https://travis-ci.org/jshttp/http-errors
[coveralls-image]: https://img.shields.io/coveralls/jshttp/http-errors.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/jshttp/http-errors?branch=master
[david-image]: http://img.shields.io/david/jshttp/http-errors.svg?style=flat-square
[david-url]: https://david-dm.org/jshttp/http-errors
[license-image]: http://img.shields.io/npm/l/http-errors.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/http-errors.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/http-errors
