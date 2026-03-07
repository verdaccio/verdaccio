import useSWRMutation from 'swr/mutation';

import API from '../store/api';
import type { APIRoute } from '../store/routes';
import { HEADERS } from '../store/utils';

export const fetcher = async <T>(
  url: string,
  method: string,
  body: any,
  options?: { signal?: AbortSignal }
): Promise<T> => {
  const isGet = method.toUpperCase() === 'GET';
  const finalUrl = url;

  return API.request<T>(finalUrl, method, {
    // Only stringify and send body if it's NOT a GET request
    body: isGet ? undefined : JSON.stringify(body),
    headers: {
      Accept: HEADERS.JSON,
      ...(isGet ? {} : { 'Content-Type': HEADERS.JSON }),
    },
    signal: options?.signal,
  });
};

export function useDataMutation<T>(
  basePath: string,
  route: APIRoute | string,
  method = 'POST',
  options: { buildUrl?: (basePath: string, route: string) => string } = {}
) {
  const key = options.buildUrl ? options.buildUrl(basePath, route) : `${basePath}${route}`;

  const { data, error, isMutating, trigger } = useSWRMutation<T, any, string, any>(
    key,
    (url, { arg }) => {
      return fetcher<T>(url, method, arg ?? {});
    }
  );

  return { data, error, isMutating, trigger };
}

async function tarballFetcher(url: string, { arg }: { arg: { link: string } }): Promise<Blob> {
  return API.request<Blob>(arg.link, 'GET', {
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
    },
    credentials: 'include',
  });
}

export function useTarballDownload() {
  const { trigger, isMutating, error } = useSWRMutation<Blob, any, string, { link: string }>(
    'tarball-download',
    tarballFetcher
  );

  return {
    download: trigger,
    isDownloading: isMutating,
    error,
  };
}
