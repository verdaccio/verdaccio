# verdaccio-memory - Verdaccio Memory Storage Plugin

[![Verdaccio Home](https://img.shields.io/badge/Homepage-Verdaccio-405236?style=flat)](https://verdaccio.org)
[![MIT License](https://img.shields.io/github/license/verdaccio/verdaccio?label=License&color=405236)](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
[![Verdaccio Latest](https://img.shields.io/npm/v/verdaccio?label=Latest%20Version&color=405236)](https://github.com/verdaccio/verdaccio)
[![This Package Latest](https://img.shields.io/npm/v/verdaccio-memory?label=verdaccio-memory&color=405236)](https://npmjs.com/package/verdaccio-memory)

[![Documentation](https://img.shields.io/badge/Help-Verdaccio?style=flat&logo=Verdaccio&label=Verdaccio&color=cd4000)](https://verdaccio.org/docs)
[![Discord](https://img.shields.io/badge/Chat-Discord?style=flat&logo=Discord&label=Discord&color=cd4000)](https://discord.com/channels/388674437219745793)
[![Bluesky](https://img.shields.io/badge/Follow-Bluesky?style=flat&logo=Bluesky&label=Bluesky&color=cd4000)](https://bsky.app/profile/verdaccio.org)
[![Backers](https://img.shields.io/opencollective/backers/verdaccio?style=flat&logo=opencollective&label=Join%20Backers&color=cd4000)](https://opencollective.com/verdaccio/contribute)
[![Sponsors](https://img.shields.io/opencollective/sponsors/verdaccio?style=flat&logo=opencollective&label=Sponsor%20Us&color=cd4000)](https://opencollective.com/verdaccio/contribute)

[![Verdaccio Downloads](https://img.shields.io/npm/dm/verdaccio?style=flat&logo=npm&label=Npm%20Downloads&color=lightgrey)](https://www.npmjs.com/package/verdaccio)
[![Docker Pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio?style=flat&logo=docker&label=Docker%20Pulls&color=lightgrey)](https://hub.docker.com/r/verdaccio/verdaccio)
[![GitHub Stars](https://img.shields.io/github/stars/verdaccio?style=flat&logo=github&label=GitHub%20Stars%20%E2%AD%90&color=lightgrey)](https://github.com/verdaccio/verdaccio/stargazers)

Plugin for filtering packages and their versions with security purposes. It allows you to make Verdaccio block:

- Versions released less than N days ago.
- Specific versions or version ranges (with semver semantics).
- Entire packages or even scopes.
- Versions released after specific date.

```
 npm install --global @verdaccio/package-filter
```

### Requirements

> `verdaccio@6.2.0` or newer.

```
npm install --global verdaccio
```

### Configuration

Edit `config.yaml` of Verdaccio to achieve desired filtering.

#### Filter package versions by age

```yaml
filters:
  '@verdaccio/package-filter':
    minAgeDays: 30 # Block versions younger than 30 days
```

Note that this option is global for all packages and scopes.
If you want some scopes, packages or package version to survive this filtering,
seek for `allow` rules later in this document.

#### Block by scope or package

```yaml
filters:
  '@verdaccio/package-filter':
    block:
      - scope: @evilscope # block all packages in this scope
      - package: semvver # block a malicious package trying to pretend 'semver'
      - package: @coolauthor/stolen # block a malicious package
```

#### Block package versions

```yaml
filters:
  '@verdaccio/package-filter':
    block:
      - package: @coolauthor/stolen
        versions:
          '>2.0.1' # block some malicious versions of previously ok package
          # uses https://www.npmjs.com/package/semver syntax
```

#### Replace newer package versions with older version

```yaml
filters:
  '@verdaccio/package-filter':
    block:
      - package: @coolauthor/stolen
        versions: '>2.0.1'
        strategy:
          replace # block some malicious versions of previously ok package,
          # replacing them with older, correct versions.
          # use this when package is used in transient dependencies and 'block' breaks the installs
```

#### dateThreshold

```yaml
filters:
  '@verdaccio/package-filter':
    dateThreshold: '2022-03-10T23:00:00.000Z' # Allow only packages released up to this date
```

#### Whitelisting blocked packages

In some cases, you may need to bypass your own rules
and whitelist certain scopes, packages, or package versions
even though they fall within a blocked area.
For example, this might happen when you own some private registry or you really need
latest version of some package and you ensured that its code is safe.
You can configure whitelist rules with `allow` clause,
which follows the same rules as `block`.
Rules specified in `allow` take precedence over all blocking rules
(even `minAgeDays` and `dateThreshold`).

```yaml
filters:
  '@verdaccio/package-filter':
    minAgeDays: 30 # Block versions younger than 30 days
    allow:
      - scope: @my-company-scope # Don't block the scope that belongs to you
      - package: @coolauthor/not-stolen # Don't block package you really trust
      - package: semver
        versions: '7.7.3' # Don't block specific package version that you know is not malicious
```

### Plugin history

Originally this plugin was authored by Ansile as [verdaccio-plugin-secfilter](https://github.com/Ansile/verdaccio-plugin-secfilter) (MIT license) and hosted as independent package.
Then it was forked by Vitalii Sugrobov as [verdaccio-plugin-delay-filter](https://github.com/vsugrob/verdaccio-plugin-delay-filter), also as independent package.
Now it lives in Verdaccio monorepo as built-in plugin.

## Donations

Verdaccio is run by **volunteers**; nobody is working full-time on it. If you find this project to be useful and would like to support its development, consider making a donation - **your logo might end up in this readme.** 😉

**[Donate](https://opencollective.com/verdaccio)** 💵👍🏻 starting from _\$1/month_ or just one single contribution.

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

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/verdaccio/contribute)]

[![backers](https://opencollective.com/verdaccio/backers.svg?width=890)](https://opencollective.com/verdaccio/contributes)

## Special Thanks

Thanks to the following companies to help us to achieve our goals providing free open source licenses.

[![jetbrains](https://github.com/verdaccio/verdaccio/blob/master/assets/thanks/jetbrains/logo.jpg?raw=true)](https://www.jetbrains.com/)
[![crowdin](https://github.com/verdaccio/verdaccio/blob/master/assets/thanks/crowdin/logo.png?raw=true)](https://crowdin.com/)

## Contributors

This project exists thanks to all the people who contribute. [[Contribute](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md)].

[![contributors](https://opencollective.com/verdaccio/contributors.svg?width=890&button=true)](https://github.com/verdaccio/verdaccio/graphs/contributors)

## FAQ / Contact / Troubleshoot

If you have any issue you can try the following options. Do not hesitate to ask or check our issues database. Perhaps someone has asked already what you are looking for.

- [Blog](https://verdaccio.org/blog/)
- [Donations](https://opencollective.com/verdaccio)
- [Reporting an issue](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md#reporting-a-bug)
- [Running discussions](https://github.com/orgs/verdaccio/discussions)
- [Chat](https://discord.com/channels/388674437219745793)
- [Logos](https://verdaccio.org/docs/logo)
- [Docker Examples](https://github.com/verdaccio/verdaccio/tree/master/docker-examples)
- [FAQ](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Aquestion%20)

## License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)

The Verdaccio documentation and logos (excluding /thanks, e.g., .md, .png, .sketch files within the /assets folder) are
[Creative Commons licensed](https://creativecommons.org/licenses/by/4.0/).
