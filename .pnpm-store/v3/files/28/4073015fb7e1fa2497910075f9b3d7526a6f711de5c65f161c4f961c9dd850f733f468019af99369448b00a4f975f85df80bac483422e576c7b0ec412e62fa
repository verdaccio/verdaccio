#  [![NPM version][npm-image]][npm-url] [![Build Status: Linux][travis-image]][travis-url] [![Build Status: Windows][appveyor-image]][appveyor-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Configuration preset loader for `conventional-changelog`.

## Usage

```sh
$ npm install --save conventional-changelog-preset-loader
```

```js
var conventionalChangelogPresetLoader = require('conventional-changelog-preset-loader');

configuration = conventionalChangelogPresetLoader(`angular`);
```


The string that is passed to the preset loader is manipulated by prepending `conventional-changelog` to the name.

For example:
* `angular` => `conventional-changelog-angular`
* `angular/preset/path` => `conventional-changelog-angular/preset/path`
* `@scope/angular` => `@scope/conventional-changelog-angular`
* `@scope/angular/preset/path` => `@scope/conventional-changelog-angular/preset/path`

Will return whatever is exported by the preset package. That may be a configuration object, a function, or a promise.

## License

MIT © [Steve Mao](https://github.com/stevemao)

[npm-image]: https://badge.fury.io/js/conventional-changelog-preset-loader.svg
[npm-url]: https://npmjs.org/package/conventional-changelog-preset-loader
[travis-image]: https://travis-ci.org/conventional-changelog/conventional-changelog-preset-loader.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/conventional-changelog-preset-loader
[appveyor-image]: https://ci.appveyor.com/api/projects/status/baoumm34w8c5o0hv/branch/master?svg=true
[appveyor-url]: https://ci.appveyor.com/project/stevemao/conventional-changelog-preset-loader/branch/master
[daviddm-image]: https://david-dm.org/conventional-changelog/conventional-changelog-preset-loader.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/conventional-changelog/conventional-changelog-preset-loader
[coveralls-image]: https://coveralls.io/repos/conventional-changelog/conventional-changelog-preset-loader/badge.svg
[coveralls-url]: https://coveralls.io/r/conventional-changelog/conventional-changelog-preset-loader
