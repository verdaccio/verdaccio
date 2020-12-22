import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import i18next from 'i18next';
import React, { useEffect } from 'react';

import loadDayJSLocale from './load-dayjs-locale';
import { getTheme, ThemeMode } from './theme';
import ThemeContext from './ThemeContext';
import useLocalStorage from './useLocalStorage';

const ThemeProvider: React.FC = ({ children }) => {
  const prefersDarkMode = window.matchMedia?.('(prefers-color-scheme:dark)').matches;
  const isDarkModeDefault = window?.__VERDACCIO_BASENAME_UI_OPTIONS?.darkMode || prefersDarkMode;
  const currentLanguage = i18next.languages?.[0];

  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', !!isDarkModeDefault);
  const [language, setLanguage] = useLocalStorage('language', currentLanguage);

  const themeMode: ThemeMode = isDarkMode ? 'dark' : 'light';

  const changeLanguage = async () => {
    await i18next.changeLanguage(language);
  };

  useEffect(() => {
    changeLanguage();
    loadDayJSLocale();
  }, [language, changeLanguage]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode, language, setLanguage }}>
      <EmotionThemeProvider theme={getTheme(themeMode)}>
        <MuiThemeProvider theme={getTheme(themeMode)}>{children}</MuiThemeProvider>
      </EmotionThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
