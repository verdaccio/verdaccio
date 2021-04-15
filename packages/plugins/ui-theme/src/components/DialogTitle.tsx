import { default as MaterialUIDialogTitle, DialogTitleProps } from '@material-ui/core/DialogTitle';
import React, { forwardRef } from 'react';

type DialogTitleRef = HTMLDivElement;

const DialogTitle = forwardRef<DialogTitleRef, DialogTitleProps>(function DialogTitle(props, ref) {
  return <MaterialUIDialogTitle {...props} ref={ref} />;
});

export default DialogTitle;
