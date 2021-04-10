import React from 'react';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import NoItems from './NoItems';

describe('<NoItem /> component', () => {
  const props = {
    text: 'test',
  };

  test('should load the component in default state', () => {
    const { container } = render(<NoItems text={props.text} />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
