import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/system';
import React from 'react';

import { Theme } from '../../Theme';

export const CardStyled = styled(Card)<{ theme?: Theme }>(({ theme }) => {
  return {
    marginTop: theme?.spacing(1),
    marginBottom: theme?.spacing(0.5),
    backgroundColor: theme?.palette?.error.light,
    opacity: '0.9',
    color: theme?.palette?.error.contrastText,
    fontWeight: 'bold',
  };
});

export type Props = {
  message: string;
};

const Deprecated: React.FC<Props> = ({ message }) => {
  return (
    <CardStyled>
      <CardContent>{message}</CardContent>
    </CardStyled>
  );
};

export default Deprecated;
