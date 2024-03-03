import React from 'react';
import { Route as ReactRouterDomRoute, Switch } from 'react-router-dom';

import { NotFound, Route, VersionProvider, loadable } from '../index';

const VersionPage = loadable(() => import(/* webpackChunkName: "Version" */ './pages/Version'));
const Front = loadable(() => import(/* webpackChunkName: "Home" */ './pages/Front'));

const AppRoute: React.FC = () => {
  return (
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
  );
};

export default AppRoute;
