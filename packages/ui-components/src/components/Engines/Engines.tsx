import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PackageMetaInterface } from '../../types/packageMeta';
import { NodeJS, Npm, Pnpm, Yarn } from '../Icons';
import { EngineListItem, StyledText } from './styles';

/**
 * The props type for {@link EngineItem}.
 */
type EngineItemProps = { title: string; element: React.ReactElement; engineText?: string };

/**
 *
 *
 * @category Component
 */
const EngineItem: FC<EngineItemProps> = ({ title, element, engineText }) => (
  <Grid item={true} xs={6}>
    <List subheader={<StyledText variant={'subtitle1'}>{title}</StyledText>}>
      <EngineListItem>
        <Avatar sx={{ bgcolor: '#FFF' }}>{element}</Avatar>
        <ListItemText primary={engineText} />
      </EngineListItem>
    </List>
  </Grid>
);

interface EngineMetadata extends Omit<PackageMetaInterface, 'latest'> {
  latest: {
    engines?: { npm?: string; node?: string; pnpm?: string; yarn?: string };
  };
}

/**
 * The props type for {@link Engine}.
 */
export type Props = { packageMeta: EngineMetadata };

/**
 *
 *
 * @category Component
 */
const Engine: React.FC<Props> = ({ packageMeta }) => {
  const { t } = useTranslation();

  const engines = packageMeta?.latest?.engines;

  if (!engines) {
    return null;
  }

  return (
    <Grid container={true}>
      {engines.node ? (
        <EngineItem
          element={<NodeJS />}
          engineText={engines.node}
          title={t('sidebar.engines.node-js')}
        />
      ) : null}

      {engines.npm ? (
        <EngineItem
          element={<Npm />}
          engineText={engines.npm}
          title={t('sidebar.engines.npm-version')}
        />
      ) : null}

      {engines.yarn ? (
        <EngineItem
          element={<Yarn />}
          engineText={engines.yarn}
          title={t('sidebar.engines.yarn-version')}
        />
      ) : null}

      {engines.pnpm ? (
        <EngineItem
          element={<Pnpm />}
          engineText={engines.pnpm}
          title={t('sidebar.engines.pnpm-version')}
        />
      ) : null}
    </Grid>
  );
};

export default Engine;
