import {
  default as MaterialUIDialogContent,
  DialogContentProps,
} from '@material-ui/core/DialogContent';
import React, { forwardRef } from 'react';

type DialogContentRef = HTMLDivElement;

const DialogContent = forwardRef<DialogContentRef, DialogContentProps>(function DialogContent(
  props,
  ref
) {
  return <MaterialUIDialogContent {...props} ref={ref} />;
});

export default DialogContent;
