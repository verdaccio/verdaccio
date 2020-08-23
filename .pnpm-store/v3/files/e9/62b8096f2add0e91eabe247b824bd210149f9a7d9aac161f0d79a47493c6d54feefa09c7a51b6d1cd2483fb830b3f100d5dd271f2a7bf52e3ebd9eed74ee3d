#  [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage Status][coveralls-image]][coveralls-url]

> Write logs based on conventional commits and templates

## Install

```sh
$ npm install --save conventional-changelog-writer
```

## Usage

```js
var conventionalChangelogWriter = require('conventional-changelog-writer');

conventionalChangelogWriter(context, options);
```

It returns a transform stream.

It expects an object mode upstream that looks something like this:

```js
{ hash: '9b1aff905b638aa274a5fc8f88662df446d374bd',
  header: 'feat(scope): broadcast $destroy event on scope destruction',
  type: 'feat',
  scope: 'scope',
  subject: 'broadcast $destroy event on scope destruction',
  body: null,
  footer: 'Closes #1',
  notes: [],
  references: [ { action: 'Closes', owner: null, repository: null, issue: '1', raw: '#1' } ] }
{ hash: '13f31602f396bc269076ab4d389cfd8ca94b20ba',
  header: 'feat(ng-list): Allow custom separator',
  type: 'feat',
  scope: 'ng-list',
  subject: 'Allow custom separator',
  body: 'bla bla bla',
  footer: 'BREAKING CHANGE: some breaking change',
  notes: [ { title: 'BREAKING CHANGE', text: 'some breaking change' } ],
  references: [] }
```

Each chunk should be a commit. Json object is also **valid**. Parts of the objects will be formatted and combined into a log based on the handlebars context, templates and options.

The downstream might look something like this:

```js
## 0.0.1 "this is a title" (2015-05-29)


### Features

* **ng-list:** Allow custom separator ([13f3160](https://github.com/a/b/commits/13f3160))
* **scope:** broadcast $destroy event on scope destruction ([9b1aff9](https://github.com/a/b/commits/9b1aff9)), closes [#1](https://github.com/a/b/issues/1)


### BREAKING CHANGES

* some breaking change
```


## API

### conventionalChangelogWriter([context, [options]])

Returns a transform stream.

#### context

Variables that will be interpolated to the template. This object contains, but not limits to the following fields.

##### version

Type: `string`

Version number of the up-coming release. If `version` is found in the last commit before generating logs, it will be overwritten.

##### title

Type: `string`

##### isPatch

Type: `boolean` Default: `semver.patch(context.version) !== 0`

By default, this value is true if `version`'s patch is `0`.

##### host

Type: `string`

The hosting website. Eg: `'https://github.com'` or `'https://bitbucket.org'`

##### owner

Type: `string`

The owner of the repository. Eg: `'stevemao'`.

##### repository

Type: `string`

The repository name on `host`. Eg: `'conventional-changelog-writer'`.

##### repoUrl

Type: `string`

The whole repository url. Eg: `'https://github.com/conventional-changelog/conventional-changelog-writer'`.
The should be used as a fallback when `context.repository` doesn't exist.

##### linkReferences

Type: `boolean` Default: `true` if (`context.repository` or `context.repoUrl`), `context.commit` and `context.issue` are truthy

Should all references be linked?

##### commit

Type: `string` Default: `'commits'`

Commit keyword in the url if `context.linkReferences === true`.

##### issue

Type: `string` Default: `'issues'`

Issue or pull request keyword in the url if `context.linkReferences === true`.

##### date

Type: `string` Default: `dateFormat(new Date(), 'yyyy-mm-dd', true)`

Default to formatted (`'yyyy-mm-dd'`) today's date. [dateformat](https://github.com/felixge/node-dateformat) is used for formatting the date. If `version` is found in the last commit, `committerDate` will overwrite this.

#### options

Type: `object`

##### transform

Type: `object` or `function` Default: get the first 7 digits of hash, and `committerDate` will be formatted as `'yyyy-mm-dd'`.

Replace with new values in each commit.

If this is an object, the keys are paths to a nested object property. the values can be a string (static) and a function (dynamic) with the old value and path passed as arguments. This value is merged with your own transform object.

If this is a function, the commit chunk will be passed as the argument and the returned value would be the new commit object. This is a handy function if you can't provide a transform stream as an upstream of this one. If returns a falsy value this commit is ignored.

a `raw` object that is originally poured form upstream is attached to `commit`.

##### groupBy

Type: `string` Default: `'type'`

How to group the commits. EG: based on the same type. If this value is falsy, commits are not grouped.

##### commitGroupsSort

Type: `function`, `string` or `array`

A compare function used to sort commit groups. If it's a string or array, it sorts on the property(ies) by `localeCompare`. Will not sort if this is a falsy value.

The string can be a dot path to a nested object property.

##### commitsSort

Type: `function`, `string` or `array` Default: `'header'`

A compare function used to sort commits. If it's a string or array, it sorts on the property(ies) by `localeCompare`. Will not sort if this is a falsy value.

The string can be a dot path to a nested object property.

##### noteGroupsSort

Type: `function`, `string` or `array` Default: `'title'`

A compare function used to sort note groups. If it's a string or array, it sorts on the property(ies) by `localeCompare`. Will not sort if this is a falsy value.

The string can be a dot path to a nested object property.

##### notesSort

Type: `function`, `string` or `array` Default: `'text'`

A compare function used to sort note groups. If it's a string or array, it sorts on the property(ies) by `localeCompare`. Will not sort if this is a falsy value.

