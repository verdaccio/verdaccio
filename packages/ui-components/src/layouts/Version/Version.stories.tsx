import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

import jqueryReadme from '../../../vitest/api/jquery-readme.js';
import jquerySidebar from '../../../vitest/api/jquery-sidebar.json';
import storybookReadme from '../../../vitest/api/storybook-readme.js';
import storybookSidebar from '../../../vitest/api/storybook-sidebar.json';
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
          return HttpResponse.json(storybookSidebar);
        }),
        http.get('https://my-registry.org/-/verdaccio/data/package/readme/storybook', () => {
          return HttpResponse.json(storybookReadme);
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
          return HttpResponse.json(jquerySidebar);
        }),
        http.get('https://my-registry.org/-/verdaccio/data/package/readme/jquery', () => {
          return HttpResponse.json(jqueryReadme);
        }),
      ],
    },
  },
};
