import React, {Component} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Add from '@material-ui/icons/Add';

import { DetailContextConsumer } from '../../pages/version';

import { Details, Heading, Content, Fab } from './styles';

interface Props {
  type: 'contributors' | 'maintainers'
}

class Developers extends Component<Props, any> {
  state = {
    visibleDevs: 6,
  };

  render() {
    return (
      <DetailContextConsumer>
        {({ packageMeta }) => {
          const { type } = this.props;
          const developerType = packageMeta.latest[type];
          if (!developerType || developerType.length === 0) return null;
          return this.renderDevelopers(developerType, packageMeta);
        }}
      </DetailContextConsumer>
    );
  };

  handleLoadMore = () => {
    this.setState((prev) => ({ visibleDevs: prev.visibleDevs + 6 }));
  }

  renderDevelopers = (developers, packageMeta) => {
    const { type } = this.props;
    const { visibleDevs } = this.state;
    return (
      <>
        <Heading variant={'subheading'}>{type}</Heading>
        <Content>
          {developers.slice(0, visibleDevs).map(developer => (
            <Details key={developer.email}>{this.renderDeveloperDetails(developer, packageMeta)}</Details>
          ))}
          {visibleDevs < developers.length &&
            <Fab onClick={this.handleLoadMore} size={'small'}><Add /></Fab>
          }
        </Content>
      </>
    );
  }

  renderLinkForMail(email, avatarComponent, packageName, version) {
    if(!email) {
      return avatarComponent;
    }
    return (
      <a href={`mailto:${email}?subject=${packageName}@${version}`} target={"_top"}>
        {avatarComponent}
      </a>
    );
  }

  renderDeveloperDetails = ({ name, avatar, email }, packageMeta) => {
    const { 
        name: packageName,
        version,
      } = packageMeta.latest;
  
    const avatarComponent = <Avatar aria-label={name} src={avatar} />;
    return (
      <Tooltip title={name}>
        {this.renderLinkForMail(email, avatarComponent, packageName, version)}
      </Tooltip>
    );
  }

}


export default Developers;
