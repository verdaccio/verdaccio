import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import NoItems from './NoItems';

describe('<NoItem /> component', () => {
  const props = {
    text: 'test',
  };

  test('should load the component in default state', () => {
    render(<NoItems text={props.text} />);
    expect(screen.getByText('test')).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
  });
});
