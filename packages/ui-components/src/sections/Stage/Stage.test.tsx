import React from 'react';
import { MemoryRouter, Route as RouterRoute, Routes } from 'react-router';
import type * as ReactRouter from 'react-router';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { fireEvent, renderWith, screen, waitFor } from '../../test/test-react-testing-library';
import StageDetail from './StageDetail';
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

// the real provider derives the session from a JWT in storage; the guard only
// cares whether there is a token at all
let session: { token: string | null; username: string | null } = {
  token: 'a-session-token',
  username: 'jota',
};
vi.mock('../../providers/AuthProvider', () => ({
  // the render helper mounts the real provider, so it has to stay exported
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => ({ userState: session }),
}));

const navigateMock = vi.fn();
vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof ReactRouter>('react-router');
  return { ...actual, useNavigate: () => navigateMock };
});

function renderList() {
  return renderWith(
    <MemoryRouter initialEntries={['/-/web/stage']}>
      <StageList />
    </MemoryRouter>
  );
}

function renderDetail(stageId = item.id) {
  return renderWith(
    <MemoryRouter initialEntries={[`/-/web/stage/${stageId}`]}>
      <Routes>
        <RouterRoute element={<StageDetail />} path="/-/web/stage/:stageId" />
      </Routes>
    </MemoryRouter>
  );
}

describe('<StageList />', () => {
  beforeEach(() => {
    requestMock.mockReset();
    navigateMock.mockReset();
    session = { token: 'a-session-token', username: 'jota' };
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

    fireEvent.click(screen.getByTestId(`stage-approve-${item.id}`));

    // approving publishes for real, so it must never be one click away
    await waitFor(() => expect(screen.getByTestId('stage-confirm')).toBeInTheDocument());
    expect(screen.getByText('stage.confirm.approveTitle')).toBeInTheDocument();
    expect(requestMock).not.toHaveBeenCalledWith(
      expect.stringContaining('/approve'),
      expect.anything()
    );
  });

  describe('without a session', () => {
    test('should send the visitor home instead of showing an error', async () => {
      session = { token: null, username: null };
      requestMock.mockResolvedValue(emptyList);

      renderList();

      await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/'));
    });

    test('should not call the registry at all', async () => {
      session = { token: null, username: null };
      requestMock.mockResolvedValue(emptyList);

      renderList();

      // every stage endpoint needs auth, so the request could only come back 401
      await waitFor(() => expect(navigateMock).toHaveBeenCalled());
      expect(requestMock).not.toHaveBeenCalled();
      expect(screen.queryByText('stage.error.list')).not.toBeInTheDocument();
    });

    test('should stay put when there is a session', async () => {
      requestMock.mockResolvedValue(emptyList);

      renderList();

      await waitFor(() => expect(requestMock).toHaveBeenCalled());
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });

  test('should confirm before rejecting', async () => {
    requestMock.mockResolvedValue(oneItem);

    renderList();
    await waitFor(() => expect(screen.getByTestId('stage-table')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId(`stage-reject-${item.id}`));

    await waitFor(() => expect(screen.getByText('stage.confirm.rejectTitle')).toBeInTheDocument());
    expect(requestMock).not.toHaveBeenCalledWith(expect.stringContaining(item.id), 'DELETE');
  });

  test('should approve after confirmation and refresh the list', async () => {
    requestMock
      .mockResolvedValueOnce(oneItem)
      .mockResolvedValueOnce({ message: 'ok' })
      .mockResolvedValueOnce(emptyList);

    renderList();
    await waitFor(() => expect(screen.getByTestId('stage-table')).toBeInTheDocument());

    fireEvent.click(screen.getByTestId(`stage-approve-${item.id}`));
    fireEvent.click(await screen.findByTestId('stage-confirm'));

    await waitFor(() =>
      expect(requestMock).toHaveBeenCalledWith(
        `http://localhost:9000/-/stage/${item.id}/approve`,
        'POST'
      )
    );
    await waitFor(() => expect(requestMock).toHaveBeenCalledTimes(3));
  });
});

describe('<StageDetail />', () => {
  beforeEach(() => {
    requestMock.mockReset();
    navigateMock.mockReset();
    session = { token: 'a-session-token', username: 'jota' };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render the staged package details', async () => {
    requestMock.mockResolvedValue(item);

    renderDetail();

    await waitFor(() => expect(screen.getByTestId('stage-detail')).toBeInTheDocument());
    expect(screen.getByText('@scope/foo@1.2.3')).toBeInTheDocument();
    expect(screen.getByText('4f7f5f1d5bcf2f72f6e4d6c4f3b2812d8a2f6c19')).toBeInTheDocument();
  });

  test('should request the stage item by route id', async () => {
    requestMock.mockResolvedValue(item);

    renderDetail();

    await waitFor(() =>
      expect(requestMock).toHaveBeenCalledWith(`http://localhost:9000/-/stage/${item.id}`)
    );
  });

  test('should show not found when the item cannot be loaded', async () => {
    requestMock.mockRejectedValue(new Error('missing'));

    renderDetail();

    await waitFor(() => expect(screen.getByText('stage.error.notFound')).toBeInTheDocument());
  });

  test('should send anonymous visitors home without loading the item', async () => {
    session = { token: null, username: null };
    requestMock.mockResolvedValue(item);

    renderDetail();

    await waitFor(() => expect(navigateMock).toHaveBeenCalledWith('/'));
    expect(requestMock).not.toHaveBeenCalled();
  });
});
