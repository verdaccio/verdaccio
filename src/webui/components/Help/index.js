/**
 * @prettier
 * @flow
 */

import React, { Fragment } from 'react';
import type { Node } from 'react';
import CardActions from '@material-ui/core/CardActions/index';
import CardContent from '@material-ui/core/CardContent/index';
import Button from '@material-ui/core/Button/index';
import Typography from '@material-ui/core/Typography/index';

import CopyToClipBoard from '../CopyToClipBoard/index';
import { getRegistryURL } from '../../utils/url';
import { CardStyled as Card, HelpTitle } from './styles';

function renderHeadingClipboardSegments(title: string, text: string): Node {
  return (
    <Fragment>
      <Typography variant="body2">{title}</Typography>
      <CopyToClipBoard text={text} />
    </Fragment>
  );
}

const Help = (): Node => {
  const registryUrl = getRegistryURL();

  return (
    <Card id="help-card">
      <CardContent>
        <Typography component="h2" variant="headline" gutterBottom id="help-card__title">
          No Package Published Yet.
        </Typography>
        <HelpTitle color="textSecondary" gutterBottom>
          To publish your first package just:
        </HelpTitle>
        {renderHeadingClipboardSegments('1. Login', `$ npm adduser --registry ${registryUrl}`)}
        {renderHeadingClipboardSegments('2. Publish', `$ npm publish --registry ${registryUrl}`)}
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
