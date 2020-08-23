# conventional-commits-filter [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> Filter out reverted commits parsed by conventional-commits-parser


## Install

```sh
$ npm install --save conventional-commits-filter
```


## Usage

```js
var conventionalCommitsFilter = require('conventional-commits-filter');

var commits = [{
  type: 'revert',
  scope: null,
  subject: 'feat(): amazing new module',
  header: 'revert: feat(): amazing new module\n',
  body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.\n',
  footer: null,
  notes: [],
  references: [],
  revert: {
    header: 'feat(): amazing new module',
    hash: '56185b7356766d2b30cfa2406b257080272e0b7a',
    body: null
  },
  hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n',
  raw: {
    type: 'revert',
    scope: null,
    subject: 'feat(): amazing new module',
    header: 'revert: feat(): amazing new module\n',
    body: 'This reverts commit 56185b7356766d2b30cfa2406b257080272e0b7a.\n',
    footer: null,
    notes: [],
    references: [],
    revert: {
      header: 'feat(): amazing new module',
      hash: '56185b7356766d2b30cfa2406b257080272e0b7a',
      body: null
    },
    hash: '789d898b5f8422d7f65cc25135af2c1a95a125ac\n'
  }
}, {
  type: 'Features',
  scope: null,
  subject: 'wow',
  header: 'amazing new module\n',
  body: null,
  footer: 'BREAKING CHANGE: Not backward compatible.\n',
  notes: [],
  references: [],
  revert: null,
  hash: '56185b',
  raw: {
    type: 'feat',
    scope: null,
    subject: 'amazing new module',
    header: 'feat(): amazing new module\n',
    body: null,
    footer: 'BREAKING CHANGE: Not backward compatible.\n',
    notes: [],
    references: [],
    revert: null,
    hash: '56185b7356766d2b30cfa2406b257080272e0b7a\n'
  }
}, {
  type: 'What',
  scope: null,
  subject: 'new feature',
  header: 'feat(): new feature\n',
  body: null,
  footer: null,
  notes: [],
  references: [],
  revert: null,
  hash: '815a3f0',
  raw: {
    type: 'feat',
    scope: null,
    subject: 'new feature',
    header: 'feat(): new feature\n',
    body: null,
    footer: null,
    notes: [],
    references: [],
    revert: null,
    hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n'
  }
}, {
  type: 'Chores',
  scope: null,
  subject: 'first commit',
  header: 'chore: first commit\n',
  body: null,
  footer: null,
  notes: [],
  references: [],
  revert: null,
  hash: '74a3e4d6d25',
  raw: {
    type: 'chore',
    scope: null,
    subject: 'first commit',
    header: 'chore: first commit\n',
    body: null,
    footer: null,
    notes: [],
    references: [],
    revert: null,
    hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n'
  }
}];

commits = conventionalCommitsFilter(commits);
console.log(commits);
/*=>
[{
  type: 'What',
  scope: null,
  subject: 'new feature',
  header: 'feat(): new feature\n',
  body: null,
  footer: null,
  notes: [],
  references: [],
  revert: null,
  hash: '815a3f0',
  raw: {
    type: 'feat',
    scope: null,
    subject: 'new feature',
    header: 'feat(): new feature\n',
    body: null,
    footer: null,
    notes: [],
    references: [],
    revert: null,
    hash: '815a3f0717bf1dfce007bd076420c609504edcf3\n'
  }
}, {
  type: 'Chores',
  scope: null,
  subject: 'first commit',
  header: 'chore: first commit\n',
  body: null,
  footer: null,
  notes: [],
  references: [],
  revert: null,
  hash: '74a3e4d6d25',
  raw: {
    type: 'chore',
    scope: null,
    subject: 'first commit',
    header: 'chore: first commit\n',
    body: null,
    footer: null,
    notes: [],
    references: [],
    revert: null,
    hash: '74a3e4d6d25dee2c0d6483a0a3887417728cbe0a\n'
  }
}]
*/
```

## License

MIT © [Steve Mao]()


[npm-image]: https://badge.fury.io/js/conventional-commits-filter.svg
[npm-url]: https://npmjs.org/package/conventional-commits-filter
[travis-image]: https://travis-ci.org/stevemao/conventional-commits-filter.svg?branch=master
[travis-url]: https://travis-ci.org/stevemao/conventional-commits-filter
[daviddm-image]: https://david-dm.org/stevemao/conventional-commits-filter.svg
[daviddm-url]: https://david-dm.org/stevemao/conventional-commits-filter
[coveralls-image]: https://coveralls.io/repos/stevemao/conventional-commits-filter/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/stevemao/conventional-commits-filter
