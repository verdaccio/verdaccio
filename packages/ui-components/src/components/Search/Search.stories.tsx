/* eslint-disable verdaccio/jsx-spread */
import Box from '@mui/material/Box';
import React from 'react';
import { MemoryRouter } from 'react-router';

import Search from './Search';

export default {
  title: 'Components/Header/Search',
};

export const SearchByQuery = {
  render: (args) => (
    <MemoryRouter initialEntries={[`/-/web/detail/storybook`]}>
      <Box
        sx={{
          height: 100,
          padding: 10,
          backgroundColor: 'primary.dark',
          '&:hover': {
            backgroundColor: 'primary.main',
            opacity: [0.9, 0.8, 0.7],
          },
        }}
      >
        <Search {...args} />
      </Box>
    </MemoryRouter>
  ),
};
