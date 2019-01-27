/**
 * @flow
 * @prettier
 */

import React, { Component } from 'react';

import { DetailContextConsumer } from '../../pages/version/index';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import { Heading, InstallItem } from './styles';
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

  renderAuthor = ({ packageMeta }) => {
    const { author } = packageMeta.latest;

    if (!author) {
      return null;
    }

    return (
      <List subheader={<Heading variant={'subheading'}>{'Author'}</Heading>}>
        <InstallItem>
          <Avatar alt={author.name} src={author.avatar} />
          <ListItemText primary={author.name} />
        </InstallItem>
      </List>
    );
  };
}

export default Authors;
