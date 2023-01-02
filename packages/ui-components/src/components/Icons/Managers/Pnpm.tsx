import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import React from 'react';

const icon = require('./pnpm.svg');

const ImgIcon = styled.img<{ theme?: Theme }>(({ theme }) => ({
  marginLeft: theme?.spacing(1),
}));

export function Pnpm() {
  return <ImgIcon alt="pnpm package manager" height="20" src={icon} width="20" />;
}
