import { createBrowserHistory } from 'history';
import React from 'react';
import { Route as ReactRouterDomRoute, Router, Switch } from 'react-router-dom';

import { NotFound, Route, VersionProvider, loadable } from '@verdaccio/ui-components';

const VersionPage = loadable(() => import(/* webpackChunkName: "Version" */ '../pages/Version'));
const Front = loadable(() => import(/* webpackChunkName: "Home" */ '../pages/Front'));

export const history = createBrowserHistory({
  // @ts-ignore
  basename: window?.__VERDACCIO_BASENAME_UI_OPTIONS?.url_prefix,
});

const AppRoute: React.FC = () => {
  return (
    <Router history={history}>
      <Switch>
        <ReactRouterDomRoute exact={true} path={Route.ROOT}>
          <Front />
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.PACKAGE}>
          <VersionProvider>
            <VersionPage />
          </VersionProvider>
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.PACKAGE_VERSION}>
          <VersionProvider>
            <VersionPage />
          </VersionProvider>
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.SCOPE_PACKAGE_VERSION}>
          <VersionProvider>
            <VersionPage />
          </VersionProvider>
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.SCOPE_PACKAGE}>
          <VersionProvider>
            <VersionPage />
          </VersionProvider>
        </ReactRouterDomRoute>
        <ReactRouterDomRoute>
          <NotFound />
        </ReactRouterDomRoute>
      </Switch>
    </Router>
  );
};

export default AppRoute;
