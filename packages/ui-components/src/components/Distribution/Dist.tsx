import List from '@mui/material/List';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { PackageMetaInterface } from '../../types/packageMeta';
import { DistChips, DistListItem, StyledText } from './styles';
import { fileSizeSI, formatLicense } from './utils';

const DistChip: FC<{ name: string; children?: React.ReactElement | string }> = ({
  name,
  children,
}) =>
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

const Dist: FC<{ packageMeta: PackageMetaInterface }> = ({ packageMeta }) => {
  const { t } = useTranslation();

  if (!packageMeta?.latest) {
    return null;
  }

  const { dist, license } = packageMeta.latest;

  if (!dist && !license) {
    return null;
  }

  return (
    <List
      subheader={<StyledText variant="subtitle1">{t('sidebar.distribution.title')}</StyledText>}
    >
      <DistListItem>
        {dist?.fileCount && (
          <DistChip name={t('sidebar.distribution.file-count')}>{`${dist.fileCount}`}</DistChip>
        )}
        {dist?.unpackedSize ? (
          <DistChip name={t('sidebar.distribution.size')}>{fileSizeSI(dist.unpackedSize)}</DistChip>
        ) : null}

        <DistChip name={t('sidebar.distribution.license')}>{formatLicense(license)}</DistChip>
      </DistListItem>
    </List>
  );
};

export default Dist;
