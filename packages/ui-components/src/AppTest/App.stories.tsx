import React from 'react';
import { MemoryRouter } from 'react-router';

import AppRoute from './AppRoute';

export default {
  title: 'App/Main',
};

export const ApplicationStoryBook: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
    <AppRoute />
  </MemoryRouter>
);

export const ApplicationjQuery: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/jquery`]}>
    <AppRoute />
  </MemoryRouter>
);

export const ApplicationForbidden: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/JSONStream`]}>
    <AppRoute />
  </MemoryRouter>
);

export const ApplicationNotFound: any = () => (
  <MemoryRouter initialEntries={[`/-/web/detail/kleur`]}>
    <AppRoute />
  </MemoryRouter>
);