The string can be a dot path to a nested object property.

##### generateOn

Type: `function`, `string` or `any` Default: if `commit.version` is a valid semver.

When the upstream finishes pouring the commits it will generate a block of logs if `doFlush` is `true`. However, you can generate more than one block based on this criteria (usually a version) even if there are still commits from the upstream.

###### generateOn(commit, commits, context, options)

####### commit

Current commit.

####### commits

Current collected commits.

####### context

The generated context based on original input `context` and `options`.

####### options

Normalized options.

**NOTE**: It checks on the transformed commit chunk instead of the original one (you can check on the original by access the `raw` object on the `commit`). However, if the transformed commit is ignored it falls back to the original commit.

If this value is a `string`, it checks the existence of the field. Set to other type to disable it.

##### finalizeContext

Type: `function` Default: pass through

Last chance to modify your context before generating a changelog.

###### finalizeContext(context, options, commits, keyCommit)

####### context

The generated context based on original input `context` and `options`.

####### options

Normalized options.

####### commits

Filtered commits from your git metadata.

####### keyCommit

The commit that triggers to generate the log.

##### debug

Type: `function` Default: `function() {}`

A function to get debug information.

##### reverse

Type: `boolean` Default: `false`

The normal order means reverse chronological order. `reverse` order means chronological order. Are the commits from upstream in the reverse order? You should only worry about this when generating more than one blocks of logs based on `generateOn`. If you find the last commit is in the wrong block inverse this value.

##### includeDetails

Type: `boolean` Default: `false`

If this value is `true`, instead of emitting strings of changelog, it emits objects containing the details the block.

*NOTE:* The downstream must be in object mode if this is `true`.

##### ignoreReverted

Type: `boolean` Default: `true`

If `true`, reverted commits will be ignored.

##### doFlush

Type: `boolean` Default: `true`

If `true`, the stream will flush out the last bit of commits (could be empty) to changelog.

##### mainTemplate

Type: `string` Default: [template.hbs](templates/template.hbs)

The main handlebars template.

##### headerPartial

Type: `string` Default: [header.hbs](templates/header.hbs)

##### commitPartial

Type: `string` Default: [commit.hbs](templates/commit.hbs)

##### footerPartial

Type: `string` Default: [footer.hbs](templates/footer.hbs)

##### partials

Type: `object`

Partials that used in the main template, if any. The key should be the partial name and the value should be handlebars template strings. If you are using handlebars template files, read files by yourself.


## Customization Guide

It is possible to customize this the changelog to suit your needs. Templates are written in [handlebars](http://handlebarsjs.com). You can customize all partials or the whole template. Template variables are from either `upstream` or `context`. The following are a suggested way of defining variables.

### upstream

Variables in upstream are commit specific and should be used per commit. Eg: *commit date* and *commit username*. You can think of them as "local" or "isolate" variables. A "raw" commit message (original commit poured from upstream) is attached to `commit`. `transform` can be used to modify a commit.

### context

context should be module specific and can be used across the whole log. Thus these variables should not be related to any single commit and should be generic information of the module or all commits. Eg: *repository url* and *author names*, etc. You can think of them as "global" or "root" variables.

Basically you can make your own templates and define all your template context. Extra context are based on commits from upstream and `options`. For more details, please checkout [handlebars](http://handlebarsjs.com) and the source code of this module. `finalizeContext` can be used at last to modify context before generating a changelog.


## CLI

```sh
$ npm install --global conventional-changelog-writer
$ conventional-changelog-writer --help # for more details
```

It works with [Line Delimited JSON](http://en.wikipedia.org/wiki/Line_Delimited_JSON).

If you have commits.ldjson

```js
{"hash":"9b1aff905b638aa274a5fc8f88662df446d374bd","header":"feat(ngMessages): provide support for dynamic message resolution","type":"feat","scope":"ngMessages","subject":"provide support for dynamic message resolution","body":"Prior to this fix it was impossible to apply a binding to a the ngMessage directive to represent the name of the error.","footer":"BREAKING CHANGE: The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.\nCloses #10036\nCloses #9338","notes":[{"title":"BREAKING CHANGE","text":"The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive."}],"references":[{"action":"Closes","owner",null,"repository":null,"issue":"10036","raw":"#10036"},{"action":"Closes","owner":null,"repository":null,"issue":"9338","raw":"#9338"}]}
```

And you run

```sh
$ conventional-changelog-writer commits.ldjson -o options.js
```

The output might look something like this

```md
# 1.0.0 (2015-04-09)


### Features

* **ngMessages:** provide support for dynamic message resolution 9b1aff9, closes #10036 #9338


### BREAKING CHANGES

* The `ngMessagesInclude` attribute is now its own directive and that must be placed as a **child** element within the element with the ngMessages directive.
```

It is printed to stdout.


## License

MIT © [Steve Mao](https://github.com/stevemao)


[npm-image]: https://badge.fury.io/js/conventional-changelog-writer.svg
[npm-url]: https://npmjs.org/package/conventional-changelog-writer
[travis-image]: https://travis-ci.org/conventional-changelog/conventional-changelog-writer.svg?branch=master
[travis-url]: https://travis-ci.org/conventional-changelog/conventional-changelog-writer
[daviddm-image]: https://david-dm.org/conventional-changelog/conventional-changelog-writer.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/conventional-changelog/conventional-changelog-writer
[coveralls-image]: https://coveralls.io/repos/conventional-changelog/conventional-changelog-writer/badge.svg
[coveralls-url]: https://coveralls.io/r/conventional-changelog/conventional-changelog-writer
