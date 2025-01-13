import { Preview, StoryFn } from '@storybook/react';
import * as Flags from 'country-flag-icons/react/3x2';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';
import { Provider } from 'react-redux';

import config from '../../plugins/ui-theme/src/i18n/config';
import {
  AppConfigurationProvider,
  PersistenceSettingProvider,
  StyleBaseline,
  ThemeProvider,
  TranslatorProvider,
  store,
} from '../src';

const DEFAULT_LANGUAGE = 'en-US';
const listLanguages = [
  { lng: DEFAULT_LANGUAGE, icon: Flags.US, menuKey: 'lng.english' },
  { lng: 'cs-CZ', icon: Flags.CZ, menuKey: 'lng.czech' },
  { lng: 'pt-BR', icon: Flags.BR, menuKey: 'lng.portuguese' },
  { lng: 'es-ES', icon: Flags.ES, menuKey: 'lng.spanish' },
  { lng: 'de-DE', icon: Flags.DE, menuKey: 'lng.german' },
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// preview-head file contains the __VERDACCIO_BASENAME_UI_OPTIONS
// required by AppConfigurationProvider
export const withMuiTheme = (Story: StoryFn) => (
  <Provider store={store}>
    <TranslatorProvider onMount={() => ({})} i18n={config} listLanguages={listLanguages}>
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

if (typeof global.process === 'undefined') {
  const { worker } = require('../msw/browser');
  worker.start();
}

/*
 * Initializes MSW
 */
initialize();

/*
 * Setup the preview
 */
const preview: Preview = {
  decorators: [withMuiTheme],
  tags: ['autodocs'],
  // Add the MSW loader to all stories
  loaders: [mswLoader],
};

export default preview;
