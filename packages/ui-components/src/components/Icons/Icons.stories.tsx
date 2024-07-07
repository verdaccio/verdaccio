import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import React from 'react';

import {
  CommonJS,
  ES6Modules,
  Earth,
  FileBinary,
  Git,
  Law,
  License,
  NodeJS,
  Npm,
  Pnpm,
  Time,
  TypeScript,
  Version,
  Yarn,
} from '.';

export default {
  title: 'Components/Icons/Overview',
};

export const Icons: any = () => (
  <Box sx={{ width: '100%' }}>
    <Stack direction="row" spacing={2}>
      <Npm />
      <Pnpm />
      <Yarn />
    </Stack>
    <Stack direction="row" spacing={2}>
      <NodeJS />
      <Git />
    </Stack>
    <Stack direction="row" spacing={2}>
      <TypeScript />
      <ES6Modules />
      <CommonJS />
    </Stack>
    <Stack direction="row" spacing={2}>
      <Version />
      <Time />
      <FileBinary />
      <Law />
    </Stack>
    <Stack direction="row" spacing={2}>
      <License />
      <Earth />
    </Stack>
  </Box>
);
