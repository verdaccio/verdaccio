import styled from '@emotion/styled';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import List from 'verdaccio-ui/components/List';
import Text from 'verdaccio-ui/components/Text';
import { Theme } from 'verdaccio-ui/design-tokens/theme';
import { useConfig } from 'verdaccio-ui/providers/config';

import { DetailContext } from '../..';

import InstallListItem, { DependencyManager } from './InstallListItem';

const StyledText = styled(Text)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme?.fontWeight.bold,
  textTransform: 'capitalize',
}));

const Install: React.FC = () => {
  const { t } = useTranslation();
  const { configOptions } = useConfig();
  const detailContext = useContext(DetailContext);

  const { packageMeta, packageName } = detailContext;

  if (!packageMeta || !packageName) {
    return null;
  }

  const hasNpm = configOptions?.pkgManagers?.includes('npm');
  const hasYarn = configOptions?.pkgManagers?.includes('yarn');
  const hasPnpm = configOptions?.pkgManagers?.includes('pnpm') ?? true;
  const hasPkgManagers = hasNpm | hasPnpm | hasYarn;

  return hasPkgManagers ? (
    <List
      data-testid={'installList'}
      subheader={<StyledText variant={'subtitle1'}>{t('sidebar.installation.title')}</StyledText>}>
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
