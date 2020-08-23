# abstract-leveldown

> An abstract prototype matching the [`leveldown`][leveldown] API. Useful for extending [`levelup`](https://github.com/Level/levelup) functionality by providing a replacement to `leveldown`.

[![level badge][level-badge]](https://github.com/Level/awesome)
[![npm](https://img.shields.io/npm/v/abstract-leveldown.svg?label=&logo=npm)](https://www.npmjs.com/package/abstract-leveldown)
[![Node version](https://img.shields.io/node/v/abstract-leveldown.svg)](https://www.npmjs.com/package/abstract-leveldown)
[![Travis](https://img.shields.io/travis/Level/abstract-leveldown.svg?logo=travis&label=)](https://travis-ci.org/Level/abstract-leveldown)
[![Coverage Status](https://coveralls.io/repos/github/Level/abstract-leveldown/badge.svg)](https://coveralls.io/github/Level/abstract-leveldown)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![npm](https://img.shields.io/npm/dm/abstract-leveldown.svg?label=dl)](https://www.npmjs.com/package/abstract-leveldown)
[![Backers on Open Collective](https://opencollective.com/level/backers/badge.svg?color=orange)](#backers)
[![Sponsors on Open Collective](https://opencollective.com/level/sponsors/badge.svg?color=orange)](#sponsors)

## Table of Contents

<details><summary>Click to expand</summary>

- [Background](#background)
- [Example](#example)
- [Browser Support](#browser-support)
- [Public API For Consumers](#public-api-for-consumers)
- [Private API For Implementors](#private-api-for-implementors)
- [Test Suite](#test-suite)
- [Spread The Word](#spread-the-word)
- [Install](#install)
- [Contributing](#contributing)
- [Big Thanks](#big-thanks)
- [Donate](#donate)
- [License](#license)

</details>

## Background

`abstract-leveldown` provides a simple, operational base prototype that's ready for extending. All operations have sensible _noop_ defaults (operations that essentially do nothing). For example, operations such as `.open(callback)` and `.close(callback)` will invoke `callback` on a next tick. Others perform sensible actions, like `.get(key, callback)` which will always yield a `'NotFound'` error.

You add functionality by implementing the "private" underscore versions of the operations. For example, to implement a public `put()` operation you add a private `_put()` method to your object. Each of these underscore methods override the default _noop_ operations and are always provided with consistent arguments, regardless of what is passed in through the public API. All methods provide argument checking and sensible defaults for optional arguments.

For example, if you call `.open()` without a callback argument you'll get an `Error('open() requires a callback argument')`. Where optional arguments are involved, your underscore methods will receive sensible defaults. A `.get(key, callback)` will pass through to a `._get(key, options, callback)` where the `options` argument is an empty object.

**If you are upgrading:** please see [UPGRADING.md](UPGRADING.md).

## Example

Let's implement a simplistic in-memory [`leveldown`][leveldown] replacement:

```js
var AbstractLevelDOWN = require('abstract-leveldown').AbstractLevelDOWN
var util = require('util')

// Constructor
function FakeLevelDOWN () {
  AbstractLevelDOWN.call(this)
}

// Our new prototype inherits from AbstractLevelDOWN
util.inherits(FakeLevelDOWN, AbstractLevelDOWN)

FakeLevelDOWN.prototype._open = function (options, callback) {
  // Initialize a memory storage object
  this._store = {}

  // Use nextTick to be a nice async citizen
  process.nextTick(callback, null, this)
}

FakeLevelDOWN.prototype._serializeKey = function (key) {
  // Safety: avoid store['__proto__'] skullduggery.
  // Below methods will receive serialized keys in their arguments.
  return '!' + key
}

FakeLevelDOWN.prototype._put = function (key, value, options, callback) {
  this._store[key] = value
  process.nextTick(callback)
}

FakeLevelDOWN.prototype._get = function (key, options, callback) {
  if (value === undefined) {
    // 'NotFound' error, consistent with LevelDOWN API
    return process.nextTick(callback, new Error('NotFound'))
  }

  process.nextTick(callback, null, value)
}

FakeLevelDOWN.prototype._del = function (key, options, callback) {
  delete this._store[key]
  process.nextTick(callback)
}
```

Now we can use our implementation with `levelup`:

```js
var levelup = require('levelup')

var db = levelup(new FakeLevelDOWN())

db.put('foo', 'bar', function (err) {
  if (err) throw err

  db.get('foo', function (err, value) {
    if (err) throw err

    console.log(value) // 'bar'
  })
})
```

See [`memdown`](https://github.com/Level/memdown/) if you are looking for a complete in-memory replacement for `leveldown`.

## Browser Support

[![Sauce Test Status](https://saucelabs.com/browser-matrix/abstract-leveldown.svg)](https://saucelabs.com/u/abstract-leveldown)

## Public API For Consumers

### `db = constructor(..)`

Constructors typically take a `location` argument pointing to a location on disk where the data will be stored. Since not all implementations are disk-based and some are non-persistent, implementors are free to take zero or more arguments in their constructor.

### `db.status`

A read-only property. An `abstract-leveldown` compliant store can be in one of the following states:

- `'new'` - newly created, not opened or closed
- `'opening'` - waiting for the store to be opened
- `'open'` - successfully opened the store, available for use
- `'closing'` - waiting for the store to be closed
- `'closed'` - store has been successfully closed, should not be used.

### `db.open([options, ]callback)`

Open the store. The `callback` function will be called with no arguments when the store has been successfully opened, or with a single error argument if the open operation failed for any reason.

The optional `options` argument may contain:

- `createIfMissing` _(boolean, default: `true`)_: If `true` and the store doesn't exist it will be created. If `false` and the store doesn't exist, `callback` will receive an error.
- `errorIfExists` _(boolean, default: `false`)_: If `true` and the store exists, `callback` will receive an error.

Not all implementations support the above options.

### `db.close(callback)`

Close the store. The `callback` function will be called with no arguments if the operation is successful or with a single `error` argument if closing failed for any reason.

### `db.get(key[, options], callback)`

Get a value from the store by `key`. The optional `options` object may contain:

- `asBuffer` _(boolean, default: `true`)_: Whether to return the `value` as a Buffer. If `false`, the returned type depends on the implementation.

The `callback` function will be called with an `Error` if the operation failed for any reason. If successful the first argument will be `null` and the second argument will be the value.

### `db.put(key, value[, options], callback)`

Store a new entry or overwrite an existing entry. There are no `options` by default but implementations may add theirs. The `callback` function will be called with no arguments if the operation is successful or with an `Error` if putting failed for any reason.

### `db.del(key[, options], callback)`

Delete an entry. There are no `options` by default but implementations may add theirs. The `callback` function will be called with no arguments if the operation is successful or with an `Error` if deletion failed for any reason.

### `db.batch(operations[, options], callback)`

Perform multiple _put_ and/or _del_ operations in bulk. The `operations` argument must be an `Array` containing a list of operations to be executed sequentially, although as a whole they are performed as an atomic operation.

Each operation is contained in an object having the following properties: `type`, `key`, `value`, where the `type` is either `'put'` or `'del'`. In the case of `'del'` the `value` property is ignored.

There are no `options` by default but implementations may add theirs. The `callback` function will be called with no arguments if the batch is successful or with an `Error` if the batch failed for any reason.

### `db.batch()`

Returns a [`chainedBatch`](#chainedbatch).

### `db.iterator([options])`

Returns an [`iterator`](#iterator). Accepts the following range options:

- `gt` (greater than), `gte` (greater than or equal) define the lower bound of the range to be iterated. Only entries where the key is greater than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries iterated will be the same.
- `lt` (less than), `lte` (less than or equal) define the higher bound of the range to be iterated. Only entries where the key is less than (or equal to) this option will be included in the range. When `reverse=true` the order will be reversed, but the entries iterated will be the same.
- `reverse` _(boolean, default: `false`)_: iterate entries in reverse order. Beware that a reverse seek can be slower than a forward seek.
- `limit` _(number, default: `-1`)_: limit the number of entries collected by this iterator. This number represents a _maximum_ number of entries and may not be reached if you get to the end of the range first. A value of `-1` means there is no limit. When `reverse=true` the entries with the highest keys will be returned instead of the lowest keys.

Legacy options:

- `start`: instead use `gte`
- `end`: instead use `lte`.

**Note** Zero-length strings, buffers and arrays as well as `null` and `undefined` are invalid as keys, yet valid as range options. These types are significant in encodings like [`bytewise`](https://github.com/deanlandolt/bytewise) and [`charwise`](https://github.com/dominictarr/charwise) as well as some underlying stores like IndexedDB. Consumers of an implementation should assume that `{ gt: undefined }` is _not_ the same as `{}`. An implementation can choose to:

- [_Serialize_](#db_serializekeykey) or [_encode_][encoding-down] these types to make them meaningful
- Have no defined behavior (moving the concern to a higher level)
- Delegate to an underlying store (moving the concern to a lower level).

If you are an implementor, a final note: the [abstract test suite](#test-suite) does not test these types. Whether they are supported or how they sort is up to you; add custom tests accordingly.

In addition to range options, `iterator()` takes the following options:

- `keys` _(boolean, default: `true`)_: whether to return the key of each entry. If set to `false`, calls to `iterator.next(callback)` will yield keys with a value of `undefined`.
- `values` _(boolean, default: `true`)_: whether to return the value of each entry. If set to `false`, calls to `iterator.next(callback)` will yield values with a value of `undefined`.
- `keyAsBuffer` _(boolean, default: `true`)_: Whether to return the key of each entry as a Buffer. If `false`, the returned type depends on the implementation.
- `valueAsBuffer` _(boolean, default: `true`)_: Whether to return the value of each entry as a Buffer.

Lastly, an implementation is free to add its own options.

### `chainedBatch`

#### `chainedBatch.put(key, value)`

Queue a `put` operation on this batch. This may throw if `key` or `value` is invalid.

#### `chainedBatch.del(key)`

Queue a `del` operation on this batch. This may throw if `key` is invalid.

#### `chainedBatch.clear()`

Clear all queued operations on this batch.

#### `chainedBatch.write([options, ]callback)`

Commit the queued operations for this batch. All operations will be written atomically, that is, they will either all succeed or fail with no partial commits.

There are no `options` by default but implementations may add theirs. The `callback` function will be called with no arguments if the batch is successful or with an `Error` if the batch failed for any reason.

After `write` has been called, no further operations are allowed.

#### `chainedBatch.db`

A reference to the `db` that created this chained batch.

### `iterator`

An iterator allows you to _iterate_ the entire store or a range. It operates on a snapshot of the store, created at the time `db.iterator()` was called. This means reads on the iterator are unaffected by simultaneous writes. Most but not all implementations can offer this guarantee.

An iterator keeps track of when a `next()` is in progress and when an `end()` has been called so it doesn't allow concurrent `next()` calls, it does allow `end()` while a `next()` is in progress and it doesn't allow either `next()` or `end()` after `end()` has been called.

#### `iterator.next(callback)`

Advance the iterator and yield the entry at that key. If an error occurs, the `callback` function will be called with an `Error`. Otherwise, the `callback` receives `null`, a `key` and a `value`. The type of `key` and `value` depends on the options passed to `db.iterator()`.

If the iterator has reached its end, both `key` and `value` will be `undefined`. This happens in the following situations:

- The end of the store has been reached
- The end of the range has been reached
- The last `iterator.seek()` was out of range.

**Note:** Don't forget to call `iterator.end()`, even if you received an error.

#### `iterator.seek(target)`

Seek the iterator to a given key or the closest key. Subsequent calls to `iterator.next()` will yield entries with keys equal to or larger than `target`, or equal to or smaller than `target` if the `reverse` option passed to `db.iterator()` was true.

If range options like `gt` were passed to `db.iterator()` and `target` does not fall within that range, the iterator will reach its end.

**Note:** At the time of writing, [`leveldown`][leveldown] is the only known implementation to support `seek()`. In other implementations, it is a noop.

#### `iterator.end(callback)`

End iteration and free up underlying resources. The `callback` function will be called with no arguments on success or with an `Error` if ending failed for any reason.

#### `iterator.db`

A reference to the `db` that created this iterator.

### Type Support

The following applies to any method above that takes a `key` argument or option: all implementations _must_ support a `key` of type String and _should_ support a `key` of type Buffer. A `key` may not be `null`, `undefined`, a zero-length Buffer, zero-length string or zero-length array.

The following applies to any method above that takes a `value` argument or option: all implementations _must_ support a `value` of type String or Buffer. A `value` may not be `null` or `undefined` due to preexisting significance in streams and iterators.

Support of other key and value types depends on the implementation as well as its underlying storage. See also [`db._serializeKey`](#db_serializekeykey) and [`db._serializeValue`](#db_serializevaluevalue).

## Private API For Implementors

Each of these methods will receive exactly the number and order of arguments described. Optional arguments will receive sensible defaults. All callbacks are error-first and must be asynchronous. If an operation within your implementation is synchronous, be sure to call the callback in a next tick using `process.nextTick(callback, ..)`, `setImmediate` or some other means of micro- or macrotask scheduling.

### `db = AbstractLevelDOWN()`

The constructor takes no parameters. Sets the `.status` to `'new'`.

### `db._open(options, callback)`

Open the store. The `options` object will always have the following properties: `createIfMissing`, `errorIfExists`. If opening failed, call the `callback` function with an `Error`. Otherwise call `callback` without any arguments.

### `db._close(callback)`

Close the store. If closing failed, call the `callback` function with an `Error`. Otherwise call `callback` without any arguments.

### `db._serializeKey(key)`

Convert a `key` to a type supported by the underlying storage. All methods below that take a `key` argument or option - including `db._iterator()` with its range options and `iterator._seek()` with its `target` argument - will receive serialized keys. For example, if `_serializeKey` is implemented as:

```js
FakeLevelDOWN.prototype._serializeKey = function (key) {
  return Buffer.isBuffer(key) ? key : String(key)
}
```

Then `db.get(2, callback)` translates into `db._get('2', options, callback)`. Similarly, `db.iterator({ gt: 2 })` translates into `db._iterator({ gt: '2', ... })` and `iterator.seek(2)` translates into `iterator._seek('2')`.

If the underlying storage supports any JavaScript type or if your implementation wraps another implementation, it is recommended to make `_serializeKey` an identity function. Serialization is irreversible, unlike _encoding_ as performed by implementations like [`encoding-down`][encoding-down]. This also applies to `_serializeValue`.

### `db._serializeValue(value)`

Convert a `value` to a type supported by the underlying storage. All methods below that take a `value` argument or option will receive serialized values. For example, if `_serializeValue` is implemented as:

```js
FakeLevelDOWN.prototype._serializeValue = function (value) {
  return Buffer.isBuffer(value) ? value : String(value)
}
```

Then `db.put(key, 2, callback)` translates into `db._put(key, '2', options, callback)`.

### `db._get(key, options, callback)`

Get a value by `key`. The `options` object will always have the following properties: `asBuffer`. If the key does not exist, call the `callback` function with a `new Error('NotFound')`. Otherwise call `callback` with `null` as the first argument and the value as the second.

### `db._put(key, value, options, callback)`

Store a new entry or overwrite an existing entry. There are no default options but `options` will always be an object. If putting failed, call the `callback` function with an `Error`. Otherwise call `callback` without any arguments.

### `db._del(key, options, callback)`

Delete an entry. There are no default options but `options` will always be an object. If deletion failed, call the `callback` function with an `Error`. Otherwise call `callback` without any arguments.

### `db._batch(operations, options, callback)`

Perform multiple _put_ and/or _del_ operations in bulk. The `operations` argument is always an `Array` containing a list of operations to be executed sequentially, although as a whole they should be performed as an atomic operation. Each operation is guaranteed to have at least `type` and `key` properties. There are no default options but `options` will always be an object. If the batch failed, call the `callback` function with an `Error`. Otherwise call `callback` without any arguments.

### `db._chainedBatch()`

The default `_chainedBatch()` returns a functional `AbstractChainedBatch` instance that uses `db._batch(array, options, callback)` under the hood. The prototype is available on the main exports for you to extend. If you want to implement chainable batch operations in a different manner then you should extend `AbstractChainedBatch` and return an instance of this prototype in the `_chainedBatch()` method:

```js
var AbstractChainedBatch = require('abstract-leveldown').AbstractChainedBatch
var inherits = require('util').inherits

function ChainedBatch (db) {
  AbstractChainedBatch.call(this, db)
}

inherits(ChainedBatch, AbstractChainedBatch)

FakeLevelDOWN.prototype._chainedBatch = function () {
  return new ChainedBatch(this)
}
```

### `db._iterator(options)`

The default `_iterator()` returns a noop `AbstractIterator` instance. The prototype is available on the main exports for you to extend. To implement iterator operations you must extend `AbstractIterator` and return an instance of this prototype in the `_iterator(options)` method.

The `options` object will always have the following properties: `reverse`, `keys`, `values`, `limit`, `keyAsBuffer` and `valueAsBuffer`.

### `iterator = AbstractIterator(db)`

The first argument to this constructor must be an instance of your `AbstractLevelDOWN` implementation. The constructor will set `iterator.db` which is used to access `db._serialize*` and ensures that `db` will not be garbage collected in case there are no other references to it.

#### `iterator._next(callback)`

Advance the iterator and yield the entry at that key. If nexting failed, call the `callback` function with an `Error`. Otherwise, call `callback` with `null`, a `key` and a `value`.

#### `iterator._seek(target)`

Seek the iterator to a given key or the closest key.

#### `iterator._end(callback)`

Free up underlying resources. This method is guaranteed to only be called once. If ending failed, call the `callback` function with an `Error`. Otherwise call `callback` without any arguments.

### `chainedBatch = AbstractChainedBatch(db)`

The first argument to this constructor must be an instance of your `AbstractLevelDOWN` implementation. The constructor will set `chainedBatch.db` which is used to access `db._serialize*` and ensures that `db` will not be garbage collected in case there are no other references to it.

#### `chainedBatch._put(key, value)`

Queue a `put` operation on this batch.

#### `chainedBatch._del(key)`

Queue a `del` operation on this batch.

#### `chainedBatch._clear()`

Clear all queued operations on this batch.

#### `chainedBatch._write(options, callback)`

The default `_write` method uses `db._batch`. If the `_write` method is overridden it must atomically commit the queued operations. There are no default options but `options` will always be an object. If committing fails, call the `callback` function with an `Error`. Otherwise call `callback` without any arguments.

## Test Suite

To prove that your implementation is `abstract-leveldown` compliant, include the abstract test suite in your `test.js` (or similar):

```js
const test = require('tape')
const suite = require('abstract-leveldown/test')
const YourDOWN = require('.')

suite({
  test: test,
  factory: function () {
    return new YourDOWN()
  }
})
```

This is the most minimal setup. The `test` option _must_ be a function that is API-compatible with `tape`. The `factory` option _must_ be a function that returns a unique and isolated database instance. The factory will be called many times by the test suite.

If your implementation is disk-based we recommend using [`tempy`](https://github.com/sindresorhus/tempy) (or similar) to create unique temporary directories. Your setup could look something like:

```js
const test = require('tape')
const tempy = require('tempy')
const suite = require('abstract-leveldown/test')
const YourDOWN = require('.')

suite({
  test: test,
  factory: function () {
    return new YourDOWN(tempy.directory())
  }
})
```

### Excluding tests

As not every implementation can be fully compliant due to limitations of its underlying storage, some tests may be skipped. For example, to skip snapshot tests:

```js
suite({
  // ..
  snapshots: false
})
```

This also serves as a signal to users of your implementation. The following options are available:

- `bufferKeys`: set to `false` if binary keys are not supported by the underlying storage
- `seek`: set to `false` if your `iterator` does not implement `_seek`
- `snapshots`: set to `false` if any of the following is true:
  - Reads don't operate on a [snapshot](#iterator)
  - Snapshots are created asynchronously
- `createIfMissing` and `errorIfExists`: set to `false` if `db._open()` does not support these options.

### Setup and teardown

To perform (a)synchronous work before or after each test, you may define `setUp` and `tearDown` functions:

```js
suite({
  // ..
  setUp: function (t) {
    t.end()
  },
  tearDown: function (t) {
    t.end()
  }
})
```

### Reusing `testCommon`

The input to the test suite is a `testCommon` object. Should you need to reuse `testCommon` for your own (additional) tests, use the included utility to create a `testCommon` with defaults:

```js
const test = require('tape')
const suite = require('abstract-leveldown/test')
const YourDOWN = require('.')

const testCommon = suite.common({
  test: test,
  factory: function () {
    return new YourDOWN()
  }
})

suite(testCommon)
```

The `testCommon` object will have all the properties describe above: `test`, `factory`, `setUp`, `tearDown` and the skip options. You might use it like so:

```js
test('setUp', testCommon.setUp)

test('custom test', function (t) {
  var db = testCommon.factory()
  // ..
})

test('another custom test', function (t) {
  var db = testCommon.factory()
  // ..
})

test('tearDown', testCommon.tearDown)
```

## Spread The Word

If you'd like to share your awesome implementation with the world, here's what you might want to do:

- Add an awesome badge to your `README`: `![level badge](https://leveljs.org/img/badge.svg)`
- Publish your awesome module to [npm](https://npmjs.org)
- Send a Pull Request to [Level/awesome](https://github.com/Level/awesome) to advertise your work!

## Install

With [npm](https://npmjs.org) do:

```
npm install abstract-leveldown
```

## Contributing

[`Level/abstract-leveldown`](https://github.com/Level/abstract-leveldown) is an **OPEN Open Source Project**. This means that:

> Individuals making significant and valuable contributions are given commit-access to the project to contribute as they see fit. This project is more like an open wiki than a standard guarded open source project.

See the [Contribution Guide](https://github.com/Level/community/blob/master/CONTRIBUTING.md) for more details.

## Big Thanks

Cross-browser Testing Platform and Open Source ♥ Provided by [Sauce Labs](https://saucelabs.com).

[![Sauce Labs logo](./sauce-labs.svg)](https://saucelabs.com)

## Donate

To sustain [`Level`](https://github.com/Level) and its activities, become a backer or sponsor on [Open Collective](https://opencollective.com/level). Your logo or avatar will be displayed on our 28+ [GitHub repositories](https://github.com/Level) and [npm](https://www.npmjs.com/) packages. 💖

### Backers

[![Open Collective backers](https://opencollective.com/level/backers.svg?width=890)](https://opencollective.com/level)

### Sponsors

[![Open Collective sponsors](https://opencollective.com/level/sponsors.svg?width=890)](https://opencollective.com/level)

## License

[MIT](LICENSE.md) © 2013-present Rod Vagg and [Contributors](CONTRIBUTORS.md).

[level-badge]: https://leveljs.org/img/badge.svg

[encoding-down]: https://github.com/Level/encoding-down

[leveldown]: https://github.com/Level/leveldown
