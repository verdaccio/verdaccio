import type { Preview, StoryFn } from '@storybook/react';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import { Provider } from 'react-redux';

import {
  AppConfigurationProvider,
  PersistenceSettingProvider,
  StyleBaseline,
  ThemeProvider,
  TranslatorProvider,
  store,
} from '../src';
import i18n, { listLanguages } from './i18n';

// preview-head file contains the __VERDACCIO_BASENAME_UI_OPTIONS
// required by AppConfigurationProvider
export const withMuiTheme = (Story: StoryFn) => (
  <Provider store={store}>
    <TranslatorProvider onMount={() => ({})} i18n={i18n} listLanguages={listLanguages}>
      <PersistenceSettingProvider>
        <AppConfigurationProvider>
          <ThemeProvider>
            <StyleBaseline />
            <Story />
          </ThemeProvider>
        </AppConfigurationProvider>
      </PersistenceSettingProvider>
    </TranslatorProvider>
  </Provider>
);

/*
 * Initializes MSW
 */
initialize();

/*
 * Setup the preview
 */
const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [withMuiTheme],
  loaders: [mswLoader],
};

export default preview;
