import React from 'react';
import { useSelector } from 'react-redux';

import Forbidden from '../../../components/Forbidden';
import { Loading, NotFound, RootState, VersionLayout } from '../../../index';

const Version: React.FC = () => {
  const manifestStore = useSelector((state: RootState) => state.manifest);
  const isLoading = useSelector((state: RootState) => state?.loading?.models.manifest);

  if (isLoading) {
    return <Loading />;
  }

  // @ts-expect-error
  if (manifestStore.forbidden) {
    return <Forbidden />;
  }

  // @ts-expect-error
  if (manifestStore.hasNotBeenFound) {
    return <NotFound />;
  }

  return <VersionLayout />;
};

export default Version;
