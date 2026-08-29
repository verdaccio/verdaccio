import React from 'react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { renderWith, screen, waitFor } from '../../test/test-react-testing-library';
import StageList from './StageList';
import type { StagePackageList } from './types';

const item = {
  id: '8f6d5b3c-1a2e-4f7b-9c0d-1e2f3a4b5c6d',
  packageName: '@scope/foo',
  version: '1.2.3',
  tag: 'latest',
  createdAt: '2026-03-16T09:00:00.000Z',
  actor: 'octocat',
  actorType: 'user',
  access: 'public' as const,
  shasum: '4f7f5f1d5bcf2f72f6e4d6c4f3b2812d8a2f6c19',
};

const emptyList: StagePackageList = { items: [], page: 0, perPage: 10, total: 0 };
const oneItem: StagePackageList = { items: [item], page: 0, perPage: 10, total: 1 };

const requestMock = vi.fn();
vi.mock('../../store/api', () => ({
  default: {
    request: (...args: unknown[]) => requestMock(...args),
  },
}));

function renderList() {
  return renderWith(
    <MemoryRouter initialEntries={['/-/web/stage']}>
      <StageList />
    </MemoryRouter>
  );
}

describe('<StageList />', () => {
  beforeEach(() => {
    requestMock.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should tell the user when nothing is staged', async () => {
    requestMock.mockResolvedValue(emptyList);

    renderList();

    await waitFor(() => expect(screen.getByText('stage.empty')).toBeInTheDocument());
    expect(screen.queryByTestId('stage-table')).not.toBeInTheDocument();
  });

  test('should render a staged version', async () => {
    requestMock.mockResolvedValue(oneItem);

    renderList();

    await waitFor(() => expect(screen.getByTestId('stage-table')).toBeInTheDocument());
    expect(screen.getByText('@scope/foo')).toBeInTheDocument();
    expect(screen.getByText('1.2.3')).toBeInTheDocument();
    expect(screen.getByText('octocat')).toBeInTheDocument();
  });

  test('should ask the registry for the requested page size', async () => {
    requestMock.mockResolvedValue(oneItem);

    renderList();

    await waitFor(() => expect(requestMock).toHaveBeenCalled());
    expect(requestMock.mock.calls[0][0]).toContain('/-/stage?page=0&perPage=10');
  });

  test('should surface a load failure instead of an empty table', async () => {
    requestMock.mockRejectedValue(new Error('boom'));

    renderList();

    await waitFor(() => expect(screen.getByText('stage.error.list')).toBeInTheDocument());
  });

  test('should confirm before approving', async () => {
    requestMock.mockResolvedValue(oneItem);

    renderList();
    await waitFor(() => expect(screen.getByTestId('stage-table')).toBeInTheDocument());

    screen.getByTestId(`stage-approve-${item.id}`).click();

    // approving publishes for real, so it must never be one click away
    await waitFor(() => expect(screen.getByTestId('stage-confirm')).toBeInTheDocument());
    expect(screen.getByText('stage.confirm.approveTitle')).toBeInTheDocument();
    expect(requestMock).not.toHaveBeenCalledWith(
      expect.stringContaining('/approve'),
      expect.anything()
    );
  });

  test('should confirm before rejecting', async () => {
    requestMock.mockResolvedValue(oneItem);

    renderList();
    await waitFor(() => expect(screen.getByTestId('stage-table')).toBeInTheDocument());

    screen.getByTestId(`stage-reject-${item.id}`).click();

    await waitFor(() => expect(screen.getByText('stage.confirm.rejectTitle')).toBeInTheDocument());
    expect(requestMock).not.toHaveBeenCalledWith(expect.stringContaining(item.id), 'DELETE');
  });
});
