import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Time, Versions } from '../../types/packageMeta';
import { utils } from '../../utils';
import { Link } from '../Link';
import { ListItemText, Spacer } from './styles';

interface Props {
  versions: Versions;
  packageName: string;
  time: Time;
}

const VersionsHistoryList: React.FC<Props> = ({ versions, packageName, time }) => {
  const { t } = useTranslation();

  return (
    <List dense={true}>
      {Object.keys(versions)
        .reverse()
        .map((version) => (
          <ListItem className="version-item" data-testid={`version-${version}`} key={version}>
            <Link to={`/-/web/detail/${packageName}/v/${version}`} variant="caption">
              <ListItemText disableTypography={false} primary={version}></ListItemText>
            </Link>
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
