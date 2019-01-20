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

class Versions extends React.PureComponent {
  render() {
    return <DetailContextConsumer>{({ packageMeta }) => this.renderContent(packageMeta['dist-tags'], packageMeta.versions)}</DetailContextConsumer>;
  }

  renderPackageList = (packages: object, isVersion: boolean = false) => (
    <List>
      {Object.keys(packages)
        .reverse()
        .map(version => (
          <ListItem key={version}>
            <ListItemText>{version}</ListItemText>
            <Spacer />
            <ListItemText>{isVersion ? `${formatDateDistance('2017-10-26T09:03:15.044Z')} ago` : packages[version]}</ListItemText>
          </ListItem>
        ))}
    </List>
  );

  // $FlowFixMe
  renderContent(distTags: object, versions: object) {
    return (
      <>
        {distTags && (
          <>
            <Heading variant={'subheading'}>{'Current Tags'}</Heading>
            {this.renderPackageList(distTags)}
          </>
        )}
        {versions && (
          <>
            <Heading variant={'subheading'}>{'Version History'}</Heading>
            {this.renderPackageList(versions, true)}
          </>
        )}
      </>
    );
  }
}

export default Versions;
