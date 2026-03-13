import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import React from 'react';
import { MemoryRouter } from 'react-router';

import searchVerdaccio from '../../../vitest/api/search-verdaccio.json';
import { SearchProvider } from '../../providers';
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
      <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
        <SearchProvider>
          <Search {...args} />
        </SearchProvider>
      </Box>
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get('https://my-registry.org/-/verdaccio/data/search/*', ({ request }) => {
          const url = new URL(request.url);
          const query = url.searchParams.get('text');

          const packages = searchVerdaccio;

          if (!query) {
            return HttpResponse.json(packages);
          }

          const filteredPackages = packages.filter((pkg: { name: string }) => {
            const regex = new RegExp(query, 'i'); // 'i' flag for case-insensitive
            return pkg['package'].name.match(regex) !== null;
          });
          return HttpResponse.json(filteredPackages);
        }),
      ],
    },
  },
};
