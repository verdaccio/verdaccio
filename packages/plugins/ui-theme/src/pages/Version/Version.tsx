import React from 'react';
import { useSelector } from 'react-redux';
import Loading from 'verdaccio-ui/components/Loading';
import NotFound from 'verdaccio-ui/components/NotFound';

import { RootState } from '../../store/store';
import VersionLayout from './VersionLayout';

const Version: React.FC = () => {
  const manifestStore = useSelector((state: RootState) => state.manifest);
  const isLoading = useSelector((state: RootState) => state?.loading?.models.manifest);


  if (isLoading) {
    return <Loading />;
  }

  if (manifestStore.hasNotBeenFound) {
    return <NotFound />;
  }

  return <VersionLayout />;
};

export default Version;
