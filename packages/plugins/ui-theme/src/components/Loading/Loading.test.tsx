import React from 'react';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import Loading from './Loading';

describe('<Loading /> component', () => {
  test('should render the component in default state', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
