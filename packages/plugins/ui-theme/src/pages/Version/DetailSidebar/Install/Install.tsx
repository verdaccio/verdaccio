import styled from '@emotion/styled';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import List from 'verdaccio-ui/components/List';
import Text from 'verdaccio-ui/components/Text';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

import { DetailContext } from '../..';

import InstallListItem, { DependencyManager } from './InstallListItem';

const StyledText = styled(Text)<{ theme?: Theme }>((props) => ({
  fontWeight: props.theme && props.theme.fontWeight.bold,
  textTransform: 'capitalize',
}));

const Install: React.FC = () => {
  const { t } = useTranslation();
  const detailContext = useContext(DetailContext);

  const { packageMeta, packageName } = detailContext;

  if (!packageMeta || !packageName) {
    return null;
  }

  return (
    <List
      data-testid={'installList'}
      subheader={<StyledText variant={'subtitle1'}>{t('sidebar.installation.title')}</StyledText>}>
      <InstallListItem dependencyManager={DependencyManager.NPM} packageName={packageName} />
      <InstallListItem dependencyManager={DependencyManager.YARN} packageName={packageName} />
      <InstallListItem dependencyManager={DependencyManager.PNPM} packageName={packageName} />
    </List>
  );
};

export default Install;
