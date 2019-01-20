import React, {Component, Fragment} from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import Typography from '@material-ui/core/Typography/index';
import Grid from '@material-ui/core/Grid/index';

import Install from '../Install';
import { Content } from './styles';
import Authors from '../Author';
import License from '../License';
import Repository from '../Repository';

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
          <Grid item={true} xs={12}>
            {this.renderSecondLevel(8)}
          </Grid>
          <Grid item={true} xs={12}>
            {this.renderRepository()}
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
  
  renderSecondLevel = (spacing = 24) => {
    return (
      <Grid container={true} spacing={spacing}>
        {this.renderAuthor()}
      </Grid>
    );
  }

  renderRepository = () => {
    return <Repository />;
  }

  renderAuthor = () => {
    return (
      <Fragment>
        <Grid item={true} xs={6}>
          <Authors />
        </Grid>
        <Grid item={true} xs={6}>
          <License />
        </Grid>
      </Fragment>
    );
  }
}


export default DetailSidebar;
