/* eslint react/jsx-max-depth: 0 */

import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';

import { DetailContextConsumer } from '../../pages/version/index';
import CopyToClipBoard from '../CopyToClipBoard';

import { Heading, GithubLink, RepositoryListItem } from './styles';
import git from './img/git.png';

class Repository extends Component<any, any> {
  render() {
    return (
      <DetailContextConsumer>
        {(context) => {
          return this.renderRepository(context);
        }}
      </DetailContextConsumer>
    );
  };

  renderRepositoryText(url) {
    return (<GithubLink href={url} target={"_blank"}>{url}</GithubLink>);
  }

  renderRepository = ({packageMeta}) => {
    const { 
      repository: {
        url,
      } = {},
    } = packageMeta.latest;
    
    if (!url) {
      return null;
    }

    return (
      <>
        <List dense={true} subheader={<Heading variant={"subheading"}>{'Repository'}</Heading>}>
          <RepositoryListItem>
            <Avatar src={git} />
            <ListItemText primary={this.renderContent(url)} />
          </RepositoryListItem>
        </List>
      </>
    );
  }
  
  renderContent(url) {
    return (
      <CopyToClipBoard text={url}>
        {this.renderRepositoryText(url)}
      </CopyToClipBoard>
    );
  }
}


export default Repository;
