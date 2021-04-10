import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

const colors = {
  black: '#000',
  white: '#fff',
  red: '#d32f2f',
  orange: '#CD4000',
  greySuperLight: '#f5f5f5',
  greyLight: '#d3d3d3',
  greyLight2: '#908ba1',
  greyLight3: '#f3f4f240',
  greyDark: '#a9a9a9',
  greyDark2: '#586069',
  greyChateau: '#95989a',
  greyGainsboro: '#e3e3e3',
  greyAthens: '#d3dddd',
  eclipse: '#3c3c3c',
  paleNavy: '#e4e8f1',
  saltpan: '#f7f8f6',
  snow: '#f9f9f9',
  love: '#e25555',
  nobel01: '#999999',
  nobel02: '#9f9f9f',
  primary: window?.__VERDACCIO_BASENAME_UI_OPTIONS?.primaryColor ?? '#4b5e40',
  secondary: '#20232a',
  background: '#fff',
  dodgerBlue: '#1ba1f2',
  cyanBlue: '#253341',
};

const themeModes = {
  light: {
    ...colors,
  },
  dark: {
    ...colors,
    primary: '#24394e',
    secondary: '#424242',
    background: '#1A202C',
  },
};

export type ThemeMode = keyof typeof themeModes;

const fontSize = {
  xxl: 26,
  xl: 24,
  lg: 21,
  md: 18,
  default: 16,
  sm: 14,
};

export type FontSize = keyof typeof fontSize;

const fontWeight = {
  light: 300,
  regular: 400,
  semiBold: 500,
  bold: 700,
};

export type FontWeight = keyof typeof fontWeight;

export const breakPoints = {
  small: 576,
  medium: 768,
  large: 1024,
  container: 1240,
  xlarge: 1275,
};

export type BreakPoints = typeof breakPoints;

const customizedTheme = {
  fontSize,
  fontWeight,
  breakPoints,
};

type CustomizedTheme = typeof customizedTheme;

export const getTheme = (themeMode: ThemeMode) => {
  const palette = themeModes[themeMode];
  return createMuiTheme({
    typography: {
      fontFamily: 'inherit',
    },
    palette: {
      type: themeMode,
      ...palette,
      primary: { main: palette.primary },
      secondary: { main: palette.secondary },
      error: { main: palette.red },
      background: {
        default: palette.background,
      },
    },
    ...customizedTheme,
  });
};

export type Theme = ReturnType<typeof getTheme>;

declare module '@material-ui/core/styles/createMuiTheme' {
  /* eslint-disable-next-line @typescript-eslint/no-empty-interface */
  interface Theme extends CustomizedTheme {}
  /* eslint-disable-next-line @typescript-eslint/no-empty-interface */
  interface ThemeOptions extends CustomizedTheme {}
}

declare module '@material-ui/core/styles/createPalette' {
  interface CustomPalette {
    black: string;
    white: string;
    red: string;
    orange: string;
    greySuperLight: string;
    greyLight: string;
    greyLight2: string;
    greyLight3: string;
    greyDark: string;
    greyDark2: string;
    greyChateau: string;
    greyGainsboro: string;
    greyAthens: string;
    eclipse: string;
    paleNavy: string;
    saltpan: string;
    snow: string;
    love: string;
    nobel01: string;
    nobel02: string;
    background: string;
    dodgerBlue: string;
    cyanBlue: string;
  }

  /* eslint-disable-next-line @typescript-eslint/no-empty-interface */
  interface Palette extends CustomPalette {}
  /* eslint-disable-next-line @typescript-eslint/no-empty-interface */
  interface PaletteOptions extends Partial<CustomPalette> {}
}
