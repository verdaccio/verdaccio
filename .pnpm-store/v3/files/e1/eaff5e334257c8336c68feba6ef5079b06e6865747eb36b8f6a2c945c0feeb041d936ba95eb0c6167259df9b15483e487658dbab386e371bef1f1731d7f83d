<p align="center"><h1 align="center">
lockfile-lint

</h1>

<p align="center">
  A CLI to lint a lockfile for security policies
</p>

<p align="center">
<a href="https://www.npmjs.org/package/lockfile-lint"><img src="https://badgen.net/npm/v/lockfile-lint" alt="npm version"/></a>
  <a href="https://www.npmjs.org/package/lockfile-lint"><img src="https://badgen.net/npm/license/lockfile-lint" alt="license"/></a>
  <a href="https://www.npmjs.org/package/lockfile-lint"><img src="https://badgen.net/npm/dt/lockfile-lint" alt="downloads"/></a>
  <a href="https://travis-ci.org/lirantal/lockfile-lint"><img src="https://badgen.net/travis/lirantal/lockfile-lint" alt="build"/></a>
  <a href="https://codecov.io/gh/lirantal/lockfile-lint"><img src="https://badgen.net/codecov/c/github/lirantal/lockfile-lint" alt="codecov"/></a>
<a href="https://snyk.io/test/npm/lockfile-lint"><img src="https://snyk.io/test/npm/lockfile-lint/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/npm/lockfile-lint" style="max-width:100%;"></a>
  <a href="https://github.com/nodejs/security-wg/blob/master/processes/responsible_disclosure_template.md"><img src="https://img.shields.io/badge/Security-Responsible%20Disclosure-yellow.svg" alt="Security Responsible Disclosure" /></a>
</p>

# About

A CLI tool to lint a lockfile for security policies

# Install

```bash
npm install --save lockfile-lint
```

# Usage

`lockfile-lint` can be installed per a project scope, or globally and exposes a `lockfile-lint` executable that should be practiced during builds, CIs, and general static code analysis procedures to ensure that lockfiles are kept up to date with pre-defined security and usage policies.

```bash
lockfile-lint --type <yarn|npm> --path <path-to-lockfile> --validate-https --allowed-hosts <host-to-match>
```

# Example

An example of running the linter with debug output for a yarn lockfile and asserting that all resources are using the official npm registry as source for packages:

```bash
DEBUG=* lockfile-lint --path yarn.lock --type yarn --allowed-hosts npm
```

**Example 2**: specify hostnames and enforce the use of HTTPS as a protocol

```bash
lockfile-lint --path yarn.lock --allowed-hosts registry.yarnpkg.com --validate-https
```

- `--type yarn` is ommitted since lockfile-lint can figure it out on it's own
- `--allowed-hosts` explicitly set to match yarn's mirror host

**Example 3**: allow the lockfile to contain packages served over github and so need to specify github.com as a host as well as the `git+https:` as a valid URI scheme

```bash
lockfile-lint --path yarn.lock --allowed-hosts yarn github.com --validate-https --allowed-schemes "https:" "git+https:"
```

- `--allowed-hosts` explicitly set to match github.com as a host and specifies `yarn` as the alias for yarn's official mirror host
- `--allowed-schemes` overrides `validate-https` and so it explicitly allows both `https:` and `git+https:` for the github URL


# CLI command options

| command line argument        | description                                                                                                                                                                                                                                                                                | implemented    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| `--path`, `-p`               | path to the lockfile                                                                                                                                                                                                                                                                       | ✅             |
| `--type`, `-t`               | lockfile type, options are `npm` or `yarn`                                                                                                                                                                                                                                                 | ✅             |
| `--validate-https`, `-s`     | validates the use of HTTPS as protocol schema for all resources in the lockfile                                                                                                                                                                                                            | ✅             |
| `--allowed-hosts`, `-a`      | validates a whitelist of allowed hosts to be used for all resources in the lockfile. Supported short-hands aliases are `npm`, `yarn`, and `verdaccio` which will match URLs `https://registry.npmjs.org`, `https://registry.yarnpkg.com` and `https://registry.verdaccio.org` respectively | ✅             |
| `--allowed-schemes`, `-o`    | allowed [URI schemes](https://tools.ietf.org/html/rfc2396#section-3.1) such as "https:", "http", "git+ssh:", or "git+https:"                                                                                                                                                                                                                                                                                        | ✅             |
| `--validate-checksum`, `-c`  | check that all resources include a checksum                                                                                                                                                                                                                                                | ❌ PRs welcome |
| `--validate-integrity`, `-i` | check that all resources include an integrity field                                                                                                                                                                                                                                        | ❌ PRs welcome |

# Contributing

Please consult [CONTIRBUTING](../../CONTRIBUTING.md) for guidelines on contributing to this project.

# Author

**lockfile-lint** © [Liran Tal](https://github.com/lirantal), Released under the [Apache-2.0](./LICENSE) License.
