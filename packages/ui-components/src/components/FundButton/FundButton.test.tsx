import _ from 'lodash';
import React from 'react';

import { render } from '../../test/test-react-testing-library';
import FundButton from './FundButton';

const pkgMeta = {
  _uplinks: {},
  latest: {
    name: 'verdaccio-ui/local-storage',
    version: '8.0.1-next.1',
    dist: {
      fileCount: 0,
      unpackedSize: 0,
      tarball: 'http://localhost:8080/bootstrap/-/bootstrap-4.3.1.tgz',
    },
    homepage: 'https://verdaccio.org',
    bugs: {
      url: 'https://github.com/verdaccio/monorepo/issues',
    },
  },
};

describe('test FundButton', () => {
  test('should not display the button if fund is missing', () => {
    const wrapper = render(<FundButton packageMeta={pkgMeta} />);

    expect(wrapper.queryByText('button.fund-this-package')).toBeNull();
  });

  test('should not display the button if url is missing', () => {
    const value = _.merge(pkgMeta, {
      latest: {
        funding: {},
      },
    });

    const wrapper = render(<FundButton packageMeta={value} />);

    expect(wrapper.queryByText('button.fund-this-package')).toBeNull();
  });

  test('should not display the button if url is not a string', () => {
    const value = _.merge(pkgMeta, {
      latest: {
        funding: {
          url: null,
        },
      },
    });

    const wrapper = render(<FundButton packageMeta={value} />);

    expect(wrapper.queryByText('button.fund-this-package')).toBeNull();
  });

  test('should not display the button if url is not an url', () => {
    const value = _.merge(pkgMeta, {
      latest: {
        funding: {
          url: 'something different as url',
        },
      },
    });

    const wrapper = render(<FundButton packageMeta={value} />);

    expect(wrapper.queryByText('button.fund-this-package')).toBeNull();
  });

  test('should display the button if url is a valid url', () => {
    const value = _.merge(pkgMeta, {
      latest: {
        funding: {
          url: 'https://opencollective.com/verdaccio',
        },
      },
    });

    const wrapper = render(<FundButton packageMeta={value} />);

    expect(wrapper.getByText('button.fund-this-package')).toBeTruthy();
  });
});
