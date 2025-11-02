import type { SWRResponse } from 'swr';
import useSWR from 'swr';

import API from '../store/api';
import type { APIRoute } from '../store/routes';

function buildUrl(
  basePath: string,
  route: APIRoute,
  packageName?: string,
  packageVersion?: string
): string {
  let url = `${basePath}${route}`;
  if (packageName) {
    url += packageName;
  }
  if (packageVersion) {
    url += `?v=${packageVersion}`;
  }
  return url;
}

export function useData<T>(
  basePath: string,
  route: APIRoute,
  packageName?: string,
  packageVersion?: string
): Pick<SWRResponse<T>, 'data' | 'error' | 'isLoading' | 'mutate'> {
  const url = buildUrl(basePath, route, packageName, packageVersion);

  const { data, error, isLoading, mutate } = useSWR<T>(url, () => API.request<T>(url));

  return { data, error, isLoading, mutate };
}
