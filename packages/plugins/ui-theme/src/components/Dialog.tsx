import { default as MaterialUIDialog, DialogProps } from '@material-ui/core/Dialog';
import React, { forwardRef } from 'react';

type DialogRef = HTMLDivElement;

const Dialog = forwardRef<DialogRef, DialogProps>(function Dialog(props, ref) {
  return <MaterialUIDialog {...props} ref={ref} />;
});

export default Dialog;
