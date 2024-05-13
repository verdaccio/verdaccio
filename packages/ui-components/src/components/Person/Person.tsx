import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import i18next from 'i18next';
import React from 'react';

import { Developer } from '../../types/packageMeta';
import { url } from '../../utils';

function getTooltip(person: Developer): string {
  return (
    person.name + (person.email && `<br><${person.email}>`) + (person.url && `<br>(${person.url})`)
  );
}

function getLink(person: Developer, packageName: string, version: string): string {
  return person.url && url.isURL(person.url)
    ? person.url
    : person.email && url.isEmail(person.email)
      ? `mailto:${person.email}?subject=${packageName}@${version}`
      : '';
}

function getName(name?: string): string {
  return !name
    ? i18next.t('author-unknown')
    : name.toLowerCase() === 'anonymous'
      ? i18next.t('author-anonymous')
      : name;
}

const Person: React.FC<{
  person: Developer;
  packageName: string;
  version: string;
  withText?: boolean;
}> = ({ person, packageName, version, withText = false }) => {
  const link = getLink(person, packageName, version);

  const avatarComponent = (
    <Avatar alt={person.name} src={person.avatar} sx={{ width: 40, height: 40 }} />
  );

  return (
    <Tooltip key={person.email} title={getTooltip(person)}>
      <>
        {link.length > 0 ? (
          <a href={link} target={'_top'}>
            {avatarComponent}
          </a>
        ) : (
          avatarComponent
        )}
        {withText && (
          <Typography sx={{ ml: 1 }} variant="subtitle2">
            {getName(person.name)}
          </Typography>
        )}
      </>
    </Tooltip>
  );
};

export default Person;
