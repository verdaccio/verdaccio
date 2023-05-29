import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { VersionProvider } from '../../providers';
import Detail from './Detail';

export default {
  title: 'Sections/Detail',
};

export const DetailStorybook: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
    <Route exact={true} path="/-/web/detail/:package">
      <VersionProvider>
        <Detail />
      </VersionProvider>
    </Route>
  </MemoryRouter>
);

export const DetailJquery: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/jquery`]}>
    <Route exact={true} path="/-/web/detail/:package">
      <VersionProvider>
        <Detail />
      </VersionProvider>
    </Route>
  </MemoryRouter>
);
