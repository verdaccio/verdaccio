import React from 'react';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import Footer from './Footer';

describe('<Footer /> component', () => {
  beforeAll(() => {
    window.VERDACCIO_VERSION = 'v.1.0.0';
  });

  afterAll(() => {
    // @ts-ignore
    delete window.VERDACCIO_VERSION;
  });

  test('should load the initial state of Footer component', () => {
    render(<Footer />);
    // FIXME: this match does not work
    // expect(screen.getByText('Powered by')).toBeInTheDocument();
  });
});
