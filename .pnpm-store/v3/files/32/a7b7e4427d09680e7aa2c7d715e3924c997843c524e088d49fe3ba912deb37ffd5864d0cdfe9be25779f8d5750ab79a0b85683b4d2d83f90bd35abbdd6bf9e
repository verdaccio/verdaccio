[![Build Status](https://api.travis-ci.org/adaltas/node-stream-transform.svg)](https://travis-ci.org/#!/adaltas/node-stream-transform)

Part of the [CSV module](https://csv.js.org/), this project is a simple object transformation framework. It implements the Node.js [`stream.Transform` API](http://nodejs.org/api/stream.html#stream_class_stream_transform). It also provides a simple callback-based API for convenience. It is both extremely easy to use and powerful.

## Documentation

* [Project homepage](http://csv.js.org/transform/)
* [API](http://csv.js.org/transform/api/)
* [Options](http://csv.js.org/transform/options/)
* [Handler](http://csv.js.org/transform/handler/)
* [State properties](http://csv.js.org/transform/state/)
* [Examples](http://csv.js.org/transform/examples/)

## Features

* Extends the native Node.js [transform stream API](http://nodejs.org/api/stream.html#stream_class_stream_transform)
* Simplicity with the optional callback and sync API
* Pipe transformations between readable and writable streams
* Synchronous versus asynchronous user functions
* Sequential and parallel execution
* Accept object, array or JSON as input and output
* Sequential or user-defined concurrent execution
* Skip and multiply records
* Alter or clone input records
* MIT License

## Usage

The module is built on the Node.js Stream API. For the sake of simplify, a simple callback API is also provided. To give you a quick look, here's an example of the callback API:

```javascript
var transform = require('stream-transform');

input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];
transform(input, function(data){
  data.push(data.shift());
  return data.join(',')+'\n';
}, function(err, output){
  output.should.eql([ '2,3,4,1\n', 'b,c,d,a\n' ]);
});
```

## Development

Tests are executed with mocha. To install it, simple run `npm install` followed by `npm test`. It will install mocha and its dependencies in your project "node_modules" directory and run the test suite. The tests run against the CoffeeScript source files.

To generate the JavaScript files, run `npm run coffee`.

The test suite is run online with [Travis](http://travis-ci.org/wdavidw/node-stream-transform). See the [Travis definition file](https://github.com/adaltas/node-stream-transform/blob/master/.travis.yml) to view the tested Node.js version.
