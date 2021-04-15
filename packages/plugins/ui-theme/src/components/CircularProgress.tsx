import {
  default as MaterialUICircularProgress,
  CircularProgressProps,
} from '@material-ui/core/CircularProgress';
import React, { forwardRef } from 'react';

type CircularProgressRef = HTMLDivElement;

const CircularProgress = forwardRef<CircularProgressRef, CircularProgressProps>(
  function CircularProgress(props, ref) {
    return <MaterialUICircularProgress {...props} ref={ref} />;
  }
);

export default CircularProgress;
