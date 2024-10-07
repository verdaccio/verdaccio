import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';

import { Theme } from '../../Theme';

export interface ViewerTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const ViewerTitle = (props: ViewerTitleProps) => {
  const { children, onClose } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          data-testid="close-raw-viewer"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  packageMeta: any;
};

/* eslint-disable verdaccio/jsx-spread */
const RawViewer: React.FC<Props> = ({ isOpen = false, onClose, packageMeta }) => {
  const { t } = useTranslation();
  const theme: Theme = useTheme();
  return (
    <Dialog data-testid={'rawViewer--dialog'} fullScreen={true} open={isOpen}>
      <ViewerTitle id="viewer-title" onClose={onClose}>
        {t('action-bar-action.raw-title', { package: packageMeta.latest.name })}
      </ViewerTitle>
      <DialogContent>
        <ReactJson
          collapseStringsAfterLength={200}
          collapsed={2}
          enableClipboard={true}
          groupArraysAfterLength={10}
          src={packageMeta as any}
          theme={theme.palette.mode == 'light' ? 'bright:inverted' : 'bright'}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RawViewer;
