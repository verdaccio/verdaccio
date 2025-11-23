import Translate from '@docusaurus/Translate';
import styled from '@emotion/styled';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { green, red } from '@mui/material/colors';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/styles';
import * as React from 'react';
import { FC } from 'react';

import CardLogo from './CardLogo';
import Icon from './Icon';
import { Addon } from './types';

const Content = styled(Typography)({
  display: 'inline-block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'break-spaces',
  fontSize: '1rem',
});

const AddonCard: FC<Addon> = ({
  url,
  name,
  category,
  description,
  downloads,
  latest,
  origin,
}): React.ReactElement => {
  const theme = useTheme();
  const matches = useMediaQuery('(min-width:600px)');
  return (
    <div>
      <Card sx={{ minWidth: 300 }}>
        <CardHeader
          title={name}
          disableTypography={false}
          titleTypographyProps={{ variants: 'outline' }}
          sx={{ paddingBottom: 1 }}
          avatar={
            <Avatar
              alt={name}
              sx={{ bgcolor: origin === 'core' ? green[200] : red[200], width: 40, height: 40 }}
            >
              <Icon category={category} />
            </Avatar>
          }
          action={
            <Avatar
              alt="Verdaccio"
              title="Verdaccio Core"
              sx={{ width: 40, height: 40, bgcolor: 'transparent' }}
            >
              <CardLogo origin={origin} />
            </Avatar>
          }
        />
        <CardContent>
          <Grid container>
            <Grid xs={12}>
              <Content sx={{ minHeight: '60px' }}>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </Content>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions sx={{ paddingTop: 1, paddingBottom: 1 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 1 }}
            justifyContent={{ sm: 'flex-end', xl: 'space-between' }}
            width="100%"
          >
            <Grid>
              <Chip
                title="Monthly downloads"
                label={new Intl.NumberFormat().format(downloads)}
                avatar={
                  <Avatar sizes="small">
                    <ArrowDownwardIcon />
                  </Avatar>
                }
                variant="outlined"
              />
            </Grid>
            <Grid>
              <Chip title="Latest version" label={`v${latest}`} variant="outlined" />
            </Grid>
            <Grid>
              <Button
                title="Show package on npmjs.com"
                variant="text"
                onClick={() => {
                  window.open(url, '_blank');
                }}
              >
                <Translate>Visit</Translate>
              </Button>
            </Grid>
          </Grid>
        </CardActions>
      </Card>
    </div>
  );
};

export default AddonCard;
