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


  renderDeveloperDetails = ({ name, avatar }) => {
    return (
      <Tooltip title={name}>
        <Avatar aria-label={name} src={avatar} />
      </Tooltip>
    );
  }

}


export default Developers;
