import React, { Component } from 'react';

import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

import { DetailContextConsumer } from '../../pages/version/index';
import CopyToClipBoard from '../CopyToClipBoard';

import { Heading, InstallItem, PackageMangerAvatar } from './styles';

class Install extends Component {
  render() {
    return (
      <DetailContextConsumer>
        {(context) => {
          return this.renderCopyCLI(context);
        }}
      </DetailContextConsumer>
    );
  };

  renderCopyCLI = ({ packageName }) => {
    return (
      <>
        <List subheader={<Heading variant={"subheading"}>{'Installation'}</Heading>}>
          {this.renderListItems(packageName)}
        </List>
      </>
    );
  }

  renderListItems = (packageName) => {
    return (
      <>
        <InstallItem>
          <PackageMangerAvatar alt={"npm logo"} src={"https://cldup.com/Rg6WLgqccB.svg"} />
          <ListItemText primary={<CopyToClipBoard text={`npm install ${packageName}`} />} secondary={'Install using NPM'} />
        </InstallItem>
        <InstallItem>
          <PackageMangerAvatar alt={"yarn logo"} src={"https://raw.githubusercontent.com/yarnpkg/assets/master/yarn-kitten-circle.png"} />
          <ListItemText primary={<CopyToClipBoard text={`yarn add ${packageName}`} />} secondary={'Install using Yarn'} />
        </InstallItem>
        <InstallItem>
          <PackageMangerAvatar alt={"pnpm logo"} src={"https://pnpm.js.org/img/pnpm-no-name-with-frame.svg"} />
          <ListItemText primary={<CopyToClipBoard text={`pnpm install ${packageName}`} />} secondary={'Install using PNPM'} />
        </InstallItem>
      </>
    );
  }
  
}

export default Install;
