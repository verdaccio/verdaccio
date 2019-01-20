/**
 * @prettier
 * @flow
 */

import { DetailContextConsumer } from '../../pages/version/index';
import { formatDateDistance } from '../../utils/package';
import { Heading, Spacer, ListItemText } from './styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import React from 'react';

class UpLinks extends React.PureComponent {
  render() {
    return <DetailContextConsumer>{({ packageMeta }) => this.renderContent(packageMeta._uplinks)}</DetailContextConsumer>;
  }

  renderUpLinksList = (uplinks: object) => (
    <List>
      {Object.keys(uplinks)
        .reverse()
        .map(name => (
          <ListItem key={name}>
            <ListItemText>{name}</ListItemText>
            <Spacer />
            <ListItemText>{`${formatDateDistance(uplinks[name].fetched)} ago`}</ListItemText>
          </ListItem>
        ))}
    </List>
  );

  // $FlowFixMe
  renderContent(uplinks: object) {
    return (
      uplinks && (
        <>
          <Heading variant={'subheading'}>{'Uplinks'}</Heading>
          {this.renderUpLinksList(uplinks)}
        </>
      )
    );
  }
}

export default UpLinks;
