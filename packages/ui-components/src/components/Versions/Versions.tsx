import styled from '@emotion/styled';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { debounce } from 'lodash-es';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import semver from 'semver';

import type { Theme } from '../../Theme';
import { useConfig } from '../../providers';
import VersionsHistoryList from './HistoryList';
import VersionsTagList from './TagList';

export type Props = { packageMeta: any; packageName: string };

export const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme && props.theme.fontWeight.bold,
  textTransform: 'capitalize',
}));

const Versions: React.FC<Props> = ({ packageMeta, packageName }) => {
  const { t } = useTranslation();
  const { configOptions } = useConfig();
  const { versions = {}, time = {}, ['dist-tags']: distTags = {} } = packageMeta ?? {};

  const [textSearch, setTextSearch] = useState('');
  // derive the filtered list instead of caching it in state: the detail routes
  // reuse this mounted component across packages, so cached versions from the
  // previously visited package would leak into the next one
  const packageVersions = useMemo(() => {
    return Object.keys(versions).reduce((acc, version) => {
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
  }, [versions, textSearch]);

  if (!packageMeta || Object.keys(packageMeta).length === 0) {
    return null;
  }
  const hideDeprecatedVersions = configOptions.hideDeprecatedVersions;
  const hasDistTags = distTags && Object.keys(distTags).length > 0 && packageName;
  const hasVersionHistory =
    packageVersions && Object.keys(packageVersions).length > 0 && packageName;

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box data-testid="versions" sx={{ m: 2 }}>
          {hasDistTags ? (
            <>
              <StyledText variant="subtitle1">
                {t('versions.current-tags')}
                <span>{` (${Object.keys(distTags).length})`}</span>
              </StyledText>
              <VersionsTagList packageName={packageName} tags={distTags} time={time} />
            </>
          ) : null}
          <>
            <StyledText variant="subtitle1">
              {t('versions.version-history')}
              <span>{` (${Object.keys(packageVersions).length})`}</span>
            </StyledText>
            <TextField
              helperText={t('versions.search.placeholder')}
              onChange={debounce((e) => {
                setTextSearch(e.target.value);
              }, 200)}
              size="small"
              variant="standard"
              sx={{ width: '50%' }}
            />
          </>
          {hasVersionHistory ? (
            <>
              {hideDeprecatedVersions === true && (
                // @ts-ignore - Alert does accept children despite the type error
                <Alert severity="info" sx={{ marginTop: 1, marginBottom: 1 }}>
                  {t('versions.hide-deprecated')}
                </Alert>
              )}
              <VersionsHistoryList
                packageName={packageName}
                time={time}
                versions={packageVersions}
              />
            </>
          ) : null}
        </Box>
      </CardContent>
    </Card>
  );
};

export default Versions;
