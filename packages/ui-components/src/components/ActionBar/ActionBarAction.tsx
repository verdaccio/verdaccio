import styled from '@emotion/styled';
import BugReportIcon from '@mui/icons-material/BugReport';
import DownloadIcon from '@mui/icons-material/CloudDownload';
import HomeIcon from '@mui/icons-material/Home';
import RawOnIcon from '@mui/icons-material/RawOn';
import CircularProgress from '@mui/material/CircularProgress';
import FabMUI from '@mui/material/Fab';
import Tooltip from '@mui/material/Tooltip';
import { common } from '@mui/material/colors';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from '../../Theme';
import { useVersion } from '../../providers';
import LinkExternal from '../LinkExternal';

export const Fab = styled(FabMUI)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    color: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.cyanBlue,
  },
  color: common.white,
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
  const { isLoading, downloadTarball } = useVersion();

  const handleDownload = useCallback(async () => {
    downloadTarball?.({ link: link as string });
  }, [link]);

  switch (type) {
    case 'VISIT_HOMEPAGE':
      return (
        <Tooltip title={t('action-bar-action.visit-home-page') as string}>
          <LinkExternal to={link} variant="button">
            <Fab size="small" color="primary">
              <HomeIcon />
            </Fab>
          </LinkExternal>
        </Tooltip>
      );
    case 'OPEN_AN_ISSUE':
      return (
        <Tooltip title={t('action-bar-action.open-an-issue') as string}>
          <LinkExternal to={link} variant="button">
            <Fab size="small">
              <BugReportIcon />
            </Fab>
          </LinkExternal>
        </Tooltip>
      );
    case 'DOWNLOAD_TARBALL':
      return (
        <Tooltip title={t('action-bar-action.download-tarball') as string}>
          {isLoading ? (
            <CircularProgress sx={{ marginX: 0 }} />
          ) : (
            <Fab data-testid="download-tarball-btn" onClick={handleDownload} size="small">
              <DownloadIcon />
            </Fab>
          )}
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
