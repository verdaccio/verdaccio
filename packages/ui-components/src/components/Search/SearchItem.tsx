/* eslint-disable verdaccio/jsx-spread */
import styled from '@emotion/styled';
import Cached from '@mui/icons-material/Cached';
import HttpsIcon from '@mui/icons-material/Https';
import SyncAlt from '@mui/icons-material/SyncAlt';
import { Theme } from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { cleanDescription } from './utils';

type SearchItemProps = {
  name: string;
  version?: string;
  description?: string;
  isPrivate?: boolean;
  isCached?: boolean;
  isRemote?: boolean;
};

const Wrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
});

export const Description = styled('div')<{ theme?: Theme }>(({ theme }) => ({
  display: 'none',
  color: theme?.palette?.greyLight2,
  lineHeight: '1.5rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  alignItems: 'center',
  overflow: 'hidden',
  paddingLeft: theme.spacing(),
  fontSize: theme?.fontSize.ssm,
  [`@media (min-width: ${theme?.breakPoints.medium}px)`]: {
    display: 'block',
    width: '300px',
  },
  [`@media (min-width: ${theme?.breakPoints.large}px)`]: {
    display: 'block',
    width: '500px',
  },
  [`@media (min-width: 1440px)`]: {
    display: 'block',
    width: '600px',
  },
}));

const NameGroup = styled.span({
  display: 'flex',
  flex: '1',
});

const Name = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  fontWeight: '700',
  fontSize: theme?.fontSize.sm,
}));

const Version = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  fontSize: theme?.fontSize.ssm,
}));

const SearchItem: React.FC<SearchItemProps> = ({
  name,
  description,
  isPrivate = false,
  isRemote = false,
  isCached = false,
  version,
  ...props
}) => {
  const { t } = useTranslation();
  const handleDelete = () => {
    // no action assigned by default
  };
  return (
    // eslint-disable-next-line verdaccio/jsx-no-style
    <li {...props} style={{ flexDirection: 'column' }}>
      <Wrapper>
        <NameGroup>
          <Name>{name}</Name>
          {description && <Description>{cleanDescription(description)}</Description>}
        </NameGroup>
        {version && <Version>{version}</Version>}
      </Wrapper>
      <Wrapper>
        <Stack direction="row" spacing={1}>
          {isPrivate && (
            <Chip
              color="primary"
              deleteIcon={<HttpsIcon />}
              label={t('search.isPrivate')}
              onDelete={handleDelete}
              size="small"
            />
          )}
          {isRemote && !isPrivate && (
            <Chip
              deleteIcon={<SyncAlt />}
              label={t('search.isRemote')}
              onDelete={handleDelete}
              size="small"
              variant="outlined"
            />
          )}
          {isCached && (
            <Chip
              deleteIcon={<Cached />}
              label={t('search.isCached')}
              onDelete={handleDelete}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      </Wrapper>
    </li>
  );
};

export default SearchItem;
