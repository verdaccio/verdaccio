# @verdaccio/ui-components - Verdaccio UI Components

[![Verdaccio Home](https://img.shields.io/badge/Homepage-Verdaccio-405236?style=flat)](https://verdaccio.org)
[![MIT License](https://img.shields.io/github/license/verdaccio/verdaccio?label=License&color=405236)](https://github.com/verdaccio/verdaccio/blob/master/LICENSE)
[![Verdaccio Latest](https://img.shields.io/npm/v/verdaccio?label=Latest%20Version&color=405236)](https://github.com/verdaccio/verdaccio)
[![This Package Latest](https://img.shields.io/npm/v/@verdaccio/ui-components?label=@verdaccio/ui-components&color=405236)](https://npmjs.com/package/@verdaccio/ui-components)

[![Documentation](https://img.shields.io/badge/Help-Verdaccio?style=flat&logo=Verdaccio&label=Verdaccio&color=cd4000)](https://verdaccio.org/docs)
[![Discord](https://img.shields.io/badge/Chat-Discord?style=flat&logo=Discord&label=Discord&color=cd4000)](https://discord.com/channels/388674437219745793)
[![Bluesky](https://img.shields.io/badge/Follow-Bluesky?style=flat&logo=Bluesky&label=Bluesky&color=cd4000)](https://bsky.app/profile/verdaccio.org)
[![Backers](https://img.shields.io/opencollective/backers/verdaccio?style=flat&logo=opencollective&label=Join%20Backers&color=cd4000)](https://opencollective.com/verdaccio/contribute)
[![Sponsors](https://img.shields.io/opencollective/sponsors/verdaccio?style=flat&logo=opencollective&label=Sponsor%20Us&color=cd4000)](https://opencollective.com/verdaccio/contribute)

[![Verdaccio Downloads](https://img.shields.io/npm/dm/verdaccio?style=flat&logo=npm&label=Npm%20Downloads&color=lightgrey)](https://www.npmjs.com/package/verdaccio)
[![Docker Pulls](https://img.shields.io/docker/pulls/verdaccio/verdaccio?style=flat&logo=docker&label=Docker%20Pulls&color=lightgrey)](https://hub.docker.com/r/verdaccio/verdaccio)
[![GitHub Stars](https://img.shields.io/github/stars/verdaccio?style=flat&logo=github&label=GitHub%20Stars%20%E2%AD%90&color=lightgrey)](https://github.com/verdaccio/verdaccio/stargazers)

A collection of components ready to use for building complex user interfaces.

- `components`: Independent components to use to build different layouts, all components are based on [MUI (Material UI)](https://mui.com/).
- `providers`: Providers are useful components that uses the React [`Context`](https://reactjs.org/docs/context.html), for instance, the `VersionProvider` connects the Redux store with independent components. The `AppConfigurationProvider` is able to read the
- `store`: The Redux store powered by [`Rematch`](https://rematchjs.org), could be used with the global object `__VERDACCIO_BASENAME_UI_OPTIONS` that verdaccio uses to provide the UI configuration.
- `theme`: The `ThemeProvider` is an abstraction of the _material-ui_ theme provider.
- `sections`: A group of components to setup quickly sections of the application, like the sidebar, header of footer.
- `layouts`: Are the combination of one or more sections ready to use.
- `hooks`: A collection of useful React hooks.

```bash
npm i -D @verdaccio/ui-components@7-next
```

## Requirements

The set of components requires libraries available in a project:

- React >17
- Material UI >5.x
- Redux >4.x
- Emotion >11
- i18next >20.x
- TypeScript is optional but recommended.

## How to use it

```jsx
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import {
  Home,
  Loading,
  NotFound,
  Route as Routes,
  TranslatorProvider,
  VersionProvider,
  loadable,
} from '@verdaccio/ui-components';

// to enable webpack code splitting
const VersionPage = loadable(() => import('../pages/Version'));

const App: React.FC = () => {
  // configuration from config.yaml
  const { configOptions } = useConfig();
  const listLanguages = [{lng: 'en-US', icon: <someSVGIcon>, menuKey: 'lng.english'}];
  return (
    <AppConfigurationProvider>
      <ThemeProvider>
        <TranslatorProvider i18n={i18n} listLanguages={listLanguages} onMount={() => {}}>
          <Suspense fallback={<Loading />}>
            <Router history={history}>
              <Header HeaderInfoDialog={CustomInfoDialog} />
                <Switch>
                  <Route exact={true} path={Routes.ROOT}>
                    <Home />
                  </Route>
                  <Route exact={true} path={Routes.SCOPE_PACKAGE}>
                    <VersionProvider>
                      <VersionPage />
                    </VersionProvider>
                  </Route>
                </Switch>
            </Router>
            {configOptions.showFooter && <Footer />}
          </Suspense>
        </TranslatorProvider>
      </ThemeProvider>
    </AppConfigurationProvider>
  );
};
``
```

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
