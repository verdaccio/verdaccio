import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import List from '@mui/material/List';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { TemplateUIOptions } from '@verdaccio/types';

import { Theme } from '../../Theme';
import { PackageMetaInterface } from '../../types/packageMeta';
import { SettingsMenu } from '../SettingsMenu';
import InstallListItem, { DependencyManager } from './InstallListItem';

const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme?.fontWeight.bold,
  textTransform: 'capitalize',
}));

const Wrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

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
  const hasPnpm = configOptions?.pkgManagers?.includes('pnpm');
  const hasApm = configOptions?.pkgManagers?.includes('apm'); // apm
  const hasPkgManagers = hasNpm || hasPnpm || hasYarn || hasApm; // apm

  return hasPkgManagers ? (
    <>
      <List
        data-testid={'installList'}
        subheader={
          <Wrapper>
            <StyledText variant={'subtitle1'}>{t('sidebar.installation.title')}</StyledText>
            <SettingsMenu packageName={packageName} />
          </Wrapper>
        }
      >
        {hasApm && (
          <InstallListItem
            dependencyManager={DependencyManager.APM}
            packageName={packageName}
            packageVersion={packageMeta.latest.version}
          />
        )}
        {hasNpm && (
          <InstallListItem
            dependencyManager={DependencyManager.NPM}
            packageName={packageName}
            packageVersion={packageMeta.latest.version}
          />
        )}
        {hasYarn && (
          <InstallListItem
            dependencyManager={DependencyManager.YARN}
            packageName={packageName}
            packageVersion={packageMeta.latest.version}
          />
        )}
        {hasPnpm && (
          <InstallListItem
            dependencyManager={DependencyManager.PNPM}
            packageName={packageName}
            packageVersion={packageMeta.latest.version}
          />
        )}
      </List>
    </>
  ) : null;
};

export default Install;
