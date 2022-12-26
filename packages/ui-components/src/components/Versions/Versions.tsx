import Typography from '@mui/material/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';

import VersionsHistoryList from './HistoryList';
import VersionsTagList from './TagList';

export type Props = { packageMeta: any; packageName: string };

const Versions: React.FC<Props> = ({ packageMeta, packageName }) => {
  const { t } = useTranslation();

  if (!packageMeta) {
    return null;
  }

  const { versions = {}, time = {}, ['dist-tags']: distTags = {} } = packageMeta;

  const hasDistTags = distTags && Object.keys(distTags).length > 0 && packageName;
  const hasVersionHistory = versions && Object.keys(versions).length > 0 && packageName;

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
          <VersionsHistoryList packageName={packageName} time={time} versions={versions} />
        </>
      ) : null}
    </>
  );
};

export default Versions;
