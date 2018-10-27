/**
 * @prettier
 * @flow
 */

import React from 'react';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import Button from '@material-ui/core/Button/index';
import { Title, Content } from './styles';

import type { Node } from 'react';

import { IProps } from './types';

const RegistryInfoDialog = ({ open = false, children, onClose }: IProps): Node => (
  <Dialog id="registryInfo--dialog-container" open={open} onClose={onClose}>
    <Title disableTypography>Register Info</Title>
    <Content>{children}</Content>
    <DialogActions>
      <Button id="registryInfo--dialog-close" onClick={onClose} color="inherit" autoFocus>
        CLOSE
      </Button>
    </DialogActions>
  </Dialog>
);

export default RegistryInfoDialog;
