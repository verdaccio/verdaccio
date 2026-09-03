import styled from '@emotion/styled';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { common } from '@mui/material/colors';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { Theme } from '../../Theme';
import { url as urlUtils, utils } from '../../utils';
import CopyClipboard from '../CopyClipboard';
import { Git } from '../Icons';
import LinkExternal from '../LinkExternal';

const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme.fontWeight.bold,
  textTransform: 'capitalize',
}));

const RepositoryListItem = styled(ListItem)({
  padding: 0,
  ':hover': {
    backgroundColor: 'transparent',
  },
});

const RepositoryListItemText = styled(ListItemText)({
  padding: '0 0 0 10px',
  margin: 0,
});

const RepositoryAvatar = styled(Avatar)({
  padding: 0,
  marginLeft: 0,
  backgroundColor: 'transparent',
});

const Repository: React.FC<{ packageMeta: any }> = ({ packageMeta }) => {
  const { t } = useTranslation();
  // repository can be the object form or a plain string, both valid in npm;
  // `git+ssh://git@host/...` and `git://host/...` are valid manifest urls but
  // dead links in a browser, so they are rewritten to https before validating
  const url = utils.formatRepository(packageMeta?.latest?.repository);
  const repositoryURL = url
    ? url
        .replace(/^git\+/, '')
        .replace(/^ssh:\/\/(git@)?/, 'https://')
        .replace(/^git:\/\//, 'https://')
    : null;
  if (!repositoryURL || !urlUtils.isURL(repositoryURL)) {
    return null;
  }

  return (
    <List
      dense={true}
      subheader={<StyledText variant="subtitle1">{t('sidebar.repository.title')}</StyledText>}
    >
      <RepositoryListItem>
        <RepositoryAvatar sx={{ bgcolor: common.white }}>
          <Git />
        </RepositoryAvatar>
        <RepositoryListItemText
          primary={
            <CopyClipboard dataTestId="repositoryID" text={repositoryURL} title={repositoryURL}>
              <LinkExternal to={repositoryURL} variant="outline">
                {repositoryURL}
              </LinkExternal>
            </CopyClipboard>
          }
        />
      </RepositoryListItem>
    </List>
  );
};

export default Repository;
