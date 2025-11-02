import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import merge from 'lodash/merge';
import React, { FunctionComponent, createContext, useContext, useMemo } from 'react';

import { TemplateUIOptions } from '@verdaccio/types';

import { PRIMARY_COLOR } from '../../Theme/colors';

type ConfigProviderProps = {
  configOptions: TemplateUIOptions;
};

const defaultValues: ConfigProviderProps = {
  configOptions: {
    // note: dark mode set as undefined by design
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
  },
};

function getConfiguration() {
  const uiConfiguration = merge(
    {},
    defaultValues.configOptions,
    window?.__VERDACCIO_BASENAME_UI_OPTIONS
  );

  if (window?.__VERDACCIO_BASENAME_UI_OPTIONS.pkgManagers) {
    uiConfiguration.pkgManagers = window?.__VERDACCIO_BASENAME_UI_OPTIONS.pkgManagers;
  }

  if (isNil(uiConfiguration.primaryColor) || isEmpty(uiConfiguration.primaryColor)) {
    uiConfiguration.primaryColor = PRIMARY_COLOR;
  }

  return uiConfiguration;
}

const AppConfigurationContext = createContext<ConfigProviderProps>(defaultValues);

const AppConfigurationProvider: FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}) => {
  const configOptions = useMemo(() => getConfiguration(), []);

  const value = {
    configOptions,
  };

  return (
    <AppConfigurationContext.Provider value={value}>
      <>{children}</>
    </AppConfigurationContext.Provider>
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
