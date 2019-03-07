/**
 * @prettier
 */

import React, { Component } from 'react';

import List from '@material-ui/core/List/index';

import { DetailContextConsumer } from '../../pages/version/index';
import { Heading, DistListItem, DistChips } from './styles';
import fileSizeSI from '../../utils/file-size';

class Dist extends Component<any, any> {
  render() {
    return (
      <DetailContextConsumer>
        {context => {
          return this.renderDist(context);
        }}
      </DetailContextConsumer>
    );
  }

  renderChips(dist, license) {
    const distDict = {
      'file-count': dist.fileCount,
      size: dist.unpackedSize && fileSizeSI(dist.unpackedSize),
      license,
    };

    const chipsList = Object.keys(distDict).reduce((componentList, title, key) => {
      const value = distDict[title];
      if (value) {
        const label = (
          <span>
            {/* eslint-disable-next-line */}
            <b>{title.split('-').join(' ')}</b>:{value}
          </span>
        );
        componentList.push(<DistChips key={key} label={label} />);
      }
      return componentList;
    }, []);

    return chipsList;
  }

  renderDist = ({ packageMeta }) => {
    const { dist = {}, license } = packageMeta.latest;

    return (
      <List subheader={<Heading variant={'subheading'}>{'Latest Distribution'}</Heading>}>
        <DistListItem>{this.renderChips(dist, license)}</DistListItem>
      </List>
    );
  };
}

export default Dist;
