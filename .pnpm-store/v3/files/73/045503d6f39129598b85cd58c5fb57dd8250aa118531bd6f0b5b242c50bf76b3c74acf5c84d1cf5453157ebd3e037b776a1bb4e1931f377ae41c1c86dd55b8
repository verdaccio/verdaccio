# macos-release [![Build Status](https://travis-ci.com/sindresorhus/macos-release.svg?branch=master)](https://travis-ci.com/github/sindresorhus/macos-release)

> Get the name and version of a macOS release from the Darwin version\
> Example: `13.2.0` → `{name: 'Mavericks', version: '10.9'}`

## Install

```
$ npm install macos-release
```

## Usage

```js
const os = require('os');
const macosRelease = require('macos-release');

// On a macOS Sierra system

macosRelease();
//=> {name: 'Sierra', version: '10.12'}

os.release();
//=> 13.2.0
// This is the Darwin kernel version

macosRelease(os.release());
//=> {name: 'Sierra', version: '10.12'}

macosRelease('14.0.0');
//=> {name: 'Yosemite', version: '10.10'}

macosRelease('20.0.0');
//=> {name: 'Big Sur', version: '11'}
```

## API

### macosRelease(release?)

#### release

Type: `string`

By default, the current operating system is used, but you can supply a custom [Darwin kernel version](https://en.wikipedia.org/wiki/Darwin_%28operating_system%29#Release_history), which is the output of [`os.release()`](https://nodejs.org/api/os.html#os_os_release).

## Related

- [os-name](https://github.com/sindresorhus/os-name) - Get the name of the current operating system. Example: `macOS Sierra`
- [macos-version](https://github.com/sindresorhus/macos-version) - Get the macOS version of the current system. Example: `10.9.3`
- [win-release](https://github.com/sindresorhus/win-release) - Get the name of a Windows version from the release number: `5.1.2600` → `XP`

---

<div align="center">
	<b>
		<a href="https://tidelift.com/subscription/pkg/npm-macos-release?utm_source=npm-macos-release&utm_medium=referral&utm_campaign=readme">Get professional support for this package with a Tidelift subscription</a>
	</b>
	<br>
	<sub>
		Tidelift helps make open source sustainable for maintainers while giving companies<br>assurances about security, maintenance, and licensing for their dependencies.
	</sub>
</div>
