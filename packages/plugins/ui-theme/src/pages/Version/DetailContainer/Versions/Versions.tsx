import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { DetailContext } from '../../context';
import VersionsHistoryList from './VersionsHistoryList';
import VersionsTagList from './VersionsTagList';
import { StyledText } from './styles';

const Versions: React.FC = () => {
  const detailContext = useContext(DetailContext);
  const { t } = useTranslation();

  const { packageMeta, packageName } = detailContext;

  if (!packageMeta) {
    return null;
  }

  const { versions = {}, time = {}, ['dist-tags']: distTags = {} } = packageMeta;

  return (
    <>
      {distTags && Object.keys(distTags).length > 0 && packageName && (
        <>
          <StyledText variant="subtitle1">{t('versions.current-tags')}</StyledText>
          <VersionsTagList packageName={packageName} tags={distTags} time={time} />
        </>
      )}
      {versions && Object.keys(versions).length > 0 && packageName && (
        <>
          <StyledText variant="subtitle1">{t('versions.version-history')}</StyledText>
          <VersionsHistoryList packageName={packageName} time={time} versions={versions} />
        </>
      )}
    </>
  );
};

export default Versions;
