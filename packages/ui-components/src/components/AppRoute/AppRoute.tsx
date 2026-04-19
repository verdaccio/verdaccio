import React from 'react';
import { Outlet, Route as RouterRoute, Routes } from 'react-router';
import { SWRConfig } from 'swr';

import { ManifestsProvider, VersionProvider } from '../../providers';
import { useConfig } from '../../providers/AppConfigurationProvider/AppConfigurationProvider';
import { Route } from '../../utils';
import loadable from '../../utils/loadable';
import NotFound from '../NotFound';

const VersionPage = loadable(() => import('../../pages/Version'));
const Front = loadable(() => import('../../pages/Front'));
const Login = loadable(() => import('../../pages/Security/Login'));
const Success = loadable(() => import('../../pages/Security/Success'));
const AddUser = loadable(() => import('../../pages/Security/AddUser'));
const ChangePassword = loadable(() => import('../../pages/Security/ChangePassword'));

const versionElement = (
  <VersionProvider>
    <VersionPage />
  </VersionProvider>
);

const AppRoute: React.FC = () => {
  const { configOptions } = useConfig();
  const createUserEnabled = configOptions?.flags?.createUser;
  const changePasswordEnabled = configOptions?.flags?.changePassword;
  return (
    <SWRConfig value={{ revalidateOnFocus: false, revalidateOnReconnect: false }}>
      <Routes>
        <RouterRoute
          element={
            <ManifestsProvider>
              <Front />
            </ManifestsProvider>
          }
          path={Route.ROOT}
        />
        <RouterRoute element={versionElement} path={Route.SCOPE_PACKAGE_VERSION} />
        <RouterRoute element={versionElement} path={Route.SCOPE_PACKAGE} />
        <RouterRoute element={versionElement} path={Route.PACKAGE_VERSION} />
        <RouterRoute element={versionElement} path={Route.PACKAGE} />
        <RouterRoute element={<Outlet />}>
          <RouterRoute element={<Login />} path={Route.LOGIN} />
          <RouterRoute element={<Success />} path={Route.SUCCESS} />
          {createUserEnabled && <RouterRoute element={<AddUser />} path={Route.ADD_USER} />}
          {changePasswordEnabled && (
            <RouterRoute element={<ChangePassword />} path={Route.CHANGE_PASSWORD} />
          )}
        </RouterRoute>
        <RouterRoute element={<NotFound />} path="*" />
      </Routes>
    </SWRConfig>
  );
};

export default AppRoute;
