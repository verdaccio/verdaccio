import Alert from '@mui/material/Alert';
import React from 'react';

export type Props = {
  message: string;
};

const Deprecated: React.FC<Props> = ({ message }) => {
  return (
    // @ts-ignore - Alert does accept children despite the type error
    <Alert severity="warning" sx={{ marginTop: 1, marginBottom: 1 }}>
      {message}
    </Alert>
  );
};

export default Deprecated;
