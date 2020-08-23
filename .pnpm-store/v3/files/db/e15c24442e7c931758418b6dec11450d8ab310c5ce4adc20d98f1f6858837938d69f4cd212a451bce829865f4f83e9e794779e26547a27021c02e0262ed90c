# level-js

> An [`abstract-leveldown`][abstract-leveldown] compliant store on top of [IndexedDB][indexeddb], which is in turn implemented on top of [LevelDB][leveldb] which brings this whole shebang full circle.

[![level badge][level-badge]][awesome]
[![npm](https://img.shields.io/npm/v/level-js.svg?label=&logo=npm)](https://www.npmjs.com/package/level-js)
[![Travis](https://img.shields.io/travis/Level/level-js.svg?logo=travis&label=)](https://travis-ci.org/Level/level-js)
[![npm](https://img.shields.io/npm/dm/level-js.svg?label=dl)](https://www.npmjs.com/package/level-js)
[![Coverage Status](https://coveralls.io/repos/github/Level/level-js/badge.svg)](https://coveralls.io/github/Level/level-js)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

## Table of Contents

<details><summary>Click to expand</summary>

- [Background](#background)
- [Example](#example)
- [Browser Support](#browser-support)
- [Type Support](#type-support)
- [Install](#install)
- [API](#api)
- [Running Tests](#running-tests)
- [Big Thanks](#big-thanks)
- [Contributing](#contributing)
- [Donate](#donate)
- [License](#license)

</details>

## Background

Here are the goals of `level-js`:

- Store large amounts of data in modern browsers
- Pass the full [`abstract-leveldown`][abstract-leveldown] test suite
- Support [`Buffer`][buffer] keys and values
- Support all key types of IndexedDB Second Edition
- Support all value types of the [structured clone algorithm][structured-clone-algorithm] except for `null` and `undefined`
- Be as fast as possible
- Sync with [multilevel](https://github.com/juliangruber/multilevel) over ASCII or binary transports.

Being `abstract-leveldown` compliant means you can use many of the [Level modules][awesome] on top of this library. For some demos of it working, see [**@brycebaril**](https://github.com/brycebaril)'s presentation [Path of the NodeBases Jedi](http://brycebaril.github.io/nodebase_jedi/#/vanilla).

## Example

**If you are upgrading:** please see [UPGRADING.md](UPGRADING.md).

```js
var levelup = require('levelup')
var leveljs = require('level-js')
var db = levelup(leveljs('bigdata'))

db.put('hello', Buffer.from('world'), function (err) {
  if (err) throw err

  db.get('hello', function (err, value) {
    if (err) throw err

    console.log(value.toString()) // 'world'
  })
})
```

In ES6 browsers:

```js
const levelup = require('levelup')
const leveljs = require('level-js')
const db = levelup(leveljs('bigdata'))

await db.put('hello', Buffer.from('world'))
const value = await db.get('hello')
```

## Browser Support

[![Sauce Test Status](https://saucelabs.com/browser-matrix/level-js.svg)](https://saucelabs.com/u/level-js)

## Type Support

Unlike [`leveldown`][leveldown], `level-js` does not stringify keys or values. This means that in addition to strings and Buffers you can store almost any JavaScript type without the need for [`encoding-down`][encoding-down].

### Values

All value types of the [structured clone algorithm][structured-clone-algorithm] are supported except for `null` and `undefined`. Depending on the environment, this includes:

- Number, including `NaN`, `Infinity` and `-Infinity`
- String, Boolean, Date, RegExp, Array, Object
- ArrayBuffer or a view thereof (typed arrays);
- Map, Set, Blob, File, FileList, ImageData (limited support).

In addition `level-js` stores [`Buffer`][buffer] values without transformation. This works in all target environments because `Buffer` is a subclass of `Uint8Array`, meaning such values can be passed to `IndexedDB` as-is.

When getting or iterating binary values, regardless of whether they were stored as a `Buffer`, `ArrayBuffer` or a view thereof, values will return as a `Buffer`. This behavior can be disabled, in which case `ArrayBuffer` returns as `ArrayBuffer`, typed arrays return as typed arrays and `Buffer` returns as `Uint8Array`:

```js
db.get('key', { asBuffer: false })
db.iterator({ valueAsBuffer: false })
```

If the environment does not support a type, it will throw an error which `level-js` catches and passes to the callbacks of `put` or `batch`. For example, IE does not support typed array values. At the time of writing, Chrome is the only browser that supports all types listed above.

### Keys

All key types of IndexedDB Second Edition are supported. Depending on the environment, this includes:

- Number, including `Infinity` and `-Infinity`, but not `NaN`
- Date, except invalid (`NaN`)
- String
- ArrayBuffer or a view thereof (typed arrays);
- Array, except cyclical, empty and sparse arrays. Elements must be valid types themselves.

In addition you can use [`Buffer`][buffer] keys, giving `level-js` the same power as implementations like `leveldown` and `memdown`. When iterating binary keys, regardless of whether they were stored as `Buffer`, `ArrayBuffer` or a view thereof, keys will return as a `Buffer`. This behavior can be disabled, in which case binary keys will always return as `ArrayBuffer`:

```js
db.iterator({ keyAsBuffer: false })
```

Note that this behavior is slightly different from values due to the way that IndexedDB works. IndexedDB stores binary _values_ using the structured clone algorithm, which preserves views, but it stores binary _keys_ as an array of octets, so that it is able to compare and sort differently typed keys.

If the environment does not support a type, it will throw an error which `level-js` catches and passes to the callbacks of `get`, `put`, `del`, `batch` or an iterator. Exceptions are:

- `null` and `undefined`: rejected early by `abstract-leveldown`
- Binary and array keys: if not supported by the environment, `level-js` falls back to `String(key)`.

### Normalization

If you desire normalization for keys and values (e.g. to stringify numbers), wrap `level-js` with [`encoding-down`][encoding-down]. Alternatively install [`level-browserify`][level-browserify] which conveniently bundles [`levelup`][levelup], `level-js` and `encoding-down`. Such an approach is also recommended if you want to achieve universal (isomorphic) behavior or to smooth over type differences between browsers. For example, you could have [`leveldown`][leveldown] in a backend and `level-js` in the frontend.

Another reason you might want to use `encoding-down` is that the structured clone algorithm, while rich in types, can be slower than `JSON.stringify`.

### Sort Order

Unless `level-js` is wrapped with [`encoding-down`][encoding-down], IndexedDB will sort your keys in the following order:

1. number (numeric)
2. date (numeric, by epoch offset)
3. binary (bitwise)
4. string (lexicographic)
5. array (componentwise).

You can take advantage of this fact with `levelup` streams. For example, if your keys are dates, you can select everything greater than a specific date (let's be happy and ignore timezones for a moment):

```js
const db = levelup(leveljs('time-db'))

db.createReadStream({ gt: new Date('2019-01-01') })
  .pipe(..)
```

Or if your keys are arrays, you can do things like:

```js
const db = levelup(leveljs('books-db'))

await db.put(['Roald Dahl', 'Charlie and the Chocolate Factory'], {})
await db.put(['Roald Dahl', 'Fantastic Mr Fox'], {})

// Select all books by Roald Dahl
db.createReadStream({ gt: ['Roald Dahl'], lt: ['Roald Dahl', '\xff'] })
  .pipe(..)
```

To achieve this on other `abstract-leveldown` implementations, wrap them with [`encoding-down`][encoding-down] and [`charwise`][charwise] (or similar).

#### Known Browser Issues

IE11 and Edge yield incorrect results for `{ gte: '' }` if the database contains any key types other than strings.

### Buffer vs ArrayBuffer

For interoperability it is recommended to use `Buffer` as your binary type. While we recognize that Node.js core modules are moving towards supporting `ArrayBuffer` and views thereof, `Buffer` remains the primary binary type in the Level ecosystem.

That said: if you want to `put()` an `ArrayBuffer` you can! Just know that it will come back as a `Buffer` by default. If you want to `get()` or iterate stored `ArrayBuffer` data as an `ArrayBuffer`, you have a few options. Without `encoding-down`:

```js
const db = levelup(leveljs('mydb'))

// Yields an ArrayBuffer, Buffer and ArrayBuffer
const value1 = await db.get('key', { asBuffer: false })
const value2 = await db.get('key')
const value3 = value2.buffer
```

With `encoding-down` (or `level-browserify`) you can use the `id` encoding to selectively bypass encodings:

```js
const encode = require('encoding-down')
const db = levelup(encode(leveljs('mydb'), { valueEncoding: 'binary' }))

// Yields an ArrayBuffer, Buffer and ArrayBuffer
const value1 = await db.get('key', { valueEncoding: 'id' })
const value2 = await db.get('key')
const value3 = value2.buffer
```

## Install

With [npm](https://npmjs.org) do:

```bash
npm install level-js
```

Not to be confused with [leveljs](https://www.npmjs.com/package/leveljs).

This library is best used with [browserify](http://browserify.org).

## API

### `db = leveljs(location[, options])`

Returns a new `leveljs` instance. `location` is the string name of the [`IDBDatabase`](https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase) to be opened, as well as the object store within that database. The database name will be prefixed with `options.prefix`.

#### `options`

The optional `options` argument may contain:

- `prefix` _(string, default: `'level-js-'`)_: Prefix for `IDBDatabase` name.
- `version` _(string | number, default: `1`)_: The version to open the database with.

See [`IDBFactory#open`](https://developer.mozilla.org/en-US/docs/Web/API/IDBFactory/open) for more details.

## Running Tests

```sh
git clone git@github.com:Level/level-js.git
cd level-js
npm install
npm test
```

It will print out a URL to open in a browser of choice.

## Big Thanks

Cross-browser Testing Platform and Open Source ♥ Provided by [Sauce Labs](https://saucelabs.com).

[![Sauce Labs logo](./sauce-labs.svg)](https://saucelabs.com)

## Contributing

[`Level/level-js`](https://github.com/Level/level-js) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Donate

To sustain [`Level`](https://github.com/Level) and its activities, become a backer or sponsor on [Open Collective](https://opencollective.com/level). Your logo or avatar will be displayed on our 28+ [GitHub repositories](https://github.com/Level), [npm](https://www.npmjs.com/) packages and (soon) [our website](http://leveldb.org). 💖

### Backers

[![Open Collective backers](https://opencollective.com/level/backers.svg?width=890)](https://opencollective.com/level)

### Sponsors

[![Open Collective sponsors](https://opencollective.com/level/sponsors.svg?width=890)](https://opencollective.com/level)

## License

[MIT](LICENSE.md) © 2012-present [Max Ogden](https://github.com/maxogden) and [Contributors](CONTRIBUTORS.md).

[level-badge]: http://leveldb.org/img/badge.svg

[indexeddb]: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API

[leveldb]: https://github.com/google/leveldb

[buffer]: https://nodejs.org/api/buffer.html

[awesome]: https://github.com/Level/awesome

[abstract-leveldown]: https://github.com/Level/abstract-leveldown

[charwise]: https://github.com/dominictarr/charwise

[levelup]: https://github.com/Level/levelup

[leveldown]: https://github.com/Level/leveldown

[level-browserify]: https://github.com/Level/level-browserify

[encoding-down]: https://github.com/Level/encoding-down

[structured-clone-algorithm]: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm
