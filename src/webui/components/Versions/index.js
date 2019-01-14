/**
 * @prettier
 * @flow
 */

import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import { DetailContextConsumer } from '../../pages/version/index';

class Versions extends React.PureComponent {
  render() {
    return (
      <DetailContextConsumer>
        {({ packageMeta }) => {
          const { versions } = packageMeta;
          if (versions) {
            return this.renderVersions(versions);
          }
        }}
      </DetailContextConsumer>
    );
  }

  // $FlowFixMe
  renderVersions(versions) {
    return (
      <List>
        {Object.keys(versions).map(version => (
          <ListItem key={version}>{versions[version].name}</ListItem>
        ))}
      </List>
    );
  }
}

export default Versions;
