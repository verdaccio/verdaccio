/* eslint-disable */
import React, {Component} from 'react';

import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Toys from '@material-ui/icons/Toys';
import SettingsIcon from '@material-ui/icons/Settings';

import { DetailContextConsumer } from '../../pages/version/index';

import { Heading } from './styles';

const ICONS = {
  node: <SettingsIcon />,
  NPM: <Toys />,
}

class Engine extends Component {
  render() {
    return (
      <DetailContextConsumer>
        {(context) => {
          return this.renderEngine(context);
        }}
      </DetailContextConsumer>
    );
  };

  renderEngine = ({packageMeta}) => {
    const { engines } = packageMeta.latest;
    if (!engines) {
      return null;
    }

    const engineDict = {
      node: engines.node,
      NPM: engines.npm
    }

    const items = Object.keys(engineDict).reduce((markup, text, key) => {
      const heading = engineDict[text]
      if (heading){
        markup.push(
          <Grid item={true} xs={6} key={key}>
            {this.renderListItems(heading, text)}
          </Grid>
        );
      }
      return markup;
    }, []);

    if (items.length < 1) {
      return null;
    }

    return (
      <Grid container={true}>
        {items}
      </Grid>
    );
  }

  renderListItems = (text, value) => {
    return (
      <List subheader={<Heading variant={"subheading"}>{value}</Heading>}>
        <ListItem>
          <Avatar>
            { ICONS[value] }
          </Avatar>
          <ListItemText primary={text} />
        </ListItem>
      </List>
    );
  }
}


export default Engine;
