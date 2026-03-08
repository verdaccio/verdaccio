import React from 'react';

import { RouterPath, renderWithRouter, screen } from '../../test/test-react-testing-library';
import Link from './Link';

describe('<Link /> component', () => {
  test('should render the component with correct text and href', () => {
    renderWithRouter(<Link to="/home">{'Home Page'}</Link>, RouterPath.ROOT, ['/']);

    const linkElement = screen.getByRole('link', { name: /home page/i });

    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', '/home');
  });

  test('should support being disabled or having custom classes (if applicable)', () => {
    renderWithRouter(
      <Link className="custom-class" to="/test">
        {'Test Link'}
      </Link>,
      RouterPath.ROOT,
      ['/']
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveClass('custom-class');
  });

  test('should render correctly with nested elements', () => {
    renderWithRouter(
      <Link to="/profile">
        <span>{'View Profile'}</span>
      </Link>,
      RouterPath.ROOT,
      ['/']
    );

    expect(screen.getByRole('link', { name: /view profile/i })).toBeInTheDocument();
  });
});
