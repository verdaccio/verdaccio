import styled from '@emotion/styled';
import BugReportIcon from '@material-ui/icons/BugReport';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import HomeIcon from '@material-ui/icons/Home';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from 'verdaccio-ui/design-tokens/theme';
import { useAPI } from 'verdaccio-ui/providers/API/APIProvider';
import { extractFileName, downloadFile } from 'verdaccio-ui/utils/url';

import FloatingActionButton from '../FloatingActionButton';
import Link from '../Link';
import Tooltip from '../Tooltip';

export const Fab = styled(FloatingActionButton)<{ theme?: Theme }>(({ theme }) => ({
  backgroundColor:
    theme?.palette.type === 'light' ? theme?.palette.primary.main : theme?.palette.cyanBlue,
  color: theme?.palette.white,
  marginRight: 10,
  ':hover': {
    color: theme?.palette.type === 'light' ? theme?.palette.primary.main : theme?.palette.cyanBlue,
    background: theme?.palette.white,
  },
}));

type ActionType = 'VISIT_HOMEPAGE' | 'OPEN_AN_ISSUE' | 'DOWNLOAD_TARBALL';

export interface ActionBarActionProps {
  type: ActionType;
  link: string;
}

/* eslint-disable react/jsx-no-bind */
const ActionBarAction: React.FC<ActionBarActionProps> = ({ type, link }) => {
  const { t } = useTranslation();
  const { getResource } = useAPI();

  const handleDownload = useCallback(async () => {
    const fileStream = await getResource(link);
    const fileName = extractFileName(link);
    downloadFile(fileStream, fileName);
  }, [getResource, link]);

  switch (type) {
    case 'VISIT_HOMEPAGE':
      return (
        <Tooltip title={t('action-bar-action.visit-home-page')}>
          <Link external={true} to={link}>
            <Fab size="small">
              <HomeIcon />
            </Fab>
          </Link>
        </Tooltip>
      );
    case 'OPEN_AN_ISSUE':
      return (
        <Tooltip title={t('action-bar-action.open-an-issue')}>
          <Link external={true} to={link}>
            <Fab size="small">
              <BugReportIcon />
            </Fab>
          </Link>
        </Tooltip>
      );
    case 'DOWNLOAD_TARBALL':
      return (
        <Tooltip title={t('action-bar-action.download-tarball')}>
          <Fab data-testid="download-tarball-btn" onClick={handleDownload} size="small">
            <DownloadIcon />
          </Fab>
        </Tooltip>
      );
  }
};

export default ActionBarAction;
