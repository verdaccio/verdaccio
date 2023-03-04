import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import React from 'react';

const icon = require('./yarn.svg');

const ImgIcon = styled.img<{ theme?: Theme }>(({ theme }) => ({
  marginLeft: theme?.spacing(1),
}));

export function Yarn() {
  return <ImgIcon alt="npm package manager" height="20" src={icon} width="20" />;
}
