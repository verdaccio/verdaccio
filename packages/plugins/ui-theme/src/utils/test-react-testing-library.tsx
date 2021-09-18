import { render } from '@testing-library/react';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';

import ThemeProvider from 'verdaccio-ui/design-tokens/ThemeProvider';
import APIProvider from 'verdaccio-ui/providers/API/APIProvider';
import AppConfigurationProvider from 'verdaccio-ui/providers/config';

import i18nConfig from '../i18n/config';

const renderWithStore = (ui, store) =>
  render(ui, {
    wrapper: ({ children }) => (
      <Provider store={store}>
        <AppConfigurationProvider>
          <APIProvider>
            <ThemeProvider>
              <I18nextProvider i18n={i18nConfig}>{children}</I18nextProvider>
            </ThemeProvider>
          </APIProvider>
        </AppConfigurationProvider>
      </Provider>
    ),
  });

const customRender = (node: React.ReactElement, ...options: any) => {
  return render(
    <AppConfigurationProvider>
      <APIProvider>
        <ThemeProvider>
          <I18nextProvider i18n={i18nConfig}>{node}</I18nextProvider>
        </ThemeProvider>
      </APIProvider>
    </AppConfigurationProvider>,
    ...options
  );
};

export * from '@testing-library/react';
// FIXME: rename all references with customRemder
export { customRender as render };
export { customRender, renderWithStore };
