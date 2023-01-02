import Grid from '@mui/material/Grid';
import React from 'react';

import { Detail, SideBar } from '../../sections';

const VersionLayout: React.FC = () => {
  return (
    <Grid className={'container content'} container={true} data-testid="version-layout" spacing={0}>
      <Grid item={true} md={8} xs={12}>
        <Detail />
      </Grid>
      <Grid item={true} md={4} xs={12}>
        <SideBar />
      </Grid>
    </Grid>
  );
};

export default VersionLayout;
