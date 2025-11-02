import type { Theme as MuiTheme } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';

import type { ThemeMode } from './modes';
import { getModePalette } from './modes';
import type { CustomTheme, CustomizedTheme } from './tokens';
import { customizedTheme } from './tokens';

export type Theme = MuiTheme & CustomizedTheme;

declare module '@mui/material/styles' {
  interface Theme extends CustomTheme {}
  interface ThemeOptions extends CustomTheme {}
}
declare module '@mui/material/styles/createTheme' {
  interface Theme extends CustomizedTheme {}

  interface DeprecatedThemeOptions extends CustomizedTheme {}
}

export const getTheme = (mode: ThemeMode, primaryColor?: string): Theme => {
  return createTheme({
    palette: getModePalette(mode, primaryColor),

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
