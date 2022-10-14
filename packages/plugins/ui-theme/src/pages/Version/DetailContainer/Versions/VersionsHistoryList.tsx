import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatDate, formatDateDistance } from 'verdaccio-ui/utils/package';

import { Time, Versions } from '../../../../../types/packageMeta';
import { ListItemText, Spacer, StyledLink } from './styles';

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
            <StyledLink to={`/-/web/detail/${packageName}/v/${version}`}>
              <ListItemText>{version}</ListItemText>
            </StyledLink>
            <Spacer />
            <ListItemText title={formatDate(time[version])}>
              {time[version] ? formatDateDistance(time[version]) : t('versions.not-available')}
            </ListItemText>
          </ListItem>
        ))}
    </List>
  );
};

export default VersionsHistoryList;
