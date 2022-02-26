import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import React from 'react';

import icon from './es6modules.svg';

const ImgIcon = styled.img<{ theme?: Theme }>(({ theme }) => ({
  marginLeft: theme?.spacing(1),
}));

export function ES6Modules() {
  return <ImgIcon alt="dsadsa" height="20" src={icon} width="20" />;
}
