import Box from '@mui/material/Box';
import React from 'react';

import Loading from './Loading';
import PackageListSkeleton from './PackageListSkeleton';
import VersionSkeleton from './VersionSkeleton';

export default {
  title: 'Components/Detail/Loading',
};

export const Icons: any = () => (
  <Box sx={{ width: '100%' }}>
    <Loading />
  </Box>
);

export const PackageList: any = () => (
  <Box sx={{ width: '100%', maxWidth: 1240 }}>
    <PackageListSkeleton />
  </Box>
);

export const PackagePage: any = () => <VersionSkeleton />;
