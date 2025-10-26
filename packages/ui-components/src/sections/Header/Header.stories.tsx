import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { HeaderInfoDialog } from '../../';
import { VersionProvider } from '../../providers';
import Header from './Header';

type Story = StoryObj<typeof Header>;
const meta: Meta<typeof Header> = {
  title: 'Sections/Header',
  component: Header,
};

export default meta;

function CustomInfoDialog({ onCloseDialog, title, isOpen }) {
  return (
    <HeaderInfoDialog
      dialogTitle={title}
      isOpen={isOpen}
      onCloseDialog={onCloseDialog}
      tabPanels={[
        { element: <div>{'foo'}</div> },
        { element: <div>{'bar'}</div> },
        { element: <div>{'fooBar'}</div> },
      ]}
      tabs={[{ label: 'foo' }, { label: 'bar' }, { label: 'barFoo' }]}
    />
  );
}

export const HeaderAll: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
      <Route exact={true} path="/-/web/detail/:package">
        <VersionProvider>
          <Header HeaderInfoDialog={CustomInfoDialog} />
        </VersionProvider>
      </Route>
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get('https://my-registry.org/-/verdaccio/data/sidebar/storybook', () => {
          return HttpResponse.json(require('../../../vitest/api/storybook-sidebar.json'));
        }),
        http.get('https://my-registry.org/-/verdaccio/data/package/readme/storybook', () => {
          return HttpResponse.json(require('../../../vitest/api/storybook-readme')());
        }),
        http.get('https://my-registry.org/-/verdaccio/data/search/*', () => {
          return HttpResponse.json(require('../../../vitest/api/search-verdaccio.json'));
        }),
      ],
    },
  },
};
