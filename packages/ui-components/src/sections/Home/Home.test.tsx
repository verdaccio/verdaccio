import React from 'react';
import { MemoryRouter } from 'react-router';

import { store } from '../../store';
import { act, renderWithStore, screen, waitFor } from '../../test/test-react-testing-library';
import Home from './Home';

// force the windows to expand to display items
// https://github.com/bvaughn/react-virtualized/issues/493#issuecomment-640084107
jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(600);
jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(600);

const ComponentSideBar: React.FC = () => (
  <MemoryRouter>
    <Home />
  </MemoryRouter>
);

describe('Home', () => {
  test('should render titles', async () => {
    act(() => {
      renderWithStore(<ComponentSideBar />, store);
    });
    await waitFor(() => expect(screen.getAllByTestId('package-item-list')).toHaveLength(5));
  });

  test('should render loading', async () => {
    act(() => {
      renderWithStore(<ComponentSideBar />, store);
    });
    await waitFor(() => expect(screen.getByTestId('loading')).toBeInTheDocument());
  });
});
