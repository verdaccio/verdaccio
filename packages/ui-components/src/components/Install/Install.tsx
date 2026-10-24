import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import List from '@mui/material/List';
import React from 'react';
import { useTranslation } from 'react-i18next';

import type { TemplateUIOptions } from '@verdaccio/types';

import type { Theme } from '../../Theme';
import type { PackageMetaInterface } from '../../types/packageMeta';
import { getNpmrcRegistry } from '../../utils';
import CopyToClipBoard from '../CopyClipboard';
import { SettingsMenu } from '../SettingsMenu';
import InstallListItem, { DependencyManager } from './InstallListItem';

const StyledText = styled(Typography)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme.fontWeight.bold,
  textTransform: 'capitalize',
}));

const RegistryConfig = styled('div')({
  marginBottom: 8,
});

/** The `.npmrc` line that points this package (or its scope) at the registry. */
export function getNpmrcRegistryLine(packageName: string, registryUrl: string): string {
  const scope = packageName.startsWith('@') ? packageName.split('/')[0] : undefined;
  return getNpmrcRegistry(scope, registryUrl);
}

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
  const hasPnpm = configOptions?.pkgManagers?.includes('pnpm') ?? true;
  const hasBun = configOptions?.pkgManagers?.includes('bun');
  const hasPkgManagers = hasNpm || hasPnpm || hasYarn || hasBun;

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
        {hasBun && (
          <InstallListItem
            dependencyManager={DependencyManager.BUN}
            packageName={packageName}
            packageVersion={packageMeta.latest.version}
          />
        )}
      </List>
      {configOptions?.base && (
        <RegistryConfig data-testid="install-npmrc">
          <Typography color="text.secondary" variant="caption">
            {t('sidebar.installation.npmrc')}
          </Typography>
          <CopyToClipBoard
            dataTestId="installNpmrc"
            text={getNpmrcRegistryLine(packageName, configOptions.base)}
            title={getNpmrcRegistryLine(packageName, configOptions.base)}
          />
        </RegistryConfig>
      )}
    </>
  ) : null;
};

export default Install;
