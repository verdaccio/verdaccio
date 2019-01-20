/* eslint no-unused-vars: 0 */

import React, {Component, Fragment} from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import Card from '@material-ui/core/Card/index';
import CardContent from '@material-ui/core/CardContent/index';
import Avatar from '@material-ui/core/Avatar';
import Notes from '@material-ui/icons/Notes';
import Typography from "@material-ui/core/Typography/index";

class License extends Component<any, any> {
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
    const { license } = packageMeta.latest;
    if (!license) {
      return null;
    }

    return (
      <Card>
        <CardContent style={{ textAling: 'center'}}>
          {this.renderLicense(license)}
        </CardContent> 
      </Card>
    );
  }

  renderLicense = (license) => {
    return (
      <Fragment>
        <Notes style={{ fontSize: 38 }} />
        <Typography color={"textPrimary"} gutterBottom={true} variant={'caption'}>
          {license}
        </Typography>
      </Fragment>
    );
  }
}


export default License;
