import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, delay, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

import homeData from '../../../vitest/api/home.json';
import { ManifestsProvider } from '../../providers';
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
      <Routes>
        <Route
          element={
            <ManifestsProvider>
              <Home />
            </ManifestsProvider>
          }
          path="/"
        />
      </Routes>
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get('https://my-registry.org/-/verdaccio/data/packages', async () => {
          await delay(3000);
          return HttpResponse.json([...homeData]);
        }),
      ],
    },
  },
};
