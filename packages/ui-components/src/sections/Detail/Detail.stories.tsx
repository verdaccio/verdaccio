import type { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

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
    <Route exact={true} path="/-/web/detail/:package">
      <VersionProvider>
        <Detail />
      </VersionProvider>
    </Route>
  </MemoryRouter>
);

export const DetailStorybook: Story = {
  render: () => getDetailApp(`/-/web/detail/storybook`),
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

export const DetailJquery: Story = {
  render: () => getDetailApp(`/-/web/detail/jquery`),
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
