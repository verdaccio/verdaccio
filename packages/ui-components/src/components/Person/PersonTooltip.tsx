import Typography from '@mui/material/Typography';
import React from 'react';

import { Developer } from '../../types/packageMeta';
import { url } from '../../utils';
import LinkExternal from '../LinkExternal';

const PersonTooltip: React.FC<{ person: Developer }> = ({ person }) => (
  <Typography data-testid={person.name + '-tooltip'}>
    {person.name}
    {person.email && url.isEmail(person.email) && (
      <LinkExternal to={`mailto:${person.email}`}>
        <br />
        {person.email}
      </LinkExternal>
    )}
    {person.url && url.isURL(person.url) && (
      <LinkExternal to={person.url}>
        <br />
        {person.url}
      </LinkExternal>
    )}
  </Typography>
);

export default PersonTooltip;
