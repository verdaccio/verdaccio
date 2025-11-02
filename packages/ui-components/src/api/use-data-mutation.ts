import useSWRMutation from 'swr/mutation';

import API from '../store/api';
import { APIRoute } from '../store/routes';
import { HEADERS } from '../store/utils';

const fetcher = async <T>(url: string, method: string, body: any): Promise<T> => {
  return API.request<T>(url, method, {
    body: JSON.stringify(body),
    headers: {
      Accept: HEADERS.JSON,
      'Content-Type': HEADERS.JSON,
    },
  });
};

export function useDataMutation<T>(basePath: string, route: APIRoute, method = 'POST') {
  const key = `${basePath}${route}`;

  const { data, error, isMutating, trigger } = useSWRMutation<T, any, string, any>(
    key,
    (url, { arg }) => {
      return fetcher<T>(url, method, arg);
    }
  );

  return { data, error, isMutating, trigger };
}

async function tarballFetcher(url: string, { arg }: { arg: { link: string } }): Promise<Blob> {
  console.log('Downloading tarball from', arg.link);
  console.log('Using URL', url);
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
