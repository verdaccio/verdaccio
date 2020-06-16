import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from 'emotion-theming';
import React, { ReactNode } from 'react';

const wrapRootElement = ({ element }: { element: ReactNode }) => (
  <ThemeProvider theme={createMuiTheme()}>{element}</ThemeProvider>
);

export default wrapRootElement;
