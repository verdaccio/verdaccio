# apache-md5
[Node.js](http://nodejs.org/) package for Apache style password encryption using md5..

[![Build Status](https://api.travis-ci.org/http-auth/apache-md5.png)](https://travis-ci.org/http-auth/apache-md5)

## Installation

Via git (or downloaded tarball):

```bash
$ git clone git://github.com/http-auth/apache-md5.git
```
Via [npm](http://npmjs.org/):

```bash
$ npm install apache-md5
```

## Usage

```javascript
var md5 = require("apache-md5");

// Encrypting password using apache's md5 algorithm.
var encryptedPassword = md5("mypass");

// Should print true.
console.log(md5("mypass", encryptedPassword) == encryptedPassword);
// Should print false.
console.log(md5("notmypass", encryptedPassword) == encryptedPassword);
```

## Running tests

It uses [mocha](https://mochajs.org/), so just run following command in package directory:

```bash
$ npm test
```

## Issues

You can find list of issues using **[this link](http://github.com/http-auth/apache-md5/issues)**.

## Requirements

 - **[Node.js](http://nodejs.org)** - Event-driven I/O server-side JavaScript       environment based on V8.
 - **[npm](http://npmjs.org)** - Package manager. Installs, publishes and manages   node programs.

## Development dependencies

 - **[mocha](https://mochajs.org/)** - simple, flexible, fun javascript test framework for node.js & the browser.
 - **[chai](http://chaijs.com/)** - BDD / TDD assertion framework for node.js and the browser that can be paired with any testing framework.

## License

The MIT License (MIT)

Copyright (c) 2016 Gevorg Harutyunyan

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
