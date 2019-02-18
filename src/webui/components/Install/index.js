/**
 * @prettier
 */

import React, { Component } from 'react';

import List from '@material-ui/core/List/index';
import ListItemText from '@material-ui/core/ListItemText/index';

import { DetailContextConsumer } from '../../pages/version/index';
import CopyToClipBoard from '../CopyToClipBoard';

import { Heading, InstallItem, PackageMangerAvatar } from './styles';
// logos of package managers
import npm from './img/npm.svg';
import pnpm from './img/pnpm.svg';
import yarn from './img/yarn.svg';

class Install extends Component {
  render() {
    return (
      <DetailContextConsumer>
        {context => {
          return this.renderCopyCLI(context);
        }}
      </DetailContextConsumer>
    );
  }

  renderCopyCLI = ({ packageName }) => {
    return (
      <>
        <List subheader={<Heading variant={'subheading'}>{'Installation'}</Heading>}>{this.renderListItems(packageName)}</List>
      </>
    );
  };

  renderListItems = packageName => {
    return (
      <>
        <InstallItem>
          <PackageMangerAvatar alt={'npm logo'} src={npm} />
          <ListItemText primary={<CopyToClipBoard text={`npm install ${packageName}`} />} secondary={'Install using NPM'} />
        </InstallItem>
        <InstallItem>
          <PackageMangerAvatar alt={'yarn logo'} src={yarn} />
          <ListItemText primary={<CopyToClipBoard text={`yarn add ${packageName}`} />} secondary={'Install using Yarn'} />
        </InstallItem>
        <InstallItem>
          <PackageMangerAvatar alt={'pnpm logo'} src={pnpm} />
          <ListItemText primary={<CopyToClipBoard text={`pnpm install ${packageName}`} />} secondary={'Install using PNPM'} />
        </InstallItem>
      </>
    );
  };
}

export default Install;
