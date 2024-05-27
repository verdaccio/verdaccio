import React from 'react';

import { render, screen } from '../../test/test-react-testing-library';
import DetailContainer from './Detail';

describe('DetailContainer', () => {
  test('renders correctly', () => {
    const { container } = render(<DetailContainer />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders without uplinks', () => {
    render(<DetailContainer showUpLinks={false} />);
    expect(screen.queryByTestId('uplinks-tab')).toBeFalsy();
  });

  test.todo('should test click on tabs');
});
