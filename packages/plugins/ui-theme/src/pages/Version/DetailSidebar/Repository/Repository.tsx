import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Avatar from 'verdaccio-ui/components/Avatar';
import CopyToClipBoard from 'verdaccio-ui/components/CopyToClipBoard';
import Link from 'verdaccio-ui/components/Link';
import List from 'verdaccio-ui/components/List';
import ListItem from 'verdaccio-ui/components/ListItem';
import ListItemText from 'verdaccio-ui/components/ListItemText';
import Text from 'verdaccio-ui/components/Text';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import { isURL } from 'verdaccio-ui/utils/url';

import { DetailContext } from '../../context';

import git from './img/git.png';

const StyledText = styled(Text)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme && props.theme.fontWeight.bold,
  textTransform: 'capitalize',
}));

const GithubLink = styled(Link)<{ theme?: Theme }>(({ theme }) => ({
  color: theme?.palette.type === 'light' ? theme?.palette.primary.main : theme?.palette.white,
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

const Repository: React.FC = () => {
  const detailContext = React.useContext(DetailContext);
  const { t } = useTranslation();

  const { packageMeta } = detailContext;

  if (!packageMeta?.latest?.repository?.url || !isURL(packageMeta.latest.repository.url)) {
    return null;
  }

  const { url } = packageMeta.latest.repository;

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
      subheader={<StyledText variant="subtitle1">{t('sidebar.repository.title')}</StyledText>}>
      <RepositoryListItem button={true}>
        <RepositoryAvatar src={git} />
        <RepositoryListItemText
          primary={
            <CopyToClipBoard text={repositoryURL}>
              <GithubLink external={true} to={repositoryURL}>
                {repositoryURL}
              </GithubLink>
            </CopyToClipBoard>
          }
        />
      </RepositoryListItem>
    </List>
  );
};

export default Repository;
