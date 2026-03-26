import React from 'react';

import { render, screen } from '../../../test/test-react-testing-library';
import Spinner from './Spinner';

describe('<Spinner /> component', () => {
  test('should render the component in default state', () => {
    render(<Spinner />);
    expect(screen.getByRole('progressbar')).toBeTruthy();
  });
});
