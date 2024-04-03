import React from 'react';
import { MemoryRouter } from 'react-router';

import { fireEvent, render, screen } from '../../test/test-react-testing-library';
import NotFound from './NotFound';

const mockHistory = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistory,
  }),
}));

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
    expect(mockHistory).toHaveBeenCalled();
  });
});
