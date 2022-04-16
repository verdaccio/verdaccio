import { StyledEngineProvider, Theme, ThemeProvider } from '@mui/material/styles';
import i18next from 'i18next';
import React, { useCallback, useEffect } from 'react';
import { useConfig } from 'verdaccio-ui/providers/config';

import useLocalStorage from '../hooks/useLocalStorage';
import ThemeContext from './ThemeContext';
import loadDayJSLocale from './load-dayjs-locale';
import { ThemeMode, getTheme } from './theme';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

function getDarkModeDefault(darkModeConfig) {
  const prefersDarkMode = window.matchMedia?.('(prefers-color-scheme:dark)').matches;
  if (typeof darkModeConfig === 'boolean') {
    return darkModeConfig;
  } else {
    return prefersDarkMode;
  }
}

const ThemeProviderWrapper: React.FC = ({ children }) => {
  const currentLanguage = i18next.languages?.[0];
  const { configOptions } = useConfig();
  const isDarkModeDefault = getDarkModeDefault(configOptions.darkMode);
  const isSwitchThemeEnabled = configOptions.showThemeSwitch;
  const [isDarkModeStorage, setIsDarkMode] = useLocalStorage('darkMode', isDarkModeDefault);
  const [language, setLanguage] = useLocalStorage('language', currentLanguage);
  const isDarkMode = isSwitchThemeEnabled === true ? isDarkModeStorage : isDarkModeDefault;
  const themeMode: ThemeMode = isDarkMode ? 'dark' : 'light';

  const changeLanguage = useCallback(async () => {
    await i18next.changeLanguage(language);
  }, [language]);

  const currentTheme = getTheme(themeMode, configOptions?.primaryColor);

  useEffect(() => {
    changeLanguage();
    loadDayJSLocale();
  }, [language, changeLanguage]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, language, setLanguage }}>
      <StyledEngineProvider injectFirst={true}>
        <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProviderWrapper;
