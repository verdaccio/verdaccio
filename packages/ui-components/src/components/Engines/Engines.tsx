import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { NodeJS, Npm, Pnpm, Yarn } from '../Icons';
import { EngineListItem, StyledText } from './styles';

const EngineItem = ({ title, element, engineText }) => (
  <Grid item={true} xs={6}>
    <List subheader={<StyledText variant={'subtitle1'}>{title}</StyledText>}>
      <EngineListItem>
        <Avatar sx={{ bgcolor: '#FFF' }}>{element}</Avatar>
        <ListItemText primary={engineText} />
      </EngineListItem>
    </List>
  </Grid>
);

const Engine: React.FC<{ packageMeta }> = ({ packageMeta }) => {
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
          engineText={engines.node}
          title={t('sidebar.engines.npm-version')}
        />
      ) : null}

      {engines.yarn ? (
        <EngineItem
          element={<Yarn />}
          engineText={engines.yarn}
          title={t('sidebar.engines.npm-version')}
        />
      ) : null}

      {engines.pnpm ? (
        <EngineItem
          element={<Pnpm />}
          engineText={engines.pnpm}
          title={t('sidebar.engines.npm-version')}
        />
      ) : null}
    </Grid>
  );
};

export default Engine;
