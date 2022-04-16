import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import merge from 'lodash/merge';
import React, { FunctionComponent, createContext, useContext, useMemo, useState } from 'react';
import { PRIMARY_COLOR } from 'verdaccio-ui/utils/colors';

import { TemplateUIOptions } from '@verdaccio/types';

type ConfigProviderProps = {
  configOptions: TemplateUIOptions;
  setConfigOptions: Function;
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
    title: 'Verdaccio',
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setConfigOptions: () => {},
};

function getConfiguration() {
  const uiConfiguration = merge(
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

const AppConfigurationProvider: FunctionComponent = ({ children }) => {
  const [configOptions, setConfigOptions] = useState<TemplateUIOptions>(getConfiguration());

  const value = useMemo(
    () => ({
      configOptions,
      setConfigOptions,
    }),
    [configOptions]
  );

  return (
    <AppConfigurationContext.Provider value={value}>{children}</AppConfigurationContext.Provider>
  );
};

export default AppConfigurationProvider;

export const useConfig = () => useContext(AppConfigurationContext);
