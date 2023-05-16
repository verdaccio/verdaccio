import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { VersionProvider } from '../../providers';
import VersionLayout from './Version';

const meta: Meta<typeof VersionLayout> = {
  title: 'VersionLayout',
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
};
