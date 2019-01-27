import React, {Component} from 'react';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import NotesIcon from '@material-ui/icons/Notes';

import { DetailContextConsumer } from '../../pages/version/index';

import { Heading } from './styles';

class License extends Component {
  render() {
    return (
      <DetailContextConsumer>
        {(context) => {
          return this.renderLicense(context);
        }}
      </DetailContextConsumer>
    );
  };

  renderLicense = ({packageMeta}) => {
    const { license } = packageMeta.latest;
    if (!license) {
      return null;
    }

    return (
      <List subheader={<Heading variant={"subheading"}>{'License'}</Heading>}>
        {this.renderListItems(license)}
      </List>
    );
  }

  renderListItems = (license) => {
    return (
      <ListItem>
        <Avatar>
          <NotesIcon />
        </Avatar>
        <ListItemText primary={license} />
      </ListItem>
    );
  }
}


export default License;
