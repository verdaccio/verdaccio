/**
 * @prettier
 */

// @flow

import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import {Title, Content} from './styles';

import {IProps} from './interfaces';

const InfoDialog = ({open = false, children, onClose}: IProps): ReactElement => (
  <Dialog open={open} onClose={onClose}>
    <Title disableTypography>Register Info</Title>
    <Content>{children}</Content>
    <DialogActions>
      <Button onClick={onClose} color="inherit" autoFocus>
        OK
      </Button>
    </DialogActions>
  </Dialog>
);

export default InfoDialog;
