/* eslint react/jsx-max-depth: 0 */

import React, {Component} from 'react';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { DetailContextConsumer } from '../../pages/version/index';
import CopyToClipBoard from '../CopyToClipBoard';

import { Heading, GithubLink, GithubLogo, RepositoryListItem } from './styles';

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
    return (<GithubLink href={url}>{url}</GithubLink>);
  }

  renderRepository = ({packageMeta}) => {
    const { repository } = packageMeta.latest;
    if (!repository) {
      return null;
    }

    const { url } = repository;
    return (
      <>
        <List dense={true} subheader={<Heading variant={"subheading"}>{'Repository'}</Heading>}>
          <RepositoryListItem>
            <Avatar>
              <GithubLogo />
            </Avatar>
            <ListItemText primary={(<CopyToClipBoard text={this.renderRepositoryText(url)} />)} />
          </RepositoryListItem>
        </List>
      </>
    );
  }
}


export default Repository;
