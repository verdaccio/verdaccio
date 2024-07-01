import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import Logo from './Logo';

describe('<Logo /> component', () => {
  test('should render the component in default state', () => {
    const { container } = render(<Logo />);
    expect(container.firstChild).toMatchSnapshot();
    expect(screen.getByTestId('default-logo')).toBeTruthy();
  });

  test('should render custom logo', () => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.logo = 'custom.png';
    render(<Logo />);
    expect(screen.getByTestId('custom-logo')).toBeTruthy();
  });
});
