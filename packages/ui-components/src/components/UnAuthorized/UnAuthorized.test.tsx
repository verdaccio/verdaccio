import React from 'react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

import { fireEvent, render, screen } from '../../test/test-react-testing-library';
import Forbidden from './Forbidden';

const mockHistory = vi.fn();

vi.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistory,
  }),
}));

describe('<Forbidden /> component', () => {
  test('should load the component in default state', () => {
    render(
      <MemoryRouter>
        <Forbidden />
      </MemoryRouter>
    );
    expect(screen.getByTestId('LockIcon')).toBeInTheDocument();
    expect(screen.getByText('error.401.sorry-no-access')).toBeInTheDocument();
    expect(screen.getByText('button.go-to-the-home-page')).toBeInTheDocument();
  });

  test('go to Home Page button click', async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <Forbidden />
      </MemoryRouter>
    );

    const node = getByTestId('not-found-go-to-home-button');
    fireEvent.click(node);
    expect(mockHistory).toHaveBeenCalled();
  });
});
