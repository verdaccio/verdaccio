/* eslint-disable verdaccio/jsx-spread */
import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter } from 'react-router';

import Home from '../../sections/Home';
import Search from './Search';

type Story = StoryObj<typeof Search>;
const meta: Meta<typeof Search> = {
  title: 'Components/Header/Search',
  component: Home,
};

export default meta;

export const SearchByQuery: Story = {
  render: (args) => (
    <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
      <Box
        sx={{
          height: 100,
          padding: 10,
          backgroundColor: 'primary.dark',
          '&:hover': {
            backgroundColor: 'primary.main',
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      >
        <Search {...args} />
      </Box>
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
