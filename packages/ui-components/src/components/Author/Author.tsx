import List from '@mui/material/List';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Person from '../Person';
import { AuthorListItem, StyledText } from './styles';

const Author: FC<{ packageMeta }> = ({ packageMeta }) => {
  const { t } = useTranslation();

  if (!packageMeta) {
    return null;
  }

  const { author, name: packageName, version } = packageMeta.latest;

  if (!author) {
    return null;
  }

  return (
    <List subheader={<StyledText variant={'subtitle1'}>{t('sidebar.author.title')}</StyledText>}>
      <AuthorListItem sx={{ my: 1 }}>
        <Person packageName={packageName} person={author} version={version} withText={true} />
      </AuthorListItem>
    </List>
  );
};

export default Author;
