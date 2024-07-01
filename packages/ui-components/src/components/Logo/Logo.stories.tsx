import Box from '@mui/material/Box';
import React from 'react';

import Logo from './Logo';

export default {
  title: 'Components/Logo',
};

export const Icons: any = () => (
  <Box sx={{ width: '100%' }}>
    <Logo size="x-small" />
    <Logo size="small" />
    <Logo size="big" />
  </Box>
);
