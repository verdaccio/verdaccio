import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Loading from 'verdaccio-ui/components/Loading';
import NotFound from 'verdaccio-ui/components/NotFound';

import { Dispatch, RootState } from '../../store/store';
import VersionLayout from './VersionLayout';
import getRouterPackageName from './get-route-package-name';

interface Params {
  scope?: string;
  package: string;
  version?: string;
}

const Version: React.FC = () => {
  const { version: packageVersion, package: pkgName, scope } = useParams<Params>();
  const manifestStore = useSelector((state: RootState) => state.manifest);
  const isLoading = useSelector((state: RootState) => state?.loading?.models.manifest);
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    const packageName = getRouterPackageName(pkgName, scope);
    dispatch.manifest.getManifest({ packageName, packageVersion });
  }, [dispatch, pkgName, scope, packageVersion]);

  if (isLoading) {
    return <Loading />;
  }

  if (manifestStore.hasNotBeenFound) {
    return <NotFound />;
  }

  return <VersionLayout />;
};

export default Version;
