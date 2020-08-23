<p align="center"><h1 align="center">
  detect-secrets
</h1>

<p align="center">
  A developer-friendly secrets detection tool for CI and pre-commit hooks
</p>

<p align="center">
  <a href="https://www.npmjs.org/package/detect-secrets"><img src="https://badgen.net/npm/v/detect-secrets" alt="npm version"/></a>
  <a href="https://www.npmjs.org/package/detect-secrets"><img src="https://badgen.net/npm/license/detect-secrets" alt="license"/></a>
  <a href="https://www.npmjs.org/package/detect-secrets"><img src="https://badgen.net/npm/dt/detect-secrets" alt="downloads"/></a>
  <a href="https://travis-ci.org/lirantal/detect-secrets"><img src="https://badgen.net/travis/lirantal/detect-secrets" alt="build"/></a>
  <a href="https://codecov.io/gh/lirantal/detect-secrets"><img src="https://badgen.net/codecov/c/github/lirantal/detect-secrets" alt="codecov"/></a>
  <a href="https://snyk.io/test/github/lirantal/detect-secrets"><img src="https://snyk.io/test/github/lirantal/detect-secrets/badge.svg" alt="Known Vulnerabilities"/></a>
  <a href="https://github.com/nodejs/security-wg/blob/master/processes/responsible_disclosure_template.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg" alt="Security Responsible Disclosure" /></a>
</p>

# About

The `detect-secrets` npm package is a Node.js-based wrapper for Yelp's [detect-secrets](https://github.com/Yelp/detect-secrets) tool that aims to provide an accessible and developer-friendly method of introducing secrets detection in pre-commit hooks.

Yelp's detect-secrets is based on Python and requires explicit installation from developers. Moreover, its installation may be challenging in different operating systems. `detect-secrets` aims to alleviate this challenge by:

1. Attempt to locate Yelp's detect-secrets tool, and if it exists in the path to execute it.

If it fails it continues to:

2. Attempt to locate the docker binary and if it exists it will download and execute the docker container for [lirantal/detect-secrets](https://github.com/lirantal/docker-detect-secrets) which has Yelp's detect-secrets inside the image.

If this fails as well:

3. Exit with a warning message

--

The above described fallback strategy is used to find an available method of executing the detect-secrets tool to protect the developer from leaking secrets into source code control.

# Install

```bash
npm install --save detect-secrets
```

This will expose `detect-secrets-launcher` Node.js executable file.

Another way to invoke it is with npx which will download and execute the detect-secrets wrapper on the fly:

```bash
npx detect-secrets [arguments]
```

# Usage

If you're using `husky` to manage pre-commit hooks configuration, then enabling secrets detection is as simple as adding another hook entry.

```js
"husky": {
    "hooks": {
      "pre-commit": "detect-secrets-launcher src/*"
    }
  }
```

If you're using `husky` and `lint-staged` to manage pre-commit hooks configuration and running static code analysis on staged files, then enabling secrets detection is as simple as adding another lint-staged entry.

A typical setup will look like this as an example:

```js
"husky": {
  "hooks": {
    "pre-commit": "lint-staged"
  },
},
"lint-staged": {
  "linters": {
    "**/*.js": [
      "detect-secrets-launcher --baseline .secrets-baseline"
    ]
  }
}
```

If you're not using a baseline file (it is created using Yelp's server-side detect-secrets tool) then you can simply omit this out and keep it as simple as `detect-secrets-launcher`.

# Example

To scan the `index.js` file within a repository for the potential of leaked secrets inside it run the following:

```bash
detect-secrets-launcher index.js
```

Note that `index.js` has to be staged and versioned control. Any other plain file that is not known to git will not be scanned.

# Contributing

Please consult [CONTIRBUTING](./CONTRIBUTING.md) for guidelines on contributing to this project.

# Author

**detect-secrets** © [Liran Tal](https://github.com/lirantal), Released under the [Apache-2.0](./LICENSE) License.
