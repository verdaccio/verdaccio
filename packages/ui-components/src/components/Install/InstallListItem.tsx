import styled from '@emotion/styled';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
}

const InstallListItem: React.FC<Interface> = ({ packageName, dependencyManager }) => {
  const { t } = useTranslation();
  const { localSettings } = useSettings();
  const isGlobal = localSettings?.global ?? false;
  const pkgName = isGlobal ? `-g ${packageName}` : packageName;

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
                dataTestId="installYarn"
                text={t('sidebar.installation.install-using-npm-command', {
                  packageName: pkgName,
                })}
                title={t('sidebar.installation.install-using-npm-command', {
                  packageName: pkgName,
                })}
              />
            }
            secondary={t('sidebar.installation.install-using-npm')}
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
                text={t('sidebar.installation.install-using-yarn-command', {
                  packageName: pkgName,
                })}
                title={t('sidebar.installation.install-using-yarn-command', {
                  packageName: pkgName,
                })}
              />
            }
            secondary={t('sidebar.installation.install-using-yarn')}
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
                text={t('sidebar.installation.install-using-pnpm-command', {
                  packageName: pkgName,
                })}
                title={t('sidebar.installation.install-using-pnpm-command', {
                  packageName: pkgName,
                })}
              />
            }
            secondary={t('sidebar.installation.install-using-pnpm')}
          />
        </InstallItem>
      );
    default:
      return null;
  }
};

export default InstallListItem;
