import React from 'react';

import { renderWith, screen } from '../../utils/test-react-testing-library';
import Support from './Support';

describe('<Support />', () => {
  test('should render the support component', () => {
    renderWith(<Support />);
    expect(screen.getByText('Support people affected by the war in Ukraine')).toBeInTheDocument();
  });
});
