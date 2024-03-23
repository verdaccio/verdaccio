import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles';
import debounce from 'lodash/debounce';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import semver from 'semver';

import { useConfig } from '../../providers';
import VersionsHistoryList from './HistoryList';
import VersionsTagList from './TagList';

export type Props = { packageMeta: any; packageName: string };

const Versions: React.FC<Props> = ({ packageMeta, packageName }) => {
  const { t } = useTranslation();
  const { configOptions } = useConfig();
  const theme = useTheme();
  const { versions = {}, time = {}, ['dist-tags']: distTags = {} } = packageMeta;

  const [packageVersions, setPackageVersions] = useState(versions);
  if (!packageMeta || Object.keys(packageMeta).length === 0) {
    return null;
  }
  const hideDeprecatedVersions = configOptions.hideDeprecatedVersions;
  const hasDistTags = distTags && Object.keys(distTags).length > 0 && packageName;
  const hasVersionHistory =
    packageVersions && Object.keys(packageVersions).length > 0 && packageName;

  const filterVersions = (textSearch) => {
    const filteredVersions = Object.keys(versions).reduce((acc, version) => {
      if (textSearch !== '') {
        if (typeof versions[version] !== 'undefined') {
          if (semver.satisfies(version, textSearch, { includePrerelease: true, loose: true })) {
            acc[version] = versions[version];
          }
        }
      } else {
        acc[version] = versions[version];
      }
      return acc;
    }, {});

    setPackageVersions(filteredVersions);
  };

  return (
    <>
      {hasDistTags ? (
        <>
          <Typography variant="subtitle1">{t('versions.current-tags')}</Typography>
          <VersionsTagList packageName={packageName} tags={distTags} time={time} />
        </>
      ) : null}
      <>
        <Typography variant="subtitle1">{t('versions.version-history')}</Typography>
        <TextField
          helperText={t('versions.search.placeholder')}
          onChange={debounce((e) => {
            filterVersions(e.target.value);
          }, 100)}
          size="small"
          variant="standard"
        />
      </>
      {hasVersionHistory ? (
        <>
          {hideDeprecatedVersions === true && (
            <Alert
              severity="info"
              sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }}
            >
              {t('versions.hide-deprecated')}
            </Alert>
          )}
          <VersionsHistoryList packageName={packageName} time={time} versions={packageVersions} />
        </>
      ) : null}
    </>
  );
};

export default Versions;
