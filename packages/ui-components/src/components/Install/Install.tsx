import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import List from '@mui/material/List';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { TemplateUIOptions } from '@verdaccio/types';

import { Theme } from '../../Theme';
import { PackageMetaInterface } from '../../types/packageMeta';
import InstallListItem, { DependencyManager } from './InstallListItem';

const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme?.fontWeight.bold,
  textTransform: 'capitalize',
}));

export type Props = {
  packageMeta: PackageMetaInterface;
  packageName: string;
  configOptions: TemplateUIOptions;
};

const Install: React.FC<Props> = ({ packageMeta, packageName, configOptions }) => {
  const { t } = useTranslation();

  if (!packageMeta || !packageName) {
    return null;
  }
  const hasNpm = configOptions?.pkgManagers?.includes('npm');
  const hasYarn = configOptions?.pkgManagers?.includes('yarn');
  const hasPnpm = configOptions?.pkgManagers?.includes('pnpm') ?? true;
  const hasPkgManagers = hasNpm || hasPnpm || hasYarn;

  return hasPkgManagers ? (
    <List
      data-testid={'installList'}
      subheader={<StyledText variant={'subtitle1'}>{t('sidebar.installation.title')}</StyledText>}
    >
      {hasNpm && (
        <InstallListItem dependencyManager={DependencyManager.NPM} packageName={packageName} />
      )}
      {hasYarn && (
        <InstallListItem dependencyManager={DependencyManager.YARN} packageName={packageName} />
      )}
      {hasPnpm && (
        <InstallListItem dependencyManager={DependencyManager.PNPM} packageName={packageName} />
      )}
    </List>
  ) : null;
};

export default Install;
