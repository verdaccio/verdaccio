import React from 'react';
import { describe, expect, test, vi, beforeEach } from 'vitest';

import { renderWith, screen, waitFor } from '../../test/test-react-testing-library';
import type { StagePackageVersion } from './types';
import {
  approveStagedVersion,
  downloadStagedTarball,
  rejectStagedVersion,
  useStageItem,
  useStageList,
} from './useStage';

const requestMock = vi.fn();
vi.mock('../../store/api', () => ({
  default: {
    request: (...args: unknown[]) => requestMock(...args),
  },
}));

const downloadFileMock = vi.fn();
vi.mock('../../utils/url', async () => {
  const actual = await vi.importActual<typeof import('../../utils/url')>('../../utils/url');
  return { ...actual, downloadFile: (...args: unknown[]) => downloadFileMock(...args) };
});

let token: string | null = 'token';
vi.mock('../../providers/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({ userState: { token, username: token ? 'jota' : null } }),
}));

const item: StagePackageVersion = {
  id: '8f6d5b3c-1a2e-4f7b-9c0d-1e2f3a4b5c6d',
  packageName: '@scope/foo',
  version: '1.2.3',
  tag: 'latest',
  createdAt: '2026-03-16T09:00:00.000Z',
  actor: 'octocat',
  actorType: 'user',
  access: 'public',
  shasum: '4f7f5f1d5bcf2f72f6e4d6c4f3b2812d8a2f6c19',
};

function StageListProbe() {
  const { data } = useStageList(2, 25);
  return <div>{data ? data.total : 'loading'}</div>;
}

function StageItemProbe({ stageId }: { stageId?: string }) {
  const { data } = useStageItem(stageId);
  return <div>{data ? data.packageName : 'loading'}</div>;
}

describe('stage API helpers', () => {
  beforeEach(() => {
    requestMock.mockReset();
    downloadFileMock.mockReset();
    token = 'token';
  });

  test('should fetch the staged package page for the active session', async () => {
    requestMock.mockResolvedValue({ items: [], page: 2, perPage: 25, total: 7 });

    renderWith(<StageListProbe />);

    await waitFor(() => expect(screen.getByText('7')).toBeInTheDocument());
    expect(requestMock).toHaveBeenCalledWith('http://localhost:9000/-/stage?page=2&perPage=25');
  });

  test('should not fetch the list without a session', async () => {
    token = null;
    requestMock.mockResolvedValue({ items: [], page: 0, perPage: 10, total: 0 });

    renderWith(<StageListProbe />);

    await waitFor(() => expect(screen.getByText('loading')).toBeInTheDocument());
    expect(requestMock).not.toHaveBeenCalled();
  });

  test('should fetch a single staged package by id', async () => {
    requestMock.mockResolvedValue(item);

    renderWith(<StageItemProbe stageId={item.id} />);

    await waitFor(() => expect(screen.getByText('@scope/foo')).toBeInTheDocument());
    expect(requestMock).toHaveBeenCalledWith(`http://localhost:9000/-/stage/${item.id}`);
  });

  test('should call approve and reject endpoints with their methods', async () => {
    requestMock.mockResolvedValue(undefined);

    await approveStagedVersion(item.id);
    await rejectStagedVersion(item.id);

    expect(requestMock).toHaveBeenCalledWith(
      `http://localhost:9000/-/stage/${item.id}/approve`,
      'POST'
    );
    expect(requestMock).toHaveBeenCalledWith(`http://localhost:9000/-/stage/${item.id}`, 'DELETE');
  });

  test('should download the tarball with a safe filename', async () => {
    const blob = new Blob(['tarball']);
    requestMock.mockResolvedValue(blob);

    await downloadStagedTarball(item);

    expect(requestMock).toHaveBeenCalledWith(
      `http://localhost:9000/-/stage/${item.id}/tarball`,
      'GET',
      {
        headers: { accept: 'application/octet-stream' },
      }
    );
    expect(downloadFileMock).toHaveBeenCalledWith(blob, 'scope-foo-1.2.3.tgz');
  });
});
