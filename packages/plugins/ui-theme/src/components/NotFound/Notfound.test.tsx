import React from 'react';
import { MemoryRouter } from 'react-router';

import { render, fireEvent } from 'verdaccio-ui/utils/test-react-testing-library';

import NotFound from './NotFound';

const mockHistory = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistory,
  }),
}));

describe('<NotFound /> component', () => {
  test('should load the component in default state', () => {
    const { container } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(container.firstChild).toMatchSnapshot();
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
