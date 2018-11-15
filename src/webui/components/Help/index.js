/**
 * @prettier
 * @flow
 */

import React from 'react';
import { CardStyled as Card } from './styles';
import CardActions from '@material-ui/core/CardActions/index';
import CardContent from '@material-ui/core/CardContent/index';
import Button from '@material-ui/core/Button/index';
import Typography from '@material-ui/core/Typography/index';

import CopyToClipBoard from '../CopyToClipBoard/index';

import { getRegistryURL } from '../../utils/url';

import type { Node } from 'react';
import { IProps } from './types';

const Help = ({ scope = '' }: IProps): Node => {
  const registryUrl = getRegistryURL();

  return (
    <Card>
      <CardContent>
        <Typography component="h2" variant="headline" gutterBottom>
          No Package Published Yet.
        </Typography>
        <Typography color="textSecondary" gutterBottom>
          To publish your first package just:
        </Typography>
        <br />
        <Typography variant="body2" gutterBottom>
          1. Login
        </Typography>
        <CopyToClipBoard text={`$ npm set ${scope} registry ${registryUrl}`} />
        <Typography variant="body2">2. Publish</Typography>
        <CopyToClipBoard text={`$ npm adduser --registry ${registryUrl}`} />
        <Typography variant="body2">3. Refresh this page.</Typography>
      </CardContent>
      <CardActions>
        <Button href="https://verdaccio.org/docs/en/installation" target="_blank" size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  );
};

export default Help;
