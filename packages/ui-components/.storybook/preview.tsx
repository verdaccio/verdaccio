import type { Preview, StoryFn } from '@storybook/react-webpack5';
import { initialize, mswLoader } from 'msw-storybook-addon';
import React from 'react';

import {
  AppConfigurationProvider,
  PersistenceSettingProvider,
  StyleBaseline,
  ThemeProvider,
  TranslatorProvider,
} from '../src';
import { AuthProvider } from '../src/providers/AuthProvider';
import i18n, { listLanguages } from './i18n';

// preview-head file contains the __VERDACCIO_BASENAME_UI_OPTIONS
// required by AppConfigurationProvider
export const withMuiTheme = (Story: StoryFn) => (
  <TranslatorProvider onMount={() => ({})} i18n={i18n} listLanguages={listLanguages}>
    <PersistenceSettingProvider>
      <AppConfigurationProvider>
        <ThemeProvider>
          <>
            <StyleBaseline />
            <AuthProvider>
              <Story />
            </AuthProvider>
          </>
        </ThemeProvider>
      </AppConfigurationProvider>
    </PersistenceSettingProvider>
  </TranslatorProvider>
);

/*
 * Initializes MSW
 */
initialize({
  onUnhandledRequest: ({ url, method }) => {
    const pathname = new URL(url).pathname;
    if (pathname.startsWith('/my-specific-api-path')) {
      console.error(`Unhandled ${method} request to ${url}.

        This exception has been only logged in the console, however, it's strongly recommended to resolve this error as you don't want unmocked data in Storybook stories.

        If you wish to mock an error response, please refer to this guide: https://mswjs.io/docs/recipes/mocking-error-responses
      `);
    }
  },
});

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
