import React, {Component} from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import Card from '@material-ui/core/Card/index';
import CardContent from '@material-ui/core/CardContent/index';
import CopyToClipBoard from '../CopyToClipBoard';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';

class Install extends Component<any, any> {
  render() {
    return (
      <DetailContextConsumer>
        {(context) => {
          return this.renderCopyCLI(context);
        }}
      </DetailContextConsumer>
    );
  };

  renderCopyCLI = ({packageName}) => {
    return (
      <Card>
        <CardContent>
          <CopyToClipBoard text={`npm install ${packageName}`} />
          <CopyToClipBoard text={`pnpm install ${packageName}`} />
          <CopyToClipBoard text={`yarn add ${packageName}`} />
          <CardActions>
            {this.renderDownloadButton()}
          </CardActions>
        </CardContent>
      </Card>
    );
  }

  renderDownloadButton = () => {
    return (
      <Button color={"primary"} size={'small'} variant={"contained"}>
        {'Download Tarball'}
      </Button>
    );
  }
}


export default Install;
