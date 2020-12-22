import styled from '@emotion/styled';
import React from 'react';
import { useTranslation } from 'react-i18next';

import Text from 'verdaccio-ui/components/Text';
import { Theme } from 'verdaccio-ui/design-tokens/theme';

import { DeveloperType } from './types';

interface Props {
  type: DeveloperType;
}

const DevelopersTitle: React.FC<Props> = ({ type }) => {
  const { t } = useTranslation();
  switch (type) {
    case DeveloperType.CONTRIBUTORS:
      return <StyledText variant={'subtitle1'}>{t('sidebar.contributors.title')}</StyledText>;
    case DeveloperType.MAINTAINERS:
      return <StyledText variant={'subtitle1'}>{t('sidebar.maintainers.title')}</StyledText>;
  }
};

export default DevelopersTitle;

const StyledText = styled(Text)<{ theme?: Theme }>(({ theme }) => ({
  fontWeight: theme?.fontWeight.bold,
  marginBottom: '10px',
}));
