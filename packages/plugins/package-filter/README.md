# @verdaccio/package-filter

[![Verdaccio Home](https://img.shields.io/badge/Homepage-Verdaccio-405236?style=flat)](https://verdaccio.org)
[![MIT License](https://img.shields.io/github/license/verdaccio/verdaccio?label=License&color=405236)](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
[![Verdaccio Latest](https://img.shields.io/npm/v/verdaccio?label=Latest%20Version&color=405236)](https://github.com/verdaccio/verdaccio)

[![Documentation](https://img.shields.io/badge/Help-Verdaccio?style=flat&logo=Verdaccio&label=Verdaccio&color=cd4000)](https://verdaccio.org/docs)
[![Discord](https://img.shields.io/badge/Chat-Discord?style=flat&logo=Discord&label=Discord&color=cd4000)](https://discord.com/channels/388674437219745793)

A built-in Verdaccio filter plugin for controlling which package versions are visible to consumers. It intercepts every manifest response and removes or replaces versions that match configurable rules.

## Use Cases

- **Supply-chain security** - block known-malicious packages, scopes, or version ranges.
- **Version quarantine** - hide versions younger than N days so newly published code has time to be reviewed before adoption.
- **Date freeze** - pin the registry to a point-in-time snapshot (e.g., only serve versions published before a specific date).
- **Emergency response** - immediately block a compromised version while keeping older safe versions available.

## How It Works

The plugin implements Verdaccio's `ManifestFilter` interface. Every time Verdaccio serves a package manifest (via `npm install`, `npm view`, search, or the web UI), the manifest passes through `filter_metadata()` before reaching the client.

The processing pipeline:

```
Incoming manifest
  1. Clone manifest (avoids mutating cached data)
  2. Apply block/replace rules by package name, scope, or version range
  3. Apply date-based filtering (minAgeDays / dateThreshold)
  4. Cleanup: remove orphaned dist-tags, time entries, and dist files
  5. Recalculate "latest" tag from remaining versions
Output filtered manifest
```

Filtered versions are removed from the manifest metadata only. Tarballs already downloaded or cached are not affected.

## Configuration

The plugin is enabled by default in Verdaccio's `config.yaml`. With no rules configured, it acts as a no-op passthrough.

### Minimal Configuration (no-op)

```yaml
filters:
  '@verdaccio/package-filter':
```

### Block Versions by Age

Hide versions published less than N days ago. This is a global rule applied to all packages.

```yaml
filters:
  '@verdaccio/package-filter':
    minAgeDays: 30
```

### Block Versions by Date

Only serve versions published before a specific date.

```yaml
filters:
  '@verdaccio/package-filter':
    dateThreshold: '2024-01-01'
```

When both `minAgeDays` and `dateThreshold` are set, the **earlier** cutoff wins (more versions are filtered).

### Block by Scope

Block all packages under a scope.

```yaml
filters:
  '@verdaccio/package-filter':
    block:
      - scope: '@evilscope'
```

### Block by Package Name

Block all versions of a specific package.

```yaml
filters:
  '@verdaccio/package-filter':
    block:
      - package: 'malicious-pkg'
      - package: '@coolauthor/stolen'
```

### Block by Version Range

Block specific semver ranges of a package. Uses [semver](https://www.npmjs.com/package/semver) syntax.

```yaml
filters:
  '@verdaccio/package-filter':
    block:
      - package: '@coolauthor/stolen'
        versions: '>2.0.1'
```

Multiple version ranges for the same package are merged:

```yaml
filters:
  '@verdaccio/package-filter':
    block:
      - package: 'some-pkg'
        versions: '>2.0.0'
      - package: 'some-pkg'
        versions: '<1.3.0'
```

This leaves only versions in `[1.3.0, 2.0.0]` visible.

### Replace Strategy

Instead of removing blocked versions, substitute them with the nearest older safe version. Useful when a blocked version is a transitive dependency and removing it would break installs.

```yaml
filters:
  '@verdaccio/package-filter':
    block:
      - package: '@coolauthor/stolen'
        versions: '>2.0.1'
        strategy: replace
```

With `replace`, `npm install @coolauthor/stolen@3.0.0` still resolves, but the client receives the content of `2.0.1`.

### Whitelisting Blocked Packages

In some cases, you may need to bypass your own rules and whitelist certain scopes, packages, or package versions even though they fall within a blocked area. For example, this might happen when you own some private registry or you really need the latest version of some package and you ensured that its code is safe. You can configure whitelist rules with the `allow` clause, which follows the same rules as `block`. Rules specified in `allow` take precedence over all blocking rules (even `minAgeDays` and `dateThreshold`).

```yaml
filters:
  '@verdaccio/package-filter':
    minAgeDays: 30 # Block versions younger than 30 days
    allow:
      - scope: '@my-company-scope' # Don't block the scope that belongs to you
      - package: '@coolauthor/not-stolen' # Don't block package you really trust
      - package: semver
        versions: '7.7.3' # Don't block specific package version that you know is not malicious
```

You can also combine `allow` with `block` rules to create fine-grained exceptions:

```yaml
filters:
  '@verdaccio/package-filter':
    block:
      - scope: '@untrusted'
    allow:
      - package: '@untrusted/but-verified'
      - package: 'some-pkg'
        versions: '2.1.0'
```

Allow rules are checked before block rules. The granularity levels:

| Allow rule                           | Effect                              |
| ------------------------------------ | ----------------------------------- |
| `scope: '@x'`                        | Entire scope bypasses all rules     |
| `package: 'x'`                       | Entire package bypasses all rules   |
| `package: 'x'` + `versions: '1.0.0'` | Only matching versions are exempted |

### Full Example

```yaml
filters:
  '@verdaccio/package-filter':
    minAgeDays: 7
    dateThreshold: '2025-01-01'
    block:
      - scope: '@malicious'
      - package: 'typosquat-pkg'
      - package: 'compromised-lib'
        versions: '>=3.0.0'
      - package: 'legacy-lib'
        versions: '>=2.0.0'
        strategy: replace
    allow:
      - scope: '@my-org'
      - package: 'compromised-lib'
        versions: '3.0.1'
```

### Disabling the Plugin

Remove or comment out the `filters` section in `config.yaml`:

```yaml
# filters:
#   '@verdaccio/package-filter':
```

## Manifest Cleanup

After filtering, the plugin automatically cleans up the manifest:

- **Dist-tags**: tags pointing to removed versions are deleted.
- **Latest tag**: if `latest` was removed, the most recent remaining stable version becomes `latest`. If no stable version exists, the most recent pre-release is used.
- **Time entries**: publish timestamps for removed versions are deleted.
- **Created/modified**: recalculated from remaining time entries.
- **Dist files**: `_distfiles` entries not referenced by any remaining version are removed.

## Debugging

The plugin uses the [`debug`](https://www.npmjs.com/package/debug) library under the `verdaccio:plugin:package-filter` namespace.

```bash
# See all plugin debug output
DEBUG=verdaccio:plugin:package-filter* verdaccio

# See only config parsing
DEBUG=verdaccio:plugin:package-filter:config verdaccio

# See only filtering decisions
DEBUG=verdaccio:plugin:package-filter:filter verdaccio

# See manifest cleanup details
DEBUG=verdaccio:plugin:package-filter:manifest verdaccio

# Combine with other verdaccio debug namespaces
DEBUG=verdaccio:plugin:package-filter*,verdaccio:storage verdaccio
```

## Plugin History

Originally authored by Ansile as [verdaccio-plugin-secfilter](https://github.com/Ansile/verdaccio-plugin-secfilter) (MIT license). Forked by Vitalii Sugrobov as [verdaccio-plugin-delay-filter](https://github.com/vsugrob/verdaccio-plugin-delay-filter). Now maintained as a built-in plugin in the Verdaccio monorepo.

## Donations

Verdaccio is run by **volunteers**; nobody is working full-time on it. If you find this project to be useful and would like to support its development, consider making a donation - **your logo might end up in this readme.**

**[Donate](https://opencollective.com/verdaccio)** starting from _\$1/month_ or just one single contribution.

## Report a vulnerability

If you want to report a security vulnerability, please follow the steps which we have defined for you in our [security policy](https://github.com/verdaccio/verdaccio/security/policy).

## Open Collective Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/verdaccio/contribute)]

[![sponsor](https://opencollective.com/verdaccio/sponsor/0/avatar.svg)](https://opencollective.com/verdaccio/sponsor/0/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/1/avatar.svg)](https://opencollective.com/verdaccio/sponsor/1/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/2/avatar.svg)](https://opencollective.com/verdaccio/sponsor/2/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/3/avatar.svg)](https://opencollective.com/verdaccio/sponsor/3/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/4/avatar.svg)](https://opencollective.com/verdaccio/sponsor/4/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/5/avatar.svg)](https://opencollective.com/verdaccio/sponsor/5/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/6/avatar.svg)](https://opencollective.com/verdaccio/sponsor/6/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/7/avatar.svg)](https://opencollective.com/verdaccio/sponsor/7/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/8/avatar.svg)](https://opencollective.com/verdaccio/sponsor/8/website)
[![sponsor](https://opencollective.com/verdaccio/sponsor/9/avatar.svg)](https://opencollective.com/verdaccio/sponsor/9/website)

## Open Collective Backers

Thank you to all our backers! [[Become a backer](https://opencollective.com/verdaccio/contribute)]

[![backers](https://opencollective.com/verdaccio/backers.svg?width=890)](https://opencollective.com/verdaccio/contributes)

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md)].

[![contributors](https://opencollective.com/verdaccio/contributors.svg?width=890&button=true)](https://github.com/verdaccio/verdaccio/graphs/contributors)

## License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE).

The Verdaccio documentation and logos (excluding /thanks, e.g., .md, .png, .sketch files within the /assets folder) are
[Creative Commons licensed](https://creativecommons.org/licenses/by/4.0/).
