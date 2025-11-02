import React from 'react';
import { Route as ReactRouterDomRoute, Switch } from 'react-router-dom';

import { NotFound, Route, VersionProvider, loadable } from '../index';
import { AuthProvider } from '../providers/AuthProvider';

const VersionPage = loadable(() => import(/* webpackChunkName: "Version" */ '../pages/Version'));
const Front = loadable(() => import(/* webpackChunkName: "Home" */ '../pages/Front'));
const Login = loadable(() => import(/* webpackChunkName: "Login" */ '../pages/Security/Login'));
const Success = loadable(
  () => import(/* webpackChunkName: "Success" */ '../pages/Security/Success')
);
const AddUser = loadable(
  () => import(/* webpackChunkName: "AddUser" */ '../pages/Security/AddUser')
);
const ChangePassword = loadable(
  () => import(/* webpackChunkName: "ChangePassword" */ '../pages/Security/ChangePassword')
);

const AppRoute: React.FC = () => {
  return (
    <AuthProvider>
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
        <ReactRouterDomRoute exact={true} path={Route.LOGIN}>
          <Login />
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.SUCCESS}>
          <Success />
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.ADD_USER}>
          <AddUser />
        </ReactRouterDomRoute>
        <ReactRouterDomRoute exact={true} path={Route.CHANGE_PASSWORD}>
          <ChangePassword />
        </ReactRouterDomRoute>
        <ReactRouterDomRoute>
          <NotFound />
        </ReactRouterDomRoute>
      </Switch>
    </AuthProvider>
  );
};

export default AppRoute;
