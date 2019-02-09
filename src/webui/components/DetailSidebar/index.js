import React, {Component} from 'react';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

import Install from '../Install';
import Author from '../Author';
import License from '../License';
import Repository from '../Repository';
import Developers from '../Developers';
import Engine from '../Engines';
import { DetailContextConsumer } from '../../pages/version/index';

import { TitleListItem, TitleAvatar } from './styles';

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
            {this.renderAuthor()}
            {this.renderMaintainers()}
            {this.renderContributors()}
            {this.renderLicense()}
          </CardContent>
        </Card>
      </>
    );
  }

  renderTitle = (packageName, packageMeta) => {
      return (
        <List>
          <TitleListItem alignItems={"flex-start"}>
            <TitleAvatar>{packageName[0]}</TitleAvatar>
            <ListItemText
              primary={packageName}
              secondary={packageMeta.latest.description}
            />
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
}

export default DetailSidebar;
