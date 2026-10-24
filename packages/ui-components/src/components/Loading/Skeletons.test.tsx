import React from 'react';
import { describe, expect, test } from 'vitest';

import { render, screen } from '../../test/test-react-testing-library';
import PackageListSkeleton from './PackageListSkeleton';
import VersionSkeleton from './VersionSkeleton';

describe('loading skeletons', () => {
  test('the package list skeleton is announced as a busy status', () => {
    render(<PackageListSkeleton />);
    const skeleton = screen.getByRole('status', { name: 'loading' });
    expect(skeleton).toHaveAttribute('aria-busy', 'true');
    expect(skeleton).toHaveAttribute('data-testid', 'package-list-skeleton');
  });

  test('the version skeleton is announced as a busy status', () => {
    render(<VersionSkeleton />);
    const skeleton = screen.getByRole('status', { name: 'loading' });
    expect(skeleton).toHaveAttribute('data-testid', 'version-skeleton');
  });
});
