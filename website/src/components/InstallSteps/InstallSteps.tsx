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
    <CopyToClipBoard text="npm i -g verdaccio" />
    <Divider />
  </Container>
);
