import React from 'react';

import { render, cleanup, screen } from 'verdaccio-ui/utils/test-react-testing-library';

import { DetailContextProvider } from '../../context';

import Deprecated from './Deprecated';

describe('test Deprecated', () => {
  afterEach(() => {
    cleanup();
  });

  const packageMeta = {
    latest: {
      packageName: 'foo',
      version: '1.0.0',
      deprecated: 'duuuude, this is deprecated',
      maintainers: [],
      contributors: [],
    },
  };

  test('should render the deprecated message', () => {
    render(
      // @ts-ignore
      <DetailContextProvider value={{ packageMeta }}>
        <Deprecated message={packageMeta.latest.deprecated} />
      </DetailContextProvider>
    );

    expect(screen.getByText('duuuude, this is deprecated')).toBeInTheDocument();
  });
});
