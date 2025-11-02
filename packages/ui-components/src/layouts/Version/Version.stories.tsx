import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

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
        <Routes>
          <Route
            element={
              <VersionProvider>
                <VersionLayout />
              </VersionProvider>
            }
            path="/-/web/detail/:package"
          />
        </Routes>
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
        <Routes>
          <Route
            element={
              <VersionProvider>
                <VersionLayout />
              </VersionProvider>
            }
            path="/-/web/detail/:package"
          />
        </Routes>
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
