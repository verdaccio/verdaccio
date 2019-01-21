/**
 * @prettier
 */

import { DetailContextConsumer } from '../../pages/version/index';
import { formatDateDistance } from '../../utils/package';
import { Heading, Spacer, ListItemText } from './styles';
import List from '@material-ui/core/List/index';
import ListItem from '@material-ui/core/ListItem/index';
import React from 'react';

class UpLinks extends React.PureComponent<any> {
  render() {
    return (
      // $FlowFixMe
      <DetailContextConsumer>
        {({ packageMeta }) => {
          return this.renderContent(packageMeta._uplinks);
        }}
      </DetailContextConsumer>
    );
  }

  renderUpLinksList = uplinks => (
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

  renderContent(uplinks) {
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
