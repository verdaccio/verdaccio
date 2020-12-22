import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { getAuthorName } from 'verdaccio-ui/utils/package';
import { isEmail } from 'verdaccio-ui/utils/url';

import { DetailContext } from '../../pages/Version';
import Avatar from '../Avatar';
import List from '../List';

import { StyledText, AuthorListItem, AuthorListItemText } from './styles';

const Author: FC = () => {
  const { packageMeta } = useContext(DetailContext);
  const { t } = useTranslation();

  if (!packageMeta) {
    return null;
  }

  const { author, name: packageName, version } = packageMeta.latest;

  if (!author) {
    return null;
  }

  const { email, name } = author;

  const avatarComponent = <Avatar alt={author.name} src={author.avatar} />;

  return (
    <List subheader={<StyledText variant={'subtitle1'}>{t('sidebar.author.title')}</StyledText>}>
      <AuthorListItem button={true}>
        {!email || !isEmail(email) ? (
          avatarComponent
        ) : (
          <a href={`mailto:${email}?subject=${packageName}@${version}`} target={'_top'}>
            {avatarComponent}
          </a>
        )}
        {name && <AuthorListItemText primary={getAuthorName(name)} />}
      </AuthorListItem>
    </List>
  );
};

export default Author;
