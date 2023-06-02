import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { VersionProvider } from '../../providers';
import DetailSidebar from './Sidebar';

export default {
  title: 'Sections/Sidebar',
};

export const SidebarLatestPackage: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
    <Route exact={true} path="/-/web/detail/:package">
      <VersionProvider>
        <DetailSidebar />
      </VersionProvider>
    </Route>
  </MemoryRouter>
);

export const SidebarPackageVersion: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/storybook/v/6.0.26`]}>
    <Route exact={true} path="/-/web/detail/:package/v/:version">
      <VersionProvider>
        <DetailSidebar />
      </VersionProvider>
    </Route>
  </MemoryRouter>
);

export const SidebarNoFounding: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/jquery`]}>
    <Route exact={true} path="/-/web/detail/:package">
      <VersionProvider>
        <DetailSidebar />
      </VersionProvider>
    </Route>
  </MemoryRouter>
);
