import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { render } from '../../test/test-react-testing-library';
import Link from './Link';

describe('<Link /> component', () => {
  test('should render the component in default state', () => {
    const { container } = render(
      <Router>
        <Link to={'/'} />
      </Router>
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  test('should render the component with link', () => {
    const { container } = render(
      <Router>
        <Link to={'/'}>{'Home'}</Link>
      </Router>
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
