# modify-values [![Build Status](https://travis-ci.org/sindresorhus/modify-values.svg?branch=master)](https://travis-ci.org/sindresorhus/modify-values)

> Modify the values of an object


## Install

```
$ npm install --save modify-values
```


## Usage

```js
var modifyValues = require('modify-values');

modifyValues({foo: 'UNICORN'}, function (value, key) {
	return value.toLowerCase();
});
//=> {foo: 'unicorn'}
```


## API

### modifyValues(input, modifier)

Modifies the values and returns a new object.

#### input

*Required*  
Type: `object`

#### modifier(value, key)

*Required*  
Type: `function`

Gets the value and key for each item and is expected to return the new value.


## Related

See [`modify-keys`](https://github.com/sindresorhus/modify-keys) for modifying the keys of an object.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
