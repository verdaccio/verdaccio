import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';

const VersionSkeleton: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Grid
      aria-busy={true}
      aria-label={t('loading')}
      className={'container content'}
      container={true}
      data-testid="version-skeleton"
      role="status"
      spacing={0}
    >
      <Grid size={{ md: 8, xs: 12 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {[0, 1, 2].map((tab) => (
            <Skeleton height={48} key={tab} sx={{ flex: 1 }} variant="text" />
          ))}
        </Box>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Skeleton height={40} variant="text" width="50%" />
            {[95, 88, 92, 70, 85, 60].map((width, index) => (
              <Skeleton key={index} variant="text" width={`${width}%`} />
            ))}
            <Skeleton height={140} sx={{ mt: 2 }} variant="rounded" />
          </CardContent>
        </Card>
      </Grid>
      <Grid size={{ md: 4, xs: 12 }}>
        <Paper sx={{ p: 2, ml: { xs: 0, md: 2 } }}>
          <Skeleton height={28} variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
          <Skeleton height={36} sx={{ my: 2 }} variant="rounded" />
          {[0, 1, 2].map((row) => (
            <Skeleton height={28} key={row} variant="text" />
          ))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default VersionSkeleton;
