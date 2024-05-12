import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import i18next from 'i18next';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { url } from '../../utils';
import { AuthorListItem, StyledText } from './styles';

export function getAuthorName(authorName?: string): string {
  if (!authorName) {
    return i18next.t('author-unknown');
  }

  if (authorName.toLowerCase() === 'anonymous') {
    return i18next.t('author-anonymous');
  }

  return authorName;
}

/**
 * @param param0
 * @returns
 */
const Author: FC<{ packageMeta }> = ({ packageMeta }) => {
  const { t } = useTranslation();

  if (!packageMeta) {
    return null;
  }

  const { author, name: packageName, version } = packageMeta.latest;

  if (!author) {
    return null;
  }

  const { email, name } = author;
  const avatarComponent = (
    <Avatar alt={author.name} src={author.avatar} sx={{ width: 40, height: 40, mx: 1 }} />
  );

  return (
    <List subheader={<StyledText variant={'subtitle1'}>{t('sidebar.author.title')}</StyledText>}>
      <AuthorListItem sx={{ my: 1 }}>
        {!email || !url.isEmail(email) ? (
          avatarComponent
        ) : (
          <a href={`mailto:${email}?subject=${packageName}@${version}`} target={'_top'}>
            {avatarComponent}
          </a>
        )}
        {name && <Typography variant="subtitle2">{getAuthorName(name)}</Typography>}
      </AuthorListItem>
    </List>
  );
};

export default Author;
