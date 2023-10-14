import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useConfig } from '../../providers';
import { Time, Versions } from '../../types/packageMeta';
import { utils } from '../../utils';
import { Link } from '../Link';
import { ListItemText, Spacer } from './styles';

interface Props {
  versions: Versions;
  packageName: string;
  time: Time;
}

export function filterDeprecated(versions: Versions) {
  const versionsIds = Object.keys(versions);
  return versionsIds.reduce((prev, current) => {
    if (!versions[current].deprecated) {
      prev[current] = versions[current];
    }

    return prev;
  }, {});
}

const VersionsHistoryList: React.FC<Props> = ({ versions, packageName, time }) => {
  const { t } = useTranslation();
  const { configOptions } = useConfig();
  const theme = useTheme();
  const hideDeprecatedVersions = configOptions.hideDeprecatedVersions;
  const listVersions = hideDeprecatedVersions ? filterDeprecated(versions) : versions;

  return (
    <List dense={true}>
      {Object.keys(listVersions)
        .reverse()
        .map((version) => (
          <ListItem className="version-item" data-testid={`version-${version}`} key={version}>
            <Link to={`/-/web/detail/${packageName}/v/${version}`} variant="caption">
              <ListItemText disableTypography={false} primary={version}></ListItemText>
            </Link>
            {typeof versions[version].deprecated === 'string' ? (
              <Chip
                color="warning"
                data-testid="deprecated-badge"
                label="deprecated"
                size="small"
                sx={{ marginLeft: theme.spacing(1) }}
                variant="outlined"
              />
            ) : null}
            <Spacer />
            <ListItemText title={utils.formatDate(time[version])}>
              {time[version]
                ? utils.formatDateDistance(time[version])
                : t('versions.not-available')}
            </ListItemText>
          </ListItem>
        ))}
    </List>
  );
};

export default VersionsHistoryList;
