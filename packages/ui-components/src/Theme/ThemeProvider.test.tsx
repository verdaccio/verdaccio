import { render, screen } from '@testing-library/react';
import React from 'react';

import {
  AppConfigurationProvider,
  PersistenceSettingProvider,
  StyleBaseline,
  ThemeProvider,
} from '../';

const AppContainer = () => (
  <AppConfigurationProvider>
    <ThemeProvider>
      <StyleBaseline />
      <PersistenceSettingProvider>
        <div>{'Theme'}</div>
      </PersistenceSettingProvider>
    </ThemeProvider>
  </AppConfigurationProvider>
);

describe('ThemeProvider', () => {
  test('should render with theme', async () => {
    render(<AppContainer />);
    await screen.findByText('Theme');
  });
});
