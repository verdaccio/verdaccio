import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import Loading from './Loading';

describe('<Loading /> component', () => {
  test('should render the component in default state', () => {
    render(<Loading />);
    screen.debug();
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });
});
