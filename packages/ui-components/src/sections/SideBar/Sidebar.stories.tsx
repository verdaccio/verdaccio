import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

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
    return HttpResponse.json(require('../../../vitest/api/storybook-sidebar.json'));
  }),
  http.get('https://my-registry.org/-/verdaccio/data/package/readme/storybook', () => {
    return HttpResponse.json(require('../../../vitest/api/storybook-readme')());
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
      <Route exact={true} path="/-/web/detail/:package">
        <VersionProvider>
          <DetailSidebar />
        </VersionProvider>
      </Route>
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
      <Route exact={true} path="/-/web/detail/:package/v/:version">
        <VersionProvider>
          <DetailSidebar />
        </VersionProvider>
      </Route>
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers,
    },
  },
};
