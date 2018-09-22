/**
 * @prettier
 */

// @flow

import React from 'react';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import Button from '@material-ui/core/Button/index';
import {Title, Content} from './styles';

import type {Node} from 'react';

import {IProps} from './interfaces';

const RegistryInfoDialog = ({open = false, children, onClose}: IProps): Node => (
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

export default RegistryInfoDialog;
