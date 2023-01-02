import React from 'react';

import { render } from '../../test/test-react-testing-library';
import Label from './Label';

describe('<Label /> component', () => {
  const props = {
    text: 'test',
  };
  test('should render the component in default state', () => {
    const { container } = render(<Label text={props.text} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
