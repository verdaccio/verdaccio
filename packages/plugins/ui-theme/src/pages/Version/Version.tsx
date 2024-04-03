import React from 'react';
import { useSelector } from 'react-redux';

import { Forbidden, Loading, NotFound, RootState, VersionLayout } from '@verdaccio/ui-components';

const Version: React.FC = () => {
  const manifestStore = useSelector((state: RootState) => state.manifest);
  const isLoading = useSelector((state: RootState) => state?.loading?.models.manifest);

  if (isLoading) {
    return <Loading />;
  }

  if (manifestStore.forbidden) {
    return <Forbidden />;
  }

  if (manifestStore.hasNotBeenFound) {
    return <NotFound />;
  }
  return <VersionLayout />;
};

export default Version;
