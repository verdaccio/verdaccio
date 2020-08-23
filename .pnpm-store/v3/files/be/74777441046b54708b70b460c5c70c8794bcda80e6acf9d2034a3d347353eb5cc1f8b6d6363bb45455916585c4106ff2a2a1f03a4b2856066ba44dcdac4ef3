<p align="center"><h1 align="center">
  lockfile-lint-api
</h1>

<p align="center">
  Lint an npm or yarn lockfile to analyze and detect issues
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/lockfile-lint-api"><img src="https://badgen.net/npm/v/lockfile-lint-api" alt="npm version"/></a>
  <a href="https://www.npmjs.org/package/lockfile-lint-api"><img src="https://badgen.net/npm/license/lockfile-lint-api" alt="license"/></a>
  <a href="https://www.npmjs.org/package/lockfile-lint-api"><img src="https://badgen.net/npm/dt/lockfile-lint-api" alt="downloads"/></a>
  <a href="https://travis-ci.org/lirantal/lockfile-lint"><img src="https://badgen.net/travis/lirantal/lockfile-lint" alt="build"/></a>
  <a href="https://codecov.io/gh/lirantal/lockfile-lint"><img src="https://badgen.net/codecov/c/github/lirantal/lockfile-lint" alt="codecov"/></a>
<a href="https://snyk.io/test/npm/lockfile-lint-api"><img src="https://snyk.io/test/npm/lockfile-lint-api/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/npm/lockfile-lint-api" style="max-width:100%;"></a>
  <a href="https://github.com/nodejs/security-wg/blob/master/processes/responsible_disclosure_template.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg" alt="Security Responsible Disclosure" /></a>
</p>

# About

Lints an npm or yarn lockfile to analyze and detect issues

NOTE: currently only yarn's `yarn.lock` is supported. PRs to support npm's `package-lock.json` are welcome 🤗

# Install

```bash
npm install --save lockfile-lint-api
```

# Usage

`lockfile-lint-api` exposes a set of validator APIs that can be used for programmatic use-cases, such as being employed by other tools and programs if needed.

## Validators

The following lockfile validators are supported

| Validator API   | description                                                                     | implemented |
| --------------  | ------------------------------------------------------------------------------- | ----------- |
| ValidateHttps   | validates the use of HTTPS as protocol schema for all resources                 | ✅          |
| ValidateHost    | validates a whitelist of allowed hosts to be used for resources in the lockfile | ✅          |
| ValidateScheme  | validates a whitelist of allowed URI schemes to be used for hosts               | ✅          |

## Success and failures

When validators encounter errors they will throw an exception, and on either success or failure in validating data they will always return a descriptive object for the validation task.

### Successful validation

When validation is successful the following object will be returned from the validating function:

```json
{
  "type": "success",
  "errors": []
}
```

### Failed validation

When validation has failed the following object will be returned from the validating function:

```json
{
  "type": "error",
  "errors": [
    {
      "package": "@babel/cli",
      "message": "detected invalid origin for package: @babel/cli"
    }
  ]
}
```

Notes about the returned object:

- An errors object will always return an array of errors metadata, even if there's only one error associated with the validation being performed
- All errors should always have a message
- The availability of the `package` property and other metadata depends on the specific validators being used

### Example

```js
const validator = new ValidateHost({packages: lockfile.object})
let result
try {
  result = validator.validate(['npm'])
} catch (error) {
  // something bad happened during validation and the validation
  // process couldn't take place
}

console.log(result)
/* prints
{
  "type": "error",
  "errors": [
    {
      "message": "detected invalid origin for package: meow",
      "package": "meow"
    }
  ]
}
*/
```

# Example

```js
const {ValidateHost, ParseLockFile} = require('lockfile-lint-api')

// path to the lockfile
const yarnLockFilePath = '/path/to/my/yarn.lock'
const options = {
  lockfilePath: yarnLockFilePath
}

// instantiate a new parser with options object
const parser = new ParseLockFile(options)

// read the file synchronously and parses it
// providing back an object that is compatible
// with the @yarn/lockfile library which has
// all the packages listed in `lockfile.object`
const lockfile = parser.parseSync()

// now instantiate a validator object with those
// list of packages
const validator = new ValidateHost({packages: lockfile.object})
let result
try {
  // validation is synchronous and is being called
  // with 'npm' as a shortcut for the npm registry
  // host to validate all lockfile resources are
  // whitelisted to the npm host
  result = validator.validate(['npm'])
} catch (error) {
  // couldn't process the validation
}

if (result.type === 'success') {
  // validation succeeded
}
```

# Contributing

Please consult [CONTIRBUTING](../../CONTRIBUTING.md) for guidelines on contributing to this project.

# Author

**lockfile-lint-api** © [Liran Tal](https://github.com/lirantal), Released under the [Apache-2.0](./LICENSE) License.
