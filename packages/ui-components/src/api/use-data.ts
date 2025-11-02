import useSWR from 'swr';

import API from '../store/api';
import { APIRoute } from '../store/routes';

const fetcher = async <T>(
  basePath: string,
  route: APIRoute,
  packageName?: string,
  packageVersion?: string
): Promise<T> => {
  return API.request<T>(
    `${basePath}${route}${typeof packageName === 'string' ? `${packageName}` : ''}${typeof packageVersion === 'string' ? `?v=${packageVersion}` : ''}`
  );
};

export function useData<T>(
  basePath: string,
  route: APIRoute,
  packageName?: string,
  packageVersion?: string
) {
  const key = `${basePath}${route}`;

  const { data, error, isLoading, mutate } = useSWR<T>(key, () =>
    fetcher<T>(basePath, route, packageName, packageVersion)
  );
  console.log('useData key--->', key, 'error--->', error);

  return { data, error, isLoading, mutate };
}
