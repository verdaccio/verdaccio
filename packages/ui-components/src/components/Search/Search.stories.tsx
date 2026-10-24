import Box from '@mui/material/Box';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, http } from 'msw';
import React, { useEffect } from 'react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router';
import { action } from 'storybook/actions';
import { userEvent, within } from 'storybook/test';

import searchVerdaccio from '../../../vitest/api/search-verdaccio.json';
import { AppConfigurationProvider, SearchProvider } from '../../providers';
import Home from '../../sections/Home';
import Search from './Search';

/**
 * Fires a Storybook action whenever the route changes (e.g. on search-item click).
 */
const NavigationLogger: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    action('navigate')({ pathname: location.pathname, search: location.search });
  }, [location]);
  return null;
};

type Story = StoryObj<typeof Search>;
const meta: Meta<typeof Search> = {
  title: 'Components/Header/Search',
  component: Home,
};

export default meta;

export const SearchByQuery: Story = {
  render: (args) => (
    <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
      <NavigationLogger />
      <Routes>
        <Route
          element={
            <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
              <SearchProvider>
                <Search {...args} />
              </SearchProvider>
            </Box>
          }
          path="*"
        />
      </Routes>
    </MemoryRouter>
  ),
  parameters: {
    msw: {
      handlers: [
        http.get('https://my.company.example/-/verdaccio/data/search/*', ({ request }) => {
          const url = new URL(request.url);
          const rawQuery = url.pathname.split('/-/verdaccio/data/search/')[1] || '';
          const query = decodeURIComponent(rawQuery);

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

const result = (
  name: string,
  version: string,
  description: string,
  flags: { verdaccioPrivate?: boolean; verdaccioPkgCached?: boolean } = {}
) => ({ package: { name, version, description }, ...flags });

// what /-/verdaccio/data/search returns with uplinks: published here, cached, or only upstream
const mixedResults = [
  result('@verdaccio/ui-components', '5.0.0', 'React components of the Verdaccio web UI', {
    verdaccioPrivate: true,
  }),
  result('react', '19.2.0', 'React is a JavaScript library for building user interfaces.', {
    verdaccioPkgCached: true,
  }),
  result('react-dom', '19.2.0', 'React package for working with the DOM.', {
    verdaccioPkgCached: true,
  }),
  result('react-router', '7.9.4', 'Declarative routing for React', {}),
  result('react-redux', '9.2.0', 'Official React bindings for Redux', {}),
  result('@tanstack/react-query', '5.90.2', 'Hooks for managing server state in React', {}),
];

const searchHandler = (results: unknown[]) =>
  http.get('https://my.company.example/-/verdaccio/data/search/*', ({ request }) => {
    const query = decodeURIComponent(
      new URL(request.url).pathname.split('/-/verdaccio/data/search/')[1] || ''
    ).toLowerCase();
    return HttpResponse.json(
      results.filter((item: any) =>
        `${item.package.name} ${item.package.description}`.toLowerCase().includes(query)
      )
    );
  });

const renderSearch = (showUplinks: boolean) => () => (
  <MemoryRouter initialEntries={['/']}>
    <NavigationLogger />
    <Routes>
      <Route
        element={
          <AppConfigurationProvider overrideConfig={{ showUplinks }}>
            <Box component="section" sx={{ minHeight: 480 }}>
              {/* the search field is styled for the header bar */}
              <Box sx={{ bgcolor: 'primary.main', px: 2, py: 1 }}>
                <SearchProvider>
                  <Search />
                </SearchProvider>
              </Box>
            </Box>
          </AppConfigurationProvider>
        }
        path="*"
      />
    </Routes>
  </MemoryRouter>
);

const typeReact = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  const input = within(canvasElement).getByPlaceholderText(/search/i);
  await userEvent.click(input);
  await userEvent.type(input, 'react');
};

export const RemoteEnabled: Story = {
  name: 'Uplinks shown: published, cached and remote groups',
  render: renderSearch(true),
  play: typeReact,
  parameters: { msw: { handlers: [searchHandler(mixedResults)] } },
};

export const RemoteDisabled: Story = {
  name: 'Uplinks hidden (showUplinks: false): flat list',
  render: renderSearch(false),
  play: typeReact,
  parameters: { msw: { handlers: [searchHandler(mixedResults)] } },
};

export const OnlyLocal: Story = {
  name: 'Only packages published here',
  render: renderSearch(true),
  play: typeReact,
  parameters: {
    msw: {
      handlers: [
        searchHandler([
          result('@verdaccio/ui-components', '5.0.0', 'React components of the Verdaccio web UI', {
            verdaccioPrivate: true,
          }),
        ]),
      ],
    },
  },
};

export const NoResults: Story = {
  name: 'No results',
  render: renderSearch(true),
  play: typeReact,
  parameters: { msw: { handlers: [searchHandler([])] } },
};
