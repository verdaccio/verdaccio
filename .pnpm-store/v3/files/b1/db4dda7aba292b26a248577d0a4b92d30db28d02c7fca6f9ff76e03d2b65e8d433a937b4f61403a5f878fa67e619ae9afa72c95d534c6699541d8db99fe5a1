# add-stream [![Build Status](https://travis-ci.org/wilsonjackson/add-stream.svg?branch=master)](https://travis-ci.org/wilsonjackson/add-stream)

> Append the contents of one stream onto another.

## Usage

```js
var fs = require('fs');
var es = require('event-stream');
var addStream = require('add-stream');

// Append strings/buffers
fs.createReadStream('1.txt') // 1.txt contains: number1
	.pipe(addStream(fs.createReadStream('2.txt'))) // 2.txt contains: number2
	.pipe(fs.createWriteStream('appended.txt')); // appended.txt contains: number1number2

// Append object streams
es.readArray([1, 2, 3])
	.pipe(addStream.obj(es.readArray([4, 5, 6])))
	.pipe(es.writeArray(function (err, array) {
		console.log(array); // [ 1, 2, 3, 4, 5, 6 ]
	}));
```

## API

### var transformStream = addStream(stream, opts = {})

Create a transform stream that appends the contents of `stream` onto whatever
is piped into it. Options are passed to the transform stream's constructor.

### var transformStream = addStream.obj(stream, opts = {})

A convenient shortcut for `addStream(stream, {objectMode: true})`.

## License

MIT
