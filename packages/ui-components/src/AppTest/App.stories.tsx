import type { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter } from 'react-router';

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
          return HttpResponse.json(require('../../vitest/api/storybook-sidebar.json'));
        }),
        http.get('https://my-registry.org/-/verdaccio/data/package/readme/storybook', () => {
          return HttpResponse.json(require('../../vitest/api/storybook-readme')());
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
          return HttpResponse.json(require('../../vitest/api/jquery-sidebar.json'));
        }),
        http.get('https://my-registry.org/-/verdaccio/data/package/readme/jquery', () => {
          return HttpResponse.json(require('../../vitest/api/jquery-readme')());
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
          return new HttpResponse('unauthorized', { status: 404 });
        }),
      ],
    },
  },
};
