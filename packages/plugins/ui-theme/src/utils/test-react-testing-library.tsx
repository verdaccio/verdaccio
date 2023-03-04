import { StyledEngineProvider } from '@mui/material/styles';
import { render } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import { AppConfigurationProvider, ThemeProvider } from '@verdaccio/ui-components';

import i18nConfig from '../i18n/config';

const renderWithStore = (ui, store) =>
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
      <StyledEngineProvider injectFirst={true}>
        <ThemeProvider>
          <I18nextProvider i18n={i18nConfig}>{node}</I18nextProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </AppConfigurationProvider>,
    ...options
  );
};

export * from '@testing-library/react';
// FIXME: rename all references with customRemder
export { customRender as render };
export { customRender, renderWithStore };
