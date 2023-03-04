import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react';

import { default as FundButton } from '.';

export default {
  title: 'FundButton',
};

export const FundButtonUrl: any = () => (
  <Box sx={{ width: '100%' }}>
    <Stack spacing={2}>
      <FundButton
        packageMeta={{
          latest: {
            funding: {
              url: 'https://opencollective.com/verdaccio',
            },
          },
        }}
      />
    </Stack>
  </Box>
);
