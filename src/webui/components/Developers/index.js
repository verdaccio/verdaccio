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
          return this.renderDevelopers(developerType);
        }}
      </DetailContextConsumer>
    );
  };

  handleLoadMore = () => {
    this.setState((prev) => ({ visibleDevs: prev.visibleDevs + 6 }));
  }

  renderDevelopers = (developers) => {
    const { type } = this.props;
    const { visibleDevs } = this.state;
    return (
      <>
        <Heading variant={'subheading'}>{type}</Heading>
        <Content>
          {developers.slice(0, visibleDevs).map(developer => (
            <Details key={developer.email}>{this.renderDeveloperDetails(developer)}</Details>
          ))}
          {visibleDevs < developers.length &&
            <Fab onClick={this.handleLoadMore} size={'small'}><Add /></Fab>
          }
        </Content>
      </>
    );
  }

  renderLinkForMail(email, avatar) {
    if(!email) {
      return avatar;
    }
    return (
      <a href={`mailto:${email}`} target={"_top"}>
        {avatar}
      </a>
    );
  }

  renderDeveloperDetails = ({ name, avatar, email }) => {
    const avatarComponent = <Avatar aria-label={name} src={avatar} />;
    return (
      <Tooltip title={name}>
        {this.renderLinkForMail(email, avatarComponent)}
      </Tooltip>
    );
  }

}


export default Developers;
