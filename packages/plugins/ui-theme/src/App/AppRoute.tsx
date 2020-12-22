import { createBrowserHistory } from 'history';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Route as ReactRouterDomRoute, Switch, Router } from 'react-router-dom';

import AppContext from './AppContext';
import loadable from './utils/loadable';

const NotFound = loadable(() =>
  import(/* webpackChunkName: "NotFound" */ 'verdaccio-ui/components/NotFound')
);
const VersionContextProvider = loadable(() =>
  import(/* webpackChunkName: "Provider" */ '../pages/Version/VersionContextProvider')
);
const VersionPage = loadable(() => import(/* webpackChunkName: "Version" */ '../pages/Version'));
const HomePage = loadable(() => import(/* webpackChunkName: "Home" */ '../pages/home'));

enum Route {
  ROOT = '/',
  SCOPE_PACKAGE = '/-/web/detail/@:scope/:package',
  SCOPE_PACKAGE_VERSION = '/-/web/detail/@:scope/:package/v/:version',
  PACKAGE = '/-/web/detail/:package',
  PACKAGE_VERSION = '/-/web/detail/:package/v/:version',
}

export const history = createBrowserHistory({
  // @ts-ignore
  basename:
    window.__VERDACCIO_BASENAME_UI_OPTIONS && window.__VERDACCIO_BASENAME_UI_OPTIONS.url_prefix,
});

const AppRoute: React.FC = () => {
  const appContext = useContext(AppContext);
  const { t } = useTranslation();

  if (!appContext) {
    throw Error(t('app-context-not-correct-used'));
  }

  const { user } = appContext;

  const isUserLoggedIn = user && user.username;

  return (
    <Router history={history}>
      <Switch>
        <ReactRouterDomRoute exact={true} path={Route.ROOT}>
          <HomePage isUserLoggedIn={!!isUserLoggedIn} />
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.PACKAGE}>
          <VersionContextProvider>
            <VersionPage />
          </VersionContextProvider>
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.PACKAGE_VERSION}>
          <VersionContextProvider>
            <VersionPage />
          </VersionContextProvider>
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.SCOPE_PACKAGE_VERSION}>
          <VersionContextProvider>
            <VersionPage />
          </VersionContextProvider>
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.SCOPE_PACKAGE}>
          <VersionContextProvider>
            <VersionPage />
          </VersionContextProvider>
        </ReactRouterDomRoute>
        <ReactRouterDomRoute>
          <NotFound />
        </ReactRouterDomRoute>
      </Switch>
    </Router>
  );
};

export default AppRoute;
