import React from 'react';

import { render } from '../../test/test-react-testing-library';
import Logo from './Logo';

describe('<Logo /> component', () => {
  test('should render the component in default state', () => {
    const { container } = render(<Logo />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
