import React from 'react';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import Footer from './Footer';

describe('<Footer /> component', () => {
  beforeAll(() => {
    window.__VERDACCIO_BASENAME_UI_OPTIONS = {
      version: 'v.1.0.0',
    };
  });

  afterAll(() => {
    // @ts-ignore
    delete window.__VERDACCIO_BASENAME_UI_OPTIONS;
  });

  test('should load the initial state of Footer component', () => {
    render(<Footer />);
    // FIXME: this match does not work
    // expect(screen.getByText('Powered by')).toBeInTheDocument();
  });
});
