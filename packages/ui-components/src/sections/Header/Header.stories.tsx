import type { Meta, StoryObj } from '@storybook/react-vite';
import { HttpResponse, delay, http } from 'msw';
import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router';

import { HeaderInfoDialog } from '../../';
import { ThemeProvider } from '../../Theme';
import searchVerdaccio from '../../../vitest/api/search-verdaccio.json';
import storybookReadme from '../../../vitest/api/storybook-readme.js';
import storybookSidebar from '../../../vitest/api/storybook-sidebar.json';
import type { TemplateUIOptions } from '@verdaccio/types';

import { AppConfigurationProvider, SearchProvider, VersionProvider } from '../../providers';
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

const renderHeader = (config: Partial<TemplateUIOptions> = {}) => (
  <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
    <Routes>
      <Route
        element={
          <AppConfigurationProvider overrideConfig={config}>
            {/* the theme reads primaryColor from the overridden config */}
            <ThemeProvider>
              <VersionProvider>
                <SearchProvider>
                  <Header HeaderInfoDialog={CustomInfoDialog} />
                </SearchProvider>
              </VersionProvider>
            </ThemeProvider>
          </AppConfigurationProvider>
        }
        path="/-/web/detail/:package"
      />
    </Routes>
  </MemoryRouter>
);

export const HeaderAll: Story = {
  render: () => renderHeader(),
  parameters: {
    msw: {
      handlers: [
        http.get('https://my.company.example/-/verdaccio/data/sidebar/storybook', () => {
          return HttpResponse.json(storybookSidebar);
        }),
        http.get('https://my.company.example/-/verdaccio/data/package/readme/storybook', () => {
          return HttpResponse.json(storybookReadme);
        }),
        http.get('https://my.company.example/-/verdaccio/data/search/*', async ({ request }) => {
          const url = new URL(request.url);
          const rawQuery = url.pathname.split('/-/verdaccio/data/search/')[1] || '';
          const query = decodeURIComponent(rawQuery);

          const packages = searchVerdaccio;

          await delay(600);

          if (!query) {
            return HttpResponse.json(packages);
          }

          const filteredPackages = packages.filter((pkg: { name: string }) => {
            const regex = new RegExp(query, 'i'); // 'i' flag for case-insensitive
            return pkg['package'].name.match(regex) !== null;
          });
          return HttpResponse.json(filteredPackages);
        }),
        http.post('https://my.company.example/-/verdaccio/sec/login', async ({ request }) => {
          const body = (await request.json()) as { username: string; password: string };

          if (body.username === 'fail') {
            return new HttpResponse('unauthorized', { status: 401 });
          }

          return HttpResponse.json({ username: body.username, token: 'valid token' });
        }),
      ],
    },
  },
};

export const WithoutSearch: Story = {
  name: 'Search disabled (web.showSearch: false)',
  render: () => renderHeader({ showSearch: false }),
  parameters: HeaderAll.parameters,
};

export const WithoutLogin: Story = {
  name: 'Login disabled (web.login: false)',
  render: () => renderHeader({ login: false }),
  parameters: HeaderAll.parameters,
};

export const Minimal: Story = {
  name: 'Only the logo (search, info, settings and theme switch off)',
  render: () =>
    renderHeader({
      showSearch: false,
      showInfo: false,
      showSettings: false,
      showThemeSwitch: false,
      login: false,
    }),
  parameters: HeaderAll.parameters,
};

export const CustomBrand: Story = {
  name: 'Custom title and colour',
  render: () => renderHeader({ title: 'Platform registry', primaryColor: '#3949ab' }),
  parameters: HeaderAll.parameters,
};
