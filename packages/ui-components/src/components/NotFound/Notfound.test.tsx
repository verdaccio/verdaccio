import React from 'react';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';

import { fireEvent, render, screen } from '../../test/test-react-testing-library';
import NotFound from './NotFound';

const mockNavigate = vi.fn();

vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('<NotFound /> component', () => {
  test('should load the component in default state', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByTestId('FolderOffIcon')).toBeInTheDocument();
    expect(screen.getByText('button.go-to-the-home-page')).toBeInTheDocument();
    expect(screen.getByText('error.404.sorry-we-could-not-find-it')).toBeInTheDocument();
  });

  test('go to Home Page button click', async () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const node = getByTestId('not-found-go-to-home-button');
    fireEvent.click(node);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
