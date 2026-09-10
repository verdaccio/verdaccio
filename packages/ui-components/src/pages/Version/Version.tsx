import React from 'react';

import Forbidden from '../../components/Forbidden';
import GenericError from '../../components/GenericError';
import { Loading, NotFound, VersionLayout, useVersion } from '../../index';

const Version: React.FC = () => {
  const { hasNotBeenFound, isForbidden, isUnAuthorized, isError, isLoading, packageMeta } =
    useVersion();

  if (isLoading) {
    return <Loading />;
  }

  if (isUnAuthorized) {
    return <Forbidden />;
  }

  if (isForbidden) {
    return <Forbidden />;
  }

  if (hasNotBeenFound) {
    return <NotFound />;
  }

  // 5xx, network failures or a manifest that never arrived: rendering the
  // layout without packageMeta crashes the tab components
  if (isError || !packageMeta) {
    return <GenericError />;
  }

  return <VersionLayout />;
};

export default Version;
