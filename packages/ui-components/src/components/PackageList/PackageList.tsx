import Divider from '@mui/material/Divider';
import React, { useState } from 'react';
import { AutoSizer } from 'react-virtualized/dist/commonjs/AutoSizer';
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized/dist/commonjs/CellMeasurer';
import type { ListRowProps } from 'react-virtualized/dist/commonjs/List';
import { List } from 'react-virtualized/dist/commonjs/List';
import { WindowScroller } from 'react-virtualized/dist/commonjs/WindowScroller';

import { DownloadProvider, Help, Package, useConfig } from '../..';
import type { ManifestWeb } from '../../providers/ManifestsProvider/ManifestsProvider';
import { utils } from '../../utils';

interface Props {
  packages: ManifestWeb[];
  /** Called when the rendered rows reach the end of the list. */
  onEndReached?: () => void;
}

const END_REACHED_THRESHOLD = 5;

const PackageList: React.FC<Props> = ({ packages, onEndReached }) => {
  const { configOptions } = useConfig();
  // heights are cached by row index: callers remount the list (key) when its rows change
  const [cache] = useState(() => new CellMeasurerCache({ fixedWidth: true, defaultHeight: 100 }));
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
      origin,
    } = packages[index];
    // TODO: move format license to API side.
    const formattedLicense = utils.formatLicense(license);
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
            origin={origin}
            showDownload={configOptions.showDownloadTarball}
            time={time}
            version={version}
          />
        </div>
      </CellMeasurer>
    );
  };

  const hasPackages = packages?.length > 0;

  if (!hasPackages) {
    return <Help />;
  }

  return (
    <DownloadProvider>
      <WindowScroller>
        {({ height, isScrolling, scrollTop, onChildScroll }) => (
          <AutoSizer disableHeight={true}>
            {({ width }) => {
              return (
                <List
                  autoHeight={true}
                  deferredMeasurementCache={cache}
                  height={height}
                  isScrolling={isScrolling}
                  onRowsRendered={({ stopIndex }) => {
                    if (stopIndex >= packages.length - END_REACHED_THRESHOLD) {
                      onEndReached?.();
                    }
                  }}
                  onScroll={onChildScroll}
                  overscanRowCount={3}
                  rowCount={packages?.length}
                  rowHeight={cache.rowHeight}
                  rowRenderer={renderRow}
                  scrollTop={scrollTop}
                  width={width}
                />
              );
            }}
          </AutoSizer>
        )}
      </WindowScroller>
    </DownloadProvider>
  );
};

export default PackageList;
