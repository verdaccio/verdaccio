import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, delay, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { SWRConfig } from 'swr';

import type { TemplateUIOptions } from '@verdaccio/types';

import homeData from '../../../vitest/api/home.json';
import { AppConfigurationProvider, ManifestsProvider } from '../../providers';
import Home from './Home';
import { registryPackages } from './__stories__/storyFixtures';
import { BackToList, packagePageHandlers, packagePageRoutes } from './__stories__/storyRoutes';

type Story = StoryObj<typeof Home>;
const meta: Meta<typeof Home> = {
  title: 'Sections/Home',
  component: Home,
};

export default meta;

const PACKAGES_URL = 'https://my.company.example/-/verdaccio/data/packages';

// a fresh SWR cache per story, otherwise switching stories shows the previous list
const renderHome = (initialEntry = '/', config: Partial<TemplateUIOptions> = {}) => (
  <SWRConfig value={{ provider: () => new Map() }}>
    <MemoryRouter initialEntries={[initialEntry]}>
      <BackToList />
      <Routes>
        <Route
          element={
            <AppConfigurationProvider
              overrideConfig={{ base: 'http://localhost:4873/', login: true, ...config }}
            >
              <ManifestsProvider>
                <Home />
              </ManifestsProvider>
            </AppConfigurationProvider>
          }
          path="/"
        />
        {packagePageRoutes}
      </Routes>
    </MemoryRouter>
  </SWRConfig>
);

const packagesHandler = (data: unknown[], wait = 300) =>
  http.get(PACKAGES_URL, async () => {
    await delay(wait);
    return HttpResponse.json(data);
  });

export const HomeDefault: Story = {
  render: () => renderHome(),
  parameters: {
    msw: {
      handlers: [
        http.get(PACKAGES_URL, async () => {
          await delay(3000);
          return HttpResponse.json([...homeData]);
        }),
      ],
    },
  },
};

export const EmptyRegistry: Story = {
  name: 'Empty registry (welcome)',
  render: () => renderHome(),
  parameters: { msw: { handlers: [packagesHandler([])] } },
};

export const SinglePackage: Story = {
  name: 'Single package (no toolbar)',
  render: () => renderHome(),
  parameters: {
    msw: { handlers: [packagesHandler(registryPackages.slice(0, 1)), ...packagePageHandlers] },
  },
};

export const ScopedPackages: Story = {
  name: 'Several scopes',
  render: () => renderHome(),
  parameters: { msw: { handlers: [packagesHandler(registryPackages), ...packagePageHandlers] } },
};

export const FilteredFromUrl: Story = {
  name: 'Filter restored from the address (?q=verdaccio)',
  render: () => renderHome('/?q=verdaccio'),
  parameters: { msw: { handlers: [packagesHandler(registryPackages), ...packagePageHandlers] } },
};

export const ScopeFromUrl: Story = {
  name: 'Scope restored from the address (?scope=@verdaccio)',
  render: () => renderHome('/?scope=@verdaccio'),
  parameters: { msw: { handlers: [packagesHandler(registryPackages), ...packagePageHandlers] } },
};

export const NoMatch: Story = {
  name: 'No package matches the filter',
  render: () => renderHome('/?q=webpack'),
  parameters: { msw: { handlers: [packagesHandler(registryPackages), ...packagePageHandlers] } },
};

export const Loading: Story = {
  name: 'Loading (skeleton)',
  render: () => renderHome(),
  parameters: {
    msw: { handlers: [packagesHandler(registryPackages, 60_000), ...packagePageHandlers] },
  },
};

export const WithoutDownload: Story = {
  name: 'Download disabled (web.showDownloadTarball: false)',
  render: () => renderHome('/', { showDownloadTarball: false }),
  parameters: { msw: { handlers: [packagesHandler(registryPackages), ...packagePageHandlers] } },
};

export const WithoutToolbar: Story = {
  name: 'Toolbar disabled (web.showPackageListToolbar: false)',
  render: () => renderHome('/', { showPackageListToolbar: false }),
  parameters: { msw: { handlers: [packagesHandler(registryPackages), ...packagePageHandlers] } },
};
