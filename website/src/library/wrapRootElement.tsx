import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from 'emotion-theming';
import React, { ReactNode } from 'react';

const themeOptions = {
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  palette: {
    primary: {
      main: '#4b5e40',
      light: '#4A5E3F',
      dark: '#405236',
    },
    secondary: {
      main: '#CD4000',
      light: '#CD4000',
      dark: '#CD4000',
    },
  },
};

const wrapRootElement = ({ element }: { element: ReactNode }) => (
  <ThemeProvider theme={createMuiTheme(themeOptions)}>{element}</ThemeProvider>
);

export default wrapRootElement;
