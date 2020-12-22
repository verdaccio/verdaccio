import React from 'react';

import { render } from 'verdaccio-ui/utils/test-react-testing-library';

import DetailContainer from './DetailContainer';

describe('DetailContainer', () => {
  test('renders correctly', () => {
    const { container } = render(<DetailContainer />);
    expect(container.firstChild).toMatchSnapshot();
  });
  test.todo('should test click on tabs');
});
