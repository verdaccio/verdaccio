import React, {Component} from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import Typography from '@material-ui/core/Typography/index';
import Grid from '@material-ui/core/Grid/index';

import Install from '../Install';
import { Content } from './styles';

class DetailSidebar extends Component<any, any> {
  render() {
    return (
      <DetailContextConsumer>
        {(context) => {
          return this.renderSideBar(context);
        }}
      </DetailContextConsumer>
    );
  };

  renderSideBar = ({packageMeta, packageName}) => {
    return (
      <Content>
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={12}>
            {this.renderTitle(packageName, packageMeta)}
          </Grid>
          <Grid item={true} xs={12}>
            {this.renderCopyCLI()}
          </Grid>
        </Grid>
      </Content>
    );
  }

  renderTitle = (packageName, packageMeta) => {
      return (
        <React.Fragment>
          <Typography color={"textPrimary"} gutterBottom={true} variant={'title'}>
            {packageName}
          </Typography>
          <Typography color={"textSecondary"} gutterBottom={true} variant={'body2'}>
            {packageMeta.latest.description}
          </Typography>
        </React.Fragment>
      );
  }

  renderCopyCLI = () => {
    return <Install />;
  }
}


export default DetailSidebar;
