import { StyledEngineProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { MemoryRouter, Route, Routes } from 'react-router';
import { SWRConfig } from 'swr';

import type { TemplateUIOptions } from '@verdaccio/types';

import { ThemeProvider } from '../Theme';
import {
  AppConfigurationProvider,
  DownloadProvider,
  PersistenceSettingProvider,
  VersionProvider,
} from '../providers';
import { AuthProvider } from '../providers/AuthProvider';
import { Route as RouterPath } from '../utils';
import i18nConfig from './i18n-config';

/**
 * Ensures the SWR library uses fresh data for each test by providing a new cache instance, preventing stale data issues across tests.
 * @param ui
 * @returns
 */
const withSWRConfig = (ui: React.ReactElement<any>) => (
  <SWRConfig value={{ provider: () => new Map() }}>{ui}</SWRConfig>
);

export const renderProviders = (
  ui: React.ReactElement<any>,
  overrideConfig: Partial<TemplateUIOptions> = {}
) => {
  return withSWRConfig(
    <PersistenceSettingProvider>
      <AppConfigurationProvider overrideConfig={overrideConfig}>
        <StyledEngineProvider injectFirst={true}>
          <ThemeProvider>
            <I18nextProvider i18n={i18nConfig}>
              <AuthProvider>
                <DownloadProvider>{ui}</DownloadProvider>
              </AuthProvider>
            </I18nextProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </AppConfigurationProvider>
    </PersistenceSettingProvider>
  );
};

const renderWith = (
  ui: React.ReactElement<any>,
  overrideConfig: Partial<TemplateUIOptions> = {}
) => {
  return render(ui, {
    wrapper: ({ children }: any) => renderProviders(children, overrideConfig),
  });
};

/**
 * Renders a component wrapped with necessary providers and a MemoryRouter for testing components that rely on routing.
 * @param ui
 * @param path
 * @returns
 */
export const renderWithRouteDetail = (
  ui: React.ReactElement<any>,
  pkgName: string = 'jquery',
  overrideConfig: Partial<TemplateUIOptions> = {}
) => {
  return renderWith(
    <MemoryRouter initialEntries={[`/-/web/detail/${pkgName}`]} initialIndex={0}>
      <Routes>
        <Route
          element={renderProviders(<VersionProvider>{ui}</VersionProvider>, overrideConfig)}
          path={RouterPath.PACKAGE}
        />
      </Routes>
    </MemoryRouter>
  );
};

export const renderWithRouter = (
  ui: React.ReactElement<any>,
  path: string,
  initialEntries: string[]
) => {
  return render(ui, {
    wrapper: ({ children }: any) =>
      withSWRConfig(
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route
              element={
                <PersistenceSettingProvider>
                  <AppConfigurationProvider>
                    <StyledEngineProvider injectFirst={true}>
                      <ThemeProvider>
                        <I18nextProvider i18n={i18nConfig}>
                          <AuthProvider>
                            <DownloadProvider>{children}</DownloadProvider>
                          </AuthProvider>
                        </I18nextProvider>
                      </ThemeProvider>
                    </StyledEngineProvider>
                  </AppConfigurationProvider>
                </PersistenceSettingProvider>
              }
              path={path}
            />
          </Routes>
        </MemoryRouter>
      ),
  });
};

/**
 *
 * @deprecated Use `renderWith` or `renderWithRouteDetail` instead for better clarity and flexibility in testing components with necessary providers and routing context.
 */
const customRender = (node: React.ReactElement, ...options: any) => {
  return render(
    withSWRConfig(
      <AppConfigurationProvider>
        <PersistenceSettingProvider>
          <ThemeProvider>
            <I18nextProvider i18n={i18nConfig}>{node}</I18nextProvider>
          </ThemeProvider>
        </PersistenceSettingProvider>
      </AppConfigurationProvider>
    ),
    ...options
  );
};

export * from '@testing-library/react';
export { customRender as render };
export { customRender, renderWith, RouterPath };
export { MemoryRouter, Routes, Route as RouterRoute };
