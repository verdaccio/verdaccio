import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { StagePackageVersion } from './types';
import { approveStagedVersion, rejectStagedVersion } from './useStage';

type PendingAction = 'approve' | 'reject' | null;

interface Props {
  item: StagePackageVersion;
  /** Called after a successful approve/reject so the caller can refresh. */
  onDone: () => void;
}

/**
 * Approve / reject buttons with a confirmation step.
 *
 * Both actions are irreversible from the UI: approving publishes the version
 * for real, rejecting deletes the staged record and its tarball.
 */
const StageActions: React.FC<Props> = ({ item, onDone }) => {
  const { t } = useTranslation();
  const [pending, setPending] = useState<PendingAction>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => {
    if (!isBusy) {
      setPending(null);
      setError(null);
    }
  }, [isBusy]);

  const confirm = useCallback(async () => {
    if (!pending) {
      return;
    }
    setIsBusy(true);
    setError(null);
    try {
      if (pending === 'approve') {
        await approveStagedVersion(item.id);
      } else {
        await rejectStagedVersion(item.id);
      }
      setPending(null);
      onDone();
    } catch (err: any) {
      // 409 here means the version got published by another route meanwhile,
      // and the staged item is deliberately kept so it can still be inspected
      setError(err?.message ?? t('stage.error.action'));
    } finally {
      setIsBusy(false);
    }
  }, [item.id, onDone, pending, t]);

  return (
    <>
      <Button
        color="primary"
        data-testid={`stage-approve-${item.id}`}
        disabled={isBusy}
        onClick={() => setPending('approve')}
        size="small"
        variant="outlined"
      >
        {t('stage.action.approve')}
      </Button>
      <Button
        color="error"
        data-testid={`stage-reject-${item.id}`}
        disabled={isBusy}
        onClick={() => setPending('reject')}
        size="small"
      >
        {t('stage.action.reject')}
      </Button>

      <Dialog onClose={close} open={pending !== null}>
        <DialogTitle>
          {pending === 'approve' ? t('stage.confirm.approveTitle') : t('stage.confirm.rejectTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {pending === 'approve'
              ? t('stage.confirm.approveBody', {
                  package: item.packageName,
                  version: item.version,
                  tag: item.tag,
                })
              : t('stage.confirm.rejectBody', {
                  package: item.packageName,
                  version: item.version,
                })}
          </DialogContentText>
          {error && (
            <Typography color="error" marginTop={2} role="alert">
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button disabled={isBusy} onClick={close}>
            {t('button.cancel')}
          </Button>
          <Button
            color={pending === 'approve' ? 'primary' : 'error'}
            data-testid="stage-confirm"
            disabled={isBusy}
            onClick={confirm}
            variant="contained"
          >
            {pending === 'approve' ? t('stage.action.approve') : t('stage.action.reject')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default StageActions;
