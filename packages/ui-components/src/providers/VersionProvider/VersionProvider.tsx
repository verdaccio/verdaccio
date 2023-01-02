import React, { useEffect } from 'react';
import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Dispatch, RootState } from '../../store/store';
import { PackageMetaInterface } from '../../types/packageMeta';

function getRouterPackageName(packageName: string, scope?: string): string {
  if (scope) {
    return `@${scope}/${packageName}`;
  }

  return packageName;
}

export interface DetailContextProps {
  enableLoading: () => void;
  hasNotBeenFound: boolean;
  isLoading: boolean;
  packageMeta: PackageMetaInterface;
  packageName: string;
  packageVersion?: string;
  readMe: string;
}

export interface VersionPageConsumerProps {
  enableLoading: () => void;
  packageMeta: PackageMetaInterface;
  packageName: string;
  packageVersion?: string;
  readMe: string;
}

export const DetailContext = createContext<Partial<DetailContextProps>>({});

interface Params {
  scope?: string;
  package: string;
  version?: string;
}

const VersionProvider: React.FC<{ children: any }> = ({ children }) => {
  const { version: packageVersion, package: pkgName, scope } = useParams<Params>();
  // @ts-ignore
  const { manifest, readme, packageName, hasNotBeenFound } = useSelector(
    (state: RootState) => state.manifest
  );
  const isLoading = useSelector((state: RootState) => state?.loading?.models.manifest);
  const dispatch = useDispatch<Dispatch>();
  useEffect(() => {
    const packageName = getRouterPackageName(pkgName, scope);
    dispatch.manifest.getManifest({ packageName, packageVersion });
  }, [dispatch, packageVersion, pkgName, scope]);

  return (
    <DetailContext.Provider
      value={{
        packageMeta: manifest,
        packageVersion,
        readMe: readme,
        packageName,
        isLoading,
        hasNotBeenFound,
      }}
    >
      {children}
    </DetailContext.Provider>
  );
};

export default VersionProvider;

export const useVersion = () => useContext(DetailContext);
