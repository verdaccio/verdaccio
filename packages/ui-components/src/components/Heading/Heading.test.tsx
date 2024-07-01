import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import Heading from './Heading';

describe('Heading component', () => {
  test('should render correctly with default props', () => {
    render(<Heading>{'Test'}</Heading>);
    const headingElement = screen.getByText('Test');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H6');
  });

  test('should render correctly with custom props', () => {
    render(<Heading variant="h1">{'Test'}</Heading>);
    const headingElement = screen.getByText('Test');
    expect(headingElement).toBeInTheDocument();
    expect(headingElement.tagName).toBe('H1');
  });
});
