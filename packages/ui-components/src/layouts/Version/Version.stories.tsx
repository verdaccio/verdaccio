import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { VersionProvider } from '../../providers';
import VersionLayout from './Version';

export default {
  title: 'VersionLayout',
};

export const VersionLayoutStorybook: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
    <Route exact={true} path="/-/web/detail/:package">
      <VersionProvider>
        <VersionLayout />
      </VersionProvider>
    </Route>
  </MemoryRouter>
);

export const VersionLayoutJquery: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/jquery`]}>
    <Route exact={true} path="/-/web/detail/:package">
      <VersionProvider>
        <VersionLayout />
      </VersionProvider>
    </Route>
  </MemoryRouter>
);
