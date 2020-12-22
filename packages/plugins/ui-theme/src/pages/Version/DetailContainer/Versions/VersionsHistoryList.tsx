import React from 'react';
import { useTranslation } from 'react-i18next';

import List from 'verdaccio-ui/components/List';
import ListItem from 'verdaccio-ui/components/ListItem';
import { formatDateDistance } from 'verdaccio-ui/utils/package';

import { Versions, Time } from '../../../../../types/packageMeta';

import { Spacer, ListItemText, StyledLink } from './styles';

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
          <ListItem className="version-item" key={version}>
            <StyledLink to={`/-/web/detail/${packageName}/v/${version}`}>
              <ListItemText>{version}</ListItemText>
            </StyledLink>
            <Spacer />
            <ListItemText>
              {time[version] ? formatDateDistance(time[version]) : t('versions.not-available')}
            </ListItemText>
          </ListItem>
        ))}
    </List>
  );
};

export default VersionsHistoryList;
