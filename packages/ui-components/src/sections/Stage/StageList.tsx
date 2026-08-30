import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Route } from '../../utils';
import StageActions from './StageActions';
import { useRequireSession } from './useRequireSession';
import type { StagePackageVersion } from './types';
import { downloadStagedTarball, useStageList } from './useStage';

const StageList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isLoggedIn = useRequireSession();
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const { data, error, isLoading, mutate } = useStageList(page, perPage);

  const handleDownload = useCallback(async (item: StagePackageVersion) => {
    await downloadStagedTarball(item);
  }, []);

  // the redirect lands on the next effect; rendering the table meanwhile would
  // only show an empty state that is about to disappear
  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding={2}>
        <Typography color="error" role="alert">
          {t('stage.error.list')}
        </Typography>
      </Box>
    );
  }

  const items = data?.items ?? [];

  return (
    <Box padding={2}>
      <Typography component="h1" gutterBottom={true} variant="h5">
        {t('stage.title')}
      </Typography>
      <Typography color="text.secondary" gutterBottom={true} variant="body2">
        {t('stage.description')}
      </Typography>

      {items.length === 0 ? (
        <Typography color="text.secondary" marginTop={2}>
          {t('stage.empty')}
        </Typography>
      ) : (
        <TableContainer component={Paper} sx={{ marginTop: 2, overflowX: 'auto' }}>
          <Table aria-label={t('stage.title')} data-testid="stage-table" size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t('stage.column.package')}</TableCell>
                <TableCell>{t('stage.column.version')}</TableCell>
                <TableCell>{t('stage.column.tag')}</TableCell>
                <TableCell>{t('stage.column.stagedBy')}</TableCell>
                <TableCell>{t('stage.column.date')}</TableCell>
                <TableCell align="right">{t('stage.column.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow data-testid={`stage-row-${item.id}`} hover={true} key={item.id}>
                  <TableCell>
                    <Button
                      onClick={() => navigate(Route.STAGE_DETAIL.replace(':stageId', item.id))}
                      size="small"
                      sx={{ textTransform: 'none' }}
                    >
                      {item.packageName}
                    </Button>
                  </TableCell>
                  <TableCell>{item.version}</TableCell>
                  <TableCell>
                    <Chip label={item.tag} size="small" />
                  </TableCell>
                  <TableCell>{item.actor}</TableCell>
                  <TableCell>{new Date(item.createdAt).toLocaleString()}</TableCell>
                  <TableCell align="right">
                    <Box alignItems="center" display="flex" gap={1} justifyContent="flex-end">
                      <Button
                        data-testid={`stage-download-${item.id}`}
                        onClick={() => handleDownload(item)}
                        size="small"
                      >
                        {t('stage.action.download')}
                      </Button>
                      <StageActions item={item} onDone={() => mutate()} />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={data?.total ?? 0}
            onPageChange={(_event, nextPage) => setPage(nextPage)}
            onRowsPerPageChange={(event) => {
              setPerPage(Number.parseInt(event.target.value, 10));
              setPage(0);
            }}
            page={page}
            rowsPerPage={perPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </TableContainer>
      )}
    </Box>
  );
};

export default StageList;
