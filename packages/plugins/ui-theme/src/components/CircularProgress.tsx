import {
  CircularProgressProps,
  default as MaterialUICircularProgress,
} from '@mui/material/CircularProgress';
import React, { forwardRef } from 'react';

type CircularProgressRef = HTMLDivElement;

const CircularProgress = forwardRef<CircularProgressRef, CircularProgressProps>(
  function CircularProgress(props, ref) {
    return <MaterialUICircularProgress {...props} ref={ref} />;
  }
);

export default CircularProgress;
