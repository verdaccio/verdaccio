import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import LinkExternal from './LinkExternal';

describe('<LinkExternal /> component', () => {
  test('should render the component in default state', () => {
    render(<LinkExternal to={'/'} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('should render the component with external link', () => {
    render(<LinkExternal to={'https://example.com'}>{'Example'}</LinkExternal>);
    const link = screen.getByRole('link', { name: 'Example' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });
});
