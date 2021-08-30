import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { PackageMetaInterface } from 'types/packageMeta';

import { useAPI } from 'verdaccio-ui/providers/API/APIProvider';

import { DetailContext } from './context';
import getRouterPackageName from './get-route-package-name';
import isPackageVersionValid from './is-package-version-valid';

interface Params {
  scope?: string;
  package: string;
  version?: string;
}

const VersionContextProvider: React.FC = ({ children }) => {
  const { version, package: pkgName, scope } = useParams<Params>();
  const [packageName, setPackageName] = useState(getRouterPackageName(pkgName, scope));
  const [packageVersion, setPackageVersion] = useState(version);
  const [packageMeta, setPackageMeta] = useState<PackageMetaInterface>();
  const [readMe, setReadme] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasNotBeenFound, setHasNotBeenFound] = useState<boolean>();
  const { callDetailPage, callReadme } = useAPI();

  useEffect(() => {
    const updatedPackageName = getRouterPackageName(pkgName, scope);
    setPackageName(updatedPackageName);
  }, [pkgName, scope]);

  useEffect(() => {
    setPackageVersion(version);
  }, [version]);

  const doCalls = useCallback(async () => {
    try {
      const packageMeta = await callDetailPage(packageName, packageVersion);
      const readMe = await callReadme(packageName, packageVersion);
      if (isPackageVersionValid(packageMeta, packageVersion)) {
        setReadme(readMe);
        setPackageMeta(packageMeta);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setHasNotBeenFound(true);
      }
    } catch (error: any) {
      setHasNotBeenFound(true);
      setIsLoading(false);
    }
  }, [packageName, packageVersion, callDetailPage, callReadme]);

  useEffect(() => {
    doCalls();
  }, [doCalls]);

  return (
    <DetailContext.Provider
      value={{
        packageMeta,
        packageVersion,
        readMe,
        packageName,
        isLoading,
        hasNotBeenFound,
      }}>
      {children}
    </DetailContext.Provider>
  );
};

export default VersionContextProvider;
