import React from 'react';

import { render, cleanup } from 'verdaccio-ui/utils/test-react-testing-library';

import Readme from './Readme';

describe('<Readme /> component', () => {
  beforeEach(cleanup);

  test('should load the component in default state', () => {
    const wrapper = render(<Readme description="test" />);
    expect(wrapper).toMatchSnapshot();
  });

  test('should dangerously set html', () => {
    const wrapper = render(<Readme description="<h1>This is a test string</h1>" />);
    expect(wrapper.getByText('This is a test string')).toBeInTheDocument();
  });
});
