# verdaccio-google-cloud - Google Cloud storage implementation for Verdaccio

[![Verdaccio Home](https://img.shields.io/badge/Homepage-Verdaccio-405236?style=flat)](https://verdaccio.org)
[![MIT License](https://img.shields.io/github/license/verdaccio/verdaccio?label=License&color=405236)](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
[![Verdaccio Latest](https://img.shields.io/npm/v/verdaccio?label=Latest%20Version&color=405236)](https://github.com/verdaccio/verdaccio)
[![This Package Latest](https://img.shields.io/npm/v/verdaccio-google-cloud?label=verdaccio-google-cloud&color=405236)](https://npmjs.com/package/verdaccio-google-cloud)

[![Documentation](https://img.shields.io/badge/Help-Verdaccio?style=flat&logo=Verdaccio&label=Verdaccio&color=cd4000)](https://verdaccio.org/docs)
[![Discord](https://img.shields.io/badge/Chat-Discord?style=flat&logo=Discord&label=Discord&color=cd4000)](https://discord.com/channels/388674437219745793)
[![Bluesky](https://img.shields.io/badge/Follow-Bluesky?style=flat&logo=Bluesky&label=Bluesky&color=cd4000)](https://bsky.app/profile/verdaccio.org)
[![Backers](https://img.shields.io/opencollective/backers/verdaccio?style=flat&logo=opencollective&label=Join%20Backers&color=cd4000)](https://opencollective.com/verdaccio/contribute)
[![Sponsors](https://img.shields.io/opencollective/sponsors/verdaccio?style=flat&logo=opencollective&label=Sponsor%20Us&color=cd4000)](https://opencollective.com/verdaccio/contribute)

[![Verdaccio Downloads](https://img.shields.io/npm/dm/verdaccio?style=flat&logo=npm&label=Npm%20Downloads&color=lightgrey)](https://www.npmjs.com/package/verdaccio)
[![Docker Pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio?style=flat&logo=docker&label=Docker%20Pulls&color=lightgrey)](https://hub.docker.com/r/verdaccio/verdaccio)
[![GitHub Stars](https://img.shields.io/github/stars/verdaccio?style=flat&logo=github&label=GitHub%20Stars%20%E2%AD%90&color=lightgrey)](https://github.com/verdaccio/verdaccio)

⚠️⚠️ This plugin is experimental and might be unstable. It requires further testing. ⚠️⚠️

```
npm i -g verdaccio-google-cloud
yarn global add verdaccio-google-cloud
pnpm i -g verdaccio-google-cloud
```

### Requirements

- Google Cloud Account
- Service account with 'Cloud Datastore Owner' role and read/write access to the bucket
- Verdaccio server (see below)

```
npm install -g verdaccio@latest
yarn global add verdaccio@latest
pnpm -g verdaccio@latest
```

### Configuration

Complete configuration example:

```yaml
store:
  google-cloud:
    ## google project id
    projectId: project-01 || env (GOOGLE_CLOUD_VERDACCIO_PROJECT_ID)

    ## namespace for metadata database
    kind: someRandonMetadataDatabaseKey

    ## this pluging do not create the bucket, it has to exist
    bucket: my-bucket-name

    ## google cloud recommend this file only for development
    ## this field is not mandatory
    keyFilename: /path/project-01.json || env (GOOGLE_CLOUD_VERDACCIO_KEY)

    ## default validation is, it can be overrided by
    ## https://cloud.google.com/nodejs/docs/reference/storage/1.6.x/File.html#createWriteStream
    # validation: crc32c

    ## Enable/disable resumable uploads to GC Storage
    ## By default it's enabled in `@google-cloud/storage`
    ## May cause failures for small package uploads so it is recommended to set it to `false`
    ## @see https://stackoverflow.com/questions/53172050/google-cloud-storage-invalid-upload-request-error-bad-request
    resumable: true
```

Define `env` whether you want load the value from environment variables.

> If you are willing to use some of `env` just **do not define** properties on
> `config.yaml` or let them emtpy. Properties have preceden over `env` variables.

## Disclaimer

⚠️⚠️ This plugin is experimental and might be unstable. It requires further testing. ⚠️⚠️

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

[![jetbrain](https://github.com/verdaccio/verdaccio/blob/master/assets/thanks/balsamiq/logo.jpg?raw=true)](https://www.jetbrains.com/)
[![crowdin](https://github.com/verdaccio/verdaccio/blob/master/assets/thanks/crowdin/logo.png?raw=true)](https://crowdin.com/)
[![balsamiq](https://github.com/verdaccio/verdaccio/blob/master/assets/thanks/jetbrains/logo.png?raw=true)](https://balsamiq.com/)

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
