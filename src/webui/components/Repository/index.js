/* eslint no-unused-vars: 0 */
/* eslint react/jsx-max-depth: 0 */

import React, {Component, Fragment} from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import Card from '@material-ui/core/Card/index';
import CardContent from '@material-ui/core/CardContent/index';
import Grid from '@material-ui/core/Grid/index';
import GitHub from '../../icons/GitHub';
import CopyToClipBoard from '../CopyToClipBoard';
import BugReport from '@material-ui/icons/BugReport';
import CardActions from '@material-ui/core/CardActions/index';
import Button from '@material-ui/core/Button';
import {GridRepo} from './styles';

class Repository extends Component<any, any> {
  render() {
    return (
      <DetailContextConsumer>
        {(context) => {
          return this.renderAuthor(context);
        }}
      </DetailContextConsumer>
    );
  };

  renderAuthor = ({packageMeta}) => {
    const { repository, bugs } = packageMeta.latest;
    if (!repository) {
      return null;
    }

    return (
      <Card>
        <CardContent style={{ textAling: 'center'}}>
          <GridRepo container={true} spacing={24}>
            {this.renderRepository(repository, bugs)}
          </GridRepo>
        </CardContent>
        <CardActions>
          <Button size={"small"}>{'Open Bugs'}</Button>
          <Button size={"small"}>{'Open Repository'}</Button>
        </CardActions>
      </Card>
    );
  }

  renderRepository = ({url, type}, bugs) => {
    return (
      <Fragment>
        <Grid item={true} xs={3}>
          <GitHub style={{ fontSize: 45 }} />
        </Grid>
        <Grid item={true} xs={9}>
          <CopyToClipBoard text={url} />
        </Grid>
      </Fragment>
    );
  }
}


export default Repository;
