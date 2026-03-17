import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter } from 'react-router';

import jqueryReadme from '../../vitest/api/jquery-readme.js';
import jquerySidebar from '../../vitest/api/jquery-sidebar.json';
import storybookReadme from '../../vitest/api/storybook-readme.js';
import storybookSidebar from '../../vitest/api/storybook-sidebar.json';
import AppRoute from './AppRoute';

const meta: Meta<typeof AppRoute> = {
  title: 'App/Main',
  component: AppRoute,
};

export default meta;

type Story = StoryObj<typeof AppRoute>;

export const ApplicationStoryBook: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
      <AppRoute />
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get('https://my-registry.org/-/verdaccio/data/sidebar/storybook', () => {
          return HttpResponse.json(storybookSidebar);
        }),
        http.get('https://my-registry.org/-/verdaccio/data/package/readme/storybook', () => {
          return HttpResponse.json(storybookReadme);
        }),
      ],
    },
  },
};

export const ApplicationJquery: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/-/web/detail/jquery`]}>
      <AppRoute />
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get('https://my-registry.org/-/verdaccio/data/sidebar/jquery', () => {
          return HttpResponse.json(jquerySidebar);
        }),
        http.get('https://my-registry.org/-/verdaccio/data/package/readme/jquery', () => {
          return HttpResponse.json(jqueryReadme);
        }),
      ],
    },
  },
};

export const ApplicationForbidden: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/-/web/detail/JSONStream`]}>
      <AppRoute />
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get('https://my-registry.org/-/verdaccio/data/sidebar/JSONStream', () => {
          return new HttpResponse('unauthorized', { status: 401 });
        }),
      ],
    },
  },
};

export const ApplicationNotFound: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/-/web/detail/kleur`]}>
      <AppRoute />
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get('https://my-registry.org/-/verdaccio/data/sidebar/kleur', () => {
          return new HttpResponse(null, { status: 404 });
        }),
      ],
    },
  },
};
