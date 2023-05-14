import { StyledEngineProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import { ThemeProvider } from '../Theme';
import AppConfigurationProvider from '../providers/AppConfigurationProvider';
import PersistenceSettingProvider from '../providers/PersistenceSettingProvider';
import { Store } from '../store/store';
import i18nConfig from './i18n-config';

const renderWithStore = (ui: React.ReactElement<any>, store: Store) =>
  render(ui, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <AppConfigurationProvider>
          <StyledEngineProvider injectFirst={true}>
            <ThemeProvider>
              <I18nextProvider i18n={i18nConfig}>{children}</I18nextProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </AppConfigurationProvider>
      </Provider>
    ),
  });

const customRender = (node: React.ReactElement, ...options: any) => {
  return render(
    <AppConfigurationProvider>
      <PersistenceSettingProvider>
        <StyledEngineProvider injectFirst={true}>
          <ThemeProvider>
            <I18nextProvider i18n={i18nConfig}>{node}</I18nextProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </PersistenceSettingProvider>
    </AppConfigurationProvider>,
    ...options
  );
};

export * from '@testing-library/react';
export { customRender as render };
export { customRender, renderWithStore };
