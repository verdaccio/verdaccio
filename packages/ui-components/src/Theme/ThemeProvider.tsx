import { ThemeProvider as MUIThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import React, { createContext, useContext } from 'react';

import useLocalStorage from '../hooks/useLocalStorage';
import { useConfig } from '../providers/AppConfigurationProvider';
import { ThemeMode } from './modes';
import { getTheme } from './theme';

interface Props {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

const ThemeContext = createContext<undefined | Props>(undefined);

function getDarkModeDefault(darkModeConfig?: boolean) {
  const prefersDarkMode = window.matchMedia?.('(prefers-color-scheme:dark)').matches;
  if (typeof darkModeConfig === 'boolean') {
    return darkModeConfig;
  } else {
    return prefersDarkMode;
  }
}

const ThemeProvider: React.FC<{ children: any }> = ({ children }) => {
  console.log('Rendering ThemeProvider');
  const { configOptions } = useConfig();
  const isDarkModeDefault = getDarkModeDefault(configOptions.darkMode);
  const isSwitchThemeEnabled = configOptions.showThemeSwitch;
  const [isDarkModeStorage, setIsDarkMode] = useLocalStorage('darkMode', isDarkModeDefault);
  const isDarkMode = isSwitchThemeEnabled === true ? isDarkModeStorage : isDarkModeDefault;
  const themeMode: ThemeMode = isDarkMode ? 'dark' : 'light';

  const currentTheme = getTheme(themeMode, configOptions.primaryColor);
  console.log('Current theme mode:', currentTheme);
  return (
    <ThemeContext.Provider value={{ isDarkMode, setIsDarkMode }}>
      <StyledEngineProvider injectFirst={true}>
        <MUIThemeProvider theme={currentTheme}>{children}</MUIThemeProvider>
      </StyledEngineProvider>
    </ThemeContext.Provider>
  );
};

export const useCustomTheme = () => useContext(ThemeContext);

export { ThemeProvider };
