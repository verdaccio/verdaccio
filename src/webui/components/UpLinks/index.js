/**
 * @prettier
 */
import React from 'react';
import List from '@material-ui/core/List/index';
import ListItem from '@material-ui/core/ListItem/index';

import { DetailContextConsumer } from '../../pages/version/index';
import NoItems from '../NoItems';
import { formatDateDistance } from '../../utils/package';

import { Heading, Spacer, ListItemText } from './styles';

class UpLinks extends React.PureComponent<any> {
  render() {
    return (
      // $FlowFixMe
      <DetailContextConsumer>
        {({ packageMeta }) => {
          return this.renderContent(packageMeta._uplinks, packageMeta.latest);
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

  renderContent(uplinks, { name }) {
    if (Object.keys(uplinks).length > 0) {
      return (
        uplinks && (
          <>
            <Heading variant={'subheading'}>{'Uplinks'}</Heading>
            {this.renderUpLinksList(uplinks)}
          </>
        )
      );
    }
    return <NoItems text={`${name} has no uplinks.`} />;
  }
}

export default UpLinks;
