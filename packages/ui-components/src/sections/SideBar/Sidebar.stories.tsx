import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

import storybookReadme from '../../../vitest/api/storybook-readme.js';
import storybookSidebar from '../../../vitest/api/storybook-sidebar.json';
import { VersionProvider } from '../../providers';
import DetailSidebar from './Sidebar';

const meta: Meta<typeof DetailSidebar> = {
  title: 'Sections/Sidebar',
  component: DetailSidebar,
};

export default meta;

type Story = StoryObj<typeof DetailSidebar>;

const handlers = [
  http.get('https://my-registry.org/-/verdaccio/data/sidebar/storybook', () => {
    return HttpResponse.json(storybookSidebar);
  }),
  http.get('https://my-registry.org/-/verdaccio/data/package/readme/storybook', () => {
    return HttpResponse.json(storybookReadme);
  }),
  http.get('https://my-registry.org/storybook/-/storybook-6.5.15.tgz', () => {
    const content = 'fake tarball content';

    const blob = new Blob([content], {
      type: 'application/gzip',
    });

    return new HttpResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/gzip',
        'Content-Disposition': 'attachment; filename="storybook-6.5.15.tgz"',
      },
    });
  }),
];

export const SidebarLatestPackage: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
      <Routes>
        <Route
          element={
            <VersionProvider>
              <DetailSidebar />
            </VersionProvider>
          }
          path="/-/web/detail/:package"
        />
      </Routes>
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers,
    },
  },
};

export const SidebarPackageVersion: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/-/web/detail/storybook/v/6.0.26`]}>
      <Routes>
        <Route
          element={
            <VersionProvider>
              <DetailSidebar />
            </VersionProvider>
          }
          path="/-/web/detail/:package/v/:version"
        />
      </Routes>
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers,
    },
  },
};
