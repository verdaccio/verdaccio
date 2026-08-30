import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';

import { Route } from '../../utils';
import StageActions from './StageActions';
import { downloadStagedTarball, useStageItem } from './useStage';
import { useRequireSession } from './useRequireSession';

const StageDetail: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { stageId } = useParams<{ stageId: string }>();
  const isLoggedIn = useRequireSession();
  const { data, error, isLoading } = useStageItem(stageId);

  const handleDownload = useCallback(async () => {
    if (data) {
      await downloadStagedTarball(data);
    }
  }, [data]);

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

  if (error || !data) {
    return (
      <Box padding={2}>
        <Typography color="error" role="alert">
          {t('stage.error.notFound')}
        </Typography>
      </Box>
    );
  }

  const rows: [string, React.ReactNode][] = [
    [t('stage.column.package'), data.packageName],
    [t('stage.column.version'), data.version],
    [t('stage.column.tag'), <Chip key="tag" label={data.tag} size="small" />],
    [t('stage.column.stagedBy'), `${data.actor} (${data.actorType})`],
    [t('stage.column.date'), new Date(data.createdAt).toLocaleString()],
    [t('stage.column.access'), data.access],
    [t('stage.column.shasum'), data.shasum],
  ];

  return (
    <Box padding={2}>
      <Button onClick={() => navigate(Route.STAGE)} size="small">
        {t('stage.backToList')}
      </Button>
      <Typography component="h1" gutterBottom={true} variant="h5">
        {data.packageName}@{data.version}
      </Typography>

      <Paper sx={{ marginTop: 2, overflowX: 'auto' }}>
        <Table data-testid="stage-detail" size="small">
          <TableBody>
            {rows.map(([label, value]) => (
              <TableRow key={label}>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, width: '30%' }}>
                  {label}
                </TableCell>
                <TableCell sx={{ wordBreak: 'break-all' }}>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Box display="flex" gap={1} marginTop={2}>
        <Button onClick={handleDownload} size="small" variant="outlined">
          {t('stage.action.download')}
        </Button>
        <StageActions item={data} onDone={() => navigate(Route.STAGE)} />
      </Box>
    </Box>
  );
};

export default StageDetail;
