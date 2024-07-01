import { Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import React from 'react';

import { Developer } from '../../types/packageMeta';
import LinkExternal from '../LinkExternal';
import PersonTooltip from './PersonTooltip';
import { getLink, getName } from './utils';

const Person: React.FC<{
  person: Developer;
  packageName: string;
  version: string;
  withText?: boolean;
}> = ({ person, packageName, version, withText = false }) => {
  const link = getLink(person, packageName, version);

  const avatarComponent = (
    <Avatar alt={person.name} src={person.avatar} sx={{ width: 40, height: 40, ml: 0, mr: 1 }} />
  );

  return (
    <>
      <Tooltip
        data-testid={person.name}
        key={person.email}
        title={<PersonTooltip person={person} />}
      >
        {link.length > 0 ? (
          <LinkExternal to={link}>{avatarComponent}</LinkExternal>
        ) : (
          avatarComponent
        )}
      </Tooltip>
      {withText && (
        <Typography sx={{ ml: 1 }} variant="subtitle2">
          {getName(person.name)}
        </Typography>
      )}
    </>
  );
};

export default Person;
