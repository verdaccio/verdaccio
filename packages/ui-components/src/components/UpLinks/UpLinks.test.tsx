import MockDate from 'mockdate';
import React from 'react';

import { cleanup, renderWith, screen } from '../../test/test-react-testing-library';
import UpLinks from './UpLinks';

describe('<UpLinks /> component', () => {
  beforeAll(() => {
    MockDate.set(new Date('2023-01-01T00:00:00Z'));
  });
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

    renderWith(<UpLinks packageMeta={packageMeta} />);
    expect(screen.getByTestId('no-uplinks')).toBeInTheDocument();
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

    renderWith(<UpLinks packageMeta={packageMeta} />);

    expect(screen.getByTestId('uplinks')).toBeInTheDocument();
    expect(screen.getByText('uplinks.title')).toBeInTheDocument();
    const link = screen.getByText('npmjs');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.npmjs.com/package/verdaccio');
    expect(screen.getByText('5 years ago')).toBeInTheDocument();
  });

  test('should not render if input is missing', () => {
    const wrapper = renderWith(<UpLinks packageMeta={undefined} />);
    // expect nothing to be rendered
    expect(wrapper.queryByTestId('no-uplinks-npm')).toBeNull();
    expect(wrapper.queryByTestId('uplinks')).toBeNull();
  });
});
