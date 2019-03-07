/**
 * @prettier
 */

import React, { Component } from 'react';

import Avatar from '@material-ui/core/Avatar/index';
import Grid from '@material-ui/core/Grid/index';
import List from '@material-ui/core/List/index';
import ListItemText from '@material-ui/core/ListItemText/index';

import { DetailContextConsumer } from '../../pages/version/index';
import { Heading, EngineListItem } from './styles';
import node from './img/node.png';
import npm from '../Install/img/npm.svg';

const ICONS = {
  'node-JS': <Avatar src={node} />,
  'NPM-version': <Avatar src={npm} />,
};

class Engine extends Component {
  render() {
    return (
      <DetailContextConsumer>
        {context => {
          return this.renderEngine(context);
        }}
      </DetailContextConsumer>
    );
  }

  renderEngine = ({ packageMeta }) => {
    const { engines } = packageMeta.latest;
    if (!engines) {
      return null;
    }

    const engineDict = {
      'node-JS': engines.node,
      'NPM-version': engines.npm,
    };

    const items = Object.keys(engineDict).reduce((markup, text, key) => {
      const heading = engineDict[text];
      if (heading) {
        markup.push(
          <Grid item={true} key={key} xs={6}>
            {this.renderListItems(heading, text)}
          </Grid>
        );
      }
      return markup;
    }, []);

    if (items.length < 1) {
      return null;
    }

    return <Grid container={true}>{items}</Grid>;
  };

  renderListItems = (heading, text) => {
    return (
      <List subheader={<Heading variant={'subheading'}>{text.split('-').join(' ')}</Heading>}>
        <EngineListItem>
          {ICONS[text]}
          <ListItemText primary={heading} />
        </EngineListItem>
      </List>
    );
  };
}

export default Engine;
