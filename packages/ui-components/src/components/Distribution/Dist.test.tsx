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
    const wrapper = render(
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
    expect(wrapper).toMatchSnapshot();
  });

  test('should render the component with license as string', () => {
    const wrapper = render(
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
    expect(wrapper).toMatchSnapshot();
  });

  test('should render the component with license as object', () => {
    const wrapper = render(
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
    expect(wrapper).toMatchSnapshot();
  });
});
