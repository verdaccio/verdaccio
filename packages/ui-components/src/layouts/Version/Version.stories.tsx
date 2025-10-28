import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { VersionProvider } from '../../providers';
import VersionLayout from './Version';

const meta: Meta<typeof VersionLayout> = {
  title: 'Layout/Version',
  component: VersionLayout,
};

export default meta;

type Story = StoryObj<typeof VersionLayout>;

export const Primary: Story = {
  name: 'Storybook',
  render: () => {
    return (
      <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
        <Route exact={true} path="/-/web/detail/:package">
          <VersionProvider>
            <VersionLayout />
          </VersionProvider>
        </Route>
      </MemoryRouter>
    );
  },
  parameters: {
    msw: {
      handlers: [
        http.get('https://my-registry.org/-/verdaccio/data/sidebar/storybook', () => {
          return HttpResponse.json(require('../../../vitest/api/storybook-sidebar.json'));
        }),
        http.get('https://my-registry.org/-/verdaccio/data/package/readme/storybook', () => {
          return HttpResponse.json(require('../../../vitest/api/storybook-readme')());
        }),
      ],
    },
  },
};

export const jQuery: Story = {
  name: 'jQuery',
  render: () => {
    return (
      <MemoryRouter initialEntries={[`/-/web/detail/jquery`]}>
        <Route exact={true} path="/-/web/detail/:package">
          <VersionProvider>
            <VersionLayout />
          </VersionProvider>
        </Route>
      </MemoryRouter>
    );
  },
  parameters: {
    msw: {
      handlers: [
        http.get('https://my-registry.org/-/verdaccio/data/sidebar/jquery', () => {
          return HttpResponse.json(require('../../../vitest/api/jquery-sidebar.json'));
        }),
        http.get('https://my-registry.org/-/verdaccio/data/package/readme/jquery', () => {
          return HttpResponse.json(require('../../../vitest/api/jquery-readme')());
        }),
      ],
    },
  },
};
