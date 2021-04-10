import React from 'react';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import { List, ListRowProps } from 'react-virtualized/dist/commonjs/List';
import { WindowScroller } from 'react-virtualized/dist/commonjs/WindowScroller';

import Divider from 'verdaccio-ui/components/Divider';
import { formatLicense } from 'verdaccio-ui/utils/package';

import Help from './Help';
import Package, { PackageInterface } from './Package';

interface Props {
  packages: PackageInterface[];
}

const cache = new CellMeasurerCache({
  fixedWidth: true,
  defaultHeight: 100,
});

/* eslint-disable  verdaccio/jsx-no-style */
const PackageList: React.FC<Props> = ({ packages }) => {
  const renderRow = ({ index, key, parent, style }: ListRowProps) => {
    const {
      name,
      version,
      description,
      time,
      keywords,
      dist,
      homepage,
      bugs,
      author,
      license,
    } = packages[index];
    // TODO: move format license to API side.
    const formattedLicense = formatLicense(license);

    return (
      <CellMeasurer cache={cache} columnIndex={0} key={key} parent={parent} rowIndex={index}>
        <div style={style}>
          {index !== 0 && <Divider />}
          <Package
            author={author}
            bugs={bugs}
            description={description}
            dist={dist}
            homepage={homepage}
            keywords={keywords}
            license={formattedLicense}
            name={name}
            time={time}
            version={version}
          />
        </div>
      </CellMeasurer>
    );
  };

  if (packages.length === 0) {
    return <Help />;
  }

  return (
    <WindowScroller>
      {({ height, isScrolling, scrollTop, onChildScroll }) => (
        <AutoSizer disableHeight={true}>
          {({ width }) => (
            <List
              autoHeight={true}
              deferredMeasurementCache={cache}
              height={height}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              overscanRowCount={3}
              rowCount={packages.length}
              rowHeight={cache.rowHeight}
              rowRenderer={renderRow}
              scrollTop={scrollTop}
              width={width}
            />
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
};

export { PackageList };
