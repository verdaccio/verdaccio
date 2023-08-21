# UI Components

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

### The store

All components assume there is a Redux storage, thus a `<Provider/>` wrap is the required that wrap the application.

```jsx
import { store } from '@verdaccio/ui-components';

<Provider store={store}>....APP</Provider>;
```

The default storage is powered by Rematch and contains the required `dispatch` to fetch data from the registry.

- Fetch all private packages

```jsx
import { useDispatch, useSelector } from 'react-redux';

const packages = useSelector((state: RootState) => state.packages.response);
useEffect(() => {
  dispatch.packages.getPackages();
}, [dispatch]);
```

## How to use it

```jsx
import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import {
  Home,
  store,
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
      <Provider store={store}>
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
      </Provider>
  );
};
``
```
