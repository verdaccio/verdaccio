import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { utils } from '../../utils';
import { LinkExternal } from '../LinkExternal';
import NoItems from '../NoItems';
import { ListItemText, Spacer, StyledText } from './styles';

const UpLinkLink: React.FC<{ packageName: string; uplinkName: string }> = ({
  packageName,
  uplinkName,
}) => {
  const link = utils.getUplink(uplinkName, packageName);
  return link ? (
    <LinkExternal href={link} variant="outline">
      {uplinkName}
    </LinkExternal>
  ) : (
    <>{uplinkName}</>
  );
};

const UpLinks: React.FC<{ packageMeta: any }> = ({ packageMeta }) => {
  const { t } = useTranslation();

  if (!packageMeta?._uplinks || !packageMeta.latest) {
    return null;
  }

  const { _uplinks: uplinks, latest } = packageMeta;

  if (Object.keys(uplinks).length === 0) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <NoItems data-testid="no-uplinks" text={t('uplinks.no-items', { name: latest.name })} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box data-testid="uplinks" sx={{ m: 2 }}>
          <StyledText variant="subtitle1">{t('uplinks.title')}</StyledText>
          <List dense={true}>
            {Object.keys(uplinks)
              .reverse()
              .map((name) => (
                <ListItem
                  className="version-item"
                  data-testid={`uplink-${name}`}
                  key={name}
                  sx={{ pr: 0 }}
                >
                  <ListItemText>
                    <UpLinkLink packageName={latest.name} uplinkName={name} />
                  </ListItemText>
                  <Spacer />
                  <ListItemText title={utils.formatDate(uplinks[name].fetched)}>
                    {utils.formatDateDistance(uplinks[name].fetched)}
                  </ListItemText>
                </ListItem>
              ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UpLinks;
