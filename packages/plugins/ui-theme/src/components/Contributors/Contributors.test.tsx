import React from 'react';

import { renderWith, screen } from '../../utils/test-react-testing-library';
import Contributors from './Contributors';

describe('<Contributors />', () => {
  test('should render the contributors component', () => {
    renderWith(<Contributors />);
    expect(screen.getByRole('link')).toHaveAttribute('href', 'https://verdaccio.org/contributors');
  });
});
