# parse-github-repo-url

> Parse a GitHub URL for user/project@version

[![Build Status](https://travis-ci.org/repo-utils/parse-github-repo-url.svg?branch=master)](https://travis-ci.org/repo-utils/parse-github-repo-url)
[![semantic-release][semantic-image] ][semantic-url]

[semantic-image]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-url]: https://github.com/semantic-release/semantic-release

# Features

Parse all the stupid ways you could write a GitHub URL in your damn `package.json`.
Supports:

- `<user>/<repo#<commit>`
- `git://` and `.git` w/ `#commit` or `@version`
- `git@` and `https:git@`
- `www.github.com`
- `gitlab.<my company name>.com/user/repo.git` parsing
- All 5 different ways you could download a freaking tarball/zipball

## API

### [user, repo, version] = parse(url)

`version` could be `false`y, a semantic version, a commit, or a branch, etc.

```js
var parse = require('parse-github-repo-url')
parse('component/emitter#1') // => ['component', 'emitter', '1']
```

See the tests for all the different types of supported URLs.
