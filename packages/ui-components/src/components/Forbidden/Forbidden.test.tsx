import React from 'react';

import { fireEvent, renderWithRouter, screen } from '../../test/test-react-testing-library';
import Forbidden from './Forbidden';

describe('<Forbidden /> component', () => {
  test('should load the component in default state', () => {
    renderWithRouter(<Forbidden />, '/', ['/']);
    expect(screen.getByTestId('LockIcon')).toBeInTheDocument();
    expect(screen.getByText('error.401.sorry-no-access')).toBeInTheDocument();
    expect(screen.getByText('button.go-to-the-home-page')).toBeInTheDocument();
  });

  test('go to Home Page button click', async () => {
    renderWithRouter(<Forbidden />, '/', ['/']);

    const node = screen.getByTestId('not-found-go-to-home-button');
    fireEvent.click(node);
  });
});
