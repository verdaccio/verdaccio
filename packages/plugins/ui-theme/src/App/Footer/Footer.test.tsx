import React from 'react';

import { render, screen } from 'verdaccio-ui/utils/test-react-testing-library';

import Footer from './Footer';

describe('<Footer /> component', () => {
  beforeAll(() => {
    window.VERDACCIO_VERSION = 'v.1.0.0';
  });

  afterAll(() => {
    delete window.VERDACCIO_VERSION;
  });

  test('should load the initial state of Footer component', () => {
    render(<Footer />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });
});
