/**
 * @prettier
 * @flow
 */

import { DetailContextConsumer } from '../../pages/version/index';
import { Heading, ListItem, CardContent } from './styles';
import List from '@material-ui/core/List';
import Chip from '@material-ui/core/Chip';
import Card from '@material-ui/core/Card';

import React from 'react';

class UpLinks extends React.PureComponent {
  render() {
    return <DetailContextConsumer>{({ packageMeta }) => this.renderContent(packageMeta._uplinks)}</DetailContextConsumer>;
  }

  renderList = (uplinks: object) => (
    <List>
      {Object.keys(uplinks)
        .reverse()
        .map(name => (
          <ListItem key={name}>
            <Chip label={name} />
          </ListItem>
        ))}
    </List>
  );

  // $FlowFixMe
  renderContent = uplinks =>
    uplinks && (
      <Card>
        <CardContent>
          <Heading variant={'subheading'}>{'UpLinks'}</Heading>
          {this.renderList(uplinks)}
        </CardContent>
      </Card>
    );
}

export default UpLinks;
