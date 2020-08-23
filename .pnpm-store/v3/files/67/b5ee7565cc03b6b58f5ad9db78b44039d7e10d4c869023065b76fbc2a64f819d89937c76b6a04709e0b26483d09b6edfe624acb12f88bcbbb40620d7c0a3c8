# prettier-bytes

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/prettier-bytes.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/prettier-bytes
[travis-image]: https://img.shields.io/travis/Flet/prettier-bytes.svg?style=flat-square
[travis-url]: https://travis-ci.org/Flet/prettier-bytes
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

Augment pretty-bytes to make the output a little more readable (and a little less precise)

Differences from `pretty-bytes`:
 - The fractional portion is rounded to one digit (ex: `2.1 MB`).
 - If there is more than one digit to the left of the decimal, the fractional portion is rounded off  (ex: `11 KB`).
 - Changed `kB` to `KB`, for more prettiness. Regular users are not likely to care about the technical difference.
 - No dependencies.

## Install

```
npm install prettier-bytes
```

## Usage

```js
var prettierBytes = require('prettier-bytes')

var pretty = prettierBytes(1337)
console.log(pretty)
// logs 1.3 kB
```

Examples from test output:
```bash
    ✔ bytes: 2 -> 2 B
    ✔ bytes: 9 -> 9 B
    ✔ bytes: 25 -> 25 B
    ✔ bytes: 235 -> 235 B
    ✔ bytes: 2335 -> 2.3 KB
    ✔ bytes: 23552 -> 24 KB
    ✔ bytes: 235520 -> 236 KB
    ✔ bytes: 2355520 -> 2.4 MB
    ✔ bytes: 23555520 -> 24 MB
    ✔ bytes: 235555520 -> 236 MB
    ✔ bytes: 2355555520 -> 2.4 GB
    ✔ bytes: 23555555520 -> 24 GB
    ✔ bytes: 235556555520 -> 236 GB
    ✔ bytes: 2355556655520 -> 2.4 TB
    ✔ bytes: 23555566655520 -> 24 TB
    ✔ bytes: 235555566665520 -> 236 TB
```

## Contributing

Contributions welcome! Please read the [contributing guidelines](CONTRIBUTING.md) first.

## License

[ISC](LICENSE)
