import type { ReactElement } from 'react';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import useSWRInfinite from 'swr/infinite';

import type { Manifest } from '@verdaccio/types';

import { useData } from '../../api/use-data';
import { getConfiguration } from '../../configuration';
import API from '../../store/api';
import { stripTrailingSlash } from '../../store/utils';
import { APIRoute } from '../../utils/routes';
import { useAuth } from '../AuthProvider';

export interface ManifestsContextProps {
  isError: boolean;
  isLoading: boolean;
  manifests: ManifestWeb[];
  /** Fetches the next page of cached packages; a no-op when there is none or one is in flight. */
  loadMore: () => void;
  /** Whether the registry holds cached packages beyond the pages loaded so far. */
  hasMore: boolean;
  isLoadingMore: boolean;
}

export interface Author {
  name?: string;
  email?: string;
  url?: string;
  avatar?: string;
}

export interface ManifestWeb extends Omit<Manifest, 'time' | 'author'> {
  time: string;
  author: Author;
  version: string;
  dist: any;
  /** Only set when `flags.cachedPackages` is enabled. */
  origin?: 'private' | 'cached';
}

interface CachedPackagesPage {
  packages: ManifestWeb[];
  /** Cursor for the next page, `null` on the last one. */
  next: string | null;
}

export const CACHED_PAGE_SIZE = 50;

export const ManifestsContext = createContext<Partial<ManifestsContextProps>>({});

const configuration = getConfiguration();

/** While the registry is empty the home page polls, so a first publish shows up without a reload. */
export const EMPTY_REGISTRY_REFRESH_MS = 10_000;

const ManifestsProvider: React.FC<{ children: ReactElement; emptyRefreshMs?: number }> = ({
  children,
  emptyRefreshMs = EMPTY_REGISTRY_REFRESH_MS,
}) => {
  const basePath = stripTrailingSlash(configuration.base);
  // a number, not SWR's function form: that one is read once at mount, before any data exists
  const [refreshInterval, setRefreshInterval] = useState(0);

  const showCached = getConfiguration().flags?.cachedPackages === true;
  const { userState } = useAuth();

  // the user is part of the key so a login starts over with what that user may see
  const cached = useSWRInfinite<CachedPackagesPage>(
    (_pageIndex, previous: CachedPackagesPage | null) => {
      if (!showCached || previous?.next === null) {
        return null;
      }
      const after = previous ? `&after=${encodeURIComponent(previous.next)}` : '';
      return [
        `${basePath}${APIRoute.CACHED_PACKAGES}?limit=${CACHED_PAGE_SIZE}${after}`,
        userState?.username ?? '',
      ];
    },
    ([url]: [string]) => API.request<CachedPackagesPage>(url),
    { revalidateFirstPage: false, revalidateOnFocus: false }
  );
  const { setSize, isValidating: isLoadingCached } = cached;
  const cachedPages = cached.data;
  const lastPage = cachedPages?.[cachedPages.length - 1];
  const hasMoreCached = showCached && !!lastPage && lastPage.next !== null;

  const loadMore = useCallback(() => {
    if (hasMoreCached && !isLoadingCached) {
      setSize((size) => size + 1);
    }
  }, [hasMoreCached, isLoadingCached, setSize]);

  const data = useData<ManifestWeb[]>(basePath, APIRoute.PACKAGES, undefined, undefined, {
    refreshInterval,
    onSuccess: (latest) =>
      setRefreshInterval(Array.isArray(latest) && latest.length === 0 ? emptyRefreshMs : 0),
  });

  const manifests = useMemo(() => {
    const privateManifests = (data.data as ManifestWeb[]) ?? [];
    return cachedPages
      ? privateManifests.concat(cachedPages.flatMap((page) => page.packages))
      : privateManifests;
  }, [data.data, cachedPages]);

  return (
    <ManifestsContext.Provider
      value={{
        manifests,
        loadMore,
        hasMore: hasMoreCached,
        isLoadingMore: hasMoreCached && isLoadingCached,
        isLoading: data.isLoading,
        // any error counts (network failures have no `.code`), but a failed
        // revalidation must not hide an already-cached, renderable list
        isError: typeof data.error !== 'undefined' && typeof data.data === 'undefined',
      }}
    >
      {children}
    </ManifestsContext.Provider>
  );
};

export default ManifestsProvider;

export const useManifests = () => useContext(ManifestsContext);
