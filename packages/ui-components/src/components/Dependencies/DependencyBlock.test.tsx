import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { fireEvent, render, screen } from '../../test/test-react-testing-library';
import { DependencyBlock } from './DependencyBlock';

const mockHistory = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: mockHistory,
  }),
}));

describe('<DependencyBlock /> component', () => {
  test('renders dependency block', () => {
    render(<DependencyBlock dependencies={{ jquery: '1.0.0' }} title="foo" />);

    expect(screen.getByText('foo (1)')).toBeInTheDocument();
    expect(screen.getByText('dependencies.dependency-block')).toBeInTheDocument();
  });

  test('renders bundleDependencies block', () => {
    render(<DependencyBlock dependencies={{ semver: '7.6.0' }} title="bundleDependencies" />);

    expect(screen.getByText('bundleDependencies (1)')).toBeInTheDocument();
    expect(screen.getByText('dependencies.dependency-block-bundle')).toBeInTheDocument();
  });

  test('handle change of route', async () => {
    render(
      <MemoryRouter
        initialEntries={[`/-/web/detail/some-dep`, `/-/web/detail/jquery`]}
        initialIndex={0}
      >
        <Route exact={true} path="/-/web/detail/:package">
          <DependencyBlock dependencies={{ jquery: '1.0.0' }} title="foo" />
        </Route>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('jquery'));

    await expect(mockHistory).toHaveBeenCalled();
  });
});
