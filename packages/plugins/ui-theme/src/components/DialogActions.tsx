import {
  DialogActionsProps,
  default as MaterialUIDialogActions,
} from '@mui/material/DialogActions';
import React, { forwardRef } from 'react';

type DialogActionsRef = HTMLDivElement;

const DialogActions = forwardRef<DialogActionsRef, DialogActionsProps>(function DialogActions(
  props,
  ref
) {
  return <MaterialUIDialogActions {...props} ref={ref} />;
});

export default DialogActions;
