import styled from '@emotion/styled';
import BugReportIcon from '@mui/icons-material/BugReport';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import HomeIcon from '@mui/icons-material/Home';
import RawOnIcon from '@mui/icons-material/RawOn';
import Tooltip from '@mui/material/Tooltip';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

import { Dispatch } from '../../store/store';
import FloatingActionButton from '../FloatingActionButton';
import Link from '../Link';

export const Fab = styled(FloatingActionButton)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor:
    theme?.palette.mode === 'light' ? theme?.palette.primary.main : theme?.palette.cyanBlue,
  color: theme?.palette.white,
  marginRight: 10,
  ':hover': {
    color: theme?.palette.mode === 'light' ? theme?.palette.primary.main : theme?.palette.cyanBlue,
    background: theme?.palette.white,
  },
}));

type ActionType = 'VISIT_HOMEPAGE' | 'OPEN_AN_ISSUE' | 'DOWNLOAD_TARBALL' | 'RAW_DATA';

export interface ActionBarActionProps {
  type: ActionType;
  link?: string;
  action?: () => void;
}

/* eslint-disable react/jsx-no-bind */
const ActionBarAction: React.FC<ActionBarActionProps> = ({ type, link, action }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<Dispatch>();

  const handleDownload = useCallback(async () => {
    dispatch.download.getTarball({ link });
  }, [dispatch, link]);

  switch (type) {
    case 'VISIT_HOMEPAGE':
      return (
        <Tooltip title={t('action-bar-action.visit-home-page') as string}>
          <Link external={true} to={link}>
            <Fab size="small">
              <HomeIcon />
            </Fab>
          </Link>
        </Tooltip>
      );
    case 'OPEN_AN_ISSUE':
      return (
        <Tooltip title={t('action-bar-action.open-an-issue') as string}>
          <Link external={true} to={link}>
            <Fab size="small">
              <BugReportIcon />
            </Fab>
          </Link>
        </Tooltip>
      );
    case 'DOWNLOAD_TARBALL':
      return (
        <Tooltip title={t('action-bar-action.download-tarball') as string}>
          <Fab data-testid="download-tarball-btn" onClick={handleDownload} size="small">
            <DownloadIcon />
          </Fab>
        </Tooltip>
      );
    case 'RAW_DATA':
      return (
        <Tooltip title={t('action-bar-action.raw') as string}>
          <Fab data-testid="raw-btn" onClick={action} size="small">
            <RawOnIcon />
          </Fab>
        </Tooltip>
      );
  }
};

export default ActionBarAction;
