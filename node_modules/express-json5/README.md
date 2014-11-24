json/json5 body parsing middleware

## API

```js
var express_json5 = require('express_json5')

var app = express()

app.use(express_json5())

app.use(function (req, res, next) {
  console.log(req.body) // populated!
  next()
})
```

### express\_json5([options])

Returns middleware that parses both `json` and `json5`. The options are:

- `strict` (true) - only parse objects and arrays
- `limit` (1mb) - maximum request body size
- `reviver` - passed to `JSON.parse()`

## License

The MIT License (MIT)

Copyright (c) 2014 Alex Kocharin, alex@kocharin.ru

Forked from https://github.com/expressjs/body-parser:

Copyright (c) 2014 Jonathan Ong me@jongleberry.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

