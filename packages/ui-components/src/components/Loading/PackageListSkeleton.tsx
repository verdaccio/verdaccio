import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ROWS = 5;

const PackageListSkeleton: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box
      aria-busy={true}
      aria-label={t('loading')}
      data-testid="package-list-skeleton"
      role="status"
    >
      {Array.from({ length: ROWS }, (_, index) => (
        <Box key={index}>
          {index !== 0 && <Divider />}
          <Box sx={{ px: 2, py: 1.5 }}>
            <Skeleton height={32} variant="text" width="35%" />
            <Skeleton variant="text" width="80%" />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
              <Skeleton height={20} variant="circular" width={20} />
              <Skeleton variant="text" width={80} />
              <Skeleton variant="text" width={60} />
              <Skeleton variant="text" width={110} />
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PackageListSkeleton;
