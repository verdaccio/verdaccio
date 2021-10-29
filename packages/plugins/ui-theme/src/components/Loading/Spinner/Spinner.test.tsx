import React from 'react';
import { cleanup, render } from 'verdaccio-ui/utils/test-react-testing-library';

import Spinner from './Spinner';

describe('<Spinner /> component', () => {
  beforeEach(cleanup);

  test('should render the component in default state', () => {
    const wrapper = render(<Spinner />);
    expect(wrapper).toMatchSnapshot();
  });
});
