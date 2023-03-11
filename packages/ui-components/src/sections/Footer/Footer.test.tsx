import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import Footer from './Footer';

describe('<Footer /> component', () => {
  beforeAll(() => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS.version = 'v1.0.0';
  });

  afterAll(() => {
    delete window.__VERDACCIO_BASENAME_UI_OPTIONS.version;
  });

  test('should load the initial state of Footer component', () => {
    render(<Footer />);
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('version-footer')).toBeInTheDocument();
  });
});
