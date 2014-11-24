# ES6 Shim
Provides compatibility shims so that legacy JavaScript engines behave as
closely as possible to ECMAScript 6 (Harmony).

[![Build Status][1]][2] [![dependency status][3]][4] [![dev dependency status][5]][6]

[![browser support](https://ci.testling.com/paulmillr/es6-shim.png)](https://ci.testling.com/paulmillr/es6-shim)

[![Sauce Test Status](https://saucelabs.com/browser-matrix/es6-shim.svg)](https://saucelabs.com/u/es6-shim)

## Installation
If you want to use it in browser:

* Just include es6-shim before your scripts.
* Include [es5-shim](https://github.com/kriskowal/es5-shim) if your browser doesn't support ECMAScript 5.
* `component install paulmillr/es6-shim` if you’re using [component(1)](https://github.com/component/component).
* `bower install es6-shim` if you’re using [Twitter Bower](http://bower.io/).

For node.js:

    npm install es6-shim

In both browser and node you may also want to include `unorm`; see the
[`String.prototype.normalize`](#stringprototypenormalize) section for
details.

## Safe shims

* `Map`, `Set` (requires ES5)
* `Promise`
* `String`:
    * `fromCodePoint()` ([a standalone shim is also available](http://mths.be/fromcodepoint))
    * `raw()`
* `String.prototype`:
    * `codePointAt()` ([a standalone shim is also available](http://mths.be/codepointat))
    * `repeat()` ([a standalone shim is also available](http://mths.be/repeat))
    * `startsWith()` ([a standalone shim is also available](http://mths.be/startswith))
    * `endsWith()` ([a standalone shim is also available](http://mths.be/endswith))
    * `includes()` ([a standalone shim is also available](http://mths.be/includes))
* `Number`:
    * `MAX_SAFE_INTEGER`
    * `MIN_SAFE_INTEGER`
    * `EPSILON`
    * `parseInt()`
    * `parseFloat()`
    * `isNaN()`([a standalone shim is also available](https://npmjs.org/package/is-nan))
    * `isInteger()`
    * `isSafeInteger()`
    * `isFinite()`
* `Array`:
    * `from()` ([a standalone shim is also available](https://npmjs.org/package/array.from))
    * `of()` ([a standalone shim is also available](https://npmjs.org/package/array.of))
* `Array.prototype`:
    * `copyWithin()`
    * `fill()`
    * `find()` ([a standalone shim is also available](https://github.com/paulmillr/Array.prototype.find))
    * `findIndex()` ([a standalone shim is also available](https://github.com/paulmillr/Array.prototype.findIndex))
    * `keys()` (note: keys/values/entries return an `ArrayIterator` object)
    * `entries()`
    * `values()`
* `Object`:
    * `getPropertyDescriptor()` (ES5)
    * `getPropertyNames()` (ES5)
    * `getPropertyKeys()` (ES5)
    * `keys()` (ES5, but no longer throws on non-object non-null/undefined values in ES6)
    * `is()` ([a standalone shim is also available](https://github.com/ljharb/object-is))
    * `assign()` ([a standalone shim is also available](https://github.com/ljharb/object.assign))
    * `setPrototypeOf()` (IE >= 11)
* `Math`:
    * `acosh()`
    * `asinh()`
    * `atanh()`
    * `cbrt()`
    * `clz32()`
    * `cosh()`
    * `expm1()`
    * `hypot()`
    * `log2()`
    * `log10()`
    * `log1p()`
    * `sign()`
    * `sinh()`
    * `tanh()`
    * `trunc()`
    * `imul()`
    * `fround()`

Math functions accuracy is 1e-11.

## Subclassing
The `Map`, `Set`, and `Promise` implementations are subclassable.
You should use the following pattern to create a subclass in ES5 which
will continue to work in ES6:
```javascript
function MyPromise(exec) {
  Promise.call(this, exec);
  // ...
}
Object.setPrototypeOf(MyPromise, Promise);
MyPromise.prototype = Object.create(Promise.prototype, {
  constructor: { value: MyPromise }
});
```

## String.prototype.normalize
Including a proper shim for `String.prototype.normalize` would
increase the size of this library by a factor of more than 4.
So instead we recommend that you install the
[`unorm`](https://github.com/walling/unorm)
package alongside `es6-shim` if you need `String.prototype.normalize`.
See https://github.com/paulmillr/es6-shim/issues/134 for more
discussion.


## WeakMap shim
It is not possible to implement WeakMap in pure javascript.
The [es6-collections](https://github.com/WebReflection/es6-collections)
implementation doesn't hold values strongly, which is critical
for the collection. es6-shim decided to not include an incorrect shim.

WeakMap has a very unusual use-case so you probably won't need it at all
(use simple `Map` instead).

## Getting started

```javascript
'abc'.startsWith('a') // true
'abc'.endsWith('a') // false
'john alice'.includes('john') // true
'123'.repeat(2)     // '123123'

Object.is(NaN, NaN) // Fixes ===. 0 isnt -0, NaN is NaN
Object.assign({a: 1}, {b: 2}) // {a: 1, b: 2}

Number.isNaN('123') // false. isNaN('123') will give true.
Number.isFinite('asd') // false. Global isFinite() will give true.
// Tests if value is a number, finite,
// >= -9007199254740992 && <= 9007199254740992 and floor(value) === value
Number.isInteger(2.4) // false.

Math.sign(400) // 1, 0 or -1 depending on sign. In this case 1.

[5, 10, 15, 10].find(function (item) {return item / 2 === 5;}) // 10
[5, 10, 15, 10].findIndex(function (item) {return item / 2 === 5;}) // 1

// Replacement for `{}` key-value storage.
// Keys can be anything.
var map = new Map()
map.set('John', 25)
map.set('Alice', 400)
map.set(['meh'], 555)
map.get(['meh']) // undefined because you need to use exactly the same object.
map.delete('Alice')
map.keys()
map.values()
map.size // 2

// Useful for storing unique items.
var set = new Set()
set.add(1)
set.add(5)
set.has(1)
set.has(4)  // => false
set.delete(5)

// Promises, see
// http://www.slideshare.net/domenicdenicola/callbacks-promises-and-coroutines-oh-my-the-evolution-of-asynchronicity-in-javascript
// https://github.com/petkaantonov/bluebird/#what-are-promises-and-why-should-i-use-them
Promise.resolve(5).then(function (value) {
  if ( ... ) throw new Error("whoops!");
  // do some stuff
  return anotherPromise();
}).catch(function (e) {
  // any errors thrown asynchronously end up here
});
```

Other stuff:

* [ECMAScript 6 drafts](http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts)
* [Harmony proposals](http://wiki.ecmascript.org/doku.php?id=harmony:harmony)

## License
The project was initially based on [es6-shim by Axel Rauschmayer](https://github.com/rauschma/es6-shim).

Current maintainers are: [Paul Miller](http://paulmillr.com), [Jordan Harband](https://github.com/ljharb), and [C. Scott Ananian](http://cscott.net).

The MIT License (MIT)

Copyright (c) 2013-2014 Paul Miller (http://paulmillr.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[1]: https://travis-ci.org/paulmillr/es6-shim.svg
[2]: https://travis-ci.org/paulmillr/es6-shim
[3]: https://david-dm.org/paulmillr/es6-shim.svg
[4]: https://david-dm.org/paulmillr/es6-shim
[5]: https://david-dm.org/paulmillr/es6-shim/dev-status.svg
[6]: https://david-dm.org/paulmillr/es6-shim#info=devDependencies

