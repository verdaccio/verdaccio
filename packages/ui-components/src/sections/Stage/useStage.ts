import useSWR from 'swr';

import API from '../../store/api';
import { getConfiguration } from '../../configuration';
import { stripTrailingSlash } from '../../store/utils';
import { APIRoute } from '../../utils/routes';
import { downloadFile } from '../../utils/url';
import type { StagePackageList, StagePackageVersion } from './types';

function stageUrl(path = ''): string {
  const basePath = stripTrailingSlash(getConfiguration().base);
  return `${basePath}${APIRoute.STAGE}${path}`;
}

/**
 * Page through the staged versions the logged in user is allowed to see.
 *
 * The registry filters by permission before paginating, so `total` always
 * matches what this user can actually reach.
 */
export function useStageList(page: number, perPage: number) {
  const url = `${stageUrl()}?page=${page}&perPage=${perPage}`;
  const { data, error, isLoading, mutate } = useSWR<StagePackageList>(url, () =>
    API.request<StagePackageList>(url)
  );

  return { data, error, isLoading, mutate };
}

/** A single staged version. */
export function useStageItem(stageId?: string) {
  const url = stageId ? stageUrl(`/${stageId}`) : null;
  const { data, error, isLoading, mutate } = useSWR<StagePackageVersion>(url, () =>
    API.request<StagePackageVersion>(url as string)
  );

  return { data, error, isLoading, mutate };
}

/** Approve a staged version, publishing it for real. */
export function approveStagedVersion(stageId: string): Promise<{ message: string }> {
  return API.request<{ message: string }>(stageUrl(`/${stageId}/approve`), 'POST');
}

/** Reject a staged version, dropping it and its tarball. */
export function rejectStagedVersion(stageId: string): Promise<void> {
  return API.request<void>(stageUrl(`/${stageId}`), 'DELETE');
}

/**
 * Download the staged tarball.
 *
 * The endpoint is authenticated, so a plain `<a href>` would get a 401: the
 * blob has to be fetched through the API client, which attaches the bearer
 * token, and then handed to the browser.
 */
export async function downloadStagedTarball(item: StagePackageVersion): Promise<void> {
  const blob = await API.request<Blob>(stageUrl(`/${item.id}/tarball`), 'GET', {
    headers: { accept: 'application/octet-stream' },
  });
  const safeName = item.packageName.replace('@', '').replace('/', '-');
  downloadFile(blob, `${safeName}-${item.version}.tgz`);
}
