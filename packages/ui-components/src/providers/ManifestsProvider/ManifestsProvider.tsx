import type { ReactElement } from 'react';
import React, { createContext, useContext } from 'react';

import type { Manifest } from '@verdaccio/types';

import { useData } from '../../api/use-data';
import { getConfiguration } from '../../configuration';
import { APIRoute } from '../../store/routes';
import { stripTrailingSlash } from '../../store/utils';

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

const ManifestsProvider: React.FC<{ children: ReactElement }> = ({ children }) => {
  const basePath = stripTrailingSlash(configuration.base);

  const data = useData<ManifestWeb[]>(basePath, APIRoute.PACKAGES);

  return (
    <ManifestsContext.Provider
      value={{
        manifests: (data.data as ManifestWeb[]) ?? [],
        isLoading: data.isLoading,
        isError: typeof data.error?.code !== 'undefined',
      }}
    >
      {children}
    </ManifestsContext.Provider>
  );
};

export default ManifestsProvider;

export const useManifests = () => useContext(ManifestsContext);
