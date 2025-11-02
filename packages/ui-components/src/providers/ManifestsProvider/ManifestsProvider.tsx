import React, { ReactElement } from 'react';
import { createContext, useContext } from 'react';

import { Manifest } from '@verdaccio/types';

import { useData } from '../../api/use-data';
import { getConfiguration } from '../../configuration';
import { APIRoute } from '../../store/routes';
import { stripTrailingSlash } from '../../store/utils';

// import { PackageMetaInterface } from '../../types/packageMeta';

export interface ManifestsContextProps {
  error: any;
  isForbidden: boolean;
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
