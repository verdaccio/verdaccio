import type { SWRResponse } from 'swr';
import useSWR from 'swr';

import API from '../store/api';
import type { APIRoute } from '../store/routes';

export function buildUrl(
  basePath: string,
  route: APIRoute,
  packageName?: string,
  packageVersion?: string
): string {
  let url = `${basePath}${route}`;
  if (packageName) {
    // encode each path segment (scoped names keep their `/`); characters like
    // `+` in build-metadata versions would otherwise be decoded as a space.
    // `@` stays literal: it is path-safe and the npm registry convention —
    // clients, proxies and test intercepts all expect `/@scope/pkg`
    url += packageName
      .split('/')
      .map((segment) => encodeURIComponent(segment).replace(/%40/g, '@'))
      .join('/');
  }
  if (packageVersion) {
    url += `?v=${encodeURIComponent(packageVersion)}`;
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
