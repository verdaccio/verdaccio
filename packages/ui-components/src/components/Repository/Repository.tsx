import styled from '@emotion/styled';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from '../../Theme';
import { url as urlUtils } from '../../utils';
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
  const theme: Theme = useTheme();
  const url = packageMeta?.latest?.repository?.url;
  if (!url || !urlUtils.isURL(url)) {
    return null;
  }

  const getCorrectRepositoryURL = (): string => {
    if (!url.includes('git+')) {
      return url;
    }

    return url.split('git+')[1];
  };

  const repositoryURL = getCorrectRepositoryURL();

  return (
    <List
      dense={true}
      subheader={<StyledText variant="subtitle1">{t('sidebar.repository.title')}</StyledText>}
    >
      <RepositoryListItem>
        <RepositoryAvatar sx={{ bgcolor: theme.palette.white }}>
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
