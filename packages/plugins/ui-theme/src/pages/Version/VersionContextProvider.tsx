import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Dispatch, RootState } from '../../store/store';
import { DetailContext } from './context';
import getRouterPackageName from './get-route-package-name';

interface Params {
  scope?: string;
  package: string;
  version?: string;
}

const VersionContextProvider: React.FC = ({ children }) => {
  const { version: packageVersion, package: pkgName, scope } = useParams<Params>();
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

export default VersionContextProvider;
