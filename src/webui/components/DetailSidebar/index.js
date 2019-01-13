/* eslint react/jsx-max-depth: 0 */

import React, {Component} from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
// import Paper from '@material-ui/core/Paper/index';
import Typography from '@material-ui/core/Typography/index';
import Grid from '@material-ui/core/Grid/index';
// import CardHeader from '@material-ui/core/CardHeader';
import Card from '@material-ui/core/Card/index';
import CardContent from '@material-ui/core/CardContent/index';
import { Content } from './styles';
import CopyToClipBoard from '../CopyToClipBoard';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
// import Paper from '@material-ui/core/Paper/index';

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
      <React.Fragment>
        {this.renderDescription(packageMeta, packageName)}
        <Content>
          <Grid container={true} spacing={24}>
            <Grid item={true} xs={12}>
              <Typography color={"textPrimary"} gutterBottom={true} variant={'title'}>
                {packageName}
              </Typography>
              <Typography color={"textSecondary"} gutterBottom={true} variant={'subtitle2'}>
                {packageMeta.latest.description}
              </Typography>
            </Grid>
            <Grid item={true} xs={12}>
              <Card>
                <CardContent>
                  <CopyToClipBoard text={`npm install ${packageName}`} />
                  <CopyToClipBoard text={`pnpm install ${packageName}`} />
                  <CopyToClipBoard text={`yarn add ${packageName}`} />
                  <CardActions>
                    <Button color={"primary"} variant={"contained"}>
                      {'Download Tarball'}
                    </Button>
                  </CardActions>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Content>
      </React.Fragment>
    );
  }

  renderDescription = (packageMeta) => {
    console.log('packageMeta', packageMeta);

    return (
      <React.Fragment>

      </React.Fragment>
    );
  }
}


export default DetailSidebar;
