import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import React from 'react';

import icon from './commonjs.svg';

const ImgIcon = styled.img<{ theme?: Theme }>(({ theme }) => ({
  marginLeft: theme?.spacing(1),
}));

export function CommonJS() {
  return <ImgIcon alt="commonjs" height="20" src={icon} width="20" />;
}
