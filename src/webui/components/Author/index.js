/* eslint no-unused-vars: 0 */

import React, {Component, Fragment} from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import Card from '@material-ui/core/Card/index';
import CardContent from '@material-ui/core/CardContent/index';
import CopyToClipBoard from '../CopyToClipBoard';
import CardHeader from '@material-ui/core/CardHeader/index';
import Avatar from '@material-ui/core/Avatar';
import CardActions from '@material-ui/core/CardActions';
import Typography from "@material-ui/core/Typography/index";

class Authors extends Component<any, any> {
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
    const { author } = packageMeta.latest;
    
    if (!author) {
      return null;
    }

    return (
      <Card>
        <CardContent>
          {this.renderAvatar(author)}
        </CardContent>
      </Card>
    );
  }

  renderAvatar = ({name, email, url, avatar}) => {
    return (
      <Fragment>
        <Avatar aria-label={name} src={avatar} />
        <Typography color={"textPrimary"} gutterBottom={true} variant={'caption'}>
          {name}
        </Typography>
      </Fragment>
    );
  }
}


export default Authors;
