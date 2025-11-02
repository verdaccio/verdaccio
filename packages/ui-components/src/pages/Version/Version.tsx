import React from 'react';

import Forbidden from '../../components/Forbidden';
import { Loading, NotFound, VersionLayout, useVersion } from '../../index';

const Version: React.FC = () => {
  const { hasNotBeenFound, isForbidden, isUnAuthorized, isLoading } = useVersion();

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

  return <VersionLayout />;
};

export default Version;
