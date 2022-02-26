import styled from '@emotion/styled';
import { Theme } from '@mui/material';
import React from 'react';

import iconTS from './typescript.svg';

const ImgIcon = styled.img<{ theme?: Theme }>(({ theme }) => ({
  marginLeft: theme?.spacing(1),
}));

export function TypeScript() {
  return <ImgIcon alt="dsadsa" height="20" src={iconTS} width="20" />;
}
