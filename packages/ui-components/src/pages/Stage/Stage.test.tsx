import React from 'react';
import { describe, expect, test, vi } from 'vitest';

import { renderWith, screen } from '../../test/test-react-testing-library';
import StageDetailPage from './StageDetail';
import StageListPage from './StageList';
import { StageDetail, StageList } from '.';

vi.mock('../../sections/Stage', () => ({
  StageDetail: () => <div>stage-detail-section</div>,
  StageList: () => <div>stage-list-section</div>,
}));

describe('Stage pages', () => {
  test('should render the list section from the page wrapper', () => {
    renderWith(<StageListPage />);

    expect(screen.getByText('stage-list-section')).toBeInTheDocument();
  });

  test('should render the detail section from the page wrapper', () => {
    renderWith(<StageDetailPage />);

    expect(screen.getByText('stage-detail-section')).toBeInTheDocument();
  });

  test('should export both stage pages from the barrel', () => {
    expect(StageList).toBe(StageListPage);
    expect(StageDetail).toBe(StageDetailPage);
  });
});
