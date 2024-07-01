import React from 'react';

import { cleanup, render } from '../../test/test-react-testing-library';
import UpLinks from './UpLinks';

describe('<UpLinks /> component', () => {
  beforeEach(cleanup);

  test('should render the component when there is no uplink', () => {
    const packageMeta = {
      latest: {
        name: 'verdaccio',
        version: '4.0.0',
        dist: { fileCount: 0, unpackedSize: 0 },
      },
      _uplinks: {},
    };

    const wrapper = render(<UpLinks packageMeta={packageMeta} />);
    expect(wrapper).toMatchSnapshot();
  });

  test('should render the component with uplinks', () => {
    const packageMeta = {
      latest: {
        name: 'verdaccio',
        version: '4.0.0',
        author: {
          name: 'verdaccio user',
          url: '',
          avatar: 'https://www.gravatar.com/avatar/000000',
        },
        dist: { fileCount: 0, unpackedSize: 0 },
      },
      _uplinks: {
        npmjs: {
          etag: '"W/"252f0a131cedd3ea82dfefd6fa049558""',
          fetched: 1529779934081,
        },
      },
    };

    const wrapper = render(<UpLinks packageMeta={packageMeta} />);

    expect(wrapper).toMatchSnapshot();
  });

  test('should not render if input is missing', () => {
    const wrapper = render(<UpLinks packageMeta={undefined} />);
    // expect nothing to be rendered
    expect(wrapper.queryByTestId('no-uplinks-npm')).toBeNull();
    expect(wrapper.queryByTestId('uplinks')).toBeNull();
  });
});
