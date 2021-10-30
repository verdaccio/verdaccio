import { DialogTitleProps, default as MaterialUIDialogTitle } from '@mui/material/DialogTitle';
import React, { forwardRef } from 'react';

type DialogTitleRef = HTMLDivElement;

const DialogTitle = forwardRef<DialogTitleRef, DialogTitleProps>(function DialogTitle(props, ref) {
  return <MaterialUIDialogTitle {...props} ref={ref} />;
});

export default DialogTitle;
