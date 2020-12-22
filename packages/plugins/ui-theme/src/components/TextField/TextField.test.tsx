import React from 'react';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import TextField from './TextField';

describe('<TextField /> component', () => {
  const props = {
    name: 'test',
    value: 'test',
  };
  test('should load the component in default state', () => {
    const { container } = render(<TextField name={props.name} value={props.value} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
