import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { utils } from '../../utils';
import NoItems from '../NoItems';
import { ListItemText, Spacer, StyledText } from './styles';

const UpLinks: React.FC<{ packageMeta: any }> = ({ packageMeta }) => {
  const { t } = useTranslation();

  if (!packageMeta?._uplinks || !packageMeta.latest) {
    return null;
  }

  const { _uplinks: uplinks, latest } = packageMeta;

  if (Object.keys(uplinks).length === 0) {
    return <NoItems data-testid="no-uplinks" text={t('uplinks.no-items', { name: latest.name })} />;
  }

  return (
    <Card>
      <CardContent>
        <Box data-testid="uplinks" sx={{ m: 1 }}>
          <StyledText variant="subtitle1">{t('uplinks.title')}</StyledText>
          <List>
            {Object.keys(uplinks)
              .reverse()
              .map((name) => (
                <ListItem key={name}>
                  <ListItemText>{name}</ListItemText>
                  <Spacer />
                  <ListItemText>{utils.formatDateDistance(uplinks[name].fetched)}</ListItemText>
                </ListItem>
              ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UpLinks;
