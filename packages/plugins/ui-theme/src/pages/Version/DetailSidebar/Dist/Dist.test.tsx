import React from 'react';

import { render, cleanup } from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContext } from '../../context';

import Dist from './Dist';

const withDistComponent = (
  packageMeta: React.ContextType<typeof DetailContext>['packageMeta']
): JSX.Element => (
  <DetailContext.Provider value={{ packageMeta }}>
    <Dist />
  </DetailContext.Provider>
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
