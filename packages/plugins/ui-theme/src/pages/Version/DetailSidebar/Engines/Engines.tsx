import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Avatar from '@mui/material/Avatar';

import { DetailContext } from '../../context';
import npm from '../Install/img/npm.svg';
import node from './img/node.png';
import { EngineListItem, StyledText } from './styles';

const Engine: React.FC = () => {
  const { packageMeta } = useContext(DetailContext);
  const { t } = useTranslation();

  const engines = packageMeta?.latest?.engines;

  if (!engines || (!engines.node && !engines.npm)) {
    return null;
  }

  return (
    <Grid container={true}>
      {engines.node && (
        <Grid item={true} xs={6}>
          <List
            subheader={
              <StyledText variant={'subtitle1'}>{t('sidebar.engines.node-js')}</StyledText>
            }
          >
            <EngineListItem button={true}>
              <Avatar src={node} />
              <ListItemText primary={engines.node} />
            </EngineListItem>
          </List>
        </Grid>
      )}

      {engines.npm && (
        <Grid item={true} xs={6}>
          <List
            subheader={
              <StyledText variant={'subtitle1'}>{t('sidebar.engines.npm-version')}</StyledText>
            }
          >
            <EngineListItem button={true}>
              <Avatar src={npm} />
              <ListItemText primary={engines.npm} />
            </EngineListItem>
          </List>
        </Grid>
      )}
    </Grid>
  );
};

export default Engine;
