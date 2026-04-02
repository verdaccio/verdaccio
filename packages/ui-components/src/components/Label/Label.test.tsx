import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import Label from './Label';

describe('<Label /> component', () => {
  const props = {
    text: 'test',
  };
  test('should render the component in default state', () => {
    render(<Label text={props.text} />);
    expect(screen.getByText('test')).toBeTruthy();
  });
});
