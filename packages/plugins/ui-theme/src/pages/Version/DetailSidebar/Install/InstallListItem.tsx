import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Avatar from 'verdaccio-ui/components/Avatar';
import CopyToClipBoard from 'verdaccio-ui/components/CopyToClipBoard';
import ListItem from 'verdaccio-ui/components/ListItem';
import ListItemText from 'verdaccio-ui/components/ListItemText';

// logos of package managers
import npmLogo from './img/npm.svg';
import pnpmLogo from './img/pnpm.svg';
import yarnLogo from './img/yarn.svg';

const InstallItem = styled(ListItem)({
  padding: 0,
  ':hover': {
    backgroundColor: 'transparent',
  },
});

const InstallListItemText = styled(ListItemText)({
  padding: '0 10px',
  margin: 0,
});

const PackageMangerAvatar = styled(Avatar)({
  borderRadius: '0px',
  padding: '0',
  img: {
    backgroundColor: 'transparent',
  },
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

  switch (dependencyManager) {
    case DependencyManager.NPM:
      return (
        <InstallItem button={true} data-testid={'installListItem-npm'}>
          <PackageMangerAvatar alt="npm" src={npmLogo} />
          <InstallListItemText
            primary={
              <CopyToClipBoard
                text={t('sidebar.installation.install-using-npm-command', { packageName })}
              />
            }
            secondary={t('sidebar.installation.install-using-npm')}
          />
        </InstallItem>
      );
    case DependencyManager.YARN:
      return (
        <InstallItem button={true} data-testid={'installListItem-yarn'}>
          <PackageMangerAvatar alt="yarn" src={yarnLogo} />
          <InstallListItemText
            primary={
              <CopyToClipBoard
                text={t('sidebar.installation.install-using-yarn-command', { packageName })}
              />
            }
            secondary={t('sidebar.installation.install-using-yarn')}
          />
        </InstallItem>
      );
    case DependencyManager.PNPM:
      return (
        <InstallItem button={true} data-testid={'installListItem-pnpm'}>
          <PackageMangerAvatar alt={'pnpm'} src={pnpmLogo} />
          <InstallListItemText
            primary={
              <CopyToClipBoard
                text={t('sidebar.installation.install-using-pnpm-command', { packageName })}
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
