import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import React from 'react';

const icon = require('./es6modules.svg');

const ImgIcon = styled.img<{ theme?: Theme }>(({ theme }) => ({
  marginLeft: theme?.spacing(1),
}));

export function ES6Modules() {
  return <ImgIcon alt="es6 modules" height="20" src={icon} width="20" />;
}
