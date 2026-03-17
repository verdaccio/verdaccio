import React, { createContext, useContext, useMemo } from 'react';
import { useParams } from 'react-router';

import { useData } from '../../api/use-data';
import { getConfiguration } from '../../configuration';
import { APIRoute } from '../../store/routes';
import { stripTrailingSlash } from '../../store/utils';
import type { PackageMetaInterface } from '../../types/packageMeta';

function getRouterPackageName(packageName: string, scope?: string): string {
  return scope ? `${scope}/${packageName}` : packageName;
}

export interface ApiError extends Error {
  code?: number;
}

export interface DetailContextProps {
  error: ApiError | undefined;
  hasNotBeenFound: boolean;
  isForbidden: boolean;
  isUnAuthorized: boolean;
  isError: boolean;
  isLoading: boolean;
  packageMeta?: PackageMetaInterface;
  packageName: string;
  packageVersion?: string;
  readMe?: string;
}

export const DetailContext = createContext<DetailContextProps | undefined>(undefined);

const VersionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    scope,
    package: pkgName,
    version: packageVersion,
  } = useParams<Record<'scope' | 'package' | 'version', string | undefined>>();

  const configuration = getConfiguration();
  const basePath = stripTrailingSlash(configuration.base);
  const packageName = getRouterPackageName(pkgName ?? '', scope);

  const readmeData = useData<string>(basePath, APIRoute.README, packageName, packageVersion);

  const sidebarData = useData<PackageMetaInterface>(
    basePath,
    APIRoute.SIDEBAR,
    packageName,
    packageVersion
  );
  const isLoading = readmeData.isLoading || sidebarData.isLoading;
  const error: ApiError | undefined = readmeData.error || sidebarData.error;
  const errorCode = (readmeData.error as ApiError)?.code ?? (sidebarData.error as ApiError)?.code;

  const value = useMemo<DetailContextProps>(
    () => ({
      packageMeta: sidebarData.data,
      readMe: readmeData.data,
      packageName,
      packageVersion,
      isLoading,
      isForbidden: errorCode === 403,
      isUnAuthorized: errorCode === 401,
      hasNotBeenFound: errorCode === 404,
      isError: errorCode !== undefined,
      error,
    }),
    [sidebarData.data, readmeData.data, packageName, packageVersion, isLoading, errorCode, error]
  );

  return <DetailContext.Provider value={value}>{children}</DetailContext.Provider>;
};

export default VersionProvider;

export const useVersion = (): DetailContextProps => {
  const context = useContext(DetailContext);
  if (context === undefined) {
    throw new Error('useVersion must be used within a VersionProvider');
  }
  return context;
};
