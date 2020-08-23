
# Node.js mixme

[![Build Status](https://secure.travis-ci.org/adaltas/node-mixme.png)](http://travis-ci.org/adaltas/node-mixme)

Merge multiple object recursively. The last object takes precedence over the 
previous ones. Only objects are merged. Arrays are overwritten.

## API

### Function `merge(...data)`

The API is minimalist, pass as many literal objects as you wish, they will all be
merged. This function is immutable, the source objects won't be altered.

```js
const {merge} = require('mixme')
const target = merge({a: '1'}, {b: '2'});
// target is {a: '1', b: '2'}
```

### Function `mutate(...data)`

Use the `mutate` function to enrich an object. The first argument will be mutated:

```js
const {mutate} = require('mixme')
const source = {a: '1'};
const target = mutate(source, {b: '2'});
// target is the same as source
// source and target are now {a: '1', b: '2'}
```

### Function `clone(data)`

It is possible to clone a literal object by simply calling `mixme` with this object as the first argument. Use the `clone` function in case you wish to clone any type of argument including arrays:

```js
const clone = require('clone')
const target = mixme.clone(['a', 'b'])
// target is now a copy of source
```

### Function `is_object_literal(object)`

Use the `is_object_literal` function to ensure an object is literate.

```js
const is_object_literal = require('mixme')
// {} is literate
is_object_literal({})
// error is not literate
is_object_literal(new Error('Catch me'))
// Array is not literate
is_object_literal([])
```

### Function `snake_case(object)`

Clone a object and convert its properties into snake case.

```js
const snake_case = require('mixme')
const target = snake_case({aA: '1', bB: cC: '2'})
// target is now {a_a: '1', b_b: c_c: '2'}
```

## Example

Create a new object from two objects:

```
obj1 = { a_key: 'a value', b_key: 'b value'}
obj2 = { b_key: 'new b value'}
result = misc.merge obj1, obj2
assert.eql result.b_key, 'new b value'
```

Merge an existing object with a second one:

```
obj1 = { a_key: 'a value', b_key: 'b value'};
obj2 = { b_key: 'new b value'};
result = mixme.mutate obj1, obj2
assert.eql result, obj1
assert.eql obj1.b_key, 'new b value'
```

## Testing

Clone the repo, install the development dependencies and run the tests:

```bash
git clone http://github.com/wdavidw/node-mixme.git .
npm install
make test
```

## Contributors

*   David Worms: <https://github.com/wdavidw>

This package is developed by [Adaltas](http://www.adaltas.com).
