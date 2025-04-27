import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/styles';
import React from 'react';

import { Theme } from '../../Theme';

export type Props = {
  message: string;
};

const Deprecated: React.FC<Props> = ({ message }) => {
  const theme: Theme = useTheme();
  return (
    // @ts-ignore - Alert does accept children despite the type error
    <Alert severity="warning" sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }}>
      {message}
    </Alert>
  );
};

export default Deprecated;
