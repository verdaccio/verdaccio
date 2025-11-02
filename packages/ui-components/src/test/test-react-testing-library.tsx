import { StyledEngineProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';

import { ThemeProvider } from '../Theme';
import { AppConfigurationProvider, PersistenceSettingProvider } from '../providers';
import { AuthProvider } from '../providers/AuthProvider/AuthProvider';
import i18nConfig from './i18n-config';

const renderWith = (ui: React.ReactElement<any>) => {
  return render(ui, {
    wrapper: ({ children }: any) => (
      <PersistenceSettingProvider>
        <AppConfigurationProvider>
          <StyledEngineProvider injectFirst={true}>
            <ThemeProvider>
              <I18nextProvider i18n={i18nConfig}>
                <AuthProvider>{children}</AuthProvider>
              </I18nextProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </AppConfigurationProvider>
      </PersistenceSettingProvider>
    ),
  });
};

const customRender = (node: React.ReactElement, ...options: any) => {
  return render(
    <AppConfigurationProvider>
      <PersistenceSettingProvider>
        <ThemeProvider>
          <I18nextProvider i18n={i18nConfig}>{node}</I18nextProvider>
        </ThemeProvider>
      </PersistenceSettingProvider>
    </AppConfigurationProvider>,
    ...options
  );
};

export * from '@testing-library/react';
export { customRender as render };
export { customRender, renderWith };
