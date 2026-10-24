import type { ReactElement } from 'react';
import React, { createContext, useContext, useState } from 'react';

import type { Manifest } from '@verdaccio/types';

import { useData } from '../../api/use-data';
import { getConfiguration } from '../../configuration';
import { stripTrailingSlash } from '../../store/utils';
import { APIRoute } from '../../utils/routes';

export interface ManifestsContextProps {
  isError: boolean;
  isLoading: boolean;
  manifests: ManifestWeb[];
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
}

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

  const data = useData<ManifestWeb[]>(basePath, APIRoute.PACKAGES, undefined, undefined, {
    refreshInterval,
    onSuccess: (latest) =>
      setRefreshInterval(Array.isArray(latest) && latest.length === 0 ? emptyRefreshMs : 0),
  });

  return (
    <ManifestsContext.Provider
      value={{
        manifests: (data.data as ManifestWeb[]) ?? [],
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
