import DownloadIcon from '@mui/icons-material/Download';
import Alert from '@mui/material/Alert';
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
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { Route } from '../../utils';
import StageActions from './StageActions';
import type { StagePackageVersion } from './types';
import { downloadStagedTarball, useStageList } from './useStage';

const StageList: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const { data, error, isLoading, mutate } = useStageList(page, perPage);

  const handleDownload = useCallback(async (item: StagePackageVersion) => {
    await downloadStagedTarball(item);
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" padding={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      // @ts-ignore - Alert does accept children despite the type error
      <Alert severity="error" sx={{ margin: 2 }}>
        {t('stage.error.list')}
      </Alert>
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
        // @ts-ignore - Alert does accept children despite the type error
        <Alert severity="info" sx={{ marginTop: 2 }}>
          {t('stage.empty')}
        </Alert>
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
                      <Tooltip title={t('stage.action.download')}>
                        <Button
                          aria-label={t('stage.action.download')}
                          onClick={() => handleDownload(item)}
                          size="small"
                        >
                          <DownloadIcon fontSize="small" />
                        </Button>
                      </Tooltip>
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
