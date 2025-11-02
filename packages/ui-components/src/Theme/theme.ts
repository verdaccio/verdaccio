import { Theme as MuiTheme, createTheme } from '@mui/material/styles';

import { baseColors } from './colors';
import { ThemeMode, getModeColors } from './modes';
import { CustomTheme, CustomizedTheme, customizedTheme } from './tokens';

export type Theme = MuiTheme & CustomizedTheme;

declare module '@mui/material/styles' {
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}
declare module '@mui/material/styles/createTheme' {
  /* eslint-disable-next-line @typescript-eslint/no-empty-interface */
  interface Theme extends CustomizedTheme {}
  /* eslint-disable-next-line @typescript-eslint/no-empty-interface */
  interface DeprecatedThemeOptions extends CustomizedTheme {}
}

export const getTheme = (mode: ThemeMode, primaryColor?: string): Theme => {
  const colors = getModeColors(mode, primaryColor);

  return createTheme({
    palette: {
      mode: 'light',
      ...baseColors,
    },

    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
    },

    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'unset',
          },
        },
      },
    },

    ...customizedTheme,
  });
};
