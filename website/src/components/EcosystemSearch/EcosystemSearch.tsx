import { createTheme } from '@mui/material/styles';
import { ThemeProvider } from '@mui/styles';
import React from 'react';
import { useState } from 'react';

import FilterControl from './FilterControl';
import ToolList from './ToolList';
import data from './addons.json';
import { Filters } from './types';

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 450,
      md: 996,
      lg: 1600,
      xl: 1800,
    },
  },
  palette: {
    primary: {
      main: '#4B5E40',
    },
    secondary: {
      main: '#808a79',
    },
  },
});

const EcosystemSearch = (): React.ReactElement => {
  const { addons, categories, origin } = data as any;

  const [filters, setFilters] = useState<Filters>({
    bundled: false,
    core: true,
    community: true,
    middleware: true,
    storage: true,
    tool: true,
    ui: true,
    authentication: true,
    filter: true,
    keyword: '',
  });

  return (
    <ThemeProvider theme={theme}>
      <FilterControl
        categories={categories}
        origins={origin}
        filters={filters}
        onChange={setFilters}
      />
      <ToolList addons={addons} filters={filters} />
    </ThemeProvider>
  );
};

export default EcosystemSearch;
