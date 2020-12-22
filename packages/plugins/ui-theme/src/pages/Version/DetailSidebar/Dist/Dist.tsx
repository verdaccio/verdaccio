import React, { FC, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import List from 'verdaccio-ui/components/List';
import fileSizeSI from 'verdaccio-ui/utils/file-size';
import { formatLicense } from 'verdaccio-ui/utils/package';

import { DetailContext } from '../../context';

import { StyledText, DistListItem, DistChips } from './styles';

const DistChip: FC<{ name: string }> = ({ name, children }) =>
  children ? (
    <DistChips
      label={
        <>
          <b>{name}</b>
          {': '}
          {children}
        </>
      }
    />
  ) : null;

const Dist: FC = () => {
  const { packageMeta } = useContext(DetailContext);
  const { t } = useTranslation();

  if (!packageMeta) {
    return null;
  }

  const { dist, license } = packageMeta && packageMeta.latest;

  return (
    <List
      subheader={<StyledText variant="subtitle1">{t('sidebar.distribution.title')}</StyledText>}>
      <DistListItem button={true}>
        <DistChip name={t('sidebar.distribution.file-count')}>{dist.fileCount}</DistChip>
        <DistChip name={t('sidebar.distribution.size')}>
          {dist.unpackedSize && fileSizeSI(dist.unpackedSize)}
        </DistChip>
        <DistChip name={t('sidebar.distribution.license')}>{formatLicense(license)}</DistChip>
      </DistListItem>
    </List>
  );
};

export default Dist;
