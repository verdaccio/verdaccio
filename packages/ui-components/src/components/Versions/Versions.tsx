import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '../../providers';
import VersionsHistoryList from './HistoryList';
import VersionsTagList from './TagList';

export type Props = { packageMeta: any; packageName: string };

const Versions: React.FC<Props> = ({ packageMeta, packageName }) => {
  const { t } = useTranslation();
  const { configOptions } = useConfig();
  const theme = useTheme();

  if (!packageMeta) {
    return null;
  }

  const { versions = {}, time = {}, ['dist-tags']: distTags = {} } = packageMeta;

  const hasDistTags = distTags && Object.keys(distTags).length > 0 && packageName;
  const hasVersionHistory = versions && Object.keys(versions).length > 0 && packageName;
  const hideDeprecatedVersions = configOptions.hideDeprecatedVersions;

  return (
    <>
      {hasDistTags ? (
        <>
          <Typography variant="subtitle1">{t('versions.current-tags')}</Typography>
          <VersionsTagList packageName={packageName} tags={distTags} time={time} />
        </>
      ) : null}
      {hasVersionHistory ? (
        <>
          <Typography variant="subtitle1">{t('versions.version-history')}</Typography>
          <>
            {hideDeprecatedVersions && (
              <Alert
                severity="info"
                sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }}
              >
                {t('versions.hide-deprecated')}
              </Alert>
            )}
            <VersionsHistoryList packageName={packageName} time={time} versions={versions} />
          </>
        </>
      ) : null}
    </>
  );
};

export default Versions;
