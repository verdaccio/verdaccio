import React, {Component} from 'react';

import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import BookIcon from '@material-ui/icons/Book';

import { DetailContextConsumer } from '../../pages/version/index';

import { Heading, LicenseListItem, LicenseAvatar } from './styles';

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
      <LicenseListItem>
        <LicenseAvatar>
          <BookIcon />
        </LicenseAvatar>
        <ListItemText primary={license} />
      </LicenseListItem>
    );
  }
}


export default License;
