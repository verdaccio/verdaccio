import type { FunctionComponent, ReactNode } from 'react';
import React, { createContext, useContext, useMemo } from 'react';

import type { TemplateUIOptions } from '@verdaccio/types';

import { PRIMARY_COLOR } from '../../Theme/colors';

type ConfigProviderProps = {
  configOptions: TemplateUIOptions;
};

interface AppConfigurationProviderProps {
  children: ReactNode;
  // Allows passing overrides like { flags: { myFlag: true } }
  overrideConfig?: Partial<TemplateUIOptions>;
}

const DEFAULT_OPTIONS: TemplateUIOptions = {
  primaryColor: PRIMARY_COLOR,
  pkgManagers: ['yarn', 'pnpm', 'npm'],
  scope: '',
  base: '',
  flags: {},
  login: true,
  url_prefix: '',
  showInfo: true,
  showSettings: true,
  showThemeSwitch: true,
  showFooter: true,
  showSearch: true,
  showRaw: true,
  showDownloadTarball: true,
  showUplinks: true,
  hideDeprecatedVersions: false,
  title: 'Verdaccio',
};

/**
 * Merges defaults, window globals, and optional local overrides.
 */
function getConfiguration(overrides: Partial<TemplateUIOptions> = {}): TemplateUIOptions {
  const windowOptions = window?.__VERDACCIO_BASENAME_UI_OPTIONS || {};

  const uiConfiguration = {
    ...DEFAULT_OPTIONS,
    ...windowOptions,
    ...overrides,
    flags: {
      ...DEFAULT_OPTIONS.flags,
      ...windowOptions.flags,
      ...overrides.flags,
    },
  };

  // Logic cleanup: Ensure primaryColor is never empty/null
  if (!uiConfiguration.primaryColor) {
    uiConfiguration.primaryColor = PRIMARY_COLOR;
  }

  return uiConfiguration;
}

const AppConfigurationContext = createContext<ConfigProviderProps | undefined>(undefined);

const AppConfigurationProvider: FunctionComponent<AppConfigurationProviderProps> = ({
  children,
  overrideConfig = {},
}) => {
  // We include overrideConfig in the dependency array so if the prop
  // changes, the configuration updates accordingly.
  const value = useMemo(
    () => ({
      configOptions: getConfiguration(overrideConfig),
    }),
    [overrideConfig]
  );

  return (
    <AppConfigurationContext.Provider value={value}>{children}</AppConfigurationContext.Provider>
  );
};

export { AppConfigurationProvider };

export const useConfig = () => {
  const ctx = useContext(AppConfigurationContext);
  if (!ctx) {
    throw new Error('useConfig must be used within AppConfigurationProvider');
  }
  return ctx;
};
