import styled from '@emotion/styled';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';

import { useSettings } from '../../providers/PersistenceSettingProvider';
import CopyToClipBoard from '../CopyClipboard';
import { Npm, Pnpm, Yarn } from '../Icons';

const InstallItem = styled(ListItem)({
  padding: 0,
  ':hover': {
    backgroundColor: 'transparent',
  },
});

const InstallListItemText = styled(ListItemText)({
  padding: '0 0 0 10px',
  margin: 0,
});

const PackageMangerAvatar = styled(Avatar)({
  borderRadius: '0px',
  padding: 0,
});

export enum DependencyManager {
  NPM = 'npm',
  YARN = 'yarn',
  PNPM = 'pnpm',
}

interface Interface {
  packageName: string;
  dependencyManager: DependencyManager;
  packageVersion?: string;
}

export function getGlobalInstall(isGlobal, packageVersion, packageName, isYarn = false) {
  const name = isGlobal
    ? `${isYarn ? '' : '-g'} ${packageVersion ? `${packageName}@${packageVersion}` : packageName}`
    : packageVersion
    ? `${packageName}@${packageVersion}`
    : packageName;

  return name.trim();
}

const InstallListItem: React.FC<Interface> = ({
  packageName,
  dependencyManager,
  packageVersion,
}) => {
  const { localSettings } = useSettings();
  const isGlobal = localSettings[packageName]?.global ?? false;

  switch (dependencyManager) {
    case DependencyManager.NPM:
      return (
        <InstallItem data-testid={'installListItem-npm'}>
          <PackageMangerAvatar alt="npm" sx={{ bgcolor: '#FFF' }}>
            <Npm />
          </PackageMangerAvatar>
          <InstallListItemText
            primary={
              <CopyToClipBoard
                dataTestId="instalNpm"
                text={`npm install ${getGlobalInstall(isGlobal, packageVersion, packageName)}`}
                title={`npm install ${getGlobalInstall(isGlobal, packageVersion, packageName)}`}
              />
            }
          />
        </InstallItem>
      );
    case DependencyManager.YARN:
      return (
        <InstallItem data-testid={'installListItem-yarn'}>
          <PackageMangerAvatar alt="yarn" sx={{ bgcolor: '#FFF' }}>
            <Yarn />
          </PackageMangerAvatar>
          <InstallListItemText
            primary={
              <CopyToClipBoard
                dataTestId="installYarn"
                text={
                  isGlobal
                    ? `yarn ${localSettings.yarnModern ? '' : 'global'} add ${getGlobalInstall(
                        isGlobal,
                        packageVersion,
                        packageName,
                        true
                      )}`
                    : `yarn add ${getGlobalInstall(isGlobal, packageVersion, packageName, true)}`
                }
                title={
                  isGlobal
                    ? `yarn global add ${getGlobalInstall(
                        isGlobal,
                        packageVersion,
                        packageName,
                        true
                      )}`
                    : `yarn add ${getGlobalInstall(isGlobal, packageVersion, packageName, true)}`
                }
              />
            }
          />
        </InstallItem>
      );
    case DependencyManager.PNPM:
      return (
        <InstallItem data-testid={'installListItem-pnpm'}>
          <PackageMangerAvatar alt={'pnpm'} sx={{ bgcolor: '#FFF' }}>
            <Pnpm />
          </PackageMangerAvatar>
          <InstallListItemText
            primary={
              <CopyToClipBoard
                dataTestId="installPnpm"
                text={`pnpm install ${getGlobalInstall(isGlobal, packageVersion, packageName)}`}
                title={`pnpm install ${getGlobalInstall(isGlobal, packageVersion, packageName)}`}
              />
            }
          />
        </InstallItem>
      );
    default:
      return null;
  }
};

export default InstallListItem;
