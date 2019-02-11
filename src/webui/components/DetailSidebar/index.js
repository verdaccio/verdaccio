/* eslint-disable */
import React, {Component} from 'react';

import Add from '@material-ui/icons/Add';
import BugReport from '@material-ui/icons/BugReport';
import Card from '@material-ui/core/Card/index';
import CardContent from '@material-ui/core/CardContent/index';
import Home from '@material-ui/icons/Home';
import List from '@material-ui/core/List/index';
import ListItemText from '@material-ui/core/ListItemText/index';
import Tooltip from '@material-ui/core/Tooltip/index';

import Install from '../Install';
import Author from '../Author';
import License from '../License';
import Repository from '../Repository';
import Developers from '../Developers';
import Engine from '../Engines';
import Dist from '../Dist';
import { DetailContextConsumer } from '../../pages/version/index';

import { TitleListItem, TitleAvatar, Fab } from './styles';

class DetailSidebar extends Component {
  render() {
    return (
      <DetailContextConsumer>
        {(context) => this.renderSideBar(context)}
      </DetailContextConsumer>
    );
  };

  renderSideBar = ({packageName, packageMeta}) => {
    return (
      <>
        <Card>
          <CardContent>
            {this.renderTitle(packageName, packageMeta)}
            {this.renderCopyCLI()}
            {this.renderRepository()}
            {this.renderEngine()}
            {this.renderDist()}
            {this.renderAuthor()}
            {this.renderMaintainers()}
            {this.renderContributors()}
            {/* {this.renderLicense()} */}
          </CardContent>
        </Card>
      </>
    );
  }

  renderTitle = (packageName, packageMeta) => {
      return (
        <List>
          <TitleListItem alignItems={"flex-start"}>
            {/* <TitleAvatar>{packageName[0]}</TitleAvatar> */}
            <ListItemText
              primary={<b>{packageName}</b>}
              secondary={packageMeta.latest.description}
            />
            
          </TitleListItem>
          <TitleListItem alignItems={"flex-start"}>
            <Tooltip title="Visit Homepage">
              <Fab size={'small'}><Home /></Fab>
            </Tooltip>
            <Tooltip title="Report a bug">
              <Fab size={'small'}><BugReport/></Fab>
            </Tooltip>
            <Tooltip title="Download Tarball">
              <Fab size={'small'}><Add /></Fab>
            </Tooltip>
          </TitleListItem>
        </List>
      );
  }

  renderCopyCLI = () => {
    return <Install />;
  }

  renderMaintainers = () => {
    return <Developers type={'maintainers'} />;
  }

  renderContributors = () => {
    return <Developers type={'contributors'} />;
  }
  
  renderLicense = () => {
    return <License />;
  }

  renderRepository = () => {
    return <Repository />;
  }

  renderAuthor = () => {
    return <Author />;
  }

  renderEngine = () => {
    return <Engine />;
  }

  renderDist = () => {
    return <Dist />;
  }
}

export default DetailSidebar;
