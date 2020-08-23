
[![Build Status](https://api.travis-ci.org/adaltas/node-csv-stringify.svg)](https://travis-ci.org/#!/adaltas/node-csv-stringify)

This package is a stringifier converting records into a CSV text and
implementing the Node.js [`stream.Transform`
API](https://nodejs.org/api/stream.html). It also provides the easier
synchronous and callback-based APIs for conveniency. It is both extremely easy
to use and powerful. It was first released in 2010 and is tested against big
data sets by a large community.

## Documentation

* [Project homepage](http://csv.js.org/stringify/)
* [API](http://csv.js.org/stringify/api/)
* [Options](http://csv.js.org/stringify/options/)
* [Examples](http://csv.js.org/stringify/examples/)

## Main features

* Follow the Node.js streaming API
* Simplicity with the optional callback API
* Support for custom formatters, delimiters, quotes, escape characters and header
* Support big datasets
* Complete test coverage and samples for inspiration
* Only 1 external dependency
* to be used conjointly with `csv-generate`, `csv-parse` and `stream-transform`
* MIT License

## Usage

The module is built on the Node.js Stream API. For the sake of simplicity, a
simple callback API is also provided. To give you a quick look, here's an
example of the callback API:

```javascript
var stringify = require('csv-stringify');

input = [ [ '1', '2', '3', '4' ], [ 'a', 'b', 'c', 'd' ] ];
stringify(input, function(err, output){
  output.should.eql('1,2,3,4\na,b,c,d\n');
});
```

## Development

Tests are executed with mocha. To install it, run `npm install` followed by `npm
test`. It will install mocha and its dependencies in your project "node_modules"
directory and run the test suite. The tests run against the CoffeeScript source
files.

To generate the JavaScript files, run `npm run build`.

The test suite is run online with
[Travis](https://travis-ci.org/#!/adaltas/node-csv-stringify). See the [Travis
definition
file](https://github.com/adaltas/node-csv-stringify/blob/master/.travis.yml) to
view the tested Node.js version.

## Contributors

*   David Worms: <https://github.com/wdavidw>

[csv_home]: https://github.com/adaltas/node-csv
[stream_transform]: http://nodejs.org/api/stream.html#stream_class_stream_transform
[examples]: http://csv.js.org/stringify/examples/
[csv]: https://github.com/adaltas/node-csv
