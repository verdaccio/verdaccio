import React from 'react';

import RegistryInfoContent from './RegistryInfoContent';
import RegistryInfoDialog from './RegistryInfoDialog';

interface Props {
  isOpen: boolean;
  onCloseDialog: () => void;
  registryUrl: string;
  scope: string;
}

const HeaderInfoDialog: React.FC<Props> = ({ onCloseDialog, isOpen, registryUrl, scope }) => (
  <RegistryInfoDialog onClose={onCloseDialog} open={isOpen}>
    <RegistryInfoContent registryUrl={registryUrl} scope={scope} />
  </RegistryInfoDialog>
);

export default HeaderInfoDialog;
