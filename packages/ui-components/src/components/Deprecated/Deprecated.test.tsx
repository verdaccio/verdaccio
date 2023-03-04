import React from 'react';

import { cleanup, render, screen } from '../../test/test-react-testing-library';
import Deprecated from './Deprecated';

describe('test Deprecated', () => {
  afterEach(() => {
    cleanup();
  });

  const packageMeta = {
    latest: {
      packageName: 'foo',
      version: '1.0.0',
      deprecated: 'this is deprecated',
      maintainers: [],
      contributors: [],
    },
  };

  test('should render the deprecated message', () => {
    render(<Deprecated message={packageMeta.latest.deprecated} />);

    expect(screen.getByText('this is deprecated')).toBeInTheDocument();
  });
});
