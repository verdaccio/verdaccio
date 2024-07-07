import styled from '@emotion/styled';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/styles';
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
  backgroundColor: 'transparent',
  padding: 0,
  marginLeft: 0,
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

export function getGlobalInstall(isLatest, isGlobal, packageVersion, packageName, isYarn = false) {
  const name = isGlobal
    ? `${isYarn ? '' : '-g'} ${packageVersion && !isLatest ? `${packageName}@${packageVersion}` : packageName}`
    : packageVersion && !isLatest
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
  const theme = useTheme();
  const isLatest = localSettings[packageName]?.latest ?? false;
  const isGlobal = localSettings[packageName]?.global ?? false;
  switch (dependencyManager) {
    case DependencyManager.NPM:
      return (
        <InstallItem data-testid={'installListItem-npm'}>
          <PackageMangerAvatar alt="npm" sx={{ bgcolor: theme.palette.white }}>
            <Npm />
          </PackageMangerAvatar>
          <InstallListItemText
            primary={
              <CopyToClipBoard
                dataTestId="installNpm"
                text={`npm install ${getGlobalInstall(isLatest, isGlobal, packageVersion, packageName)}`}
                title={`npm install ${getGlobalInstall(isLatest, isGlobal, packageVersion, packageName)}`}
              />
            }
          />
        </InstallItem>
      );
    case DependencyManager.YARN:
      return (
        <InstallItem data-testid={'installListItem-yarn'}>
          <PackageMangerAvatar alt="yarn" sx={{ bgcolor: theme.palette.white }}>
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
                    : `yarn add ${getGlobalInstall(isLatest, isGlobal, packageVersion, packageName, true)}`
                }
                title={
                  isGlobal
                    ? `yarn global add ${getGlobalInstall(
                        isGlobal,
                        packageVersion,
                        packageName,
                        true
                      )}`
                    : `yarn add ${getGlobalInstall(isLatest, isGlobal, packageVersion, packageName, true)}`
                }
              />
            }
          />
        </InstallItem>
      );
    case DependencyManager.PNPM:
      return (
        <InstallItem data-testid={'installListItem-pnpm'}>
          <PackageMangerAvatar alt={'pnpm'} sx={{ bgcolor: theme.palette.white }}>
            <Pnpm />
          </PackageMangerAvatar>
          <InstallListItemText
            primary={
              <CopyToClipBoard
                dataTestId="installPnpm"
                text={`pnpm install ${getGlobalInstall(isLatest, isGlobal, packageVersion, packageName)}`}
                title={`pnpm install ${getGlobalInstall(isLatest, isGlobal, packageVersion, packageName)}`}
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
