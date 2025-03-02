import type { Meta, StoryObj } from '@storybook/react';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import Home from './Home';

type Story = StoryObj<typeof Home>;
const meta: Meta<typeof Home> = {
  title: 'Sections/Home',
  component: Home,
};

export default meta;

export const HomeDefault: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/`]}>
      <Route exact={true} path="/">
        <Home />
      </Route>
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get('https://my-registry.org/-/verdaccio/data/packages', () => {
          return HttpResponse.json([...require('../../../vitest/api/home.json')]);
        }),
      ],
    },
  },
};
