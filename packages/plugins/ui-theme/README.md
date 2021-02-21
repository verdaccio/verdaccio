![verdaccio gif](https://user-images.githubusercontent.com/558752/52916111-fa4ba980-32db-11e9-8a64-f4e06eb920b3.png)

# @verdaccio/ui-theme

[Verdaccio](https://verdaccio.org/) UI is a [theme plugin](https://verdaccio.org/docs/en/dev-plugins#theme-plugin) build in React, Typescript and Emotion. It uses Jest and Testing Library for Unit testing.

[![verdaccio (latest)](https://img.shields.io/npm/v/@verdaccio/ui-theme/latest.svg)](https://www.npmjs.com/package/@verdaccio/ui-theme)
[![docker pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio.svg?maxAge=43200)](https://verdaccio.org/docs/en/docker.html)
[![backers](https://opencollective.com/verdaccio/tiers/backer/badge.svg?label=Backer&color=brightgreen)](https://opencollective.com/verdaccio)
[![stackshare](https://img.shields.io/badge/Follow%20on-StackShare-blue.svg?logo=stackshare&style=flat)](https://stackshare.io/verdaccio)
[![discord](https://img.shields.io/discord/388674437219745793.svg)](http://chat.verdaccio.org/)
[![node](https://img.shields.io/node/v/@verdaccio/ui-theme/latest.svg)](https://www.npmjs.com/package/@verdaccio/ui-theme)
[![MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](./LICENSE)
[![Crowdin](https://d322cqt584bo4o.cloudfront.net/verdaccio/localized.svg)](https://crowdin.com/project/verdaccio)
[![codecov](https://codecov.io/gh/verdaccio/ui/branch/master/graph/badge.svg)](https://codecov.io/gh/verdaccio/ui)

[![Twitter followers](https://img.shields.io/twitter/follow/verdaccio_npm.svg?style=social&label=Follow)](https://twitter.com/verdaccio_npm)
[![Github](https://img.shields.io/github/stars/verdaccio/verdaccio.svg?style=social&label=Stars)](https://github.com/verdaccio/verdaccio/stargazers)

## Special Thanks

Thanks to the following companies to help us to achieve our goals providing free open source licenses.

[![jetbrain](https://github.com/verdaccio/verdaccio/raw/master/assets/thanks/jetbrains/logo.png)](https://www.jetbrains.com/)
[![crowdin](https://github.com/verdaccio/verdaccio/raw/master/assets/thanks/crowdin/logo.png)](https://crowdin.com/)
[![browserstack](https://cdn.verdaccio.dev/readme/browserstack_logo.png)](https://www.browserstack.com/)

## Open Collective Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/verdaccio#sponsor)]

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

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/verdaccio#backer)]

[![backers](https://opencollective.com/verdaccio/backers.svg?width=890)](https://opencollective.com/verdaccio#backers)

## Contributors

This project exists thanks to all the people who contribute.

[![contrubitors](https://opencollective.com/verdaccio/contributors.svg?width=890&button=true)](../../graphs/contributors)

### FAQ / Contact / Troubleshoot

If you have any issue you can try the following options, do no desist to ask or check our issues database, perhaps someone has asked already what you are looking for.

- [Blog](https://medium.com/verdaccio)
- [Donations](https://opencollective.com/verdaccio)
- [Roadmaps](https://github.com/verdaccio/ui/projects)
- [Reporting an issue](https://github.com/verdaccio/verdaccio/blob/master/CONTRIBUTING.md#reporting-a-bug)
- [Running discussions](https://github.com/verdaccio/verdaccio/issues?q=is%3Aissue+is%3Aopen+label%3Adiscuss)
- [Chat](http://chat.verdaccio.org/)
- [Logos](https://verdaccio.org/docs/en/logo)
- [FAQ](https://github.com/verdaccio/verdaccio/issues?utf8=%E2%9C%93&q=is%3Aissue%20label%3Aquestion%20)
- [Docker Examples](https://github.com/verdaccio/docker-examples)

### Translations

Translations are handled locally. I18n files can be found in the folder `i18n/translations/*` of this repository. We would love to provide translations from other languages, embracing all our users, but unfortunately we cannot do this without your help. Would you like to help us? Please feel **super welcome** to add a locale by opening a pull request.

Your PR should contain:

1 - A json file in the folder `i18n/translations/*` with the translations. The file must be named according to the new added language

2 - The files `i18n/config.ts` and `LanguageSwitch.tsx` updated with the new language. Please see the current structure

3 - The other translations containing the new language in the language of the file. Example:

New language: `cs_CZ `

The file `pt-BR ` should contain:

```
"lng": {
    ...,
    "czech": "Tcheco"
}
```

4 - A SVG flag of the new translated language in the the folder `src/components/Icon/img/*`. You maybe want to compress the svg file using https://jakearchibald.github.io/svgomg/

### License

Verdaccio is [MIT licensed](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
