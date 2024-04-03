import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter, Route } from 'react-router';

import { render, screen } from '../../test/test-react-testing-library';
import { DependencyBlock } from './DependencyBlock';

describe('<DependencyBlock /> component', () => {
  test('renders dependency block', () => {
    render(<DependencyBlock dependencies={{ jquery: '1.0.0' }} title="foo" />);

    expect(screen.getByText('foo (1)')).toBeInTheDocument();
    expect(screen.getByText('dependencies.dependency-block')).toBeInTheDocument();

    userEvent.click(screen.getByText('dependencies.dependency-block'));
  });

  test.todo('test the click event');
  test.skip('handle change route handler', () => {
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

    userEvent.click(screen.getByTestId('jquery'));
  });
});
