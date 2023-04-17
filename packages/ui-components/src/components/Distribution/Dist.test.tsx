import React from 'react';

import { cleanup, render } from '../../test/test-react-testing-library';
import { PackageMetaInterface } from '../../types/packageMeta';
import Dist from './Dist';

const withDistComponent = (packageMeta: PackageMetaInterface): JSX.Element => (
  <Dist packageMeta={packageMeta} />
);

describe('<Dist /> component', () => {
  afterEach(function () {
    cleanup();
  });

  test('should render the component in default state', () => {
    const { getByText } = render(
      withDistComponent({
        latest: {
          name: 'verdaccio1',
          version: '4.0.0',
          dist: {
            fileCount: 7,
            unpackedSize: 10,
          },
          license: '',
        },
        _uplinks: {},
      })
    );
    expect(getByText('sidebar.distribution.title')).toBeInTheDocument();
    expect(getByText('sidebar.distribution.file-count')).toBeInTheDocument();
    expect(getByText('sidebar.distribution.size')).toBeInTheDocument();
    expect(getByText('sidebar.distribution.size')).toBeInTheDocument();
    expect(getByText('7', { exact: false })).toBeInTheDocument();
    expect(getByText('10.00 Bytes', { exact: false })).toBeInTheDocument();
  });

  test('should render the component with license as string', () => {
    const { getByText } = render(
      withDistComponent({
        latest: {
          name: 'verdaccio2',
          version: '4.0.0',
          dist: {
            fileCount: 7,
            unpackedSize: 10,
          },
          license: 'MIT',
        },
        _uplinks: {},
      })
    );
    expect(getByText('MIT', { exact: false })).toBeInTheDocument();
  });

  test('should render the component with license as object', () => {
    const { getByText } = render(
      withDistComponent({
        latest: {
          name: 'verdaccio3',
          version: '4.0.0',
          dist: {
            fileCount: 7,
            unpackedSize: 10,
          },
          license: {
            type: 'MIT',
            url: 'https://www.opensource.org/licenses/mit-license.php',
          },
        },
        _uplinks: {},
      })
    );
    expect(getByText('MIT', { exact: false })).toBeInTheDocument();
  });

  test('should not render if latest is missing', () => {
    const { queryAllByText } = render(
      withDistComponent({
        latest: undefined,
        _uplinks: {},
      })
    );
    expect(queryAllByText('sidebar.distribution.title')).toHaveLength(0);
  });

  test('should not render if latest content is missing', () => {
    const { queryAllByText } = render(
      withDistComponent({
        latest: { dist: undefined, license: undefined },
        _uplinks: {},
      })
    );
    expect(queryAllByText('sidebar.distribution.title')).toHaveLength(0);
  });
});
