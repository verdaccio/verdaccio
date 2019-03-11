/**
 * @prettier
 * @flow
 */

import { DetailContextConsumer } from '../../pages/version/index';
import { formatDateDistance } from '../../utils/package';
import { Heading, Spacer, ListItemText } from './styles';
import List from '@material-ui/core/List/index';
import ListItem from '@material-ui/core/ListItem/index';
import React from 'react';
import { DIST_TAGS } from '../../../lib/constants';

class Versions extends React.PureComponent<any> {
  render() {
    return (
      // $FlowFixMe
      <DetailContextConsumer>
        {({ packageMeta }) => {
          return this.renderContent(packageMeta);
        }}
      </DetailContextConsumer>
    );
  }

  renderPackageList = (packages: any, isVersion: boolean = false, timeMap: Object = {}) => {
    return (
      <List>
        {Object.keys(packages)
          .reverse()
          .map(version => (
            <ListItem key={version}>
              <ListItemText>{version}</ListItemText>
              <Spacer />
              <ListItemText>{isVersion && timeMap[version] ? `${formatDateDistance(timeMap[version])} ago` : packages[version]}</ListItemText>
            </ListItem>
          ))}
      </List>
    );
  };

  // $FlowFixMe
  renderContent(packageMeta) {
    const { versions = {}, time: timeMap = {}, [DIST_TAGS]: distTags = {} } = packageMeta;

    return (
      <>
        {distTags && (
          <>
            <Heading variant={'subheading'}>{'Current Tags'}</Heading>
            {this.renderPackageList(distTags, false, timeMap)}
          </>
        )}
        {versions && (
          <>
            <Heading variant={'subheading'}>{'Version History'}</Heading>
            {this.renderPackageList(versions, true, timeMap)}
          </>
        )}
      </>
    );
  }
}

export default Versions;
