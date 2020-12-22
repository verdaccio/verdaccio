import _ from 'lodash';
import React from 'react';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContext } from '../context';
import { DetailContextProps } from '../version-config';

import DetailSidebarFundButton from './DetailSidebarFundButton';

const ComponentToBeRendered: React.FC<{ contextValue: DetailContextProps }> = ({
  contextValue,
}) => (
  <DetailContext.Provider value={contextValue}>
    <DetailSidebarFundButton />
  </DetailContext.Provider>
);

const detailContextValue: DetailContextProps = {
  packageName: 'foo',
  readMe: 'test',
  enableLoading: () => {},
  isLoading: false,
  hasNotBeenFound: false,
  packageMeta: {
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
  },
};

describe('test DetailSidebarFundButton', () => {
  test('should not display the button if fund is missing', () => {
    const wrapper = render(<ComponentToBeRendered contextValue={detailContextValue} />);

    expect(wrapper.queryByText('Fund')).toBeNull();
  });

  test('should not display the button if url is missing', () => {
    const value = _.merge(detailContextValue, {
      packageMeta: {
        latest: {
          funding: {},
        },
      },
    });

    const wrapper = render(<ComponentToBeRendered contextValue={value} />);

    expect(wrapper.queryByText('Fund')).toBeNull();
  });

  test('should not display the button if url is not a string', () => {
    const value = _.merge(detailContextValue, {
      packageMeta: {
        latest: {
          funding: {
            url: null,
          },
        },
      },
    });

    const wrapper = render(<ComponentToBeRendered contextValue={value} />);

    expect(wrapper.queryByText('Fund')).toBeNull();
  });

  test('should not display the button if url is not an url', () => {
    const value = _.merge(detailContextValue, {
      packageMeta: {
        latest: {
          funding: {
            url: 'somethign different as url',
          },
        },
      },
    });

    const wrapper = render(<ComponentToBeRendered contextValue={value} />);

    expect(wrapper.queryByText('Fund')).toBeNull();
  });

  test('should display the button if url is a valid url', () => {
    const value = _.merge(detailContextValue, {
      packageMeta: {
        latest: {
          funding: {
            url: 'https://opencollective.com/verdaccio',
          },
        },
      },
    });

    const wrapper = render(<ComponentToBeRendered contextValue={value} />);

    expect(wrapper.getByText('Fund')).toBeTruthy();
  });
});
