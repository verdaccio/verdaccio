import Typography from '@mui/material/Typography';
import React from 'react';

interface Props {
  text: string;
  className?: string;
}

const NoItems: React.FC<Props> = ({ className, text, ...props }) => (
  // eslint-disable-next-line verdaccio/jsx-spread
  <Typography {...props} className={className} gutterBottom={true} variant="subtitle1">
    {text}
  </Typography>
);

export default NoItems;
