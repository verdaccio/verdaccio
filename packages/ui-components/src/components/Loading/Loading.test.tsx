import React from 'react';

import { act, render, screen, waitFor } from '../../test/test-react-testing-library';
import Loading from './Loading';

describe('<Loading /> component', () => {
  test('should render the component in default state', async () => {
    act(() => {
      render(<Loading />);
    });
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });
  });
});
