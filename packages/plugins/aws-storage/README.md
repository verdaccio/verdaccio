# verdaccio-aws-s3-storage - AWS S3 storage plugin for Verdaccio

[![Verdaccio Home](https://img.shields.io/badge/Homepage-Verdaccio-405236?style=flat)](https://verdaccio.org)
[![MIT License](https://img.shields.io/github/license/verdaccio/verdaccio?label=License&color=405236)](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
[![Verdaccio Latest](https://img.shields.io/npm/v/verdaccio?label=Latest%20Version&color=405236)](https://github.com/verdaccio/verdaccio)
[![This Package Latest](https://img.shields.io/npm/v/verdaccio-aws-s3-storage?label=verdaccio-aws-s3-storage&color=405236)](https://npmjs.com/package/verdaccio-aws-s3-storage)

[![Documentation](https://img.shields.io/badge/Help-Verdaccio?style=flat&logo=Verdaccio&label=Verdaccio&color=cd4000)](https://verdaccio.org/docs)
[![Discord](https://img.shields.io/badge/Chat-Discord?style=flat&logo=Discord&label=Discord&color=cd4000)](https://discord.com/channels/388674437219745793)
[![Bluesky](https://img.shields.io/badge/Follow-Bluesky?style=flat&logo=Bluesky&label=Bluesky&color=cd4000)](https://bsky.app/profile/verdaccio.org)
[![Backers](https://img.shields.io/opencollective/backers/verdaccio?style=flat&logo=opencollective&label=Join%20Backers&color=cd4000)](https://opencollective.com/verdaccio/contribute)
[![Sponsors](https://img.shields.io/opencollective/sponsors/verdaccio?style=flat&logo=opencollective&label=Sponsor%20Us&color=cd4000)](https://opencollective.com/verdaccio/contribute)

[![Verdaccio Downloads](https://img.shields.io/npm/dm/verdaccio?style=flat&logo=npm&label=Npm%20Downloads&color=lightgrey)](https://www.npmjs.com/package/verdaccio)
[![Docker Pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio?style=flat&logo=docker&label=Docker%20Pulls&color=lightgrey)](https://hub.docker.com/r/verdaccio/verdaccio)
[![GitHub Stars](https://img.shields.io/github/stars/verdaccio?style=flat&logo=github&label=GitHub%20Stars%20%E2%AD%90&color=lightgrey)](https://github.com/verdaccio/verdaccio/stargazers)

> This plugin was forked based on [`verdaccio-s3-storage`](https://github.com/Remitly/verdaccio-s3-storage) built in Typescript + other features added along
> the time. Both plugins might have vary in behaviour since then, we recommend use the AWS plugin on this repo due
> is under control of Verdaccio community and constantly upated.

## See it in action

- Test on [Docker + LocalStack + Verdaccio 4 + S3 Plugin example](https://github.com/verdaccio/verdaccio/tree/master/docker-examples/tree/master/amazon-s3-docker-example).
- Using `docker-compose` on this repo based on [**verdaccio-minio**](https://github.com/barolab/verdaccio-minio) developed by [barolab](https://github.com/barolab).
- Feel free to propose new ways to run this plugin.

### Basic Requirements

- AWS Account (in case you are using the cloud)
- Verdaccio server (4.0) (for 3.x use `verdaccio-s3-storage` instead)

```
npm install -g verdaccio
```

## Usage

```
npm install verdaccio-aws-s3-storage
```

This will pull AWS credentials from your environment.

In your verdaccio config, configure

```yaml
store:
  aws-s3-storage:
    bucket: your-s3-bucket
    keyPrefix: some-prefix # optional, has the effect of nesting all files in a subdirectory
    region: us-west-2 # optional, will use aws s3's default behavior if not specified
    endpoint: https://{service}.{region}.amazonaws.com # optional, will use aws s3's default behavior if not specified
    s3ForcePathStyle: false # optional, will use path style URLs for S3 objects
    accessKeyId: your-access-key-id # optional, aws accessKeyId for private S3 bucket
    secretAccessKey: your-secret-access-key # optional, aws secretAccessKey for private S3 bucket
    sessionToken: your-session-token # optional, aws sessionToken for private S3 bucket
```

The configured values can either be the actual value or the name of an environment variable that contains the value for the following options:

- `bucket`
- `keyPrefix`
- `region`
- `endpoint`
- `accessKeyID`
- `secretAccessKey`
- `sessionToken`

```yaml
store:
  aws-s3-storage:
    bucket: S3_BUCKET # If an environment variable named S3_BUCKET is set, it will use that value. Otherwise assumes the bucket is named 'S3_BUCKET'
    keyPrefix: S3_KEY_PREFIX # If an environment variable named S3_KEY_PREFIX is set, it will use that value. Otherwise assumes the bucket is named 'S3_KEY_PREFIX'
    endpoint: S3_ENDPOINT # If an environment variable named S3_ENDPOINT is set, it will use that value. Otherwise assumes the bucket is named 'S3_ENDPOINT'
    ...
```

store properties can be defined for packages. The storage location corresponds to the folder in s3 bucket.

```
packages:
  '@scope/*':
    access: all
    publish: $all
    storage: 'scoped'
  '**':
    access: $all
    publish: $all
    proxy: npmjs
    storage: 'public'
```

# Developer Testing

In case of local testing, this project can be used self-efficiently. Four main ingredients are as follows:

- `config.yaml`, see [verdaccio documentation](https://verdaccio.org/docs/en/configuration.html)
- The provided docker file allows to test the plugin, with no need for main verdaccio application
- The provided docker-compose also provides minio in orchestration as a local substitute for S3 backend
- Create and set content of `registry.envs` as follows. This file does not exist on the repo and should be generated manually after cloning the project.

```
AWS_ACCESS_KEY_ID=foobar
AWS_SECRET_ACCESS_KEY=1234567e
AWS_DEFAULT_REGION=eu-central-1
AWS_S3_ENDPOINT=https://localhost:9000/
AWS_S3_PATH_STYLE=true
```

## Execute the docker image for testing

> You need the latest docker installed in your computer

```bash
docker-compose up
```

> By default there is no bucket created, **you might need to browse `http://127.0.0.1:9000/minio/` and create
> the example bucket manually named `rise`** and then restart `docker-compose up`.

The default values should work out of the box. If you change anything, make sure the corresponding variables are set in
other parts of the ingredient as well.

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
