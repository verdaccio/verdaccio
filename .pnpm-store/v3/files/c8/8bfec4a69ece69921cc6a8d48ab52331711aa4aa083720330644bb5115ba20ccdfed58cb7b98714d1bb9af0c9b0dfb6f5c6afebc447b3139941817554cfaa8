# matcher [![Build Status](https://travis-ci.org/sindresorhus/matcher.svg?branch=master)](https://travis-ci.org/sindresorhus/matcher)

> Simple [wildcard](https://en.wikipedia.org/wiki/Wildcard_character) matching

Useful when you want to accept loose string input and regexes/globs are too convoluted.


## Install

```
$ npm install matcher
```


## Usage

```js
const matcher = require('matcher');

matcher(['foo', 'bar', 'moo'], ['*oo', '!foo']);
//=> ['moo']

matcher(['foo', 'bar', 'moo'], ['!*oo']);
//=> ['bar']

matcher.isMatch('unicorn', 'uni*');
//=> true

matcher.isMatch('unicorn', '*corn');
//=> true

matcher.isMatch('unicorn', 'un*rn');
//=> true

matcher.isMatch('rainbow', '!unicorn');
//=> true

matcher.isMatch('foo bar baz', 'foo b* b*');
//=> true

matcher.isMatch('unicorn', 'uni\\*');
//=> false

matcher.isMatch('UNICORN', 'UNI*', {caseSensitive: true});
//=> true

matcher.isMatch('UNICORN', 'unicorn', {caseSensitive: true});
//=> false
```


## API

### matcher(inputs, patterns, [options])

Accepts an array of `input`'s and `pattern`'s.

Returns an array of `inputs` filtered based on the `patterns`.

### matcher.isMatch(input, pattern, [options])

Returns a boolean of whether the `input` matches the `pattern`.

#### input

Type: `string`

String to match.

#### options

Type: `Object`

##### caseSensitive

Type: `boolean`<br>
Default: `false`

Treat uppercase and lowercase characters as being the same.

Ensure you use this correctly. For example, files and directories should be matched case-insensitively, while most often, object keys should be matched case-sensitively.

#### pattern

Type: `string`

Use `*` to match zero or more characters. A pattern starting with `!` will be negated.


## Benchmark

```
$ npm run bench
```


## Related

- [multimatch](https://github.com/sindresorhus/multimatch) - Extends `minimatch.match()` with support for multiple patterns


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
