/**
 * @prettier
 */

import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar/index';
import List from '@material-ui/core/List/index';
import ListItemText from '@material-ui/core/ListItemText/index';

import { DetailContextConsumer } from '../../pages/version/index';
import { Heading, AuthorListItem } from './styles';

class Authors extends Component<any, any> {
  render() {
    return (
      <DetailContextConsumer>
        {context => {
          return this.renderAuthor(context);
        }}
      </DetailContextConsumer>
    );
  }

  renderLinkForMail(email, avatarComponent, packageName, version) {
    if (!email) {
      return avatarComponent;
    }
    return (
      <a href={`mailto:${email}?subject=${packageName}@${version}`} target={'_top'}>
        {avatarComponent}
      </a>
    );
  }

  renderAuthor = ({ packageMeta }) => {
    const { author, name: packageName, version } = packageMeta.latest;

    if (!author) {
      return null;
    }

    const avatarComponent = <Avatar alt={author.name} src={author.avatar} />;
    return (
      <List subheader={<Heading variant={'subheading'}>{'Author'}</Heading>}>
        <AuthorListItem>
          {this.renderLinkForMail(author.email, avatarComponent, packageName, version)}
          <ListItemText primary={author.name} />
        </AuthorListItem>
      </List>
    );
  };
}

export default Authors;
