import React from 'react';
import { vi } from 'vitest';

import { Forbidden } from '../..';
import { fireEvent, renderWithRouter, screen } from '../../test/test-react-testing-library';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => ({
  ...(await vi.importActual('react-router')),
  useNavigate: () => mockNavigate,
}));

describe('<Forbidden /> component', () => {
  test('should load the component in default state', () => {
    renderWithRouter(<Forbidden />, '/', ['/']);
    expect(screen.getByTestId('LockIcon')).toBeInTheDocument();
    expect(screen.getByText('error.401.sorry-no-access')).toBeInTheDocument();
    expect(screen.getByText('button.go-to-the-home-page')).toBeInTheDocument();
  });

  test('go to Home Page button click', async () => {
    renderWithRouter(<Forbidden />, '/', ['/']);

    const node = screen.getByTestId('not-found-go-to-home-button');
    fireEvent.click(node);
    expect(mockNavigate).toHaveBeenCalled();
  });
});
