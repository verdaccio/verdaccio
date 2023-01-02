import React from 'react';

import { render } from '../../test/test-react-testing-library';
import DetailContainer from './Detail';

describe('DetailContainer', () => {
  test('renders correctly', () => {
    const { container } = render(<DetailContainer />);
    expect(container.firstChild).toMatchSnapshot();
  });
  test.todo('should test click on tabs');
});
