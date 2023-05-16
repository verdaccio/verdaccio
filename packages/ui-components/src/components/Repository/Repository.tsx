import styled from '@emotion/styled';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Theme } from '../../Theme';
import { url as urlUtils } from '../../utils';
import CopyClipboard from '../CopyClipboard';
import { Git } from '../Icons';
import { Link } from '../Link';

const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme?.fontWeight.bold,
  textTransform: 'capitalize',
}));

const GithubLink = styled(Link)<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.mode === 'light' ? theme?.palette.primary.main : theme?.palette.white,
  ':hover': {
    color: theme?.palette.dodgerBlue,
  },
}));

const RepositoryListItem = styled(ListItem)({
  padding: 0,
  ':hover': {
    backgroundColor: 'transparent',
  },
});

const RepositoryListItemText = styled(ListItemText)({
  padding: '0 10px',
  margin: 0,
});

const RepositoryAvatar = styled(Avatar)({
  borderRadius: '0px',
  padding: '0',
  img: {
    backgroundColor: 'transparent',
  },
});

const Repository: React.FC<{ packageMeta: any }> = ({ packageMeta }) => {
  const { t } = useTranslation();
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
        <RepositoryAvatar sx={{ backgroundColor: '#fff' }}>
          <Git />
        </RepositoryAvatar>
        <RepositoryListItemText
          primary={
            <CopyClipboard dataTestId="repositoryID" text={repositoryURL} title={repositoryURL}>
              <GithubLink external={true} to={repositoryURL} variant="outline">
                {repositoryURL}
              </GithubLink>
            </CopyClipboard>
          }
        />
      </RepositoryListItem>
    </List>
  );
};

export default Repository;
