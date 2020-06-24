import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import CopyToClipBoard from '../CopyToClipBoard';

import IconDownload from './IconDownload';

export const InstallSteps = () => (
  <Container disableGutters>
    <Grid container>
      <Grid item xs={12} md={6}>
        <div>
          <IconDownload />
          <Typography variant="h6" component="h2">
            installation
          </Typography>
        </div>
        <div>
          <Typography variant="subtitle1" component="div" gutterBottom>
            installDescr
          </Typography>
          <CopyToClipBoard text="npm i -g verdaccio" />
          <Typography variant="subtitle1" component="div" gutterBottom>
            loadFont
          </Typography>
        </div>
        <Divider />
        <Button>installButton</Button>
      </Grid>
    </Grid>
  </Container>
);
