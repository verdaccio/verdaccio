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
  <Dialog id={'registryInfo--dialog-container'} onClose={onClose} open={open}>
    <Title disableTypography={true}>Register Info</Title>
    <Content>{children}</Content>
    <DialogActions>
      <Button color={'inherit'} id={'registryInfo--dialog-close'} onClick={onClose}>
        CLOSE
      </Button>
    </DialogActions>
  </Dialog>
);

export default RegistryInfoDialog;
