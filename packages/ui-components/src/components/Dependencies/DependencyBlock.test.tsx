import React from 'react';
import { describe, expect, test } from 'vitest';

import { fireEvent, renderWithRouteDetail, screen } from '../../test/test-react-testing-library';
import { DependencyBlock } from './DependencyBlock';

describe('<DependencyBlock /> component', () => {
  test('renders dependency block', () => {
    renderWithRouteDetail(<DependencyBlock dependencies={{ jquery: '1.0.0' }} title="foo" />);

    expect(screen.getByText('foo (1)')).toBeInTheDocument();
    expect(screen.getByText('dependencies.dependency-block')).toBeInTheDocument();
  });

  test('renders bundleDependencies block', () => {
    renderWithRouteDetail(
      <DependencyBlock dependencies={{ semver: '7.6.0' }} title="bundleDependencies" />
    );

    expect(screen.getByText('bundleDependencies (1)')).toBeInTheDocument();
    expect(screen.getByText('dependencies.dependency-block-bundle')).toBeInTheDocument();
  });

  test('handle change of route', async () => {
    renderWithRouteDetail(<DependencyBlock dependencies={{ jquery: '1.0.0' }} title="foo" />);

    fireEvent.click(screen.getByTestId('jquery'));
  });

  test('dependencies are sorted alphabetically', () => {
    renderWithRouteDetail(
      <DependencyBlock
        dependencies={{ jquery: '1.0.0', axios: '1.0.0', lodash: '1.0.0' }}
        title="foo"
      />
    );

    const depTags = screen.getByTestId('foo').querySelectorAll('.dep-tag');
    const depNames = Array.from(depTags, (tag) => tag.getAttribute('data-testid'));
    expect(depNames).toEqual(['axios', 'jquery', 'lodash']);
  });
});
