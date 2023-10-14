import Alert from '@mui/material/Alert';
import { useTheme } from '@mui/styles';
import React from 'react';

export type Props = {
  message: string;
};

const Deprecated: React.FC<Props> = ({ message }) => {
  const theme = useTheme();
  return (
    <Alert severity="warning" sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }}>
      {message}
    </Alert>
  );
};

export default Deprecated;
