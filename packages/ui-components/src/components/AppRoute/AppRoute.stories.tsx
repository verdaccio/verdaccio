import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, delay, http } from 'msw';
import React from 'react';
import { MemoryRouter, useLocation } from 'react-router';
import { INITIAL_VIEWPORTS } from 'storybook/viewport';

import { Header, SearchProvider } from '../../';
import homeRoute from '../../../vitest/api/home-route.json';
import searchVerdaccio from '../../../vitest/api/search-verdaccio.json';
import storybookReadme from '../../../vitest/api/storybook-readme.js';
import storybookSidebar from '../../../vitest/api/storybook-sidebar.json';
import verdaccioAuthSidebar from '../../../vitest/api/verdaccio-auth-sidebar.json';
import verdaccioProxySidebar from '../../../vitest/api/verdaccio-proxy-sidebar.json';
import verdaccioUiSidebar from '../../../vitest/api/verdaccio-ui-sidebar.json';
import { Route } from '../../utils';
import AppRoute from './AppRoute';

const AppWithHeader: React.FC = () => {
  const location = useLocation();
  const isPlainHeader = [
    Route.LOGIN,
    Route.SUCCESS,
    Route.ADD_USER,
    Route.CHANGE_PASSWORD,
  ].includes(location.pathname as Route);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SearchProvider>
        <Header isPlainHeader={isPlainHeader} />
      </SearchProvider>
      <div style={{ flexGrow: 1 }}>
        <AppRoute />
      </div>
    </div>
  );
};

const meta: Meta<typeof AppRoute> = {
  title: 'Components/AppRoute',
  component: AppRoute,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: INITIAL_VIEWPORTS,
    },
  },
};

export default meta;

type Story = StoryObj<typeof AppRoute>;

const sidebarByPackage: Record<string, any> = {
  storybook: storybookSidebar,
  '@verdaccio/ui-components': verdaccioUiSidebar,
  '@verdaccio/auth': verdaccioAuthSidebar,
  '@verdaccio/proxy': verdaccioProxySidebar,
};

const readmeByPackage: Record<string, string> = {
  storybook: storybookReadme,
  '@verdaccio/ui-components':
    '<h1>@verdaccio/ui-components</h1>\n<p>Shared React components for the Verdaccio UI. Built with MUI and Emotion.</p>',
  '@verdaccio/auth':
    '<h1>@verdaccio/auth</h1>\n<p>Authentication handler for Verdaccio with JWT support and a flexible plugin system.</p>',
  '@verdaccio/proxy':
    '<h1>@verdaccio/proxy</h1>\n<p>Proxy module for forwarding requests to uplink registries with built-in caching.</p>',
};

function extractPackageName(url: string): string {
  const parts = url.split('/');
  // scoped: .../@scope/name or unscoped: .../name
  const lastPart = parts[parts.length - 1];
  const secondLast = parts[parts.length - 2];
  if (secondLast?.startsWith('@')) {
    return `${secondLast}/${lastPart}`;
  }
  return lastPart;
}

const handlers = [
  http.get('https://my-registry.org/-/verdaccio/data/packages', () => {
    return HttpResponse.json([...homeRoute]);
  }),
  http.get('https://my-registry.org/-/verdaccio/data/sidebar/*', ({ request }) => {
    const pkgName = extractPackageName(request.url);
    return HttpResponse.json(sidebarByPackage[pkgName] ?? sidebarByPackage['storybook']);
  }),
  http.get('https://my-registry.org/-/verdaccio/data/package/readme/*', ({ request }) => {
    const pkgName = extractPackageName(request.url);
    return HttpResponse.json(readmeByPackage[pkgName] ?? readmeByPackage['storybook']);
  }),
  http.get('https://my-registry.org/-/verdaccio/data/search/*', async ({ request }) => {
    const url = new URL(request.url);
    const rawQuery = url.pathname.split('/-/verdaccio/data/search/')[1] || '';
    const query = decodeURIComponent(rawQuery);
    console.warn('search query', query);
    const packages = searchVerdaccio;
    await delay(600);
    if (!query) {
      return HttpResponse.json(packages);
    }
    const filteredPackages = packages.filter((pkg: { package: { name: string } }) => {
      const matches = pkg.package.name.match(new RegExp(query, 'i')) !== null;
      return matches;
    });
    console.warn('filteredPackages', filteredPackages);
    return HttpResponse.json(filteredPackages);
  }),
  http.post('https://my-registry.org/-/verdaccio/sec/login', async ({ request }) => {
    const body = (await request.json()) as { username: string; password: string };
    if (body.username === 'fail') {
      return new HttpResponse('unauthorized', { status: 401 });
    }
    return HttpResponse.json({ username: body.username, token: 'valid-token' });
  }),
];

export const Navigation: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/`]}>
      <AppWithHeader />
    </MemoryRouter>
  ),
  parameters: {
    msw: { handlers },
  },
};

export const ScopedPackage: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/-/web/detail/@scope/storybook`]}>
      <AppWithHeader />
    </MemoryRouter>
  ),
  parameters: {
    msw: { handlers },
  },
};

export const NavigationMobile: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/`]}>
      <AppWithHeader />
    </MemoryRouter>
  ),
  parameters: {
    msw: { handlers },
  },
  globals: {
    viewport: { value: 'iphone6', isRotated: false },
  },
};

export const ScopedPackageMobile: Story = {
  render: () => (
    <MemoryRouter initialEntries={[`/-/web/detail/@scope/storybook`]}>
      <AppWithHeader />
    </MemoryRouter>
  ),
  parameters: {
    msw: { handlers },
  },
  globals: {
    viewport: { value: 'iphone6', isRotated: false },
  },
};
