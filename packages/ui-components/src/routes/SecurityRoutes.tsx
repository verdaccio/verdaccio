import React from 'react';
import { Outlet, Route as RouterRoute, Routes } from 'react-router';

import NotFound from '../components/NotFound';
import { AddUser, ChangePassword, Login, Success } from '../sections/Security';
import { Route } from '../utils';

const Layout: React.FC = () => <Outlet />;

const SecurityRoutes = () => {
  return (
    <Routes>
      <RouterRoute element={<Layout />}>
        <RouterRoute element={<Login />} path={Route.LOGIN} />
        <RouterRoute element={<Success />} path={Route.SUCCESS} />
        <RouterRoute element={<AddUser />} path={Route.ADD_USER} />
        <RouterRoute element={<ChangePassword />} path={Route.CHANGE_PASSWORD} />
      </RouterRoute>
      <RouterRoute element={<NotFound />} path="*" />
    </Routes>
  );
};

export { SecurityRoutes };
