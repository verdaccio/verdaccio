import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import AppRoute from './AppRoute';

export default {
  title: 'App/Main',
};

export const Application: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
    <Route exact={true} path="/-/web/detail/:package">
      <AppRoute />
    </Route>
  </MemoryRouter>
);
