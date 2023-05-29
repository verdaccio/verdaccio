import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react';

import {
  CommonJS,
  ES6Modules,
  Earth,
  Git,
  Law,
  License,
  NodeJS,
  Time,
  TypeScript,
  Version,
} from '.';

export default {
  title: 'Components/Icons/Overview',
};

export const Icons: any = () => (
  <Box sx={{ width: '100%' }}>
    <Stack spacing={2}>
      <NodeJS />
      <Git />
      <Version />
      <TypeScript />
      <Time />
      <License />
      <Law />
      <ES6Modules />
      <CommonJS />
      <Earth />
    </Stack>
  </Box>
);
