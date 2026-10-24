import styled from '@emotion/styled';
import CloudOutlined from '@mui/icons-material/CloudOutlined';
import Inventory2Outlined from '@mui/icons-material/Inventory2Outlined';
import LockOutlined from '@mui/icons-material/LockOutlined';
import type { Theme } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '../../';
import { SearchOrigin, cleanDescription } from './utils';

type SearchItemProps = {
  name: string;
  version?: string;
  description?: string;
  isPrivate?: boolean;
  isCached?: boolean;
  isRemote?: boolean;
};

export const ORIGIN_ICONS = {
  [SearchOrigin.PRIVATE]: LockOutlined,
  [SearchOrigin.CACHED]: Inventory2Outlined,
  [SearchOrigin.REMOTE]: CloudOutlined,
};

const Row = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  minWidth: 0,
});

const Text = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
});

const TitleLine = styled('div')({
  display: 'flex',
  alignItems: 'baseline',
  gap: 8,
});

const Name = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  fontWeight: 700,
  fontSize: theme.fontSize.sm,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

const Version = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  marginLeft: 'auto',
  flexShrink: 0,
  fontSize: theme.fontSize.ssm,
  color: theme.palette.text.secondary,
}));

export const Description = styled('span')<{ theme?: Theme }>(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: theme.fontSize.ssm,
  lineHeight: 1.5,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
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
  const { configOptions } = useConfig();
  const origin = isPrivate
    ? SearchOrigin.PRIVATE
    : isCached
      ? SearchOrigin.CACHED
      : isRemote
        ? SearchOrigin.REMOTE
        : undefined;
  const OriginIcon = configOptions?.showUplinks && origin ? ORIGIN_ICONS[origin] : undefined;

  return (
    <li {...props}>
      <Row>
        {OriginIcon && (
          <OriginIcon
            color={origin === SearchOrigin.PRIVATE ? 'primary' : 'action'}
            data-testid={`search-origin-${origin}`}
            fontSize="small"
            titleAccess={t(`search.origin.${origin}`)}
          />
        )}
        <Text>
          <TitleLine>
            <Name>{name}</Name>
            {version && <Version>{version}</Version>}
          </TitleLine>
          {description && <Description>{cleanDescription(description)}</Description>}
        </Text>
      </Row>
    </li>
  );
};

export default SearchItem;
