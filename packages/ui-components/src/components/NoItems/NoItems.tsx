import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import React from 'react';

interface Props {
  text: string;
}

const NoItems: React.FC<Props> = ({ text, ...props }) => (
  <Alert severity="info">
    <Typography {...props}>{text}</Typography>
  </Alert>
);

export default NoItems;
