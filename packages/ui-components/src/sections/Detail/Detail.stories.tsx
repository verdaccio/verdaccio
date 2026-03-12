import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

import jqueryReadme from '../../../vitest/api/jquery-readme.js';
import jquerySidebar from '../../../vitest/api/jquery-sidebar.json';
import storybookReadme from '../../../vitest/api/storybook-readme.js';
import storybookSidebar from '../../../vitest/api/storybook-sidebar.json';
import { VersionProvider } from '../../providers';
import Detail from './Detail';

const meta: Meta<typeof Detail> = {
  title: 'Sections/Detail',
  component: Detail,
};

export default meta;

type Story = StoryObj<typeof Detail>;
const getDetailApp = (url: string) => (
  <MemoryRouter initialEntries={[url]}>
    <Routes>
      <Route
        element={
          <VersionProvider>
            <Detail />
          </VersionProvider>
        }
        path="/-/web/detail/:package"
      />
    </Routes>
  </MemoryRouter>
);

export const DetailStorybook: Story = {
  render: () => getDetailApp(`/-/web/detail/storybook`),
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

export const DetailJquery: Story = {
  render: () => getDetailApp(`/-/web/detail/jquery`),
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

export const DetailForbidden: Story = {
  render: () => getDetailApp(`/-/web/detail/JSONStream`),
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
